'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { useLiveData } from '@/hooks/useLiveData';
import { createStaffAppointment, updateAppointmentStatus } from '@/app/actions';
import type {
  EnrichedAppointment,
  AppointmentFormData,
  AppointmentFilters,
  AppointmentStatus,
  AppointmentHistoryEntry,
  CalendarView,
} from './types';
import { checkConflict, generateId, getDayName, calculateEndTime, getWeekDates, getMonthDates, getDatesInRange } from './utils';

interface AppointmentContextType {
  appointments: EnrichedAppointment[];
  filteredAppointments: EnrichedAppointment[];
  filters: AppointmentFilters;
  setFilters: (filters: Partial<AppointmentFilters>) => void;
  calendarView: CalendarView;
  setCalendarView: (view: CalendarView) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  selectedAppointment: EnrichedAppointment | null;
  setSelectedAppointment: (apt: EnrichedAppointment | null) => void;
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
  editingAppointment: EnrichedAppointment | null;
  setEditingAppointment: (apt: EnrichedAppointment | null) => void;
  reschedulingAppointment: EnrichedAppointment | null;
  setReschedulingAppointment: (apt: EnrichedAppointment | null) => void;
  createAppointment: (data: AppointmentFormData) => { success: boolean; conflicts: ReturnType<typeof checkConflict> };
  updateAppointment: (id: string, data: Partial<AppointmentFormData>) => { success: boolean; conflicts: ReturnType<typeof checkConflict> };
  cancelAppointment: (id: string, reason: string) => void;
  rescheduleAppointment: (id: string, data: AppointmentFormData) => { success: boolean; conflicts: ReturnType<typeof checkConflict> };
  updateStatus: (id: string, status: AppointmentStatus) => void;
  getAppointmentHistory: (id: string) => AppointmentHistoryEntry[];
  getAppointmentsForDate: (date: string) => EnrichedAppointment[];
  getAppointmentsForDateRange: (from: string, to: string) => EnrichedAppointment[];
  dentists: Array<{ id: string; firstName: string; lastName: string; specialty: string }>;
  services: Array<{ id: string; name: string; price: number; durationMinutes: number }>;
  patients: Array<{ id: string; firstName: string; lastName: string; phone: string; email: string }>;
}

const AppointmentContext = createContext<AppointmentContextType | null>(null);

