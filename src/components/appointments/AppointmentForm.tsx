'use client';

import { useState, useEffect } from 'react';
import { useAppointments } from './AppointmentProvider';
import { Drawer } from '@/components/ui/Drawer';
import { calculateEndTime, timeToMinutes, formatTimeDisplay } from './utils';
import type { AppointmentFormData, AppointmentConflict } from './types';
import { STATUS_LABELS, STATUS_COLORS } from './types';

const TIME_OPTIONS = Array.from({ length: 18 }, (_, i) => {
  const h = 9 + Math.floor(i / 2);
  const m = i % 2 === 0 ? 0 : 30;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
});

interface AppointmentFormProps {
  open: boolean;
  onClose: () => void;
  editMode?: boolean;
}

export function AppointmentForm({ open, onClose, editMode = false }: AppointmentFormProps) {
  const {
    editingAppointment,
    reschedulingAppointment,
    dentists,
    services,
    patients,
    createAppointment,
    updateAppointment,
    rescheduleAppointment,
    setEditingAppointment,
    setReschedulingAppointment,
    setFormOpen,
  } = useAppointments();

  const isReschedule = !!reschedulingAppointment;
  const isEdit = editMode && !!editingAppointment;
  const target = isReschedule ? reschedulingAppointment : editingAppointment;

  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    dentistId: '',
    serviceId: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '09:30',
    treatmentType: '',
    notes: '',
  });

  const [conflicts, setConflicts] = useState<AppointmentConflict[]>([]);
  const [showConflictWarning, setShowConflictWarning] = useState(false);

  useEffect(() => {
    if (target) {
      setFormData({
        patientId: target.patientId,
        dentistId: target.dentistId,
        serviceId: target.serviceId,
        date: isReschedule ? '' : target.date,
        startTime: isReschedule ? '' : target.startTime,
        endTime: isReschedule ? '' : target.endTime,
        treatmentType: target.treatmentType,
        notes: target.notes,
      });
    } else {
      setFormData({
        patientId: '',
        dentistId: '',
        serviceId: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '09:30',
        treatmentType: '',
        notes: '',
      });
    }
    setConflicts([]);
    setShowConflictWarning(false);
  }, [target, isReschedule]);

  useEffect(() => {
    if (formData.serviceId) {
      const service = services.find((s) => s.id === formData.serviceId);
      if (service) {
        setFormData((prev) => ({
          ...prev,
          endTime: calculateEndTime(prev.startTime, service.durationMinutes),
        }));
      }
    }
  }, [formData.serviceId, formData.startTime, services]);

  const handleClose = () => {
    onClose();
    setEditingAppointment(null);
    setReschedulingAppointment(null);
    setFormOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConflicts([]);
    setShowConflictWarning(false);

    let result;
    if (isReschedule && target) {
      result = rescheduleAppointment(target.id, formData);
    } else if (isEdit && target) {
      result = updateAppointment(target.id, formData);
    } else {
      result = createAppointment(formData);
    }

    if (result.success) {
      handleClose();
    } else {
      setConflicts(result.conflicts);
      setShowConflictWarning(true);
    }
  };

  const selectedDentistAppts = target
    ? []
    : [];

  const title = isReschedule
    ? 'Reschedule Appointment'
    : isEdit
    ? 'Edit Appointment'
    : 'New Appointment';

  return (
    <Drawer open={open} onClose={handleClose} title={title} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {isReschedule && target && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-900/20">
            <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">Original Appointment</p>
            <p className="text-xs text-amber-700 dark:text-amber-400">
              {target.date} at {formatTimeDisplay(target.startTime)} - {formatTimeDisplay(target.endTime)}
            </p>
          </div>
        )}

        {showConflictWarning && conflicts.length > 0 && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-900/20">
            <p className="text-xs font-semibold text-red-800 dark:text-red-300">Scheduling Conflict</p>
            {conflicts.map((c, i) => (
              <p key={i} className="text-xs text-red-700 dark:text-red-400">{c.message}</p>
            ))}
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">Patient *</label>
          <select
            value={formData.patientId}
            onChange={(e) => setFormData((prev) => ({ ...prev, patientId: e.target.value }))}
            className="input"
            required
          >
            <option value="">Select patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">Dentist *</label>
            <select
              value={formData.dentistId}
              onChange={(e) => setFormData((prev) => ({ ...prev, dentistId: e.target.value }))}
              className="input"
              required
            >
              <option value="">Select dentist</option>
              {dentists.map((d) => (
                <option key={d.id} value={d.id}>Dr. {d.firstName} {d.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">Service *</label>
            <select
              value={formData.serviceId}
              onChange={(e) => setFormData((prev) => ({ ...prev, serviceId: e.target.value }))}
              className="input"
              required
            >
              <option value="">Select service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} ({s.durationMinutes}min)</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">Treatment Type *</label>
          <input
            type="text"
            value={formData.treatmentType}
            onChange={(e) => setFormData((prev) => ({ ...prev, treatmentType: e.target.value }))}
            className="input"
            placeholder="e.g., Initial Consultation, Follow-up"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">Date *</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
            className="input"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">Start Time *</label>
            <select
              value={formData.startTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
              className="input"
              required
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>{formatTimeDisplay(t)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">End Time *</label>
            <select
              value={formData.endTime}
              onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
              className="input"
              required
            >
              {TIME_OPTIONS.filter((t) => timeToMinutes(t) > timeToMinutes(formData.startTime)).map((t) => (
                <option key={t} value={t}>{formatTimeDisplay(t)}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold text-nova-text-secondary">Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="input min-h-[80px] resize-y"
            placeholder="Additional notes..."
          />
        </div>

        <div className="flex justify-end gap-3 border-t border-nova-border pt-4">
          <button type="button" onClick={handleClose} className="btn btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            {isReschedule ? 'Reschedule' : isEdit ? 'Update' : 'Create Appointment'}
          </button>
        </div>
      </form>
    </Drawer>
  );
}
