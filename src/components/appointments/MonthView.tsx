'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { useAppointments } from './AppointmentProvider';
import { getMonthDates, isToday, formatTimeDisplay } from './utils';
import { STATUS_COLORS } from './types';
import type { EnrichedAppointment } from './types';

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function MonthDayCell({
  date,
  isCurrentMonth,
  appointments,
  onSelect,
  onAppointmentClick,
}: {
  date: string;
  isCurrentMonth: boolean;
  appointments: EnrichedAppointment[];
  onSelect: (date: string) => void;
  onAppointmentClick: (apt: EnrichedAppointment) => void;
}) {
  const d = new Date(date + 'T00:00:00');
  const today = isToday(date);

  return (
    <div
      className={cn(
        'min-h-[100px] border-b border-r border-nova-border/50 p-1.5 transition-colors hover:bg-nova-muted/30 cursor-pointer',
        !isCurrentMonth && 'bg-nova-muted/20',
        today && 'bg-nova-primary/5'
      )}
      onClick={() => onSelect(date)}
    >
      <p
        className={cn(
          'mb-1 text-right text-xs font-semibold',
          today ? 'flex h-6 w-6 items-center justify-center rounded-full bg-nova-primary text-white' : '',
          !isCurrentMonth ? 'text-nova-text-muted' : 'text-nova-text'
        )}
      >
        {d.getDate()}
      </p>
      <div className="space-y-0.5">
        {appointments.slice(0, 3).map((apt) => {
          const colors = STATUS_COLORS[apt.status];
          return (
            <button
              key={apt.id}
              onClick={(e) => {
                e.stopPropagation();
                onAppointmentClick(apt);
              }}
              className={cn(
                'w-full truncate rounded px-1 py-0.5 text-left text-[10px] font-medium transition-colors hover:opacity-80',
                colors.bg,
                colors.text
              )}
            >
              {apt.startTime} {apt.patientName.split(' ')[0]}
            </button>
          );
        })}
        {appointments.length > 3 && (
          <p className="text-center text-[10px] text-nova-text-muted">+{appointments.length - 3} more</p>
        )}
      </div>
    </div>
  );
}

export function MonthView() {
  const { selectedDate, getAppointmentsForDate, setSelectedAppointment, setSelectedDate } = useAppointments();
  const current = new Date(selectedDate + 'T00:00:00');
  const year = current.getFullYear();
  const month = current.getMonth();

  const dates = useMemo(() => getMonthDates(year, month), [year, month]);

  const goToPrevMonth = () => {
    const d = new Date(year, month - 1, 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToNextMonth = () => {
    const d = new Date(year, month + 1, 1);
    setSelectedDate(d.toISOString().split('T')[0]);
  };

  const goToToday = () => setSelectedDate(new Date().toISOString().split('T')[0]);

  const monthLabel = current.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const appointmentMap = useMemo(() => {
    const map: Record<string, EnrichedAppointment[]> = {};
    dates.forEach((date) => {
      map[date] = getAppointmentsForDate(date);
    });
    return map;
  }, [dates, getAppointmentsForDate]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-nova-border px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={goToPrevMonth} className="rounded-lg px-2 py-1 text-nova-text-muted transition-colors hover:bg-nova-muted hover:text-nova-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <button onClick={goToToday} className="rounded-lg bg-nova-primary px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-nova-primary-dark">
            Today
          </button>
          <button onClick={goToNextMonth} className="rounded-lg px-2 py-1 text-nova-text-muted transition-colors hover:bg-nova-muted hover:text-nova-text">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
        <h3 className="text-sm font-semibold text-nova-text">{monthLabel}</h3>
      </div>

      <div className="grid grid-cols-7 border-b border-nova-border">
        {DAY_LABELS.map((label) => (
          <div key={label} className="border-r border-nova-border/50 p-2 text-center text-xs font-semibold text-nova-text-muted">
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {dates.map((date) => {
          const d = new Date(date + 'T00:00:00');
          const isCurrentMonth = d.getMonth() === month;
          return (
            <MonthDayCell
              key={date}
              date={date}
              isCurrentMonth={isCurrentMonth}
              appointments={appointmentMap[date] || []}
              onSelect={setSelectedDate}
              onAppointmentClick={setSelectedAppointment}
            />
          );
        })}
      </div>
    </div>
  );
}
