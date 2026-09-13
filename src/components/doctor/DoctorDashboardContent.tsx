'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CurrentPatientCard } from './CurrentPatientCard';
import { Avatar } from '@/components/dental/AvatarsAndMore';
import { NotificationCenter } from '@/components/notifications';
import { useLiveData } from '@/hooks/useLiveData';
import { useAuth } from '@/components/layout/AuthProvider';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useTheme } from '@/components/layout/ThemeProvider';
import { cn, formatDateInput } from '@/lib/utils';
import { useState } from 'react';
import { notify } from '@/components/ui/Notification';

export function DoctorDashboardContent() {
  const { dentists, appointments, patients, sessions, myDentist, loading, refetch } = useLiveData('mine');
  const { user } = useAuth();
  const { language, t, direction } = useLanguage();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'history'>('today');

  const currentDentist = myDentist;
  const dentistName = currentDentist ? `${currentDentist.firstName} ${currentDentist.lastName}` : 'Doctor';

  if (!myDentist && !loading) {
    // Doctor has no linked dentist record — show setup prompt.
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="rounded-lg border border-nova-border bg-nova-surface p-8 text-center">
          <p className="text-lg font-bold text-nova-text">Setup Required</p>
          <p className="mt-2 text-sm text-nova-text-secondary">
            Your dentist profile could not be found. Please contact the administrator.
          </p>
        </div>
      </div>
    );
  }

  const today = new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const dentistAppointments = appointments.filter(
    (apt) => apt.dentistId === currentDentist?.id
  );

  const todayStr = formatDateInput(new Date());

  const todayAppointments = dentistAppointments.filter(
    (apt) => apt.date === todayStr
  );

  const upcomingAppointments = dentistAppointments.filter(
    (apt) => apt.date > todayStr && apt.status !== 'cancelled'
  );

  const historyAppointments = dentistAppointments.filter(
    (apt) => apt.status === 'completed' || apt.status === 'cancelled'
  );

  // Stats
  const confirmedCount = todayAppointments.filter((a) => a.status === 'confirmed').length;
  const pendingCount = todayAppointments.filter((a) => a.status === 'pending').length;
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">
            {t('welcome')}, {dentistName}
          </h1>
          <p className="text-sm text-nova-text-secondary">{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success">{confirmedCount} confirmed</Badge>
          <Badge variant="warning">{pendingCount} pending</Badge>
          <Button variant="outline" onClick={() => { void refetch(); notify('info', 'Sync', 'Synced with Supabase'); }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            Sync
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-lg border border-nova-border bg-nova-surface px-4 py-3 text-sm text-nova-text-secondary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-nova-border border-t-nova-primary" />
          Loading live clinic data…
        </div>
      )}

      {/* Tab navigation */}
      <div className="flex gap-1 rounded-lg bg-nova-muted p-1">
        {[
          { key: 'today' as const, label: language === 'ar' ? 'اليوم' : 'Today' },
          { key: 'upcoming' as const, label: language === 'ar' ? 'القادمة' : 'Upcoming' },
          { key: 'history' as const, label: language === 'ar' ? 'السجل' : 'History' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-nova-primary text-white shadow-soft'
                : 'text-nova-text-secondary hover:text-nova-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column - Patient & Session */}
        <div className="lg:col-span-1 space-y-6">
          <CurrentPatientCard />
          <Card>
            <CardBody>
              <NotificationCenter />
            </CardBody>
          </Card>
        </div>

        {/* Center column - Appointments */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card variant="stat">
              <p className="text-sm text-nova-text-secondary">Today&apos;s Confirmed</p>
              <p className="mt-1 text-3xl font-bold text-nova-text">{confirmedCount}</p>
            </Card>
            <Card variant="stat">
              <p className="text-sm text-nova-text-secondary">Pending</p>
              <p className="mt-1 text-3xl font-bold text-nova-text">{pendingCount}</p>
            </Card>
            <Card variant="stat">
              <p className="text-sm text-nova-text-secondary">Active Patients</p>
              <p className="mt-1 text-3xl font-bold text-nova-text">{activePatients}</p>
            </Card>
            <Card variant="stat">
              <p className="text-sm text-nova-text-secondary">Sessions Today</p>
              <p className="mt-1 text-3xl font-bold text-nova-text">
                {sessions.filter((s) => s.date === todayStr).length}
              </p>
            </Card>
          </div>

          {/* Tab content */}
          {activeTab === 'today' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {language === 'ar' ? 'مواعيد اليوم' : "Today's Appointments"}
                  <Badge variant="info">{todayAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {todayAppointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-nova-text-muted">
                    No appointments today
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map((appointment) => (
                      <button
                        key={appointment.id}
                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-nova-muted/30"
                      >
                        <Avatar name={appointment.patientName} size="md" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-nova-text">{appointment.patientName}</p>
                          <p className="text-xs text-nova-text-muted">{appointment.serviceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-nova-text">{appointment.startTime}</p>
                          <Badge variant={
                            appointment.status === 'confirmed' ? 'success' :
                            appointment.status === 'pending' ? 'warning' : 'default'
                          } dot>
                            {appointment.status}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {activeTab === 'upcoming' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {language === 'ar' ? 'المواعيد القادمة' : 'Upcoming Appointments'}
                  <Badge variant="primary">{upcomingAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {upcomingAppointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-nova-text-muted">
                    {language === 'ar' ? 'لا توجد مواعيد قادمة' : 'No upcoming appointments'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <button
                        key={appointment.id}
                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-nova-muted/30"
                      >
                        <Avatar name={appointment.patientName} size="md" />
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-nova-text">{appointment.patientName}</p>
                          <p className="text-xs text-nova-text-muted">{appointment.serviceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-nova-text">
                            {appointment.date} {appointment.startTime}
                          </p>
                          <Badge variant="info" dot>Upcoming</Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {language === 'ar' ? 'سجل المواعيد' : 'Appointment History'}
                  <Badge variant="outline">{historyAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardBody>
                {historyAppointments.length === 0 ? (
                  <div className="py-8 text-center text-sm text-nova-text-muted">
                    No history available
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyAppointments.slice(0, 6).map((appointment) => (
                      <button
                        key={appointment.id}
                        className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-nova-muted/30"
                      >
                        <Avatar name={appointment.patientName} size="md" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-nova-text">{appointment.patientName}</p>
                          <p className="text-xs text-nova-text-muted">{appointment.serviceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-nova-text-muted">{appointment.date}</p>
                          <Badge variant={
                            appointment.status === 'completed' ? 'success' : 'default'
                          } dot>
                            {appointment.status}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardBody>
              <h3 className="mb-3 text-sm font-bold text-nova-text">
                {language === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
              </h3>
              <div className="flex flex-wrap gap-3">
                <Button>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  New Appointment
                </Button>
                <Button variant="outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  Add Patient
                </Button>
                <Button variant="outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                  Services
                </Button>
                <Button variant="outline">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                  </svg>
                  Gallery
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
