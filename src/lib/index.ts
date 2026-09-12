export { supabase } from './supabase/client';
export type { Patient, Dentist, Appointment, Service, GalleryImage, Notification, Billing, Schedule, AuthUser, Session } from './supabase/types';
export { cn } from './utils';
export {
  formatDate, formatDateInput, formatTime, formatCurrency,
  generateId, truncate, isArabic, getDirection, debounce,
  capitalize, getInitials, storage, getDocumentLocale,
  STATUS_CONFIG,
} from './utils';
export { GOOGLE_FONTS_URL, fontConfig, ARABIC_FONT_STACK, ENGLISH_FONT_STACK, MONO_FONT_STACK, TYPE_SCALE, LINE_HEIGHTS, LETTER_SPACINGS } from '@/config/fonts';
export { tokens } from '@/config/design-tokens';
export type { DesignTokens, StatusColor, ButtonVariant, ButtonSize, CardVariant, NotificationType, TimerState } from '@/config/design-tokens';
export { APP_NAME, APP_VERSION, APP_URL, DEFAULT_PAGE_SIZE, APPOINTMENT_STATUSES, TIME_SLOTS, DENTAL_PRACTICE_CONFIG, STORAGE_KEYS } from '@/config/constants';
