'use client';

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { SearchFilters, PatientManagementShortcuts, DoctorScheduleManagerForSecretary, ServiceManagerForSecretary, SmartAutomation } from './NotificationCenter';
import { NotificationCenter } from '@/components/notifications';
import { ClinicOverview, TodaySchedule, AppointmentCalendar } from './ClinicOverview';
import { useLiveData } from '@/hooks/useLiveData';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function SecretaryDashboardContent() {
  const { appointments, patients, sessions, dentists, loading } = useLiveData('all');
  const { language, t } = useLanguage();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'manage' | 'automate'>('overview');

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) => apt.date === today);
  const confirmedToday = todayAppointments.filter((apt) => apt.status === 'confirmed').length;
  const pendingToday = todayAppointments.filter((apt) => apt.status === 'pending').length;
  const cancelledToday = todayAppointments.filter((apt) => apt.status === 'cancelled').length;
  const activeSessions = sessions.filter((s) => s.status === 'active').length;
  const delayedAppointments = todayAppointments.filter(
    (apt) => apt.status === 'pending' || apt.status === 'rescheduled'
  ).length;
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === 'active').length;
  const totalDentists = dentists.length;
  const upcomingAppointments = appointments.filter(
    (apt) => apt.date > today && apt.status !== 'cancelled'
  ).length;

  const tabs = [
    { key: 'overview' as const, label: language === 'ar' ? 'نظرة عامة' : 'Overview' },
    { key: 'manage' as const, label: language === 'ar' ? 'الإدارة' : 'Manage' },
    { key: 'automate' as const, label: language === 'ar' ? 'الأتمتة' : 'Automation' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">{t('app.name')} — Secretary Desk</h1>
          <p className="text-sm text-nova-text-secondary">
            {language === 'ar' ? 'لوحة الأمانة' : 'Clinic Operations Dashboard'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="warning">{pendingToday} waiting</Badge>
          <Badge variant="info">{activeSessions} active</Badge>
          <Badge variant="success">{confirmedToday} confirmed</Badge>
          <Button variant="outline" onClick={() => {}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Export
          </Button>
        </div>
      </div>

      {loading && (
        <div className="flex items-center gap-3 rounded-lg border border-nova-border bg-nova-surface px-4 py-3 text-sm text-nova-text-secondary">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-nova-border border-t-nova-primary" />
          Loading live clinic data…
        </div>
      )}

      <div className="flex gap-1 rounded-lg bg-nova-muted p-1">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn('rounded-md px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.key ? 'bg-nova-primary text-white shadow-soft' : 'text-nova-text-secondary hover:text-nova-text')}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <ClinicOverview />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TodaySchedule />
                <AppointmentCalendar />
              </div>
            </div>
            <div className="space-y-6">
              <SearchFilters />
              <NotificationCenter />
            </div>
          </div>
          <PatientManagementShortcuts />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <DoctorScheduleManagerForSecretary />
              <ServiceManagerForSecretary />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card variant="stat"><CardBody className="flex flex-row items-center justify-between p-4"><div><p className="text-sm text-nova-text-secondary">Total Patients</p><p className="mt-1 text-3xl font-bold text-nova-text">{totalPatients}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-nova-primary-light text-nova-primary-dark"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></svg></div></CardBody></Card>
            <Card variant="stat"><CardBody className="flex flex-row items-center justify-between p-4"><div><p className="text-sm text-nova-text-secondary">Active Patients</p><p className="mt-1 text-3xl font-bold text-nova-text">{activePatients}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg></div></CardBody></Card>
            <Card variant="stat"><CardBody className="flex flex-row items-center justify-between p-4"><div><p className="text-sm text-nova-text-secondary">Total Doctors</p><p className="mt-1 text-3xl font-bold text-nova-text">{totalDentists}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.27 16.2C5.12 17.2 6.31 18 7.62 18c.6 0 1-.18 1.41-.54l2.1-2.1" /></svg></div></CardBody></Card>
            <Card variant="stat"><CardBody className="flex flex-row items-center justify-between p-4"><div><p className="text-sm text-nova-text-secondary">Upcoming</p><p className="mt-1 text-3xl font-bold text-nova-text">{upcomingAppointments}</p></div><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /></svg></div></CardBody></Card>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-6"><DoctorScheduleManagerForSecretary /><ServiceManagerForSecretary /></div>
            <div className="space-y-6"><AppointmentCalendar /><TodaySchedule /></div>
          </div>
        </div>
      )}

      {activeTab === 'automate' && (
        <div className="space-y-6">
          <SmartAutomation />
          <div className="grid gap-6 lg:grid-cols-2">
            <AppointmentCalendar /><TodaySchedule />
          </div>
          <NotificationCenter />
        </div>
      )}
    </div>
  );
}
