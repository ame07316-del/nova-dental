'use client';

import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useDemoData } from '@/components/layout/DemoDataProvider';
import { cn } from '@/lib/utils';

// Clinic overview stats
export function ClinicOverview() {
  const { appointments, patients, sessions } = useDemoData();
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((apt) => apt.date === today);
  const confirmedToday = todayAppointments.filter((apt) => apt.status === 'confirmed').length;
  const pendingToday = todayAppointments.filter((apt) => apt.status === 'pending').length;
  const cancelledToday = todayAppointments.filter((apt) => apt.status === 'cancelled').length;
  const activeSessions = sessions.filter((s) => s.status === 'active').length;
  const delayedAppointments = todayAppointments.filter((apt) => apt.status === 'pending' || apt.status === 'rescheduled').length;
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.status === 'active').length;

  const stats = [
    { label: 'Total Appointments Today', value: todayAppointments.length, sub: `${confirmedToday} confirmed`, variant: 'primary' as const },
    { label: 'Waiting Patients', value: pendingToday, sub: 'Awaiting check-in', variant: 'warning' as const },
    { label: 'Active Sessions', value: activeSessions, sub: 'In progress', variant: 'success' as const },
    { label: 'Delayed', value: delayedAppointments, sub: 'Rescheduled or pending', variant: 'error' as const },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} variant="stat">
          <CardBody className="flex flex-row items-center justify-between p-4">
            <div>
              <p className="text-sm text-nova-text-secondary">{stat.label}</p>
              <p className="mt-1 text-3xl font-bold text-nova-text">{stat.value}</p>
              <p className="mt-1 text-xs text-nova-text-muted">{stat.sub}</p>
            </div>
            <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl',
              stat.variant === 'primary' ? 'bg-nova-primary-light text-nova-primary-dark' :
              stat.variant === 'warning' ? 'bg-amber-100 text-amber-700' :
              stat.variant === 'success' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            )}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {stat.variant === 'primary' ? <><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /></> :
                  stat.variant === 'warning' ? <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> :
                  stat.variant === 'success' ? <><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></> :
                  <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></>}
              </svg>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

// Today's schedule
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

// Appointment calendar preview
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
