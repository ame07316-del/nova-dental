'use client';

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/dental/AvatarsAndMore';
import { useDemoData } from '@/components/layout/DemoDataProvider';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { notify } from '@/components/ui/Notification';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { Appointment, Patient, Dentist, Service } from '@/lib/supabase/types';

// Search and filters component
export function SearchFilters() {
  const { appointments, patients, dentists, services } = useDemoData();
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'appointments' | 'patients' | 'dentists' | 'services'>('all');

  const searchResults: Array<{ type: string; patientName?: string }> = (() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    switch (activeFilter) {
      case 'all':
        return [
          ...appointments.filter((a) => a.patientName.toLowerCase().includes(q)).slice(0, 3).map((a) => ({ type: 'appointment', patientName: a.patientName })),
          ...patients.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)).slice(0, 3).map((p) => ({ type: 'patient', patientName: `${p.firstName} ${p.lastName}` })),
          ...dentists.filter((d) => `${d.firstName} ${d.lastName}`.toLowerCase().includes(q)).slice(0, 3).map((d) => ({ type: 'dentist', patientName: `${d.firstName} ${d.lastName}` })),
          ...services.filter((s) => s.name.toLowerCase().includes(q)).slice(0, 3).map((s) => ({ type: 'service', patientName: s.name })),
        ];
      case 'appointments':
        return appointments.filter((a) => a.patientName.toLowerCase().includes(q)).map((a) => ({ type: 'appointment', patientName: a.patientName }));
      case 'patients':
        return patients.filter((p) => `${p.firstName} ${p.lastName}`.toLowerCase().includes(q)).map((p) => ({ type: 'patient', patientName: `${p.firstName} ${p.lastName}` }));
      case 'dentists':
        return dentists.filter((d) => `${d.firstName} ${d.lastName}`.toLowerCase().includes(q)).map((d) => ({ type: 'dentist', patientName: `${d.firstName} ${d.lastName}` }));
      case 'services':
        return services.filter((s) => s.name.toLowerCase().includes(q)).map((s) => ({ type: 'service', patientName: s.name }));
      default:
        return [];
    }
  })();

  const filters = [
    { key: 'all' as const, label: 'All' },
    { key: 'appointments' as const, label: 'Appointments' },
    { key: 'patients' as const, label: 'Patients' },
    { key: 'dentists' as const, label: 'Doctors' },
    { key: 'services' as const, label: 'Services' },
  ];

  return (
    <Card variant="minimal" className="p-4">
      <CardHeader><CardTitle className="text-sm">Search & Filters</CardTitle></CardHeader>
      <CardBody className="space-y-3">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-nova-text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} className="pl-10" />
        </div>
        <div className="flex flex-wrap gap-1">
          {filters.map((filter) => (
            <button key={filter.key} onClick={() => setActiveFilter(filter.key)} className={cn(
              'rounded-full px-3 py-1 text-xs font-medium transition-colors',
              activeFilter === filter.key ? 'bg-nova-primary-light text-nova-primary-dark' : 'bg-nova-muted text-nova-text-muted hover:bg-nova-border'
            )}>{filter.label}</button>
          ))}
        </div>
        {query && (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {searchResults.length === 0 ? <p className="py-2 text-center text-xs text-nova-text-muted">No results</p> : (
              searchResults.slice(0, 8).map((result, index) => (
                <button key={index} onClick={() => notify('info', 'View', `Viewing ${result.type}`)} className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-nova-muted/30">
                  <div className={cn('flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold text-white',
                    result.type === 'appointment' ? 'bg-nova-primary' : result.type === 'patient' ? 'bg-green-600' : result.type === 'dentist' ? 'bg-violet-600' : 'bg-amber-600'
                  )}>{result.patientName?.charAt(0) || 'N/A'}</div>
                  <div className="flex-1"><p className="text-xs font-medium text-nova-text">{result.patientName || 'N/A'}</p><p className="text-[10px] text-nova-text-muted capitalize">{result.type}</p></div>
                </button>
              ))
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Notification center
export function SecretaryNotificationCenter() {
  const { notifications } = useDemoData();
  const [showAll, setShowAll] = useState(false);
  const unreadNotifications = notifications.filter((n) => !n.read);
  const displayedNotifications = showAll ? notifications : notifications.slice(0, 5);

  const typeConfig: Record<string, { dot: string }> = {
    info: { dot: 'bg-nova-info' }, success: { dot: 'bg-nova-success' },
    warning: { dot: 'bg-nova-warning' }, error: { dot: 'bg-nova-error' },
    appointment: { dot: 'bg-nova-info' }, payment: { dot: 'bg-nova-success' },
  };

  const toToastType = (type: string): 'info' | 'success' | 'warning' | 'error' => {
    if (type === 'success' || type === 'payment') return 'success';
    if (type === 'warning') return 'warning';
    if (type === 'error') return 'error';
    return 'info';
  };

  return (
    <Card variant="minimal" className="p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm"><span className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>Notifications</span></CardTitle>
        {unreadNotifications.length > 0 && <Badge variant="error" dot>{unreadNotifications.length} unread</Badge>}
      </CardHeader>
      <CardBody className="space-y-2">
        <div className="space-y-1">
          {displayedNotifications.map((notification) => {
            const config = typeConfig[notification.type] ?? typeConfig.info;
            return (
              <button key={notification.id} onClick={() => notify(toToastType(notification.type), notification.title, notification.message)}
                className={cn('flex w-full items-start gap-3 rounded-lg p-3 text-left transition-colors hover:bg-nova-muted/30', !notification.read && 'bg-nova-muted/10')}>
                <div className={cn('mt-1 flex h-2 w-2 shrink-0 rounded-full', config.dot)} />
                <div className="flex-1">
                  <p className={cn('text-sm', !notification.read ? 'font-semibold text-nova-text' : 'text-nova-text-secondary')}>{notification.title}</p>
                  <p className="text-xs text-nova-text-muted">{notification.message}</p>
                  <p className="mt-1 text-[10px] text-nova-text-muted">{notification.time}</p>
                </div>
              </button>
            );
          })}
        </div>
        <Button variant="ghost" size="sm" className="w-full" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : `View All (${notifications.length})`}
        </Button>
      </CardBody>
    </Card>
  );
}

// Patient management shortcuts
export function PatientManagementShortcuts() {
  const { patients } = useDemoData();
  const activePatients = patients.filter((p) => p.status === 'active');
  const shortcuts = [
    { label: 'Add', icon: 'plus', variant: 'primary' as const },
    { label: 'Import', icon: 'upload', variant: 'outline' as const },
    { label: 'Reports', icon: 'file', variant: 'outline' as const },
  ];

  return (
    <Card variant="minimal" className="p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Patients ({activePatients.length})</CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-3 gap-2">
          {shortcuts.map((shortcut, index) => (
            <button key={index} onClick={() => notify('info', shortcut.label, `${shortcut.label} activated.`)}
              className={cn('flex flex-col items-center justify-center rounded-lg p-3 transition-all hover:shadow-soft',
                shortcut.variant === 'primary' ? 'bg-nova-primary text-white hover:bg-nova-primary-dark' : 'bg-nova-muted text-nova-text-secondary hover:bg-nova-border'
              )}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {shortcut.icon === 'plus' ? <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></> :
                  shortcut.icon === 'upload' ? <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></> :
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />}
              </svg>
              <span className="mt-1 text-[10px] font-medium">{shortcut.label}</span>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {activePatients.slice(0, 5).map((patient) => (
            <button key={patient.id} onClick={() => notify('info', 'Profile', `Viewing ${patient.firstName} ${patient.lastName}`)}
              className="flex items-center gap-1.5 rounded-full bg-nova-primary-light px-2 py-1 text-[10px] font-medium text-nova-primary-dark">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-nova-primary text-[8px] text-white">{patient.firstName.charAt(0)}</div>
              {patient.firstName}
            </button>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Doctor schedule manager for secretary
export function DoctorScheduleManagerForSecretary() {
  const { dentists, schedules } = useDemoData();
  const [selectedDentist, setSelectedDentist] = useState<string>(dentists[0]?.id || '');
  const selectedDentistData = dentists.find((d) => d.id === selectedDentist);
  const dentistSchedules = schedules.filter((s) => s.dentistId === selectedDentist);
  const todaySchedules = dentistSchedules.filter((s) => s.date === new Date().toISOString().split('T')[0]);

  return (
    <Card variant="minimal" className="p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Doctor Schedules</CardTitle>
        <Button size="sm" variant="outline">Add</Button>
      </CardHeader>
      <CardBody className="space-y-3">
        <Input placeholder="Filter dentists..." />
        <div className="space-y-2">
          {dentists.map((dentist) => {
            const ts = schedules.filter((s) => s.dentistId === dentist.id).filter((s) => s.date === new Date().toISOString().split('T')[0]);
            return (
              <button key={dentist.id} className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-nova-muted/30">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nova-muted text-xs font-bold text-nova-text">{dentist.firstName.charAt(0)}</div>
                <div className="flex-1"><p className="text-sm font-medium text-nova-text">{dentist.firstName} {dentist.lastName}</p><p className="text-xs text-nova-text-muted">{dentist.specialty}</p></div>
                <div className="text-right"><p className="text-xs text-nova-text-secondary">{ts.length} today</p><Badge variant={dentist.isActive ? 'success' : 'default'} dot>{dentist.isActive ? 'Active' : 'Off'}</Badge></div>
              </button>
            );
          })}
        </div>
        {selectedDentistData && (
          <div className="rounded-lg bg-nova-muted/30 p-3">
            <h4 className="mb-2 text-xs font-semibold text-nova-text-secondary">Today&apos;s Hours</h4>
            {todaySchedules.length > 0 ? todaySchedules.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-xs"><span className="text-nova-text">{s.startTime} - {s.endTime}</span><Badge variant={s.isAvailable ? 'success' : 'default'} dot>{s.isAvailable ? 'Available' : 'Closed'}</Badge></div>
            )) : <p className="text-xs text-nova-text-muted">No schedule today</p>}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

// Service manager for secretary
export function ServiceManagerForSecretary() {
  const { services } = useDemoData();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredServices = services.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.category.toLowerCase().includes(searchTerm.toLowerCase()));
  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <Card variant="minimal" className="p-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm">Services</CardTitle>
        <Button size="sm" variant="outline">Add</Button>
      </CardHeader>
      <CardBody className="space-y-3">
        <Input placeholder="Search services..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full" />
        <div className="flex flex-wrap gap-1">{categories.map((cat) => (<button key={cat} className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-nova-primary-light text-nova-primary-dark">{cat}</button>))}</div>
        <div className="space-y-2">
          {filteredServices.slice(0, 6).map((service) => (
            <div key={service.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-nova-muted/30">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-nova-muted text-xs font-bold text-nova-text">{service.name.charAt(0)}</div>
                <div><p className="text-xs font-medium text-nova-text">{service.name}</p><p className="text-[10px] text-nova-text-muted">{service.category}</p></div>
              </div>
              <div className="text-right"><p className="text-xs font-bold text-nova-primary">${service.price}</p><Badge variant={service.isActive ? 'success' : 'default'} dot>{service.isActive ? 'Active' : 'Inactive'}</Badge></div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

// Appointment calendar for secretary
export function AppointmentCalendar() {
  const { appointments } = useDemoData();
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  const appointmentsByDate: Record<string, typeof appointments> = {};
  appointments.forEach((apt) => { if (!appointmentsByDate[apt.date]) appointmentsByDate[apt.date] = []; appointmentsByDate[apt.date].push(apt); });
  const dates = Object.keys(appointmentsByDate).sort().slice(0, 5);

  return (
    <Card variant="minimal" className="p-4">
      <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-sm">Appointment Calendar</CardTitle><span className="text-xs text-nova-text-muted">{currentMonth}</span></CardHeader>
      <CardBody className="space-y-2">
        {dates.length === 0 ? <div className="py-4 text-center text-sm text-nova-text-muted">No appointments scheduled</div> : (
          dates.map((date) => {
            const dayApts = appointmentsByDate[date];
            const dayDate = new Date(date);
            return (
              <div key={date} className="flex items-center gap-3 rounded-lg p-2 hover:bg-nova-muted/30">
                <div className="w-12 text-right"><p className="text-xs font-semibold text-nova-text">{dayDate.getDate()}</p><p className="text-[10px] text-nova-text-muted">{dayDate.toLocaleString('en-US', { weekday: 'short' })}</p></div>
                <div className="flex-1 space-y-1">
                  {dayApts.slice(0, 3).map((apt) => (<div key={apt.id} className="flex items-center gap-2"><div className="h-1.5 w-1.5 shrink-0 rounded-full bg-nova-primary" /><span className="text-xs text-nova-text-secondary">{apt.patientName}</span><span className="text-[10px] text-nova-text-muted">{apt.startTime}</span></div>))}
                  {dayApts.length > 3 && <p className="text-[10px] text-nova-text-muted">+{dayApts.length - 3} more</p>}
                </div>
                <Badge variant="info">{dayApts.length}</Badge>
              </div>
            );
          })
        )}
      </CardBody>
    </Card>
  );
}

// Today's schedule for secretary
export function TodaySchedule() {
  const { appointments } = useDemoData();
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) => apt.date === today).sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <Card variant="minimal" className="p-4">
      <CardHeader className="flex flex-row items-center justify-between"><CardTitle className="text-sm">Today&apos;s Schedule</CardTitle><Badge variant="info">{todayAppointments.length}</Badge></CardHeader>
      <CardBody className="space-y-2">
        {todayAppointments.length === 0 ? <div className="py-4 text-center text-sm text-nova-text-muted">No appointments today</div> : (
          todayAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-nova-muted/30">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nova-muted text-xs font-bold text-nova-text">{apt.patientName.charAt(0)}</div>
              <div className="flex-1"><p className="text-sm font-medium text-nova-text">{apt.patientName}</p><p className="text-xs text-nova-text-muted">{apt.serviceName}</p></div>
              <div className="text-right"><p className="text-xs font-medium text-nova-text">{apt.startTime}</p><Badge variant={apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'default'} dot>{apt.status}</Badge></div>
            </div>
          ))
        )}
      </CardBody>
    </Card>
  );
}

// Smart automation
export function SmartAutomation() {
  const { appointments } = useDemoData();
  const today = new Date().toISOString().split('T')[0];
  const pendingAppointments = appointments.filter((apt) => apt.date === today && apt.status === 'pending');

  const autoSuggestions = [
    { title: 'Auto-Assign Pending', description: `${pendingAppointments.length} pending appointments ready for assignment`, action: 'Run', variant: 'primary' as const },
    { title: 'Balance Schedule', description: 'Distribute appointments evenly across all dentists', action: 'Optimize', variant: 'success' as const },
    { title: 'Send Reminders', description: `Send reminders for ${pendingAppointments.length} upcoming appointments`, action: 'Send', variant: 'info' as const },
  ];

  return (
    <Card variant="dental" className="p-4">
      <CardHeader><CardTitle className="text-sm"><span className="flex items-center gap-2"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>Smart Automation</span></CardTitle></CardHeader>
      <CardBody className="space-y-3">
        {autoSuggestions.map((suggestion, index) => (
          <button key={index} onClick={() => notify('success', 'Automation', `${suggestion.title} completed.`)} className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-nova-muted/30">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-nova-muted text-nova-primary"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg></div>
            <div className="flex-1"><p className="text-sm font-semibold text-nova-text">{suggestion.title}</p><p className="text-xs text-nova-text-muted">{suggestion.description}</p></div>
            <Button size="sm" variant="outline">{suggestion.action}</Button>
          </button>
        ))}
      </CardBody>
    </Card>
  );
}