function enrichAppointment(apt: any): EnrichedAppointment {
  return {
    id: apt.id,
    patientId: apt.patientId,
    patientName: apt.patientName || 'Unknown Patient',
    patientPhone: apt.patientPhone || '',
    patientEmail: apt.patientEmail || '',
    dentistId: apt.dentistId,
    dentistName: apt.dentistName || 'Unknown Dentist',
    serviceId: apt.serviceId || '',
    serviceName: apt.serviceName || apt.treatmentType || '',
    date: apt.date,
    dayName: apt.dayName || getDayName(apt.date),
    startTime: apt.startTime,
    endTime: apt.endTime,
    status: apt.status as AppointmentStatus,
    treatmentType: apt.treatmentType || '',
    notes: apt.notes || '',
    price: apt.price || 0,
    createdAt: apt.createdAt || new Date().toISOString(),
    updatedAt: apt.updatedAt || new Date().toISOString(),
    originalDate: apt.originalDate,
    originalTime: apt.originalTime,
    history: apt.history || [],
  };
}

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const { appointments: liveAppointments, dentists: rawDentists, services: rawServices, patients: rawPatients } = useLiveData('all');

  const [appointments, setAppointments] = useState<EnrichedAppointment[]>([]);

  // Populate local store from live Supabase data whenever it (re)loads.
  // Merge by id so in-flight optimistic creates (client-generated ids not
  // yet present on the server) are preserved instead of being clobbered.
  useEffect(() => {
    if (liveAppointments) {
      const enriched = (liveAppointments as any[]).map(enrichAppointment);
      setAppointments((prev) => {
        if (prev.length === 0) return enriched;
        const liveIds = new Set(enriched.map((a) => a.id));
        const optimistic = prev.filter((a) => {
          if (liveIds.has(a.id)) return false;
          // Safety net: drop stale optimistic rows (older than 10 min) so a
          // lost server response can never duplicate a booking forever.
          if (a.id.startsWith('tmp-')) {
            const age = Date.now() - new Date(a.createdAt).getTime();
            return Number.isFinite(age) && age < 10 * 60 * 1000;
          }
          return true;
        });
        return [...enriched, ...optimistic];
      });
    }
  }, [liveAppointments]);
  const [filters, setFiltersState] = useState<AppointmentFilters>({
    search: '',
    dentistId: '',
    serviceId: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });
  const [calendarView, setCalendarView] = useState<CalendarView>('week');
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${m}-${day}`;
  });
  const [selectedAppointment, setSelectedAppointment] = useState<EnrichedAppointment | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<EnrichedAppointment | null>(null);
  const [reschedulingAppointment, setReschedulingAppointment] = useState<EnrichedAppointment | null>(null);

  const dentists = useMemo(
    () =>
      (rawDentists as any[]).map((d) => ({
        id: d.id,
        firstName: d.firstName,
        lastName: d.lastName,
        specialty: d.specialty,
      })),
    [rawDentists]
  );

  const services = useMemo(
    () =>
      (rawServices as any[]).map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        durationMinutes: s.durationMinutes,
      })),
    [rawServices]
  );

  const patients = useMemo(
    () =>
      (rawPatients as any[]).map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        phone: p.phone,
        email: p.email,
      })),
    [rawPatients]
  );

  const setFilters = useCallback((partial: Partial<AppointmentFilters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const filteredAppointments = useMemo(() => {
    let result = [...appointments];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.patientName.toLowerCase().includes(q) ||
          a.dentistName.toLowerCase().includes(q) ||
          a.treatmentType.toLowerCase().includes(q) ||
          a.serviceName.toLowerCase().includes(q)
      );
    }

    if (filters.dentistId) {
      result = result.filter((a) => a.dentistId === filters.dentistId);
    }

    if (filters.serviceId) {
      result = result.filter((a) => a.serviceId === filters.serviceId);
    }

    if (filters.status !== 'all') {
      result = result.filter((a) => a.status === filters.status);
    }

    if (filters.dateFrom) {
      result = result.filter((a) => a.date >= filters.dateFrom);
    }

    if (filters.dateTo) {
      result = result.filter((a) => a.date <= filters.dateTo);
    }

    return result;
  }, [appointments, filters]);

  const getAppointmentsForDate = useCallback(
    (date: string) => appointments.filter((a) => a.date === date && a.status !== 'cancelled'),
    [appointments]
  );

  const getAppointmentsForDateRange = useCallback(
    (from: string, to: string) => {
      const dates = getDatesInRange(from, to);
      const dateSet = new Set(dates);
      return filteredAppointments.filter((a) => dateSet.has(a.date) && a.status !== 'cancelled');
    },
    [filteredAppointments]
  );

  const addHistory = useCallback(
    (appointmentId: string, entry: Omit<AppointmentHistoryEntry, 'id' | 'appointmentId' | 'timestamp'>) => {
      const historyEntry: AppointmentHistoryEntry = {
        id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        appointmentId,
        timestamp: new Date().toISOString(),
        ...entry,
      };
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId
            ? { ...a, history: [...a.history, historyEntry], updatedAt: new Date().toISOString() }
            : a
        )
      );
    },
    []
  );

  const createAppointment = useCallback(
    (data: AppointmentFormData): { success: boolean; conflicts: ReturnType<typeof checkConflict> } => {
      const conflicts = checkConflict(data, appointments);
      if (conflicts.length > 0) return { success: false, conflicts };

      const patient = patients.find((p) => p.id === data.patientId);
      const dentist = dentists.find((d) => d.id === data.dentistId);
      const service = services.find((s) => s.id === data.serviceId);

      const localApt: EnrichedAppointment = {
        id: `tmp-${generateId()}`,
        patientId: data.patientId,
        patientName: patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown',
        patientPhone: patient?.phone || '',
        patientEmail: patient?.email || '',
        dentistId: data.dentistId,
        dentistName: dentist ? `Dr. ${dentist.firstName} ${dentist.lastName}` : 'Unknown',
        serviceId: data.serviceId,
        serviceName: service?.name || data.treatmentType,
        date: data.date,
        dayName: getDayName(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        status: 'confirmed',
        treatmentType: data.treatmentType,
        notes: data.notes,
        price: service?.price || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        history: [],
      };

      setAppointments((prev) => [...prev, localApt]);

      createStaffAppointment({
        patientId: data.patientId,
        dentistId: data.dentistId,
        serviceId: data.serviceId,
        date: data.date,
        startTime: data.startTime,
        treatmentType: data.treatmentType,
        notes: data.notes,
        status: 'confirmed',
      })
        .then((res) => {
          if (res.ok) {
            // Swap the optimistic row for the real server row (same booking,
            // server id) so refetches never duplicate it.
            const serverRow = enrichAppointment(res.data);
            setAppointments((prev) => prev.map((a) => (a.id === localApt.id ? serverRow : a)));
          } else {
            // Server rejected it: roll back so no ghost booking lingers.
            setAppointments((prev) => prev.filter((a) => a.id !== localApt.id));
            console.error('createStaffAppointment failed:', res.error);
          }
        })
        .catch((err) => console.error('createStaffAppointment failed:', err));

      return { success: true, conflicts: [] };
    },
    [appointments, patients, dentists, services]
  );

  const updateAppointment = useCallback(
    (id: string, data: Partial<AppointmentFormData>): { success: boolean; conflicts: ReturnType<typeof checkConflict> } => {
      const existing = appointments.find((a) => a.id === id);
      if (!existing) return { success: false, conflicts: [] };

      const mergedData: AppointmentFormData = {
        patientId: data.patientId || existing.patientId,
        dentistId: data.dentistId || existing.dentistId,
        serviceId: data.serviceId || existing.serviceId,
        date: data.date || existing.date,
        startTime: data.startTime || existing.startTime,
        endTime: data.endTime || existing.endTime,
        treatmentType: data.treatmentType || existing.treatmentType,
        notes: data.notes ?? existing.notes,
      };

      const conflicts = checkConflict(mergedData, appointments, id);
      if (conflicts.length > 0) return { success: false, conflicts };

      const changes: { field: string; oldValue: string; newValue: string }[] = [];
      if (data.date && data.date !== existing.date) changes.push({ field: 'date', oldValue: existing.date, newValue: data.date });
      if (data.startTime && data.startTime !== existing.startTime) changes.push({ field: 'time', oldValue: existing.startTime, newValue: data.startTime });
      if (data.dentistId && data.dentistId !== existing.dentistId) changes.push({ field: 'dentist', oldValue: existing.dentistName, newValue: dentists.find((d) => d.id === data.dentistId) ? `Dr. ${dentists.find((d) => d.id === data.dentistId)!.firstName} ${dentists.find((d) => d.id === data.dentistId)!.lastName}` : data.dentistId });
      if (data.serviceId && data.serviceId !== existing.serviceId) changes.push({ field: 'service', oldValue: existing.serviceName, newValue: services.find((s) => s.id === data.serviceId)?.name || data.serviceId });

      const patient = data.patientId ? patients.find((p) => p.id === data.patientId) : undefined;
      const dentist = data.dentistId ? dentists.find((d) => d.id === data.dentistId) : undefined;
      const service = data.serviceId ? services.find((s) => s.id === data.serviceId) : undefined;

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                ...mergedData,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : a.patientName,
                patientPhone: patient?.phone || a.patientPhone,
                patientEmail: patient?.email || a.patientEmail,
                dentistName: dentist ? `Dr. ${dentist.firstName} ${dentist.lastName}` : a.dentistName,
                serviceName: service?.name || a.serviceName,
                dayName: mergedData.date ? getDayName(mergedData.date) : a.dayName,
                price: service?.price || a.price,
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );

      if (changes.length > 0) {
        // Applied as a queued functional update right after the edit above,
        // so it always attaches to the fresh row (no timer, no stale snapshot).
        addHistory(id, { action: 'updated', performedBy: 'Staff', changes });
      }

      return { success: true, conflicts: [] };
    },
    [appointments, patients, dentists, services, addHistory]
  );

  const cancelAppointment = useCallback(
    (id: string, reason: string) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: 'cancelled' as AppointmentStatus, notes: a.notes ? `${a.notes}\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`, updatedAt: new Date().toISOString() }
            : a
        )
      );
      updateAppointmentStatus(id, { status: 'cancelled', notes: `Cancelled: ${reason}` })
        .then((res) => {
          if (!res.ok) console.error('updateAppointmentStatus failed:', res.error);
        })
        .catch((err) => console.error('updateAppointmentStatus failed:', err));
    },
    []
  );

  const rescheduleAppointment = useCallback(
    (id: string, data: AppointmentFormData): { success: boolean; conflicts: ReturnType<typeof checkConflict> } => {
      const existing = appointments.find((a) => a.id === id);
      if (!existing) return { success: false, conflicts: [] };

      const conflicts = checkConflict(data, appointments, id);
      if (conflicts.length > 0) return { success: false, conflicts };

      const patient = patients.find((p) => p.id === data.patientId);
      const dentist = dentists.find((d) => d.id === data.dentistId);
      const service = services.find((s) => s.id === data.serviceId);

      setAppointments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                dayName: getDayName(data.date),
                status: 'rescheduled' as AppointmentStatus,
                originalDate: a.originalDate || a.date,
                originalTime: a.originalTime || a.startTime,
                patientName: patient ? `${patient.firstName} ${patient.lastName}` : a.patientName,
                patientPhone: patient?.phone || a.patientPhone,
                patientEmail: patient?.email || a.patientEmail,
                dentistName: dentist ? `Dr. ${dentist.firstName} ${dentist.lastName}` : a.dentistName,
                serviceName: service?.name || a.serviceName,
                serviceId: data.serviceId || a.serviceId,
                price: service?.price || a.price,
                notes: data.notes ?? a.notes,
                updatedAt: new Date().toISOString(),
              }
            : a
        )
      );

      setTimeout(() => {
        addHistory(id, {
          action: 'rescheduled',
          performedBy: 'Staff',
          changes: [
            { field: 'date', oldValue: existing.date, newValue: data.date },
            { field: 'time', oldValue: existing.startTime, newValue: data.startTime },
          ],
        });
      }, 0);

      return { success: true, conflicts: [] };
    },
    [appointments, patients, dentists, services, addHistory]
  );

  const updateStatus = useCallback(
    (id: string, status: AppointmentStatus) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a))
      );
      updateAppointmentStatus(id, { status })
        .then((res) => {
          if (!res.ok) console.error('updateAppointmentStatus failed:', res.error);
        })
        .catch((err) => console.error('updateAppointmentStatus failed:', err));
    },
    []
  );

  const getAppointmentHistory = useCallback(
    (id: string) => appointments.find((a) => a.id === id)?.history || [],
    [appointments]
  );

  const value: AppointmentContextType = useMemo(
    () => ({
    appointments,
    filteredAppointments,
    filters,
    setFilters,
    calendarView,
    setCalendarView,
    selectedDate,
    setSelectedDate,
    selectedAppointment,
    setSelectedAppointment,
    formOpen,
    setFormOpen,
    editingAppointment,
    setEditingAppointment,
    reschedulingAppointment,
    setReschedulingAppointment,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    updateStatus,
    getAppointmentHistory,
    getAppointmentsForDate,
    getAppointmentsForDateRange,
    dentists,
    services,
    patients,
    }),
    [
      appointments,
      filteredAppointments,
      filters,
      setFilters,
      calendarView,
      selectedDate,
      selectedAppointment,
      formOpen,
      editingAppointment,
      reschedulingAppointment,
      createAppointment,
      updateAppointment,
      cancelAppointment,
      rescheduleAppointment,
      updateStatus,
      getAppointmentHistory,
      getAppointmentsForDate,
      getAppointmentsForDateRange,
      dentists,
      services,
      patients,
    ]
  );

  return <AppointmentContext.Provider value={value}>{children}</AppointmentContext.Provider>;
}

export function useAppointments() {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointments must be used within AppointmentProvider');
  return context;
}
