// Application constants and configuration

export const APP_NAME = 'NOVA Dental Studio';
export const APP_VERSION = '1.0.0';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Sidebar configuration
export const SIDEBAR_WIDTH_EXPANDED = 256; // 256px = w-64
export const SIDEBAR_WIDTH_COLLAPSED = 64; // 64px = w-16
export const SIDEBAR_COLLAPSE_THRESHOLD = 768; // md breakpoint

// Header configuration
export const HEADER_HEIGHT = 64; // h-16

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 25, 50];

// Appointment statuses
export const APPOINTMENT_STATUSES = [
  'confirmed',
  'pending',
  'in-progress',
  'completed',
  'cancelled',
  'no-show',
  'rescheduled',
  'waiting',
  'delayed',
] as const;

// Time slots for appointments
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00',
];

// Service categories
export const SERVICE_CATEGORIES = [
  'Preventive',
  'Restorative',
  'Cosmetic',
  'Orthodontics',
  'Oral Surgery',
  'Emergency',
] as const;

// Notification settings
export const NOTIFICATION_AUTO_DISMISS = 5000; // 5 seconds
export const NOTIFICATION_MAX_VISIBLE = 5;

// Debounce delay for search inputs
export const SEARCH_DEBOUNCE_MS = 300;

// Date formats
export const DATE_FORMAT = {
  short: 'MMM DD, YYYY',
  long: 'DD MMMM YYYY',
  time: 'hh:mm A',
  datetime: 'DD MMMM YYYY, hh:mm A',
};

// Supabase storage keys
export const STORAGE_KEYS = {
  THEME: 'nova-theme',
  LANGUAGE: 'nova-language',
  AUTH: 'nova-auth',
  SESSION: 'nova-session',
} as const;

// Breakpoints (Tailwind compatible)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Dental practice specific
export const DENTAL_PRACTICE_CONFIG = {
  maxAppointmentsPerDay: 20,
  appointmentDuration: 30, // minutes
  bufferTime: 15, // minutes between appointments
  openingHours: {
    start: '09:00',
    end: '18:00',
  },
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
};
