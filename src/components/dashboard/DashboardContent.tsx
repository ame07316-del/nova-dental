'use client';

import { useState, useEffect } from 'react';
import { useDemoData } from '@/components/layout/DemoDataProvider';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui';
import { Skeleton, CardSkeleton } from '@/components/ui/Skeleton';
import { notify } from '@/components/ui/Notification';
import { formatCurrency, formatDateInput } from '@/lib/utils';

// Dashboard content using demo data
export function DashboardContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { appointments, patients, billing, notifications } = useDemoData();

  // Simulate loading (once on mount)
  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Dashboard</h1>
          <p className="text-sm text-nova-text-secondary">Welcome back to NOVA Dental Studio</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <Skeleton variant="text" width="40%" height="16" className="mb-2" />
              <Skeleton variant="text" width="60%" height="32" className="mb-2" />
              <Skeleton variant="text" width="30%" height="12" />
            </Card>
          ))}
        </div>
        <CardSkeleton count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load dashboard"
        message="We couldn't load your dashboard data."
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Calculate stats from demo data
  const today = formatDateInput(new Date());
  const todayAppointments = appointments.filter((apt) => apt.date === today);
  const confirmedToday = todayAppointments.filter((apt) => apt.status === 'confirmed').length;
  const pendingToday = todayAppointments.filter((apt) => apt.status === 'pending').length;
  const activePatients = patients.filter((p) => p.status === 'active').length;
  const totalRevenue = billing.filter((b) => b.status === 'paid').reduce((sum, b) => sum + b.totalAmount, 0);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nova-text">Dashboard</h1>
        <p className="text-sm text-nova-text-secondary">Welcome back to NOVA Dental Studio</p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card variant="stat">
          <p className="text-sm text-nova-text-secondary">Today&apos;s Appointments</p>
          <p className="mt-1 text-3xl font-bold text-nova-text">{confirmedToday}</p>
          <Badge variant="success" className="mt-2">{pendingToday} pending</Badge>
        </Card>
        <Card variant="stat">
          <p className="text-sm text-nova-text-secondary">Active Patients</p>
          <p className="mt-1 text-3xl font-bold text-nova-text">{activePatients}</p>
          <Badge variant="primary" className="mt-2">All active</Badge>
        </Card>
        <Card variant="stat">
          <p className="text-sm text-nova-text-secondary">Total Revenue</p>
          <p className="mt-1 text-3xl font-bold text-nova-text">{formatCurrency(totalRevenue)}</p>
          <Badge variant="success" className="mt-2">Paid this month</Badge>
        </Card>
        <Card variant="stat">
          <p className="text-sm text-nova-text-secondary">Notifications</p>
          <p className="mt-1 text-3xl font-bold text-nova-text">{unreadNotifications}</p>
          <Badge variant="warning" className="mt-2">Unread</Badge>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap items-center gap-3">
            <Button>New Appointment</Button>
            <Button variant="outline">Add Patient</Button>
            <Button variant="outline">View Gallery</Button>
          </div>
        </CardBody>
      </Card>

      {/* Recent appointments preview */}
      <Card>
        <CardHeader>
          <CardTitle>Today&apos;s Appointments ({confirmedToday})</CardTitle>
        </CardHeader>
        <CardBody>
          {todayAppointments.length > 0 ? (
            <div className="space-y-3">
              {todayAppointments.slice(0, 5).map((apt) => (
                <div key={apt.id} className="flex items-center justify-between rounded-lg p-3 hover:bg-nova-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-nova-primary-light text-nova-primary-dark text-xs font-bold">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-nova-text">{apt.patientName}</p>
                      <p className="text-xs text-nova-text-muted">{apt.serviceName} • {apt.startTime}</p>
                    </div>
                  </div>
                  <Badge variant={
                    apt.status === 'confirmed' ? 'success' :
                    apt.status === 'pending' ? 'warning' :
                    apt.status === 'cancelled' ? 'error' : 'default'
                  } dot>
                    {apt.status}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No appointments today"
              description="Schedule your first appointment for today."
              action={{ label: 'Schedule Now', onClick: () => notify('success', 'Feature coming soon', 'Appointment scheduling is available in the full version.') }}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
