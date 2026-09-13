'use server';

import { createClient, isSupabaseServerConfigured } from '@/lib/supabase/server';
import {
  mapAppointment,
  mapDentist,
  mapHistoryEntry,
  mapNotification,
  mapPatient,
  mapSchedule,
  mapService,
  mapSession,
} from '@/lib/api/mappers';
import type { Appointment, Dentist, Notification, Patient, Schedule, Service, DentalSession } from '@/lib/supabase/types';

/** رسالة موحّدة لما Supabase مش متظبط — بدل كراش 500 يظهر وضع العرض التجريبي */
const SUPABASE_NOT_CONFIGURED =
  'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart the server.';

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export type StaffRole = 'doctor' | 'secretary' | 'admin';

export interface SessionUser {
  id: string;
  email: string;
  role: StaffRole | 'patient' | null;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
}

export interface AvailableSlot {
  start_time: string;
  end_time: string;
}

export interface BookAppointmentInput {
  serviceId: string;
  dentistId: string;
  date: string;
  startTime: string;
  patient: { firstName: string; lastName: string; email: string; phone: string };
  treatmentType?: string;
  notes?: string;
}

const STAFF_ROLES: StaffRole[] = ['doctor', 'secretary', 'admin'];

function isStaff(role: string | null | undefined): role is StaffRole {
  return !!role && STAFF_ROLES.includes(role as StaffRole);
}

// ---------------------------------------------------------------------------
// Session + role
// ---------------------------------------------------------------------------

export async function getSessionUser(): Promise<SessionUser | null> {
  // أي فشل (Supabase غير متظبط / شبكة / إلخ) → null عشان الـ guard يعمل
  // redirect أنيق إلى /login بدل ما الصفحة ترجع 500.
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return null;

    const user = data.user;
    let role: StaffRole | 'patient' | null = null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('role, first_name, last_name, avatar_url, phone')
      .eq('id', user.id)
      .maybeSingle();

    if (profile) {
      role = profile.role as StaffRole | 'patient';
    } else if (user.user_metadata?.role === 'patient') {
      // No profile yet: only the harmless patient role is honored from metadata.
      // Staff roles (doctor/secretary/admin) are granted exclusively via the
      // profiles table by an administrator — never by self-selected signup data.
      role = 'patient';
    }

    return {
      id: user.id,
      email: user.email ?? '',
      role,
      firstName: profile?.first_name ?? user.user_metadata?.first_name,
      lastName: profile?.last_name ?? user.user_metadata?.last_name,
      avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url,
      phone: profile?.phone,
    };
  } catch {
    return null;
  }
}

async function requireStaff(): Promise<{ user: SessionUser }> {
  const user = await getSessionUser();
  if (!user || !isStaff(user.role)) {
    throw new Error('Unauthorized');
  }
  return { user };
}

// ---------------------------------------------------------------------------
// Public (anonymous) — booking flow
// ---------------------------------------------------------------------------

export async function getPublicCatalog(): Promise<ActionResult<{ services: Service[]; dentists: Dentist[] }>> {
  if (!isSupabaseServerConfigured()) return { ok: false, error: SUPABASE_NOT_CONFIGURED };
  const supabase = createClient();
  const [servicesRes, dentistsRes] = await Promise.all([
    supabase.from('services').select('*').eq('is_active', true).order('name', { ascending: true }),
    // Public catalog exposes display columns only — never staff PII
    // (email, phone, license_number stay server-side).
    supabase
      .from('dentists')
      .select('id, first_name, last_name, specialty, bio, avatar_url, rating, is_active')
      .eq('is_active', true)
      .order('first_name', { ascending: true }),
  ]);

  if (servicesRes.error) return { ok: false, error: servicesRes.error.message };
  if (dentistsRes.error) return { ok: false, error: dentistsRes.error.message };

  return {
    ok: true,
    data: {
      services: (servicesRes.data ?? []).map(mapService),
      dentists: (dentistsRes.data ?? []).map(mapDentist),
    },
  };
}

