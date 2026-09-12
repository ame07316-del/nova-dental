import type {
  Appointment,
  DentalSession,
  Dentist,
  GalleryImage,
  Notification,
  Patient,
  Schedule,
  Service,
} from '@/lib/supabase/types';

type Row = Record<string, any>;

export interface AppointmentHistoryEntry {
  id: string;
  appointmentId: string;
  action: string;
  timestamp: string;
  changes?: { field: string; oldValue: string; newValue: string }[];
  performedBy: string;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function toDayName(date: string): string {
  try {
    return DAY_NAMES[new Date(`${date}T00:00:00`).getDay()] ?? '';
  } catch {
    return '';
  }
}

function toTime(value: unknown): string {
  if (!value) return '';
  return String(value).slice(0, 5);
}

export function mapPatient(row: Row): Patient {
  return {
    id: row.id,
    userId: row.user_id ?? '',
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    dateOfBirth: row.date_of_birth ?? null,
    gender: (row.gender as Patient['gender']) ?? null,
    address: row.address ?? null,
    nationalId: row.national_id ?? null,
    medicalHistory: row.medical_history ?? null,
    allergies: row.allergies ?? null,
    insuranceProvider: row.insurance_provider ?? null,
    insuranceNumber: row.insurance_number ?? null,
    avatarUrl: row.avatar_url ?? null,
    notes: row.notes ?? null,
    status: (row.status as Patient['status']) ?? 'active',
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  };
}

export function mapDentist(row: Row): Dentist {
  return {
    id: row.id,
    firstName: row.first_name ?? '',
    lastName: row.last_name ?? '',
    specialty: row.specialty ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    licenseNumber: row.license_number ?? null,
    rating: row.rating != null ? Number(row.rating) : null,
    patientCount: row.patient_count != null ? Number(row.patient_count) : null,
    avatarUrl: row.avatar_url ?? null,
    bio: row.bio ?? null,
    qualifications: row.qualifications ?? null,
    isActive: row.is_active !== false,
    schedule: row.schedule ?? null,
    roomNumber: row.room_number ?? null,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  };
}

export function mapService(row: Row): Service {
  return {
    id: row.id,
    name: row.name ?? '',
    description: row.description ?? '',
    category: row.category ?? '',
    price: Number(row.price ?? 0),
    currency: row.currency ?? null,
    durationMinutes: Number(row.duration_minutes ?? 30),
    imageUrl: row.image_url ?? null,
    isActive: row.is_active !== false,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  };
}

export function mapSchedule(row: Row): Schedule {
  return {
    id: row.id,
    dentistId: row.dentist_id,
    date: row.date ?? '',
    dayName: row.day_name ?? toDayName(row.date ?? ''),
    startTime: toTime(row.start_time),
    endTime: toTime(row.end_time),
    breakStart: row.break_start ? toTime(row.break_start) : null,
    breakEnd: row.break_end ? toTime(row.break_end) : null,
    maxAppointments: row.max_appointments ?? null,
    isAvailable: row.is_available !== false,
    createdAt: row.created_at ?? '',
  };
}

export interface AppointmentRow {
  id: string;
  patient_id: string | null;
  dentist_id: string | null;
  service_id: string | null;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  treatment_type: string | null;
  notes: string | null;
  price: number | null;
  currency: string | null;
  is_paid: boolean | null;
  room_number: string | null;
  created_at: string;
  updated_at: string;
  patients?: { first_name: string; last_name: string; phone: string } | null;
  dentists?: { first_name: string; last_name: string } | null;
  services?: { name: string } | null;
}

export function mapAppointment(row: AppointmentRow): Appointment {
  const patientName = row.patients
    ? `${row.patients.first_name ?? ''} ${row.patients.last_name ?? ''}`.trim()
    : '';
  const dentistName = row.dentists
    ? `Dr. ${row.dentists.first_name ?? ''} ${row.dentists.last_name ?? ''}`.trim().replace('Dr. Dr.', 'Dr.')
    : '';
  return {
    id: row.id,
    patientId: row.patient_id ?? '',
    patientName: patientName || 'N/A',
    dentistId: row.dentist_id ?? '',
    dentistName: dentistName || 'Unassigned',
    serviceId: row.service_id ?? '',
    serviceName: row.services?.name ?? '',
    date: row.date ?? '',
    dayName: toDayName(row.date ?? ''),
    startTime: toTime(row.start_time),
    endTime: toTime(row.end_time),
    status: (row.status as Appointment['status']) ?? 'pending',
    treatmentType: row.treatment_type ?? '',
    notes: row.notes ?? null,
    price: row.price != null ? Number(row.price) : null,
    currency: row.currency ?? null,
    isPaid: row.is_paid ?? false,
    roomNumber: row.room_number ?? null,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  };
}

export function mapSession(row: Row): DentalSession {
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    patientId: row.patient_id,
    dentistId: row.dentist_id,
    serviceId: row.service_id ?? '',
    date: row.date ?? '',
    startTime: toTime(row.start_time),
    endTime: toTime(row.end_time),
    status: row.status ?? 'scheduled',
    type: row.type ?? '',
    notes: row.notes ?? null,
    procedures: row.procedures ?? [],
    progress: Number(row.progress ?? 0),
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  };
}

export function mapNotification(row: Row): Notification {
  return {
    id: row.id,
    type: row.type ?? 'info',
    title: row.title ?? '',
    message: row.message ?? '',
    time: row.time ?? row.created_at ?? '',
    read: row.is_read !== false,
    relatedId: row.related_id ?? null,
    createdAt: row.created_at ?? '',
  };
}

export function mapGalleryImage(row: Row): GalleryImage {
  return {
    id: row.id,
    patientId: row.patient_id ?? null,
    dentistId: row.dentist_id ?? null,
    imageUrl: row.image_url ?? '',
    thumbnailUrl: row.thumbnail_url ?? null,
    treatmentType: row.treatment_type ?? '',
    beforeImageUrl: row.before_image_url ?? null,
    description: row.description ?? row.title ?? null,
    isFeatured: row.is_featured ?? false,
    createdAt: row.created_at ?? '',
    updatedAt: row.updated_at ?? '',
  };
}

export function mapHistoryEntry(row: Row): AppointmentHistoryEntry {
  const changes: AppointmentHistoryEntry['changes'] = [];
  if (row.old_status !== row.new_status) {
    changes.push({ field: 'status', oldValue: row.old_status ?? '', newValue: row.new_status ?? '' });
  }
  if (row.old_start_time !== row.new_start_time) {
    changes.push({
      field: 'start_time',
      oldValue: toTime(row.old_start_time),
      newValue: toTime(row.new_start_time),
    });
  }
  if (row.old_end_time !== row.new_end_time) {
    changes.push({
      field: 'end_time',
      oldValue: toTime(row.old_end_time),
      newValue: toTime(row.new_end_time),
    });
  }
  if (row.notes) {
    changes.push({ field: 'notes', oldValue: '', newValue: row.notes });
  }
  return {
    id: row.id,
    appointmentId: row.appointment_id,
    action: (row.new_status ?? row.old_status ?? 'status-changed') as AppointmentHistoryEntry['action'],
    timestamp: row.changed_at ?? '',
    changes: changes.length > 0 ? changes : undefined,
    performedBy: row.changed_by ?? 'system',
  };
}