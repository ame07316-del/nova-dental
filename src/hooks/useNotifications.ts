'use client';

import { useState, useCallback } from 'react';
import { useApp } from '@/components/layout/AppProvider';
import { notify } from '@/components/ui/Notification';
import type { NotificationType } from '@/config/design-tokens';

// Notification hook
export function useNotifications() {
  const { notifications, addNotification, removeNotification } = useApp();

  const success = useCallback((title: string, message: string) => {
    notify('success', title, message);
    addNotification('success', message);
  }, [addNotification]);

  const error = useCallback((title: string, message: string) => {
    notify('error', title, message);
    addNotification('error', message);
  }, [addNotification]);

  const info = useCallback((title: string, message: string) => {
    notify('info', title, message);
    addNotification('info', message);
  }, [addNotification]);

  const warning = useCallback((title: string, message: string) => {
    notify('warning', title, message);
    addNotification('warning', message);
  }, [addNotification]);

  return {
    notifications,
    success,
    error,
    info,
    warning,
    dismissAll: () => notifications.forEach((n) => removeNotification(n.id)),
  };
}

// Toast notification hook
export function useToast() {
  const [toasts, setToasts] = useState<Array<{ id: string; type: NotificationType; title: string; message: string }>>([]);

  const addToast = useCallback((type: NotificationType, title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