/** Real availability: schedules for a dentist over the next N days (public). */
export async function getDoctorAvailability(dentistId: string): Promise<ActionResult<Schedule[]>> {
  if (!isSupabaseServerConfigured()) return { ok: false, error: SUPABASE_NOT_CONFIGURED };
  const supabase = createClient();
  const { data, error } = await supabase
    .from('schedules')
    .select('*')
    .eq('dentist_id', dentistId)
    .eq('is_available', true)
    .gte('date', new Date().toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []).map(mapSchedule) };
}

export async function getAvailableSlots(
  dentistId: string,
  serviceId: string,
  date: string
): Promise<ActionResult<AvailableSlot[]>> {
  if (!isSupabaseServerConfigured()) return { ok: false, error: SUPABASE_NOT_CONFIGURED };
  const supabase = createClient();
  const { data, error } = await supabase.rpc('get_available_slots', {
    p_dentist_id: dentistId,
    p_service_id: serviceId,
    p_date: date,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data ?? []) as AvailableSlot[] };
}

export async function bookAppointment(input: BookAppointmentInput): Promise<ActionResult<{ appointmentId: string }>> {
  if (!input.serviceId || !input.dentistId || !input.date || !input.startTime) {
    return { ok: false, error: 'Missing required booking fields' };
  }
  if (!input.patient.email || !input.patient.email.includes('@')) {
    return { ok: false, error: 'A valid email is required' };
  }
  if (!input.patient.firstName || !input.patient.phone) {
    return { ok: false, error: 'Name and phone are required' };
  }

  if (!isSupabaseServerConfigured()) return { ok: false, error: SUPABASE_NOT_CONFIGURED };
  const supabase = createClient();
  const { data, error } = await supabase.rpc('book_appointment', {
    p_payload: {
      service_id: input.serviceId,
      dentist_id: input.dentistId,
      date: input.date,
      start_time: input.startTime,
      treatment_type: input.treatmentType || 'General Consultation',
      notes: input.notes || null,
      patient: {
        first_name: input.patient.firstName,
        last_name: input.patient.lastName,
        email: input.patient.email,
        phone: input.patient.phone,
      },
    },
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { appointmentId: data as string } };
}

// ---------------------------------------------------------------------------
// Staff data (RLS-gated)
// ---------------------------------------------------------------------------

export async function fetchAppointments(scope: 'all' | 'mine' = 'all'): Promise<ActionResult<Appointment[]>> {
  try {
    const { user } = await requireStaff();
    // Doctors can only see their own appointments regardless of requested scope.
    const effectiveScope: 'all' | 'mine' = (user.role === 'doctor') ? 'mine' : scope;
    const supabase = createClient();

    let query = supabase
      .from('appointments')
      .select('*, patients(first_name,last_name), dentists(first_name,last_name), services(name)');

    if (effectiveScope === 'mine') {
      const { data: me } = await supabase.from('dentists').select('id').eq('user_id', user.id).maybeSingle();
      if (!me) return { ok: true, data: [] };
      query = query.eq('dentist_id', me.id);
    }

    const { data, error } = await query.order('date', { ascending: false }).order('start_time', { ascending: true });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapAppointment) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function fetchAppointment(id: string): Promise<ActionResult<Appointment>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();
    // Doctors may only read their own appointments (IDOR guard, mirrors
    // fetchAppointmentHistory / fetchAppointments / startLiveSession).
    if (user.role === 'doctor') {
      const { data: me } = await supabase.from('dentists').select('id').eq('user_id', user.id).maybeSingle();
      if (!me) return { ok: false, error: 'Not found' };
      const { data, error } = await supabase
        .from('appointments')
        .select('*, patients(first_name,last_name), dentists(first_name,last_name), services(name)')
        .eq('id', id)
        .eq('dentist_id', me.id)
        .single();
      if (error) return { ok: false, error: 'Not found' };
      return { ok: true, data: mapAppointment(data) };
    }
    const { data, error } = await supabase
      .from('appointments')
      .select('*, patients(first_name,last_name), dentists(first_name,last_name), services(name)')
      .eq('id', id)
      .single();
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: mapAppointment(data) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export type HistoryEntry = ReturnType<typeof mapHistoryEntry>;

export async function fetchAppointmentHistory(appointmentId: string): Promise<ActionResult<HistoryEntry[]>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    // Doctors may only view history for their own appointments.
    if (user.role === 'doctor') {
      const { data: me } = await supabase.from('dentists').select('id').eq('user_id', user.id).maybeSingle();
      if (!me) return { ok: true, data: [] };
      const { data: apt } = await supabase.from('appointments').select('id').eq('id', appointmentId).eq('dentist_id', me.id).maybeSingle();
      if (!apt) return { ok: true, data: [] };
    }

    const { data, error } = await supabase
      .from('appointment_history')
      .select('*')
      .eq('appointment_id', appointmentId)
      .order('changed_at', { ascending: false });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapHistoryEntry) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export interface StatusUpdateInput {
  status: Appointment['status'];
  notes?: string;
}

export interface CreateStaffAppointmentInput {
  patientId: string;
  dentistId: string;
  serviceId: string;
  date: string;
  startTime: string;
  treatmentType: string;
  notes?: string;
  status?: Appointment['status'];
}

export async function createStaffAppointment(
  input: CreateStaffAppointmentInput
): Promise<ActionResult<Appointment>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    const { data: service } = await supabase
      .from('services')
      .select('id, price, currency, duration_minutes, name')
      .eq('id', input.serviceId)
      .single();
    if (!service) return { ok: false, error: 'Service not found' };

    const duration = Number(service.duration_minutes ?? 30);
    const startTime = input.startTime.slice(0, 5);
    const [hh, mm] = startTime.split(':').map(Number);
    const end = new Date();
    end.setHours(hh, mm + duration, 0, 0);
    const endTime = `${String(end.getHours()).padStart(2, '0')}:${String(end.getMinutes()).padStart(2, '0')}`;

    const { data, error } = await supabase
      .from('appointments')
      .insert({
        patient_id: input.patientId,
        dentist_id: input.dentistId,
        service_id: input.serviceId,
        date: input.date,
        start_time: startTime,
        end_time: endTime,
        status: input.status ?? 'confirmed',
        treatment_type: input.treatmentType,
        notes: input.notes || null,
        price: service.price,
        currency: service.currency,
      })
      .select('*, patients(first_name,last_name), dentists(first_name,last_name), services(name)')
      .single();
    if (error) return { ok: false, error: error.message };

    await supabase.from('appointment_history').insert({
      appointment_id: data.id,
      changed_by: user.id,
      old_status: null,
      new_status: data.status,
      notes: 'Appointment created by staff',
    });

    return { ok: true, data: mapAppointment(data) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function updateAppointmentStatus(
  id: string,
  input: StatusUpdateInput
): Promise<ActionResult<{ id: string; status: string }>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    const { data: existing } = await supabase.from('appointments').select('*').eq('id', id).single();
    if (!existing) return { ok: false, error: 'Not found' };
    // Doctors may only change the status of their own appointments (IDOR guard).
    if (user.role === 'doctor') {
      const { data: mine } = await supabase
        .from('dentists')
        .select('id')
        .eq('user_id', user.id)
        .eq('id', existing.dentist_id)
        .maybeSingle();
      if (!mine) return { ok: false, error: 'Not authorized' };
    }
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: input.status })
      .eq('id', id)
      .select('id, status')
      .single();
    if (error) return { ok: false, error: error.message };

    if (existing) {
      await supabase.from('appointment_history').insert({
        appointment_id: id,
        changed_by: user.id,
        old_status: existing.status,
        new_status: input.status,
        notes: input.notes ?? null,
      });
    }

    return { ok: true, data: { id: data.id, status: data.status } };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function fetchPatients(search?: string): Promise<ActionResult<Patient[]>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();
    let query = supabase.from('patients').select('*').order('created_at', { ascending: false });

    // Doctors see only patients they have appointments with.
    if (user.role === 'doctor') {
      const { data: me } = await supabase.from('dentists').select('id').eq('user_id', user.id).maybeSingle();
      if (!me) return { ok: true, data: [] };
      const { data: aptRows } = await supabase
        .from('appointments')
        .select('patient_id')
        .eq('dentist_id', me.id)
        .limit(1000);
      const patientIds = (aptRows ?? []).map((r) => r.patient_id).filter((id): id is string => id != null);
      if (patientIds.length === 0) return { ok: true, data: [] };
      query = query.in('id', patientIds);
    }

    if (search) {
      // Escape all PostgREST-significant chars so the search stays plain text.
      const safe = search.replace(/[,():".*%_]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
      if (!safe) return { ok: true, data: [] };
      const like = `%${safe}%`;
      query = query.or(`first_name.ilike.${like},last_name.ilike.${like},email.ilike.${like},phone.ilike.${like}`);
    }
    const { data, error } = await query;
    if (error && error.code !== 'PGRST116') return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapPatient) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function fetchDentists(includeInactive = false): Promise<ActionResult<Dentist[]>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();
    // Contact/PII columns stay with secretary/admin; doctors get display columns.
    const columns =
      user.role === 'secretary' || user.role === 'admin'
        ? '*'
        : 'id, first_name, last_name, specialty, bio, avatar_url, rating, is_active';
    let query = supabase.from('dentists').select(columns);
    if (!includeInactive) query = query.eq('is_active', true);
    const { data, error } = await query.order('first_name', { ascending: true });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapDentist) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function getMyDentist(): Promise<ActionResult<Dentist | null>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();
    const { data, error } = await supabase.from('dentists').select('*').eq('user_id', user.id).maybeSingle();
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data ? mapDentist(data) : null };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function fetchSchedules(scope: 'all' | 'mine' = 'all'): Promise<ActionResult<Schedule[]>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    // Doctors see only their own schedules.
    if (user.role === 'doctor') {
      const { data: dentists } = await supabase.from('dentists').select('id').eq('user_id', user.id);
      const ids = (dentists ?? []).map((d) => d.id);
      if (ids.length === 0) return { ok: true, data: [] };
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .in('dentist_id', ids)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
      if (error) return { ok: false, error: error.message };
      return { ok: true, data: (data ?? []).map(mapSchedule) };
    }

    if (scope === 'mine') {
      const { data: dentists } = await supabase.from('dentists').select('id').eq('user_id', user.id);
      const ids = (dentists ?? []).map((d) => d.id);
      if (ids.length === 0) return { ok: true, data: [] };
      const { data, error } = await supabase
        .from('schedules')
        .select('*')
        .in('dentist_id', ids)
        .gte('date', new Date().toISOString().split('T')[0])
        .order('date', { ascending: true });
      if (error) return { ok: false, error: error.message };
      return { ok: true, data: (data ?? []).map(mapSchedule) };
    }

    const { data, error } = await supabase
      .from('schedules')
      .select('*')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: (data ?? []).map(mapSchedule) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function fetchSessions(scope: 'all' | 'mine' = 'all'): Promise<ActionResult<DentalSession[]>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    let query =
      scope === 'all'
        ? supabase.from('live_dental_sessions').select('*')
        : supabase.from('live_dental_sessions').select('*, dentists(user_id)');

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) return { ok: false, error: error.message };

    // Doctors see only their own sessions.
    if (user.role === 'doctor') {
      const rows = (data ?? []).filter((s: { dentists?: { user_id?: string } | null }) => s.dentists?.user_id === user.id);
      return { ok: true, data: rows.map(mapSession) };
    }
    return { ok: true, data: (data ?? []).map(mapSession) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function startLiveSession(appointmentId: string): Promise<ActionResult<DentalSession>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    const { data: apt, error: aptError } = await supabase
      .from('appointments')
      .select('*')
      .eq('id', appointmentId)
      .single();
    if (aptError) return { ok: false, error: aptError.message };

    // Verify the appointment belongs to this user's dentist (doctors only).
    if (user.role === 'doctor') {
      const { data: d } = await supabase.from('dentists').select('id').eq('user_id', user.id).eq('id', apt.dentist_id).maybeSingle();
      if (!d) return { ok: false, error: 'Not authorized' };
    }

    const { data, error } = await supabase
      .from('live_dental_sessions')
      .insert({
        appointment_id: apt.id,
        patient_id: apt.patient_id,
        dentist_id: apt.dentist_id,
        service_id: apt.service_id,
        date: apt.date,
        start_time: apt.start_time,
        end_time: apt.end_time,
        status: 'active',
        type: apt.treatment_type,
        started_at: new Date().toISOString(),
        progress: 0,
      })
      .select('*')
      .single();
    if (error) return { ok: false, error: error.message };

    await supabase
      .from('appointments')
      .update({ status: 'in-progress' })
      .eq('id', apt.id);

    await supabase.from('appointment_history').insert({
      appointment_id: apt.id,
      changed_by: user.id,
      old_status: apt.status,
      new_status: 'in-progress',
      notes: 'Live session started',
    });

    return { ok: true, data: mapSession(data) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function endLiveSession(sessionId: string): Promise<ActionResult<DentalSession>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    const { data: session, error: sessionError } = await supabase
      .from('live_dental_sessions')
      .select('*, dentists(user_id)')
      .eq('id', sessionId)
      .single();
    if (sessionError) return { ok: false, error: sessionError.message };

    // Verify the session belongs to this user's dentist (doctors only).
    if (user.role === 'doctor') {
      if (session.dentists?.user_id !== user.id) return { ok: false, error: 'Not authorized' };
    }

    const { data, error } = await supabase
      .from('live_dental_sessions')
      .update({ status: 'completed', ended_at: new Date().toISOString(), progress: 100 })
      .eq('id', sessionId)
      .select('*')
      .single();
    if (error) return { ok: false, error: error.message };

    if (session.appointment_id) {
      await supabase.from('appointments').update({ status: 'completed' }).eq('id', session.appointment_id);
      await supabase.from('appointment_history').insert({
        appointment_id: session.appointment_id,
        changed_by: user.id,
        old_status: 'in-progress',
        new_status: 'completed',
        notes: 'Live session completed',
      });
    }

    return { ok: true, data: mapSession(data) };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function fetchNotifications(): Promise<ActionResult<{ list: Notification[]; unread: number }>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();

    // Doctors see clinic-wide notifications (user_id IS NULL) and notifications tied to their patients.
    let query = supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50);
    if (user.role === 'doctor') {
      const { data: me } = await supabase.from('dentists').select('id').eq('user_id', user.id).maybeSingle();
      if (me) {
        const { data: aptRows } = await supabase
          .from('appointments')
          .select('id')
          .eq('dentist_id', me.id)
          .limit(500);
        const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const aptIds = (aptRows ?? []).map((r) => r.id).filter((id): id is string => typeof id === 'string' && uuidRe.test(id));
        if (aptIds.length > 0) {
          query = query.or(`user_id.is.null,related_id.in.(${aptIds.join(',')})`);
        } else {
          query = query.is('user_id', null);
        }
      }
    }
    const { data, error } = await query;
    if (error) return { ok: false, error: error.message };

    const list = (data ?? []).map((n: Notification) => mapNotification(n));
    const unread = list.filter((n: Notification) => !n.read).length;
    return { ok: true, data: { list, unread } };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function markNotificationRead(id: string): Promise<ActionResult<null>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();
    // Doctors may only touch clinic-wide or their own notifications.
    let query = supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (user.role === 'doctor') {
      query = query.or(`user_id.is.null,user_id.eq.${user.id}`);
    }
    const { error } = await query;
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult<null>> {
  try {
    const { user } = await requireStaff();
    // Mass-update is a secretary/admin operation; doctors are limited to
    // clinic-wide notifications so one account can't wipe the clinic's alerts.
    if (user.role !== 'secretary' && user.role !== 'admin') {
      const supabase = createClient();
      const { error } = await supabase.from('notifications').update({ is_read: true }).is('user_id', null).neq('is_read', true);
      if (error) return { ok: false, error: error.message };
      return { ok: true, data: null };
    }
    const supabase = createClient();
    const { error } = await supabase.from('notifications').update({ is_read: true }).neq('is_read', true);
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function dismissNotification(id: string): Promise<ActionResult<null>> {
  try {
    const { user } = await requireStaff();
    const supabase = createClient();
    let query = supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (user.role === 'doctor') {
      query = query.or(`user_id.is.null,user_id.eq.${user.id}`);
    }
    const { error } = await query;
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}