'use client';

import { useState } from 'react';
import { AppointmentProvider, useAppointments } from './AppointmentProvider';
import { DayView } from './DayView';
import { WeekView } from './WeekView';
import { MonthView } from './MonthView';
import { AppointmentForm } from './AppointmentForm';
import { AppointmentFilters } from './AppointmentFilters';
import { AppointmentDetails } from './AppointmentDetails';
import { CalendarView } from './types';

function CalendarViewToggle({ view, onChange }: { view: CalendarView; onChange: (v: CalendarView) => void }) {
  const views: { key: CalendarView; label: string }[] = [
    { key: 'day', label: 'Day' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
  ];

  return (
    <div className="inline-flex rounded-lg border border-nova-border bg-nova-surface p-0.5">
      {views.map((v) => (
        <button
          key={v.key}
          onClick={() => onChange(v.key)}
          className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
            view === v.key
              ? 'bg-nova-primary text-white shadow-sm'
              : 'text-nova-text-secondary hover:text-nova-text hover:bg-nova-muted'
          }`}
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

function AppointmentsContent() {
  const {
    filteredAppointments,
    calendarView,
    setCalendarView,
    formOpen,
    setFormOpen,
    editingAppointment,
    reschedulingAppointment,
    setEditingAppointment,
    setReschedulingAppointment,
  } = useAppointments();

  const statusCounts = {
    total: filteredAppointments.length,
    confirmed: filteredAppointments.filter((a) => a.status === 'confirmed').length,
    pending: filteredAppointments.filter((a) => a.status === 'pending').length,
    'in-progress': filteredAppointments.filter((a) => a.status === 'in-progress').length,
    completed: filteredAppointments.filter((a) => a.status === 'completed').length,
    cancelled: filteredAppointments.filter((a) => a.status === 'cancelled').length,
    rescheduled: filteredAppointments.filter((a) => a.status === 'rescheduled').length,
    delayed: filteredAppointments.filter((a) => a.status === 'delayed').length,
    waiting: filteredAppointments.filter((a) => a.status === 'waiting').length,
  };

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setReschedulingAppointment(null);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Appointments</h1>
          <p className="text-sm text-nova-text-secondary">Manage and schedule appointments</p>
        </div>
        <button onClick={handleNewAppointment} className="btn btn-primary">
          <svg className="mr-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Appointment
        </button>
      </div>

      {/* Status summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {[
          { label: 'Total', value: statusCounts.total, color: 'bg-nova-muted text-nova-text' },
          { label: 'Confirmed', value: statusCounts.confirmed, color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
          { label: 'Waiting', value: statusCounts.waiting, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
          { label: 'In Progress', value: statusCounts['in-progress'], color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
          { label: 'Completed', value: statusCounts.completed, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
          { label: 'Cancelled', value: statusCounts.cancelled, color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
          { label: 'Rescheduled', value: statusCounts.rescheduled, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
          { label: 'Delayed', value: statusCounts.delayed, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
        ].map((item) => (
          <div key={item.label} className={`rounded-lg px-3 py-2 ${item.color}`}>
            <p className="text-lg font-bold">{item.value}</p>
            <p className="text-[10px] font-medium opacity-80">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <AppointmentFilters />

      {/* Calendar controls */}
      <div className="flex items-center justify-between">
        <CalendarViewToggle view={calendarView} onChange={setCalendarView} />
        <span className="text-xs text-nova-text-muted">{filteredAppointments.length} appointments</span>
      </div>

      {/* Calendar */}
      <div className="rounded-xl border border-nova-border bg-nova-surface shadow-soft">
        {calendarView === 'day' && <DayView />}
        {calendarView === 'week' && <WeekView />}
        {calendarView === 'month' && <MonthView />}
      </div>

      {/* Form Drawer */}
      <AppointmentForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingAppointment(null);
          setReschedulingAppointment(null);
        }}
        editMode={!!editingAppointment}
      />

      {/* Details Drawer */}
      <AppointmentDetails />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <AppointmentProvider>
      <AppointmentsContent />
    </AppointmentProvider>
  );
}
