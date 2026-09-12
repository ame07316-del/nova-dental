'use client';

import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import type { InternalNotification, NotificationType, NotificationStatus } from './types';
import type { Notification } from '@/lib/supabase/types';
import { fetchNotifications, markAllNotificationsRead, markNotificationRead, dismissNotification as dismissNotificationAction, getSessionUser } from '@/app/actions';
import { useAuth } from '@/components/layout/AuthProvider';

interface NotificationContextType {
  notifications: InternalNotification[];
  unreadCount: number;
  filter: NotificationStatus | 'all';
  setFilter: (filter: NotificationStatus | 'all') => void;
  typeFilter: NotificationType | 'all';
  setTypeFilter: (filter: NotificationType | 'all') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  selectedNotification: InternalNotification | null;
  setSelectedNotification: (notification: InternalNotification | null) => void;
  addNotification: (notification: Omit<InternalNotification, 'id' | 'createdAt' | 'status'>) => void;
  refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

const NOTIFICATION_ID_PREFIX = 'notif-int-';
const MAX_UNREAD_DISPLAY = 9;

function mapDatabaseType(type: string): NotificationType {
  switch (type) {
    case 'success':
      return 'session-completion';
    case 'warning':
      return 'rescheduling';
    case 'error':
      return 'cancellation';
    case 'payment':
      return 'session-completion';
    case 'appointment':
    case 'info':
    default:
      return 'appointment-delay';
  }
}

function toInternal(notification: Notification): InternalNotification {
  return {
    id: notification.id,
    type: mapDatabaseType(notification.type),
    status: notification.read ? 'read' : 'pending',
    title: notification.title,
    message: notification.message,
    appointmentId: notification.relatedId ?? '',
    patientName: '',
    dentistName: '',
    serviceName: '',
    originalTime: '',
    newTime: '',
    originalDate: '',
    newDate: '',
    reason: '',
    createdAt: notification.createdAt,
    readAt: notification.read ? notification.createdAt : undefined,
  };
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState<InternalNotification[]>([]);
  const [filter, setFilter] = useState<NotificationStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<NotificationType | 'all'>('all');
  const [selectedNotification, setSelectedNotification] = useState<InternalNotification | null>(null);
  const [isStaffUser, setIsStaffUser] = useState(false);

  // Resolve role from the profiles table (authoritative), not auth.user_metadata.
  useEffect(() => {
    let cancelled = false;
    const resolve = async () => {
      const sessionUser = await getSessionUser();
      if (!cancelled && sessionUser && (sessionUser.role === 'doctor' || sessionUser.role === 'secretary' || sessionUser.role === 'admin')) {
        setIsStaffUser(true);
      } else if (!cancelled) {
        setIsStaffUser(false);
      }
    };
    void resolve();
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const refetch = useCallback(async () => {
    if (!isStaffUser) {
      setNotifications([]);
      return;
    }
    const res = await fetchNotifications();
    if (res.ok) {
      setNotifications(res.data.list.map(toInternal));
    }
  }, [isStaffUser]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const unreadCount = useMemo(
    () =>
      notifications.filter((n) => n.status !== 'read' && n.status !== 'dismissed').length,
    [notifications]
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: 'read' as NotificationStatus, readAt: new Date().toISOString() } : n
      )
    );
    void markNotificationRead(id);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.status !== 'dismissed' ? { ...n, status: 'read' as NotificationStatus, readAt: new Date().toISOString() } : n
      )
    );
    void markAllNotificationsRead();
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, status: 'dismissed' as NotificationStatus, dismissedAt: new Date().toISOString() } : n
      )
    );
    void dismissNotificationAction(id);
  }, []);

  const addNotification = useCallback(
    (notificationData: Omit<InternalNotification, 'id' | 'createdAt' | 'status'>) => {
      const newNotif: InternalNotification = {
        ...notificationData,
        id: `${NOTIFICATION_ID_PREFIX}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === newNotif.id ? { ...n, status: 'sent' as NotificationStatus } : n
          )
        );
      }, 1500);
    },
    []
  );

  const value: NotificationContextType = useMemo(
    () => ({
      notifications,
      unreadCount: Math.min(unreadCount, MAX_UNREAD_DISPLAY),
      filter,
      setFilter,
      typeFilter,
      setTypeFilter,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      selectedNotification,
      setSelectedNotification,
      addNotification,
      refetch,
    }),
    [notifications, unreadCount, filter, typeFilter, markAsRead, markAllAsRead, dismissNotification, selectedNotification, addNotification, refetch]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export function useNotificationCenter() {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotificationCenter must be used within NotificationProvider');
  return context;
}