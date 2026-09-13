import type { AppointmentConflict, EnrichedAppointment, AppointmentFormData, CalendarSlot } from './types';

const CLINIC_OPEN = 9;
const CLINIC_CLOSE = 18;
const SLOT_INTERVAL = 30;

export function generateTimeSlots(startHour = CLINIC_OPEN, endHour = CLINIC_CLOSE): CalendarSlot[] {
  const slots: CalendarSlot[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += SLOT_INTERVAL) {
      slots.push({
        time: `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
        hour: h,
        minute: m,
      });
    }
  }
  return slots;
}

export function timeToMinutes(time: string): number {
  if (typeof time !== 'string') return NaN;
  const m = time.match(/^(\d{1,2}):(\d{2})/);
  if (!m) return NaN;
  return Number(m[1]) * 60 + Number(m[2]);
}

export function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function calculateEndTime(startTime: string, durationMinutes: number): string {
  return minutesToTime(timeToMinutes(startTime) + durationMinutes);
}

export function getDayName(dateStr: string): string {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { weekday: 'long' });
}

export function formatDateDisplay(dateStr: string): string {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}/.test(dateStr)) return '';
  const d = new Date(dateStr + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTimeDisplay(time: string): string {
  const mins = timeToMinutes(time);
  if (!Number.isFinite(mins)) return '';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function todayLocalString(): string {
  return toLocalDateString(new Date());
}

export function getWeekDates(dateStr: string): string[] {
  const d = new Date(dateStr + 'T00:00:00');
  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const dt = new Date(monday);
    dt.setDate(monday.getDate() + i);
    return toLocalDateString(dt);
  });
}

export function getMonthDates(year: number, month: number): string[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() + 6) % 7;
  const dates: string[] = [];
  for (let i = -startPad; i < 42 - startPad; i++) {
    const dt = new Date(year, month, 1 + i);
    dates.push(toLocalDateString(dt));
  }
  return dates;
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayLocalString();
}

export function checkConflict(
  formData: AppointmentFormData,
  existingAppointments: EnrichedAppointment[],
  excludeId?: string
): AppointmentConflict[] {
  const conflicts: AppointmentConflict[] = [];
  const newStart = timeToMinutes(formData.startTime);
  const newEnd = timeToMinutes(formData.endTime);

  // Invalid times must never silently pass detection (NaN defeats every < > check).
  if (!Number.isFinite(newStart) || !Number.isFinite(newEnd) || newEnd <= newStart) {
    conflicts.push({ type: 'outside-hours', message: 'Please choose a valid start and end time' });
    return conflicts;
  }

  if (newStart < CLINIC_OPEN * 60 || newEnd > CLINIC_CLOSE * 60) {
    conflicts.push({ type: 'outside-hours', message: 'Appointment is outside clinic hours (9:00 AM - 6:00 PM)' });
  }

  const dentistAppts = existingAppointments.filter(
    (a) =>
      a.dentistId === formData.dentistId &&
      a.date === formData.date &&
      a.id !== excludeId &&
      a.status !== 'cancelled'
  );

  for (const appt of dentistAppts) {
    const existStart = timeToMinutes(appt.startTime);
    const existEnd = timeToMinutes(appt.endTime);
    if (newStart < existEnd && newEnd > existStart) {
      conflicts.push({
        type: 'overlap',
        message: `Overlaps with ${appt.patientName}'s appointment (${formatTimeDisplay(appt.startTime)} - ${formatTimeDisplay(appt.endTime)})`,
        conflictingAppointmentId: appt.id,
      });
    }
  }

  // Any overlap with the lunch break (1:00 PM - 2:00 PM) is a conflict.
  const lunchStart = 13 * 60;
  const lunchEnd = 14 * 60;
  if (newStart < lunchEnd && newEnd > lunchStart) {
    conflicts.push({ type: 'break', message: 'Appointment overlaps with lunch break (1:00 PM - 2:00 PM)' });
  }

  return conflicts;
}

export function getAppointmentPosition(
  startTime: string,
  endTime: string,
  startHour = CLINIC_OPEN,
  endHour = CLINIC_CLOSE
): { top: number; height: number } {
  const totalMinutes = (endHour - startHour) * 60;
  const startMinutes = timeToMinutes(startTime) - startHour * 60;
  const endMinutes = timeToMinutes(endTime) - startHour * 60;
  return {
    top: (startMinutes / totalMinutes) * 100,
    height: ((endMinutes - startMinutes) / totalMinutes) * 100,
  };
}

export function generateId(): string {
  return `apt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function getDatesInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from + 'T00:00:00');
  const end = new Date(to + 'T00:00:00');
  while (current <= end) {
    dates.push(toLocalDateString(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
