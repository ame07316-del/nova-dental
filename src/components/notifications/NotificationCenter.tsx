'use client';

import { useState } from 'react';
import { useNotificationCenter } from './NotificationProvider';
import { NotificationItem } from './NotificationItem';
import { NotificationFilters } from './NotificationFilters';
import { NotificationDetails } from './NotificationDetails';
import { cn } from '@/lib/utils';

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    filter,
    typeFilter,
    markAllAsRead,
    setSelectedNotification,
  } = useNotificationCenter();
  const [showFilters, setShowFilters] = useState(false);

  const filteredNotifications = notifications.filter((n) => {
    if (filter !== 'all' && n.status !== filter) return false;
    if (typeFilter !== 'all' && n.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-nova-text">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -end-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-nova-error text-[9px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-nova-text">Notifications</h3>
          {unreadCount > 0 && (
            <span className="rounded-full bg-nova-primary/10 px-2 py-0.5 text-[10px] font-semibold text-nova-primary">
              {unreadCount} unread
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              'rounded-md px-2 py-1 text-xs font-medium transition-colors',
              showFilters ? 'bg-nova-primary text-white' : 'text-nova-text-muted hover:bg-nova-muted'
            )}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
          </button>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="rounded-md px-2 py-1 text-xs font-medium text-nova-primary hover:bg-nova-primary/10 transition-colors"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && <NotificationFilters />}

      {/* Success/Failure state summary */}
      <div className="flex gap-2">
        <div className="flex items-center gap-1.5 rounded-md bg-green-50 px-2 py-1 dark:bg-green-900/20">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
          <span className="text-[10px] font-medium text-green-700 dark:text-green-400">
            {notifications.filter((n) => n.status === 'sent').length} sent
          </span>
        </div>
        {notifications.filter((n) => n.status === 'failed').length > 0 && (
          <div className="flex items-center gap-1.5 rounded-md bg-red-50 px-2 py-1 dark:bg-red-900/20">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-600">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <span className="text-[10px] font-medium text-red-700 dark:text-red-400">
              {notifications.filter((n) => n.status === 'failed').length} failed
            </span>
          </div>
        )}
      </div>

      {/* Notification list */}
      <div className="space-y-1 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="py-8 text-center">
            <svg className="mx-auto mb-2 text-nova-text-muted" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <p className="text-sm text-nova-text-muted">No notifications</p>
            <p className="text-xs text-nova-text-muted">
              {filter !== 'all' || typeFilter !== 'all' ? 'Try changing your filters' : 'All caught up!'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))
        )}
      </div>

      {/* Details Drawer */}
      <NotificationDetails />
    </div>
  );
}
