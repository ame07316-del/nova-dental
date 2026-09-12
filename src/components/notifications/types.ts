export type NotificationType =
  | 'appointment-delay'
  | 'appointment-moved-earlier'
  | 'appointment-moved-later'
  | 'rescheduling'
  | 'cancellation'
  | 'session-completion'
  | 'schedule-adjustment';

export type NotificationStatus = 'pending' | 'sent' | 'read' | 'failed' | 'dismissed';

export interface InternalNotification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  appointmentId: string;
  patientName: string;
  dentistName: string;
  serviceName: string;
  originalTime: string;
  newTime: string;
  originalDate: string;
  newDate: string;
  reason: string;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
}

export const NOTIFICATION_TYPE_CONFIG: Record<NotificationType, { label: string; icon: string; color: string; bgColor: string }> = {
  'appointment-delay': { label: 'Appointment Delayed', icon: 'clock', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/30' },
  'appointment-moved-earlier': { label: 'Moved Earlier', icon: 'arrow-left', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/30' },
  'appointment-moved-later': { label: 'Moved Later', icon: 'arrow-right', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/30' },
  rescheduling: { label: 'Rescheduled', icon: 'refresh', color: 'text-violet-600', bgColor: 'bg-violet-100 dark:bg-violet-900/30' },
  cancellation: { label: 'Cancelled', icon: 'x-circle', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/30' },
  'session-completion': { label: 'Session Complete', icon: 'check-circle', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/30' },
  'schedule-adjustment': { label: 'Schedule Adjusted', icon: 'calendar', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/30' },
};

export const NOTIFICATION_STATUS_CONFIG: Record<NotificationStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  read: { label: 'Read', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  failed: { label: 'Failed', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  dismissed: { label: 'Dismissed', color: 'bg-gray-100 text-gray-600 dark:bg-gray-800/30 dark:text-gray-400' },
};

export const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  'appointment-delay': 'Appointment Delay',
  'appointment-moved-earlier': 'Moved Earlier',
  'appointment-moved-later': 'Moved Later',
  rescheduling: 'Rescheduling',
  cancellation: 'Cancellation',
  'session-completion': 'Session Complete',
  'schedule-adjustment': 'Schedule Adjustment',
};
