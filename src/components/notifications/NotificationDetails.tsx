'use client';

import { useNotificationCenter } from './NotificationProvider';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { NOTIFICATION_TYPE_CONFIG, NOTIFICATION_STATUS_CONFIG } from './types';
import { NotificationIcon } from './NotificationIcon';
import { cn } from '@/lib/utils';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatTime(time: string): string {
  if (!time) return 'N/A';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function NotificationDetails() {
  const { selectedNotification, setSelectedNotification, markAsRead, dismissNotification } =
    useNotificationCenter();
  if (!selectedNotification) return null;

  const notification = selectedNotification;
  const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type];
  const statusConfig = NOTIFICATION_STATUS_CONFIG[notification.status];

  const handleDismiss = () => {
    dismissNotification(notification.id);
    setSelectedNotification(null);
  };

  return (
    <Drawer
      open={!!selectedNotification}
      onClose={() => setSelectedNotification(null)}
      title="Notification Details"
      size="md"
    >
      <div className="space-y-5">
        {/* Type & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold', typeConfig.bgColor, typeConfig.color)}>
            <NotificationIcon type={notification.type} size={20} />
            {typeConfig.label}
          </div>
          <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', statusConfig.color)}>
            {statusConfig.label}
          </span>
        </div>

        {/* Title & Message */}
        <div>
          <h3 className="text-lg font-bold text-nova-text">{notification.title}</h3>
          <p className="mt-2 text-sm text-nova-text-secondary leading-relaxed">{notification.message}</p>
        </div>

        {/* Time Details */}
        <div className="rounded-lg border border-nova-border p-4 space-y-3">
          <h4 className="text-xs font-semibold uppercase text-nova-text-muted">Time Information</h4>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {notification.originalDate && (
              <div>
                <p className="text-[10px] text-nova-text-muted">Original Date</p>
                <p className="text-sm font-medium text-nova-text">{notification.originalDate}</p>
              </div>
            )}
            {notification.originalTime && (
              <div>
                <p className="text-[10px] text-nova-text-muted">Original Time</p>
                <p className="text-sm font-medium text-nova-text">{formatTime(notification.originalTime)}</p>
              </div>
            )}
            {notification.newDate && notification.newDate !== notification.originalDate && (
              <div>
                <p className="text-[10px] text-nova-text-muted">New Date</p>
                <p className="text-sm font-medium text-nova-primary">{notification.newDate}</p>
              </div>
            )}
            {notification.newTime && notification.newTime !== notification.originalTime && (
              <div>
                <p className="text-[10px] text-nova-text-muted">New Time</p>
                <p className="text-sm font-medium text-nova-primary">{formatTime(notification.newTime)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Patient & Appointment Info */}
        {notification.patientName && (
          <div className="rounded-lg border border-nova-border p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase text-nova-text-muted">Appointment Reference</h4>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {notification.patientName && (
                <div>
                  <p className="text-[10px] text-nova-text-muted">Patient</p>
                  <p className="text-sm font-medium text-nova-text">{notification.patientName}</p>
                </div>
              )}
              {notification.dentistName && (
                <div>
                  <p className="text-[10px] text-nova-text-muted">Doctor</p>
                  <p className="text-sm font-medium text-nova-text">{notification.dentistName}</p>
                </div>
              )}
              {notification.serviceName && (
                <div>
                  <p className="text-[10px] text-nova-text-muted">Service</p>
                  <p className="text-sm font-medium text-nova-text">{notification.serviceName}</p>
                </div>
              )}
              {notification.appointmentId && (
                <div>
                  <p className="text-[10px] text-nova-text-muted">Appointment ID</p>
                  <p className="text-sm font-medium text-nova-text font-mono">{notification.appointmentId}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reason */}
        {notification.reason && (
          <div className="rounded-lg border border-nova-border p-4">
            <h4 className="text-xs font-semibold uppercase text-nova-text-muted">Reason</h4>
            <p className="mt-1 text-sm text-nova-text-secondary">{notification.reason}</p>
          </div>
        )}

        {/* Timestamps */}
        <div className="rounded-lg border border-nova-border p-4 space-y-2">
          <h4 className="text-xs font-semibold uppercase text-nova-text-muted">Timestamps</h4>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-nova-text-muted">Created</span>
              <span className="text-nova-text">{formatDate(notification.createdAt)}</span>
            </div>
            {notification.readAt && (
              <div className="flex justify-between text-xs">
                <span className="text-nova-text-muted">Read</span>
                <span className="text-nova-text">{formatDate(notification.readAt)}</span>
              </div>
            )}
            {notification.dismissedAt && (
              <div className="flex justify-between text-xs">
                <span className="text-nova-text-muted">Dismissed</span>
                <span className="text-nova-text">{formatDate(notification.dismissedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t border-nova-border pt-4">
          {notification.status !== 'read' && notification.status !== 'dismissed' && (
            <Button variant="primary" className="flex-1" onClick={() => { markAsRead(notification.id); setSelectedNotification({ ...notification, status: 'read' }); }}>
              Mark as Read
            </Button>
          )}
          {notification.status !== 'dismissed' && (
            <Button variant="secondary" className="flex-1" onClick={handleDismiss}>
              Dismiss
            </Button>
          )}
        </div>
      </div>
    </Drawer>
  );
}
