'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';

// Searchable grid placeholder for dental data
export function SearchableGrid() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-bold text-nova-text">Services</h2>
        <Input
          placeholder="Search services..."
          className="max-w-sm"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} variant="interactive" className="p-4">
            <Skeleton variant="text" width="60%" height="20" className="mb-2" />
            <Skeleton variant="text" width="100%" height="14" className="mb-3" />
            <div className="flex items-center justify-between">
              <Skeleton variant="text" width="30%" height="16" />
              <Skeleton variant="text" width="20%" height="16" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Appointment card component
export function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <Card variant="interactive" className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nova-primary-light text-nova-primary-dark text-sm font-bold">
            {appointment.patientName?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-nova-text">{appointment.patientName}</p>
            <p className="text-xs text-nova-text-muted">{appointment.time}</p>
          </div>
        </div>
        <Badge variant={
          appointment.status === 'confirmed' ? 'confirmed' :
          appointment.status === 'pending' ? 'pending' :
          appointment.status === 'completed' ? 'completed' : 'default'
        } dot>
          {appointment.status}
        </Badge>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-nova-text-secondary">
        <span>{appointment.treatmentType}</span>
        <span>•</span>
        <span>{appointment.dentistName}</span>
      </div>
    </Card>
  );
}

// Patient list card
export function PatientCard({ patient }: { patient: any }) {
  return (
    <Card variant="interactive" className="p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-nova-primary text-white text-sm font-bold">
          {patient.firstName?.charAt(0) || '?'}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-nova-text">{patient.firstName} {patient.lastName}</p>
          <p className="text-xs text-nova-text-muted">{patient.email}</p>
        </div>
        <Badge variant="confirmed">Active</Badge>
      </div>
    </Card>
  );
}
