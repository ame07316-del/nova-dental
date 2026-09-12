'use client';

import { createContext, useContext, type ReactNode } from 'react';
import {
  dentists,
  services,
  schedules,
  patients,
  appointments,
  sessions,
  notifications,
  billing,
} from '@/data/demo';
import type {
  Dentist,
  Service,
  Schedule,
  Patient,
  Appointment,
  Session,
  Notification,
  Billing,
} from '@/lib/supabase/types';

// Type-safe demo data
const demoData = {
  dentists: dentists as Dentist[],
  services: services as Service[],
  schedules: schedules as Schedule[],
  patients: patients as Patient[],
  appointments: appointments as Appointment[],
  sessions: sessions as Session[],
  notifications: notifications as Notification[],
  billing: billing as Billing[],
};

// Demo Data Context
interface DemoDataContextType {
  dentists: Dentist[];
  services: Service[];
  schedules: Schedule[];
  patients: Patient[];
  appointments: Appointment[];
  sessions: Session[];
  notifications: Notification[];
  billing: Billing[];
  isLoading: boolean;
  error: string | null;
}

const DemoDataContext = createContext<DemoDataContextType | null>(null);

export function DemoDataProvider({ children }: { children: ReactNode }) {
  return (
    <DemoDataContext.Provider value={{ ...demoData, isLoading: false, error: null }}>
      {children}
    </DemoDataContext.Provider>
  );
}

// Hook to access demo data
export function useDemoData() {
  const context = useContext(DemoDataContext);
  if (!context) {
    throw new Error('useDemoData must be used within DemoDataProvider');
  }
  return context;
}

// Individual hooks for each data type
export function useDentists() {
  return useDemoData().dentists;
}

export function useServices() {
  return useDemoData().services;
}

export function useSchedules() {
  return useDemoData().schedules;
}

export function usePatients() {
  return useDemoData().patients;
}

export function useAppointments() {
  return useDemoData().appointments;
}

export function useSessions() {
  return useDemoData().sessions;
}

export function useNotifications() {
  return useDemoData().notifications;
}

export function useBilling() {
  return useDemoData().billing;
}

// Filtered hooks
export function useUpcomingAppointments() {
  const all = useDemoData().appointments;
  return all.filter((apt) => new Date(apt.date) >= new Date());
}

export function usePastAppointments() {
  const all = useDemoData().appointments;
  return all.filter((apt) => new Date(apt.date) < new Date());
}

export function useActiveSessions() {
  return useDemoData().sessions.filter((s) => s.status === 'active');
}

export function useCompletedSessions() {
  return useDemoData().sessions.filter((s) => s.status === 'completed');
}
