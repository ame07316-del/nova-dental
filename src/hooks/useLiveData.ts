'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  fetchAppointments,
  fetchDentists,
  fetchNotifications,
  fetchPatients,
  fetchSchedules,
  fetchSessions,
  getMyDentist,
  getPublicCatalog,
  type ActionResult,
} from '@/app/actions';
import type { Appointment, DentalSession, Dentist, Notification, Patient, Schedule, Service } from '@/lib/supabase/types';

export interface LiveData {
  services: Service[];
  dentists: Dentist[];
  patients: Patient[];
  appointments: Appointment[];
  sessions: DentalSession[];
  schedules: Schedule[];
  notifications: Notification[];
  myDentist: Dentist | null;
}

const INITIAL: LiveData = {
  services: [],
  dentists: [],
  patients: [],
  appointments: [],
  sessions: [],
  schedules: [],
  notifications: [],
  myDentist: null,
};

/**
 * Loads the real Supabase data (staff surfaces) and returns it in the same
 * camelCase shapes the components already consume. `scope: 'mine'` restricts
 * appointments/sessions/schedules to the signed-in doctor; otherwise 'all'.
 */
export function useLiveData(scope: 'mine' | 'all' = 'all') {
  const [data, setData] = useState<LiveData>(INITIAL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [
      aptRes,
      patsRes,
      densRes,
      sessRes,
      notifRes,
      schedRes,
      myRes,
      catRes,
    ] = await Promise.all([
      fetchAppointments(scope),
      fetchPatients(),
      fetchDentists(),
      fetchSessions(scope),
      fetchNotifications(),
      fetchSchedules(scope),
      getMyDentist(),
      getPublicCatalog(),
    ]);

    const errors: string[] = [];
    const list = <T,>(res: ActionResult<T[]>): T[] => (res.ok ? res.data : (errors.push(res.error), []));

    setData({
      appointments: list(aptRes),
      patients: list(patsRes),
      dentists: list(densRes),
      sessions: list(sessRes),
      schedules: list(schedRes),
      notifications: notifRes.ok ? notifRes.data.list : (errors.push(notifRes.error), []),
      services: catRes.ok ? catRes.data.services : (errors.push(catRes.error), []),
      myDentist: myRes.ok ? myRes.data : (errors.push(myRes.error), null),
    });

    if (errors.length > 0) setError(errors[0]);
    setLoading(false);
  }, [scope]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...data, loading, error, refetch: load };
}