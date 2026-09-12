'use client';

import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { type Patient, type Appointment } from '@/lib/supabase/types';
import { cn, formatDate, formatTime, generateId } from '@/lib/utils';
import { notify } from '@/components/ui/Notification';

// Supabase queries helper
export const queries = {
  // Patients
  async getPatients() {
    const { data, error } = await supabase.from('patients').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as Patient[];
  },

  async getPatient(id: string) {
    const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Patient;
  },

  async createPatient(patient: Omit<Patient, 'id'>) {
    const { data, error } = await supabase.from('patients').insert(patient).select().single();
    if (error) throw error;
    return data as Patient;
  },

  async updatePatient(id: string, updates: Partial<Patient>) {
    const { data, error } = await supabase.from('patients').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Patient;
  },

  // Appointments
  async getAppointments(date?: string) {
    let query = supabase.from('appointments').select('*').order('date', { ascending: true });
    if (date) query = query.eq('date', date);
    const { data, error } = await query;
    if (error) throw error;
    return data as Appointment[];
  },

  async getAppointment(id: string) {
    const { data, error } = await supabase.from('appointments').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Appointment;
  },

  async createAppointment(appointment: Omit<Appointment, 'id'>) {
    const { data, error } = await supabase.from('appointments').insert(appointment).select().single();
    if (error) throw error;
    return data as Appointment;
  },

  async updateAppointment(id: string, updates: Partial<Appointment>) {
    const { data, error } = await supabase.from('appointments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Appointment;
  },

  async cancelAppointment(id: string) {
    const { data, error } = await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', id).select().single();
    if (error) throw error;
    return data as Appointment;
  },

  // Dentists
  async getDentists() {
    const { data, error } = await supabase.from('dentists').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as any[];
  },

  // Services
  async getServices() {
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as any[];
  },

  // Gallery
  async getGalleryImages() {
    const { data, error } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as any[];
  },

  // Notifications
  async getNotifications() {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as any[];
  },

  // Billing
  async getBilling() {
    const { data, error } = await supabase.from('billing').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    return data as any[];
  },

  // Auth helpers
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async signUp(email: string, password: string, userData?: Record<string, unknown>) {
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: userData } });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
};

// Hook for data fetching with loading/error states
export function useQuery<T>(queryFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      const result = await queryFn();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Query failed'));
      notify('error', 'Query Error', (err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [queryFn]);

  return { data, loading, error, refetch: execute };
}

// Hook for mutations
export function useMutation<T, V extends any[]>(mutationFn: (...args: V) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (...args: V) => {
    try {
      setLoading(true);
      setError(null);
      const result = await mutationFn(...args);
      notify('success', 'Success', 'Operation completed successfully');
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Mutation failed'));
      notify('error', 'Error', (err as Error).message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [mutationFn]);

  return { loading, error, execute };
}
