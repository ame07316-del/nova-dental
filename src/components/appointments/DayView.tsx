'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAppointments } from './AppointmentProvider';
import { generateTimeSlots, formatTimeDisplay, getAppointmentPosition, isToday } from './utils';
import { STATUS_COLORS, STATUS_LABELS } from './types';
import type { EnrichedAppointment } from './types';

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);

function DayViewAppointment({ apt, onClick }: { apt: EnrichedAppointment; onClick: () => void }) {
  const pos = getAppointmentPosition(apt.startTime, apt.endTime);
  const colors = STATUS_COLORS[apt.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute left-16 right-2 rounded-md border px-2 py-1 text-left text-xs transition-all hover:shadow-elevated z-10',
        colors.bg,
        colors.text,
        'border-current/20'
      )}
      style={{ top: `${pos.top}%`, height: `${Math.max(pos.height, 3)}%` }}
    >
      <p className="truncate font-semibold">{apt.patientName}</p>
      <p className="truncate text-[10px] opacity-80">
        {formatTimeDisplay(apt.startTime)} - {formatTimeDisplay(apt.endTime)}
      </p>
      <p className="truncate text-[10px] opacity-80">{apt.serviceName}</p>
    </button>
  );
}

export function DayView() {
  const { selectedDate, getAppointmentsForDate, setSelectedAppointment, setSelectedDate } = useAppointments();
  const slots = useMemo(() => generateTimeSlots(), []);
  const dayAppts = useMemo(() => getAppointmentsForDate(selectedDate), [selectedDate, getAppointmentsForDate]);

  const goToPrevDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToNextDay = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToToday = () => setSelectedDate(new Date().toISOString().split('T')[0]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-nova-border px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={goToPrevDay} className="rounded-lg px-2 py-1 text-nova-text-muted transition-colors hover:bg-nova-muted hover:text-nova-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={goToToday} className="rounded-lg bg-nova-primary px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-nova-primary-dark">
            Today
          </button>
          <button onClick={goToNextDay} className="rounded-lg px-2 py-1 text-nova-text-muted transition-colors hover:bg-nova-muted hover:text-nova-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
        <h3 className={cn('text-sm font-semibold', isToday(selectedDate) ? 'text-nova-primary' : 'text-nova-text')}>
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </h3>
        <span className="text-xs text-nova-text-muted">{dayAppts.length} appointments</span>
      </div>

      <div className="relative overflow-y-auto" style={{ height: 'calc(100vh - 280px)' }}>
        {HOURS.map((hour) => (
          <div key={hour} className="flex border-b border-nova-border/50" style={{ height: `${100 / 9}%` }}>
            <div className="flex w-16 shrink-0 items-start justify-end pr-2 pt-1">
              <span className="text-[10px] font-medium text-nova-text-muted">{formatTimeDisplay(`${String(hour).padStart(2, '0')}:00`)}</span>
            </div>
            <div className="flex-1 border-l border-nova-border/50" />
          </div>
        ))}

        {dayAppts.map((apt) => (
          <DayViewAppointment key={apt.id} apt={apt} onClick={() => setSelectedAppointment(apt)} />
        ))}

        {!isToday(selectedDate) && dayAppts.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-nova-text-muted">No appointments on this day</p>
          </div>
        )}
      </div>
    </div>
  );
}
