// Supabase edge functions for NOVA Dental Studio

// Function to send notification via email
export async function sendNotification(email: string, subject: string, message: string) {
  const response = await fetch('https://api.emailservice.com/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to: email, subject, message }),
  });
  return response.json();
}

// Function to calculate treatment plan cost
export function calculateTreatmentCost(services: Array<{ price: number; discount?: number }>) {
  const subtotal = services.reduce((sum, s) => sum + s.price, 0);
  const discount = services.reduce((sum, s) => sum + (s.discount || 0), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal - discount + tax;
  return { subtotal, discount, tax, total };
}

// Function to find available appointment slots
export function findAvailableSlots(schedule: Array<{ start: string; end: string; isAvailable: boolean }>, date: string, duration: number = 30) {
  const slots: string[] = [];
  const startHour = 9;
  const endHour = 18;

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const slotStart = hour * 60 + minute;
      const slotEnd = slotStart + duration;

      const isBooked = schedule.some(s => {
        const [startH, startM] = s.start.split(':').map(Number);
        const [endH, endM] = s.end.split(':').map(Number);
        const startSlot = startH * 60 + startM;
        const endSlot = endH * 60 + endM;
        return slotStart < endSlot && slotEnd > startSlot && !s.isAvailable;
      });

      if (!isBooked && slotEnd <= endHour * 60) {
        slots.push(time);
      }
    }
  }

  return slots;
}

// Function to format dental chart data
export function formatDentalChart(data: Record<string, any>) {
  const teeth = ['11', '12', '13', '14', '15', '16', '17', '18', '21', '22', '23', '24', '25', '26', '27', '28', '31', '32', '33', '34', '35', '36', '37', '38', '41', '42', '43', '44', '45', '46', '47', '48'];
  return teeth.map(tooth => ({
    id: tooth,
    status: data[tooth] || 'healthy',
    treatment: data[`${tooth}_treatment`] || null,
  }));
}

// Function to validate appointment data
export function validateAppointment(data: { patientId: string; dentistId: string; date: string; startTime: string; endTime: string }) {
  const errors: string[] = [];

  if (!data.patientId) errors.push('Patient ID is required');
  if (!data.dentistId) errors.push('Dentist ID is required');
  if (!data.date) errors.push('Date is required');
  if (!data.startTime || !data.endTime) errors.push('Start and end time are required');

  const start = new Date(`1970-01-01T${data.startTime}`);
  const end = new Date(`1970-01-01T${data.endTime}`);
  if (end <= start) errors.push('End time must be after start time');

  const appointmentDate = new Date(data.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (appointmentDate < today) errors.push('Date cannot be in the past');

  return { valid: errors.length === 0, errors };
}
