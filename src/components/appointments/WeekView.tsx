'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAppointments } from './AppointmentProvider';
import { getWeekDates, formatTimeDisplay, getAppointmentPosition, isToday } from './utils';
import { STATUS_COLORS } from './types';
import type { EnrichedAppointment } from './types';

const HOURS = Array.from({ length: 9 }, (_, i) => i + 9);
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function WeekAppointment({ apt, onClick }: { apt: EnrichedAppointment; onClick: () => void }) {
  const pos = getAppointmentPosition(apt.startTime, apt.endTime);
  const colors = STATUS_COLORS[apt.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute left-0.5 right-0.5 rounded px-1 py-0.5 text-left text-[10px] transition-all hover:shadow-elevated z-10',
        colors.bg,
        colors.text,
        'border border-current/20'
      )}
      style={{ top: `${pos.top}%`, height: `${Math.max(pos.height, 2.5)}%` }}
    >
      <p className="truncate font-semibold">{apt.patientName.split(' ')[0]}</p>
      <p className="truncate opacity-80">{formatTimeDisplay(apt.startTime)}</p>
    </button>
  );
}

export function WeekView() {
  const { selectedDate, getAppointmentsForDate, setSelectedAppointment, setSelectedDate } = useAppointments();
  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate]);

  const goToPrevWeek = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() - 7);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToNextWeek = () => {
    const d = new Date(selectedDate + 'T00:00:00');
    d.setDate(d.getDate() + 7);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToToday = () => setSelectedDate(new Date().toISOString().split('T')[0]);

  const weekStart = new Date(weekDates[0] + 'T00:00:00');
  const weekEnd = new Date(weekDates[6] + 'T00:00:00');
  const headerLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-nova-border px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={goToPrevWeek} className="rounded-lg px-2 py-1 text-nova-text-muted transition-colors hover:bg-nova-muted hover:text-nova-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={goToToday} className="rounded-lg bg-nova-primary px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-nova-primary-dark">
            Today
          </button>
          <button onClick={goToNextWeek} className="rounded-lg px-2 py-1 text-nova-text-muted transition-colors hover:bg-nova-muted hover:text-nova-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
        <h3 className="text-sm font-semibold text-nova-text">{headerLabel}</h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[700px]">
          <div className="grid grid-cols-[4rem_repeat(7,1fr)] border-b border-nova-border">
            <div className="border-r border-nova-border p-2" />
            {weekDates.map((date, i) => {
              const d = new Date(date + 'T00:00:00');
              const today = isToday(date);
              return (
                <div key={date} className={cn('border-r border-nova-border p-2 text-center', today && 'bg-nova-primary/5')}>
                  <p className="text-[10px] font-medium text-nova-text-muted">{DAY_LABELS[i]}</p>
                  <p className={cn('text-lg font-bold', today ? 'text-nova-primary' : 'text-nova-text')}>
                    {d.getDate()}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="relative grid grid-cols-[4rem_repeat(7,1fr)]" style={{ height: 'calc(100vh - 320px)' }}>
            <div className="border-r border-nova-border">
              {HOURS.map((hour) => (
                <div key={hour} className="flex items-start justify-end pr-2 border-b border-nova-border/50" style={{ height: `${100 / 9}%` }}>
                  <span className="text-[10px] font-medium text-nova-text-muted">{formatTimeDisplay(`${String(hour).padStart(2, '0')}:00`)}</span>
                </div>
              ))}
            </div>

            {weekDates.map((date) => {
              const dayAppts = getAppointmentsForDate(date);
              const today = isToday(date);
              return (
                <div key={date} className={cn('relative border-r border-nova-border/50', today && 'bg-nova-primary/[0.02]')}>
                  {HOURS.map((hour) => (
                    <div key={hour} className="border-b border-nova-border/50" style={{ height: `${100 / 9}%` }} />
                  ))}
                  {dayAppts.map((apt) => (
                    <WeekAppointment key={apt.id} apt={apt} onClick={() => setSelectedAppointment(apt)} />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
