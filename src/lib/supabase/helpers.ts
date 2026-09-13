// ============================================
// NOVA Dental Studio — Shared helpers
// Clean, typed utilities for the whole app.
// كل دالة موثّقة ومختصرة — أي مبرمج يقرأها يفهمها فورًا.
// ============================================

/** تكلفة خطة علاج: مجموع - خصم + ضريبة 8% */
export function calculateTreatmentCost(
  services: Array<{ price: number; discount?: number }>
) {
  const subtotal = services.reduce((sum, s) => sum + s.price, 0);
  const discount = services.reduce((sum, s) => sum + (s.discount ?? 0), 0);
  const tax = subtotal * 0.08;
  return { subtotal, discount, tax, total: subtotal - discount + tax };
}

/** يولّد slots وهمية (للـ storybook/tests فقط) — الحجز الحقيقي يستخدم RPC get_available_slots */
export function findAvailableSlots(
  schedule: Array<{ start: string; end: string; isAvailable: boolean }>,
  _date: string,
  duration = 30
): string[] {
  const slots: string[] = [];
  for (let hour = 9; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
      const slotStart = hour * 60 + minute;
      const slotEnd = slotStart + duration;
      const isBooked = schedule.some((s) => {
        const [sh, sm] = s.start.split(':').map(Number);
        const [eh, em] = s.end.split(':').map(Number);
        const a = sh * 60 + sm;
        const b = eh * 60 + em;
        return slotStart < b && slotEnd > a && !s.isAvailable;
      });
      if (!isBooked && slotEnd <= 18 * 60) slots.push(time);
    }
  }
  return slots;
}

/** خريطة أسنان FDI (11-48) — للـ dental chart */
export function formatDentalChart(data: Record<string, unknown>) {
  const teeth = [
    '11','12','13','14','15','16','17','18','21','22','23','24','25','26','27','28',
    '31','32','33','34','35','36','37','38','41','42','43','44','45','46','47','48',
  ];
  return teeth.map((id) => ({
    id,
    status: (data[id] as string) ?? 'healthy',
    treatment: (data[`${id}_treatment`] as string | null) ?? null,
  }));
}

/** تحقّق بسيط لبيانات موعد (للـ forms المحلية) — التحقّق النهائي في DB */
export function validateAppointment(data: {
  patientId: string;
  dentistId: string;
  date: string;
  startTime: string;
  endTime: string;
}) {
  const errors: string[] = [];
  if (!data.patientId) errors.push('Patient ID is required');
  if (!data.dentistId) errors.push('Dentist ID is required');
  if (!data.date) errors.push('Date is required');
  if (!data.startTime || !data.endTime) errors.push('Start and end time are required');
  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  if (!(end > start)) errors.push('End time must be after start time');
  const d = new Date(data.date);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (d < today) errors.push('Date cannot be in the past');
  return { valid: errors.length === 0, errors };
}
