// design-tokens.ts — NOVA Dental Studio Type-Safe Design Tokens
// Export all design tokens as TypeScript types for use across the application

export const tokens = {
  // === Colors ===
  colors: {
    // NOVA Brand
    primary: '#0EA5E9',
    'primary-dark': '#0C4A6E',
    'primary-light': '#BAE6FD',
    secondary: '#38BDF8',
    accent: '#FBBF24',
    'accent-dark': '#B45309',
    
    // Backgrounds
    bg: '#F0F9FF',
    surface: '#FFFFFF',
    'surface-alt': '#F8FAFC',
    muted: '#E8F2F8',
    border: '#BAE6FD',
    
    // Text
    text: '#0C4A6E',
    'text-secondary': '#475569',
    'text-muted': '#94A3B8',
    
    // Semantic
    success: '#16A34A',
    warning: '#D97706',
    error: '#DC2626',
    info: '#0284C7',
    toothWhite: '#FFFBF0',
    dentine: '#C4956A',
    
    // Dark Mode
    dark: {
      bg: '#0C1628',
      surface: '#1E293B',
      'surface-alt': '#253347',
      text: '#F0F9FF',
      'text-secondary': '#94A3B8',
      'text-muted': '#64748B',
      border: '#334155',
    },
    
    // Status
    status: {
      confirmed: { bg: '#DCFCE7', text: '#166534', dot: '#16A34A' },
      pending: { bg: '#FEF3C7', text: '#92400E', dot: '#D97706' },
      inProgress: { bg: '#E0F2FE', text: '#075985', dot: '#0EA5E9' },
      completed: { bg: '#D1FAE5', text: '#065F46', dot: '#16A34A' },
      cancelled: { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626' },
      noShow: { bg: '#F1F5F9', text: '#475569', dot: '#64748B' },
      rescheduled: { bg: '#EDE9FE', text: '#5B21B6', dot: '#8B5CF6' },
      urgent: { bg: '#FEE2E2', text: '#991B1B', dot: '#DC2626' },
      vip: { bg: '#FFF7ED', text: '#9A3412', dot: '#FBBF24' },
    },
  } as const,
  
  // === Typography ===
  typography: {
    fontFamily: {
      arabic: "'Noto Naskh Arabic', serif",
      arabicBody: "'Noto Sans Arabic', sans-serif",
      display: "'Figtree', sans-serif",
      body: "'Inter', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Plus Jakarta Sans', sans-serif",
      trust: "'Lexend', sans-serif",
    },
    fontSize: {
      display: { ar: '48px', en: '48px' },
      h1: { ar: '36px', en: '36px' },
      h2: { ar: '28px', en: '28px' },
      h3: { ar: '22px', en: '22px' },
      h4: { ar: '18px', en: '18px' },
      body: { ar: '18px', en: '16px' },
      small: { ar: '16px', en: '14px' },
      caption: { ar: '14px', en: '12px' },
      label: { ar: '13px', en: '11px' },
      overline: { ar: '12px', en: '10px' },
      mono: { ar: '14px', en: '13px' },
    },
    fontWeight: {
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
    },
    lineHeight: {
      tight: 1.1,
      snug: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      ArabicBody: 1.8,
    },
    letterSpacing: {
      tighter: '-0.02em',
      tight: '-0.01em',
      normal: '0',
      wide: '0.02em',
      wider: '0.04em',
      widest: '0.08em',
    },
  } as const,
  
  // === Spacing (4px base) ===
  spacing: {
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  } as const,
  
  // === Border Radius ===
  radius: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
    btn: '8px',
    card: '12px',
    modal: '16px',
    avatar: '50%',
    badge: '9999px',
    chip: '6px',
    input: '8px',
    event: '6px',
  } as const,
  
  // === Shadows ===
  shadows: {
    none: '0 0 0 transparent',
    flat: '0 1px 2px rgba(12, 74, 110, 0.05)',
    soft: '0 1px 3px rgba(12, 74, 110, 0.06), 0 1px 2px rgba(12, 74, 110, 0.04)',
    elevated: '0 4px 6px rgba(12, 74, 110, 0.07), 0 2px 4px rgba(12, 74, 110, 0.05)',
    floating: '0 10px 15px rgba(12, 74, 110, 0.1), 0 4px 6px rgba(12, 74, 110, 0.05)',
    prominent: '0 20px 25px rgba(12, 74, 110, 0.1), 0 8px 10px rgba(12, 74, 110, 0.06)',
    neumorph: '-3px -3px 8px rgba(255, 255, 255, 0.6), 3px 3px 8px rgba(12, 74, 110, 0.08)',
    inner: 'inset 0 2px 4px rgba(12, 74, 110, 0.06)',
  } as const,
  
  // === Transitions ===
  transitions: {
    fast: '150ms ease-out',
    normal: '200ms ease-out',
    slow: '300ms ease-out',
    slower: '400ms ease-out',
  } as const,
  
  // === Animation Durations ===
  animation: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '400ms',
    skeleton: '1.5s',
    spin: '800ms',
    pulse: '2s',
    blink: '1s',
  } as const,
} as const;

// Type exports
export type DesignTokens = typeof tokens;
export type ColorTokens = typeof tokens.colors;
export type TypographyTokens = typeof tokens.typography;
export type SpacingTokens = typeof tokens.spacing;
export type RadiusTokens = typeof tokens.radius;
export type ShadowTokens = typeof tokens.shadows;
export type TransitionTokens = typeof tokens.transitions;

// Status color type
export type StatusColor = 'confirmed' | 'pending' | 'inProgress' | 'completed' | 'cancelled' | 'noShow' | 'rescheduled' | 'urgent' | 'vip';

// Button variant type
export type ButtonVariant = 'primary' | 'primary-dark' | 'secondary' | 'secondary-dark' | 'outline' | 'ghost' | 'gold' | 'gold-dark' | 'danger' | 'success' | 'small' | 'disabled';
export type ButtonSize = 'large' | 'medium' | 'small' | 'icon-only';

// Card variant type
export type CardVariant = 'default' | 'elevated' | 'outline' | 'minimal' | 'image' | 'interactive' | 'stat' | 'dental';

// Notification type
export type NotificationType = 'info' | 'success' | 'warning' | 'error' | 'appointment' | 'payment' | 'system';

// Timer state type
export type TimerState = 'countdown' | 'active' | 'break' | 'end-of-day' | 'emergency' | 'paused' | 'finished' | 'upcoming' | 'overdue';
