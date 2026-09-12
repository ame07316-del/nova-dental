export { dentists, services, schedules, patients, appointments, sessions, notifications, billing } from './demo';
export { DemoDataProvider, useDemoData, useDentists, useServices, useSchedules, usePatients, useAppointments, useSessions, useNotifications, useBilling, useUpcomingAppointments, usePastAppointments, useActiveSessions, useCompletedSessions } from '@/components/layout/DemoDataProvider';
export type { Dentist, Service, Schedule, Patient, Appointment, Session, Notification, Billing } from '@/lib/supabase/types';
