'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/dental/AvatarsAndMore';

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
          appointment.status === 'confirmed' ? 'success' :
          appointment.status === 'pending' ? 'warning' :
          appointment.status === 'completed' ? 'info' : 'default'
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

// Appointment list component
export function AppointmentList() {
  const [appointments] = useState([
    { id: 1, patientName: 'Ahmed Hassan', time: '9:00 AM', treatmentType: 'Cleaning', dentistName: 'Dr. Smith', status: 'confirmed' },
    { id: 2, patientName: 'Sarah Johnson', time: '9:30 AM', treatmentType: 'Whitening', dentistName: 'Dr. Smith', status: 'pending' },
    { id: 3, patientName: 'Mohamed Ali', time: '10:00 AM', treatmentType: 'Check-up', dentistName: 'Dr. Lee', status: 'confirmed' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Appointments</h1>
          <p className="text-sm text-nova-text-secondary">Schedule and manage appointments</p>
        </div>
        <Button>New Appointment</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {appointments.map((appt) => (
          <AppointmentCard key={appt.id} appointment={appt} />
        ))}
      </div>
    </div>
  );
}

// Dentist list component
export function DentistList() {
  const [dentists] = useState([
    { id: 1, firstName: 'Dr. Sarah', lastName: 'Smith', specialty: 'Orthodontics', rating: 4.9, patients: 120 },
    { id: 2, firstName: 'Dr. Ahmed', lastName: 'Hassan', specialty: 'Oral Surgery', rating: 4.8, patients: 85 },
    { id: 3, firstName: 'Dr. Mohamed', lastName: 'Ali', specialty: 'Cosmetic', rating: 5.0, patients: 200 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Dentists</h1>
          <p className="text-sm text-nova-text-secondary">Manage dental team members</p>
        </div>
        <Button>Add Dentist</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dentists.map((dentist) => (
          <Card key={dentist.id} variant="interactive">
            <CardBody>
              <div className="flex items-center gap-3">
                <Avatar name={`${dentist.firstName} ${dentist.lastName}`} size="md" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-nova-text">{dentist.firstName} {dentist.lastName}</p>
                  <p className="text-xs text-nova-text-muted">{dentist.specialty}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-xs text-nova-text-secondary">
                <span>⭐ {dentist.rating}</span>
                <span>👥 {dentist.patients} patients</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Service list component
export function ServiceList() {
  const [services] = useState([
    { id: 1, name: 'General Check-up', category: 'Preventive', price: 50, duration: '30 min' },
    { id: 2, name: 'Teeth Whitening', category: 'Cosmetic', price: 200, duration: '60 min' },
    { id: 3, name: 'Dental Implant', category: 'Restorative', price: 800, duration: '120 min' },
    { id: 4, name: 'Braces/Invisalign', category: 'Orthodontics', price: 1500, duration: '90 min' },
    { id: 5, name: 'Root Canal', category: 'Restorative', price: 400, duration: '90 min' },
    { id: 6, name: 'Deep Cleaning', category: 'Preventive', price: 80, duration: '45 min' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Services</h1>
          <p className="text-sm text-nova-text-secondary">Manage dental services and pricing</p>
        </div>
        <Button>Add Service</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} variant="interactive">
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-nova-text">{service.name}</p>
                  <p className="text-xs text-nova-text-muted">{service.category} • {service.duration}</p>
                </div>
                <span className="text-lg font-bold text-nova-primary">${service.price}</span>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}


