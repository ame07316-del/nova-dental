export type { Patient, Dentist, Appointment, Service, GalleryImage, Notification as NotificationType, Billing, Schedule, AuthUser, Session } from '@/lib/supabase/types';
export { supabase } from '@/lib/supabase/client';

// App-wide type exports
export interface NavItem {
  id: string;
  label: { en: string; ar: string };
  href: string;
  icon: string;
  roles: string[];
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  time?: string;
  read?: boolean;
}

export type ThemeMode = 'light' | 'dark' | 'system';
export type LanguageType = 'en' | 'ar';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger' | 'success';
export type CardVariant = 'default' | 'elevated' | 'outline' | 'minimal' | 'interactive' | 'stat' | 'dental';
