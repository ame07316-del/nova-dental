import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to merge Tailwind CSS classes with conflict resolution
 * Uses tailwind-merge to prevent class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date for display based on locale
 */
export function formatDate(
  date: string | Date,
  locale: 'en' | 'ar' = 'en',
  options: Intl.DateTimeFormatOptions = {}
): string {
  const d = new Date(date);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', defaultOptions).format(d);
}

/**
 * Format a date for input (YYYY-MM-DD)
 */
export function formatDateInput(date: string | Date): string {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

/**
 * Format time (HH:MM)
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

/**
 * Format currency based on locale
 */
export function formatCurrency(amount: number, currency: string = 'SAR', locale: 'en' | 'ar' = 'en'): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

/**
 * Check if a string is Arabic
 */
export function isArabic(text: string): boolean {
  return /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(text);
}

/**
 * Get text direction based on content
 */
export function getDirection(text: string): 'ltr' | 'rtl' {
  return isArabic(text) ? 'rtl' : 'ltr';
}

/**
 * Safe DOM access
 */
export function safeQuerySelector<T extends Element>(selector: string): T | null {
  if (typeof document === 'undefined') return null;
  return document.querySelector<T>(selector);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Get initials from name
 */
export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/**
 * Status badge configuration
 */
export const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  confirmed: { bg: '#DCFCE7', text: '#166534', dot: '#16A34A', label: 'Confirmed' },
  pending: { bg: '#FEF3C7', text: '#92400E', dot: '#D97706', label: 'Pending' },
  'in-progress': { bg: '#E0F2FE', text: '#075985', dot: '#0EA5E9', label: 'In Progress' },
  completed: { bg: '#D1FAE5', text: '#065F46', dot: '#16A34A', label: 'Completed' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626', label: 'Cancelled' },
  'no-show': { bg: '#F1F5F9', text: '#475569', dot: '#64748B', label: 'No Show' },
  rescheduled: { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6', label: 'Rescheduled' },
  urgent: { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626', label: 'Urgent' },
  vip: { bg: '#FFF7ED', text: '#9A3412', dot: '#FBBF24', label: 'VIP' },
};

/**
 * Check if running in browser
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get current locale from document
 */
export function getDocumentLocale(): 'en' | 'ar' {
  if (typeof document === 'undefined') return 'en';
  return document.documentElement.lang === 'ar' ? 'ar' : 'en';
}

/**
 * Storage utility with SSR safety
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: (key: string, value: unknown): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('localStorage write error:', e);
    }
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error('localStorage remove error:', e);
    }
  },
};
