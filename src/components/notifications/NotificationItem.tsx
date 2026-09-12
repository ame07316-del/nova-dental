'use client';

import { useNotificationCenter } from './NotificationProvider';
import { NOTIFICATION_TYPE_CONFIG, NOTIFICATION_STATUS_CONFIG } from './types';
import type { InternalNotification } from './types';
import { NotificationIcon } from './NotificationIcon';
import { cn } from '@/lib/utils';

function formatTimeAgo(dateStr: string): string {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function NotificationItem({ notification }: { notification: InternalNotification }) {
  const { markAsRead, setSelectedNotification } = useNotificationCenter();
  const typeConfig = NOTIFICATION_TYPE_CONFIG[notification.type];
  const statusConfig = NOTIFICATION_STATUS_CONFIG[notification.status];
  const isUnread = notification.status !== 'read' && notification.status !== 'dismissed';

  const handleClick = () => {
    if (isUnread) markAsRead(notification.id);
    setSelectedNotification(notification);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg p-3 text-start transition-all hover:bg-nova-muted/30',
        isUnread && 'bg-nova-primary/[0.03] border-s-2 border-s-nova-primary',
        notification.status === 'dismissed' && 'opacity-50'
      )}
    >
      <div className={cn('mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', typeConfig.bgColor, typeConfig.color)}>
        <NotificationIcon type={notification.type} size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className={cn('text-sm truncate', isUnread ? 'font-semibold text-nova-text' : 'font-medium text-nova-text-secondary')}>
            {notification.title}
          </p>
          {isUnread && <span className="h-2 w-2 shrink-0 rounded-full bg-nova-primary" />}
        </div>
        <p className="mt-0.5 text-xs text-nova-text-muted line-clamp-2">{notification.message}</p>
        <div className="mt-1.5 flex items-center gap-2">
          <span className={cn('inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium', statusConfig.color)}>
            {statusConfig.label}
          </span>
          <span className="text-[10px] text-nova-text-muted">{formatTimeAgo(notification.createdAt)}</span>
          {notification.patientName && (
            <span className="text-[10px] text-nova-text-muted truncate">{notification.patientName}</span>
          )}
        </div>
      </div>
    </button>
  );
}

export { NotificationItem };
