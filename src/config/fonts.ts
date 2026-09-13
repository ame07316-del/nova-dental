// fonts.ts — Arabic & English Font Configuration for NOVA Dental Studio
// Font pairing based on typography catalog entries:
// - Entry #26: "Arabic Elegant" (Noto Naskh Arabic + Noto Sans Arabic)
// - Entry #30: "Medical Clean" (Figtree + Noto Sans)
// - Entry #16: "Corporate Trust" (Lexend + Source Sans 3)

export const FONTS = {
  // Primary heading font for Arabic
  arabicHeading: {
    family: "'Noto Naskh Arabic', serif",
    weights: [400, 500, 600, 700],
    styles: ['normal', 'italic'],
    subsets: ['arabic'],
    display: 'swap',
  },
  
  // Body font for Arabic
  arabicBody: {
    family: "'Noto Sans Arabic', sans-serif",
    weights: [300, 400, 500, 600, 700],
    styles: ['normal'],
    subsets: ['arabic'],
    display: 'swap',
  },
  
  // English display heading
  display: {
    family: "'Figtree', sans-serif",
    weights: [400, 500, 600, 700, 800],
    styles: ['normal'],
    subsets: ['latin'],
    display: 'swap',
  },
  
  // English body
  body: {
    family: "'Inter', sans-serif",
    weights: [300, 400, 500, 600, 700],
    styles: ['normal'],
    subsets: ['latin'],
    display: 'swap',
  },
  
  // Data/mono font
  mono: {
    family: "'JetBrains Mono', monospace",
    weights: [400, 500, 600],
    styles: ['normal'],
    subsets: ['latin'],
    display: 'swap',
  },
  
  // Label/caption font
  label: {
    family: "'Plus Jakarta Sans', sans-serif",
    weights: [400, 500, 600, 700],
    styles: ['normal'],
    subsets: ['latin'],
    display: 'swap',
  },
  
  // Corporate/Trust font (alternative)
  trust: {
    family: "'Lexend', sans-serif",
    weights: [300, 400, 500, 600, 700],
    styles: ['normal'],
    subsets: ['latin'],
    display: 'swap',
  },
} as const;

// Font loading configuration for Next.js
// NOTE: Inter + Noto Naskh Arabic are now self-hosted via next/font/local
// (see src/app/layout.tsx + src/fonts/). The URL below is kept only as a
// reference for any additional optional fonts (Figtree, JetBrains Mono, …).
export const GOOGLE_FONTS_URL = [
  "https://fonts.googleapis.com/css2?",
  "family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap",
  "&family=Noto+Sans+Arabic:wght@300;400;500;600;700&display=swap",
  "&family=Figtree:wght@400;500;600;700;800&display=swap",
  "&family=Inter:wght@300;400;500;600;700&display=swap",
  "&family=JetBrains+Mono:wght@400;500;600&display=swap",
  "&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
  "&family=Lexend:wght@300;400;500;600;700&display=swap",
].join('');

export const fontConfig = {
  subsets: ['arabic', 'latin'],
  display: 'swap' as const,
  variable: '--font-nova',
};

// Font fallback chain for Arabic
export const ARABIC_FONT_STACK = "'Noto Naskh Arabic', 'Noto Sans Arabic', 'Traditional Arabic', 'Geeza Pro', sans-serif";

// Font fallback chain for English
export const ENGLISH_FONT_STACK = "'Figtree', 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// Font fallback chain for data/mono
export const MONO_FONT_STACK = "'JetBrains Mono', 'Courier New', Consolas, monospace";

// Type scale ratios (modular scale: 1.25 ratio)
export const TYPE_SCALE = {
  display: 48,   // 3rem
  h1: 36,        // 2.25rem
  h2: 28,        // 1.75rem
  h3: 22,        // 1.375rem
  h4: 18,        // 1.125rem
  body: 16,      // 1rem
  small: 14,     // 0.875rem
  caption: 12,   // 0.75rem
  label: 11,     // 0.6875rem
  overline: 10,  // 0.625rem
  mono: 13,      // 0.8125rem
};

// Line heights per language
export const LINE_HEIGHTS = {
  arabic: {
    display: 1.1,
    h1: 1.2,
    h2: 1.3,
    h3: 1.4,
    body: 1.8,    // Arabic needs more leading
    small: 1.6,
    caption: 1.5,
  },
  english: {
    display: 1.1,
    h1: 1.2,
    h2: 1.3,
    h3: 1.4,
    body: 1.6,
    small: 1.5,
    caption: 1.4,
  },
};

// Letter spacing per language
export const LETTER_SPACINGS = {
  arabic: {
    display: '-0.02em',
    heading: '-0.01em',
    body: '0',
    label: '0.02em',
  },
  english: {
    display: '-0.02em',
    heading: '-0.01em',
    body: '0',
    label: '0.04em',
    uppercase: '0.08em',
  },
};
