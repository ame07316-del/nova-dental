'use client';

import { useCallback, useMemo, useState } from 'react';
import { useAuth as UseAuthBase } from '@/components/layout/AuthProvider';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import { notify } from '@/components/ui/Notification';
import type { Patient } from '@/lib/supabase/types';

// Extended auth hook with patient data
export function useAuthExtended() {
  const { user, isAuthenticated, signIn, signUp, signOut } = UseAuthBase();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);

  const loadPatient = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data, error } = await getSupabaseBrowser().from('patients').select('*').eq('user_id', user.id).single();
      if (!error && data) {
        setPatient(data as Patient);
      }
    } catch (err) {
      console.error('Failed to load patient:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      setPatient(null);
      notify('success', 'Logged out', 'You have been signed out.');
    } catch (err) {
      notify('error', 'Error', 'Failed to sign out.');
    }
  }, [signOut]);

  return {
    user,
    isAuthenticated,
    patient,
    loading,
    signIn,
    signUp,
    logout,
    loadPatient,
  };
}

// Hook for checking user roles
export function useRoles() {
  const { user } = UseAuthBase();

  const roles = useMemo(
    () => (user?.user_metadata?.role ? [user.user_metadata.role] : []),
    [user]
  );

  const hasRole = useCallback((role: string) => {
    return roles.includes(role as (typeof roles)[number]);
  }, [roles]);

  const isAdmin = hasRole('admin');
  const isDentist = hasRole('doctor');
  const isPatient = hasRole('patient');

  return {
    roles,
    hasRole,
    isAdmin,
    isDentist,
    isPatient,
    userRole: user?.user_metadata?.role,
  };
}
