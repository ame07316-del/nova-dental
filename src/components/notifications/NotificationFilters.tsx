'use client';

import { useMemo } from 'react';
import { useNotificationCenter } from './NotificationProvider';
import { NOTIFICATION_TYPE_CONFIG, NOTIFICATION_STATUS_CONFIG } from './types';
import type { NotificationType, NotificationStatus } from './types';
import { cn } from '@/lib/utils';

export function NotificationFilters() {
  const { filter, setFilter, typeFilter, setTypeFilter, notifications } = useNotificationCenter();

  const statusCounts = useMemo(
    () =>
      ({
        all: notifications.length,
        pending: notifications.filter((n) => n.status === 'pending').length,
        sent: notifications.filter((n) => n.status === 'sent').length,
        read: notifications.filter((n) => n.status === 'read').length,
        failed: notifications.filter((n) => n.status === 'failed').length,
        dismissed: notifications.filter((n) => n.status === 'dismissed').length,
      } as Record<string, number>),
    [notifications]
  );

  const typeCounts = useMemo(
    () =>
      Object.keys(NOTIFICATION_TYPE_CONFIG).reduce(
        (acc, key) => {
          acc[key as NotificationType] = notifications.filter((n) => n.type === key).length;
          return acc;
        },
        {} as Record<NotificationType, number>
      ),
    [notifications]
  );

  const statuses: Array<{ key: NotificationStatus | 'all'; label: string }> = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'sent', label: 'Sent' },
    { key: 'read', label: 'Read' },
    { key: 'failed', label: 'Failed' },
    { key: 'dismissed', label: 'Dismissed' },
  ];

  const types: Array<{ key: NotificationType | 'all'; label: string }> = [
    { key: 'all', label: 'All Types' },
    ...(Object.keys(NOTIFICATION_TYPE_CONFIG) as NotificationType[]).map((t) => ({
      key: t,
      label: NOTIFICATION_TYPE_CONFIG[t].label,
    })),
  ];

  const MAX_UNREAD_DISPLAY = 9;

  return (
    <div className="space-y-3">
      {/* Status filters */}
      <div className="flex flex-wrap gap-1">
        {statuses.map((s) => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              filter === s.key
                ? 'bg-nova-primary text-white'
                : 'bg-nova-muted text-nova-text-secondary hover:bg-nova-border'
            )}
          >
            {s.label}
            {statusCounts[s.key] > 0 && (
              <span className={cn(
                'ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none',
                filter === s.key ? 'bg-white/20' : 'bg-nova-border text-nova-text-muted'
              )}>
                {statusCounts[s.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Type filters */}
      <div className="flex flex-wrap gap-1">
        {types.map((t) => {
          const count = t.key === 'all' ? statusCounts.all : typeCounts[t.key] || 0;
          return (
            <button
              key={t.key}
              onClick={() => setTypeFilter(t.key)}
              className={cn(
                'rounded-md px-2 py-1 text-[10px] font-medium transition-colors',
                typeFilter === t.key
                  ? 'bg-nova-accent text-amber-900'
                  : 'bg-nova-muted text-nova-text-muted hover:bg-nova-border'
              )}
            >
              {t.label}
              {count > 0 && (
                <span className="ml-1 text-[9px] opacity-70">({count})</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
