'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Notification types
type NotificationType = 'info' | 'success' | 'warning' | 'error';

interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time?: string;
  read?: boolean;
}

// Individual toast notification
interface ToastProps {
  notification: NotificationData;
  onDismiss: (id: string) => void;
}

export function Toast({ notification, onDismiss }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const icons: Record<NotificationType, JSX.Element> = {
    info: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
    success: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
    warning: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    error: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
  };

  const borderColors: Record<NotificationType, string> = {
    info: 'border-l-4 border-l-nova-info',
    success: 'border-l-4 border-l-nova-success',
    warning: 'border-l-4 border-l-nova-warning',
    error: 'border-l-4 border-l-nova-error',
  };

  const iconColors: Record<NotificationType, string> = {
    info: 'text-nova-info',
    success: 'text-nova-success',
    warning: 'text-nova-warning',
    error: 'text-nova-error',
  };

  return (
    <div className={cn(
      'animate-slide-in-right flex w-80 items-start gap-3 rounded-lg border bg-nova-surface p-4 shadow-floating',
      borderColors[notification.type]
    )}>
      <span className={cn('shrink-0', iconColors[notification.type])}>
        {icons[notification.type]}
      </span>
      <div className="flex-1">
        <p className="text-sm font-semibold text-nova-text">{notification.title}</p>
        <p className="mt-0.5 text-xs text-nova-text-secondary">{notification.message}</p>
      </div>
      <button
        onClick={() => onDismiss(notification.id)}
        className="shrink-0 rounded p-0.5 text-nova-text-muted hover:text-nova-text"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

// Notification container (stack)
export function NotificationContainer() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  // Subscribe to app notifications via global event
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      setNotifications((prev) => [...prev, e.detail]);
    };
    window.addEventListener('nova-notification', handler as EventListener);
    return () => window.removeEventListener('nova-notification', handler as EventListener);
  }, []);

  const dismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2" dir="ltr">
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} onDismiss={dismiss} />
      ))}
    </div>
  );
}

// Helper to trigger notification
export function notify(type: NotificationType, title: string, message: string) {
  window.dispatchEvent(
    new CustomEvent('nova-notification', {
      detail: { id: Date.now().toString(), type, title, message },
    })
  );
}
