'use client';

import { useAppointments } from './AppointmentProvider';
import { formatDateDisplay, formatTimeDisplay } from './utils';
import type { AppointmentHistoryEntry } from './types';

const ACTION_ICONS: Record<string, string> = {
  created: 'M12 5v14M5 12h14',
  updated: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7',
  cancelled: 'M18 6L6 18M6 6l12 12',
  rescheduled: 'M23 4v6h-6M1 20v-6h6',
  'status-changed': 'M22 11.08V12a10 10 0 1 1-5.93-9.14',
};

const ACTION_COLORS: Record<string, string> = {
  created: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  updated: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  cancelled: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  rescheduled: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'status-changed': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};

const ACTION_LABELS: Record<string, string> = {
  created: 'Created',
  updated: 'Updated',
  cancelled: 'Cancelled',
  rescheduled: 'Rescheduled',
  'status-changed': 'Status Changed',
};

export function AppointmentHistory({ appointmentId }: { appointmentId: string }) {
  const { getAppointmentHistory } = useAppointments();
  const history = getAppointmentHistory(appointmentId);

  if (history.length === 0) {
    return (
      <div className="rounded-lg border border-nova-border p-4">
        <h4 className="mb-2 text-xs font-semibold uppercase text-nova-text-muted">History</h4>
        <p className="text-xs text-nova-text-muted">No history available for this appointment.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-nova-border p-4">
      <h4 className="mb-3 text-xs font-semibold uppercase text-nova-text-muted">History</h4>
      <div className="space-y-3">
        {[...history].reverse().map((entry) => (
          <div key={entry.id} className="flex gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${ACTION_COLORS[entry.action] || 'bg-nova-muted text-nova-text-muted'}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d={ACTION_ICONS[entry.action] || ACTION_ICONS['updated']} />
                </svg>
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-nova-text">{ACTION_LABELS[entry.action] || entry.action}</span>
                <span className="text-[10px] text-nova-text-muted">by {entry.performedBy}</span>
              </div>
              <p className="text-[10px] text-nova-text-muted">
                {formatDateDisplay(entry.timestamp.split('T')[0])} at {formatTimeDisplay(entry.timestamp.split('T')[1]?.substring(0, 5) || '00:00')}
              </p>
              {entry.changes && entry.changes.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {entry.changes.map((change, i) => (
                    <p key={i} className="text-[10px] text-nova-text-secondary">
                      <span className="font-medium">{change.field}</span>: {change.oldValue} → {change.newValue}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
