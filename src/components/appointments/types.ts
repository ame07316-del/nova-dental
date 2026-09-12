export type AppointmentStatus =
  | 'confirmed'
  | 'pending'
  | 'waiting'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'
  | 'delayed';

export type CalendarView = 'day' | 'week' | 'month';

export interface AppointmentFormData {
  patientId: string;
  dentistId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  treatmentType: string;
  notes: string;
}

export interface AppointmentConflict {
  type: 'overlap' | 'break' | 'unavailable' | 'outside-hours';
  message: string;
  conflictingAppointmentId?: string;
}

export interface AppointmentHistoryEntry {
  id: string;
  appointmentId: string;
  action: 'created' | 'updated' | 'cancelled' | 'rescheduled' | 'status-changed';
  timestamp: string;
  changes?: { field: string; oldValue: string; newValue: string }[];
  performedBy: string;
}

export interface CalendarSlot {
  time: string;
  hour: number;
  minute: number;
}

export interface DayAppointments {
  date: string;
  appointments: EnrichedAppointment[];
}

export interface EnrichedAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  dentistId: string;
  dentistName: string;
  serviceId: string;
  serviceName: string;
  date: string;
  dayName: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  treatmentType: string;
  notes: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  originalDate?: string;
  originalTime?: string;
  history: AppointmentHistoryEntry[];
}

export interface AppointmentFilters {
  search: string;
  dentistId: string;
  serviceId: string;
  status: AppointmentStatus | 'all';
  dateFrom: string;
  dateTo: string;
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  confirmed: 'Confirmed',
  pending: 'Pending',
  waiting: 'Waiting',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
  delayed: 'Delayed',
};

export const STATUS_COLORS: Record<AppointmentStatus, { bg: string; text: string; dot: string }> = {
  confirmed: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500' },
  pending: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500' },
  waiting: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500' },
  'in-progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  completed: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  cancelled: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
  rescheduled: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
  delayed: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500' },
};
