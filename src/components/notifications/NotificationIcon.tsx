'use client';

import { type NotificationType } from './types';

const ICON_PATHS: Record<NotificationType, string> = {
  'appointment-delay': 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4l3 3',
  'appointment-moved-earlier': 'M19 12H5m7-7-7 7 7 7',
  'appointment-moved-later': 'M5 12h14m-7-7 7 7-7 7',
  rescheduling: 'M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15',
  cancellation: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4m0 4h.01',
  'session-completion': 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3',
  'schedule-adjustment': 'M3 4h18a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm16 2V2m-8 4V2m-4 4V2',
};

interface NotificationIconProps {
  type: NotificationType;
  size?: number;
  className?: string;
}

export function NotificationIcon({ type, size = 16, className }: NotificationIconProps) {
  const path = ICON_PATHS[type] || ICON_PATHS['schedule-adjustment'];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d={path} />
    </svg>
  );
}
