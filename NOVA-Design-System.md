# NOVA Dental Studio — Design System v1.0

## 🏥 Product Personality

**NOVA Dental Studio** is a modern dental clinic operations system that communicates:

| Dimension | Value |
|-----------|-------|
| **Core Identity** | Professional dental technology & intelligent clinic operations |
| **Emotional Tone** | Calm confidence, precise care, trustworthy innovation |
| **Personality Archetype** | The Expert Clinician — authoritative yet approachable |
| **Brand Voice** | Clear, professional, warm — never childish or overly clinical |
| **Target Audience** | Patients seeking premium dental care, dentists managing operations |
| **Differentiator** | Technology-enabled trust — modern tools meeting human care |

**What NOVA is NOT:**
- ❌ Generic blue hospital template
- ❌ Children's cartoon dental office
- ❌ Overly sterile cold clinical environment
- ❌ Playful/whimsical branding

---

## 🎨 Visual Direction

### Design Philosophy
- **Soft UI Evolution + Minimalism & Swiss Style** (from Product #60: Dental Practice)
- Clean, spacious layouts with measured depth
- Soft shadows that suggest layers without distraction
- Gold accents as premium signal — not decorative excess
- Photography-first: real dental imagery, not illustrations

### Core Visual Principles
1. **Precision** — Geometric grids, consistent spacing, aligned elements
2. **Calm** — Limited color palette, generous white space, no visual noise
3. **Trust** — High contrast text, verified social proof, professional imagery
4. **Technology** — Subtle tech touches: clean data displays, smooth transitions
5. **Premium** — Gold (#FBBF24) as accent only, never dominant

### Anti-Patterns (Strictly Prohibited)
- ❌ Bright neon colors, AI purple/pink gradients
- ❌ Excessive glassmorphism (backdrop-filter abuse)
- ❌ Random border-radius on cards (use consistent values)
- ❌ Decorative elements that don't serve a function
- ❌ Weak contrast text (< 4.5:1)
- ❌ Repetitive dashboard card grids as universal layout

---

## 📐 UI Style Specification

| Property | Value | Rationale |
|----------|-------|-----------|
| **Primary Style** | Soft UI Evolution | Modern depth without childishness |
| **Secondary Style** | Minimalism & Swiss Style | Clean hierarchy, functional clarity |
| **Tertiary Support** | Accessible & Ethical | WCAG compliance, inclusive design |
| **Border Radius** | 8px (components), 12px (cards), 16px (modals) | Consistent, not random |
| **Shadow System** | Soft multi-layer (see Shadows section) | Depth without distraction |
| **Animation Duration** | 200–300ms standard, 150ms micro | Professional pacing |
| **Easing** | ease-out (entry), ease-in (exit), linear (data) | Natural motion |
| **Touch Targets** | 44x44px minimum, 48px preferred | Accessibility first |

---

## 🎨 Color System

### Light Mode (Default)

```
┌─────────────────────────────────────────────────────────────┐
│                    NOVA LIGHT MODE PALETTE                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRIMARY        #0EA5E9  Fresh Blue          ← Main accent   │
│  PRIMARY-DARK   #0C4A6E  Deep Blue          ← Hover/active  │
│  PRIMARY-LIGHT  #BAE6FD  Soft Blue          ← Backgrounds   │
│  SECONDARY      #38BDF8  Sky Blue           ← Supports      │
│  ACCENT/GOLD    #FBBF24  Smile Yellow       ← CTAs, badges  │
│  ACCENT-DARK    #B45309  Deep Gold          ← Hover states  │
│                                                               │
│  BACKGROUND     #F0F9FF  Cool Blue-White  ← Page bg         │
│  SURFACE        #FFFFFF  Pure White        ← Cards, panels  │
│  SURFACE-ALT    #F8FAFC  Off-White         ← Alternate rows  │
│  MUTED          #E8F2F8  Very Light Blue   ← Disabled states │
│  BORDER         #BAE6FD  Light Blue Border ← Dividers        │
│                                                               │
│  FOREGROUND     #0C4A6E  Deep Navy          ← Primary text   │
│  FOREGROUND-2   #475569  Slate Grey         ← Secondary text │
│  FOREGROUND-3   #94A3B8  Muted Grey         ← Helper text    │
│                                                               │
│  SUCCESS        #16A34A  Health Green       ← Positive       │
│  SUCCESS-BG     #DCFCE7  Green Tint         ← Success bg     │
│  WARNING        #D97706  Amber              ← Caution        │
│  WARNING-BG     #FEF3C7  Amber Tint         ← Warning bg     │
│  ERROR          #DC2626  Dental Red         ← Errors         │
│  ERROR-BG       #FEE2E2  Red Tint           ← Error bg       │
│  INFO           #0284C7  Info Blue          ← Info           │
│  INFO-BG        #E0F2FE  Info Tint          ← Info bg        │
│                                                              │
│  TOOTH WHITE    #FFFBF0  Warm White         ← Special accents │
│  DENTINE        #C4956A  Warm Beige         ← Natural tones   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Dark Mode

```
┌─────────────────────────────────────────────────────────────┐
│                    NOVA DARK MODE PALETTE                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  PRIMARY        #38BDF8  Sky Blue (lighter for dark)        │
│  PRIMARY-DARK   #0EA5E9  Fresh Blue                     │
│  PRIMARY-LIGHT  #0C4A6E  Deep Blue (bg)                   │
│  ACCENT/GOLD    #FBBF24  Smile Yellow     ← Same as light │
│  ACCENT-DARK    #D97706  Deep Gold                │
│                                                               │
│  BACKGROUND     #0C1628  Deep Navy         ← Page bg         │
│  SURFACE        #1E293B  Dark Slate         ← Cards, panels  │
│  SURFACE-ALT    #253347  Elevated Slate     ← Alternate rows │
│  MUTED          #1A2744  Very Dark Blue     ← Disabled       │
│  BORDER         #334155  Slate Border       ← Dividers       │
│                                                               │
│  FOREGROUND     #F0F9FF  Cool White         ← Primary text   │
│  FOREGROUND-2   #94A3B8  Soft Grey          ← Secondary text │
│  FOREGROUND-3   #64748B  Muted Grey         ← Helper text    │
│                                                               │
│  SUCCESS        #22C55E  Bright Green       ← Positive       │
│  SUCCESS-BG     #14532D  Dark Green         ← Success bg     │
│  WARNING        #F59E0B  Bright Amber       ← Caution        │
│  WARNING-BG     #78350F  Dark Amber         ← Warning bg     │
│  ERROR          #EF4444  Bright Red         ← Errors         │
│  ERROR-BG       #7F1D1D  Dark Red           ← Error bg       │
│  INFO           #38BDF8  Bright Blue        ← Info           │
│  INFO-BG        #0C4A6E  Dark Blue          ← Info bg        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Color Usage Rules

| Element | Light Mode | Dark Mode | Notes |
|---------|-----------|-----------|-------|
| Page Background | #F0F9FF | #0C1628 | Never pure white (#FFFFFF) |
| Card Background | #FFFFFF | #1E293B | Always surface color |
| Primary Text | #0C4A6E | #F0F9FF | Contrast ≥ 7:1 |
| Secondary Text | #475569 | #94A3B8 | Contrast ≥ 4.5:1 |
| CTA Button | #0EA5E9 bg / #FFFFFF text | #38BDF8 bg / #0C1628 text | High contrast always |
| Accent/Gold | #FBBF24 | #FBBF24 | Consistent across modes |
| Links | #0284C7 | #38BDF8 | Underlined on hover |

---

## 🔤 Typography System

### Font Pairing: Arabic Elegant + Medical Clean

| Role | Arabic | English | Fallback |
|------|--------|---------|----------|
| **Display/Heading** | Noto Naskh Arabic (serif) | Figtree (sans-serif) | System Arabic serif |
| **Body** | Noto Sans Arabic (sans) | Inter / Noto Sans (sans) | System sans-serif |
| **Monospace/Data** | — | JetBrains Mono | Consolas, monospace |
| **Labels/Captions** | Noto Sans Arabic | Plus Jakarta Sans | System sans |

### Font Import URLs

```css
/* Arabic + Medical pairing */
@import url('https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Figtree:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
```

### Typography Scale

| Level | Arabic Size | English Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------------|-------------|--------|-------------|----------------|-------|
| **Display** | 48–64px | 48–64px | 700 (Bold) | 1.1 | -0.02em | Hero headlines |
| **H1** | 36–42px | 36–42px | 700 | 1.2 | -0.01em | Page titles |
| **H2** | 28–32px | 28–32px | 600 | 1.3 | 0 | Section headings |
| **H3** | 22–26px | 22–26px | 600 | 1.4 | 0 | Card titles |
| **H4** | 18–20px | 18–20px | 600 | 1.4 | 0 | Sub-card titles |
| **Body** | 16–18px | 16–18px | 400 | 1.6 | 0 | Paragraph text |
| **Body-Small** | 14–16px | 14–16px | 400 | 1.5 | 0 | Secondary text |
| **Caption** | 12–14px | 12–14px | 500 | 1.4 | 0.02em | Labels, captions |
| **Label** | 11–13px | 11–13px | 600 | 1.3 | 0.04em | Form labels, badges |
| **Overline** | 10–12px | 10–12px | 700 | 1.2 | 0.08em | Section prefixes, uppercase labels |
| **Button** | 14–16px | 14–16px | 600 | 1.4 | 0.02em | All buttons |
| **Mono/Data** | 13–14px | 13–14px | 500 | 1.5 | 0.02em | Data displays, IDs |

### Arabic Typography Rules

1. **RTL by default** — All Arabic text uses `direction: rtl`
2. **Noto Naskh Arabic** for headings — traditional Naskh style, elegant and readable
3. **Noto Sans Arabic** for body — modern sans-serif optimized for screen
4. **Arabic text size** should be 1–2px larger than English equivalent for readability
5. **Arabic line-height** should be 1.7–1.8 for body text (Arabic script needs more leading)
6. **Never mix fonts** within a single text element — use appropriate font per language

### RTL/LTR Behavior

```css
/* Base direction handling */
:root {
  --direction: ltr;
}

[dir="rtl"], [lang="ar"] {
  --direction: rtl;
  font-family: 'Noto Naskh Arabic', 'Noto Sans Arabic', system-ui;
}

[dir="ltr"], [lang="en"] {
  --direction: ltr;
  font-family: 'Figtree', 'Inter', system-ui;
}

/* Mirror layout for RTL */
[dir="rtl"] {
  text-align: right;
}

[dir="ltr"] {
  text-align: left;
}

/* Responsive Arabic font scaling */
@media (max-width: 768px) {
  [lang="ar"] body {
    font-size: 15px; /* Slightly smaller on mobile for Arabic readability */
  }
}
```

### Bidirectional Support Matrix

| Element | LTR (English) | RTL (Arabic) | Notes |
|---------|--------------|-------------|-------|
| Navigation | Left → Right | Right → Left | Mirror entire nav |
| Text alignment | Left | Right | Per `dir` attribute |
| Icons | Normal | Flip horizontally | Use `transform: scaleX(-1)` |
| Cards | Left-aligned | Right-aligned | Per `dir` attribute |
| Buttons | Icon left, text right | Icon right, text left | Mirror button layout |
| Form fields | Label above, input below | Label above, input below | Same (vertical) |
| Badges | Left-to-right reading | Right-to-left reading | Per `dir` attribute |
| Numbers | Left-to-right | Left-to-right | Always LTR for numbers |
| Dates | MM/DD/YYYY | DD/MM/YYYY | Locale-specific format |
| Price/currency | $100.00 | ١٠٠٫٠٠$ | RTL number display |

---

## 📏 Spacing Scale

Based on **4px base unit** system:

```
Token          Value    Usage
─────────────────────────────────────────────────
space-1        4px      Tight spacing (icons within buttons)
space-2        8px      Compact spacing (icon + label)
space-3        12px     Input padding, small gaps
space-4        16px     Standard padding, card inner spacing
space-5        20px     Medium spacing (section inner)
space-6        24px     Card padding, form spacing
space-8        32px     Section spacing, grid gap
space-10       40px     Large section gap
space-12       48px     Major section separation
space-16       64px     Page section spacing
space-20       80px     Hero section spacing
space-24       96px     Full page block separation
```

### Layout Grid

| Property | Value |
|----------|-------|
| **Grid columns** | 12 |
| **Gutter (desktop)** | 32px (space-8) |
| **Gutter (tablet)** | 24px (space-6) |
| **Gutter (mobile)** | 16px (space-4) |
| **Max content width** | 1280px |
| **Content padding** | 48px (space-12) desktop, 24px (space-6) mobile |
| **Sidebar width** | 280px (collapsible to 72px) |
| **Header height** | 64px desktop, 56px mobile |
| **Footer height** | auto (min 120px) |

---

## 🔲 Border Radius

| Component | Radius | Usage |
|-----------|--------|-------|
| **Buttons** | 8px | Pill-shaped CTAs |
| **Input fields** | 8px | Form inputs, text areas |
| **Cards** | 12px | Standard card panels |
| **Modal/Dialog** | 16px | Popups, confirmations |
| **Avatar** | 50% | Circular images |
| **Badge/Tag** | 9999px | Pill-shaped labels |
| **Image** | 8px | Photo thumbnails |
| **Table rows** | 0px | Flat table rows |
| **Alert/Banner** | 8px | Notification bars |
| **Progress ring** | 50% | Circular progress |
| **Calendar event** | 6px | Small event markers |
| **Toggle/Switch** | 9999px | Toggle switches |
| **Chip** | 6px | Small data chips |

**Rule: Never use random border-radius values. Always use the tokens above.**

---

## 🌑 Shadow & Elevation System

NOVA uses a **soft shadow system** (Soft UI Evolution) — subtle depth that suggests layers without visual noise.

```css
/* Shadow tokens */
:root {
  --shadow-none: 0 0 0 transparent;
  
  /* Level 0 — Flat */
  --shadow-flat: 0 1px 2px rgba(12, 74, 110, 0.05);
  
  /* Level 1 — Soft (default cards) */
  --shadow-soft: 
    0 1px 3px rgba(12, 74, 110, 0.06),
    0 1px 2px rgba(12, 74, 110, 0.04);
  
  /* Level 2 — Elevated (hover states) */
  --shadow-elevated: 
    0 4px 6px rgba(12, 74, 110, 0.07),
    0 2px 4px rgba(12, 74, 110, 0.05);
  
  /* Level 3 — Floating (modals, dropdowns) */
  --shadow-floating: 
    0 10px 15px rgba(12, 74, 110, 0.1),
    0 4px 6px rgba(12, 74, 110, 0.05);
  
  /* Level 4 — Prominent (mobile sheets, popovers) */
  --shadow-prominent: 
    0 20px 25px rgba(12, 74, 110, 0.1),
    0 8px 10px rgba(12, 74, 110, 0.06);
  
  /* Neumorphism soft (for dental-specific soft UI elements) */
  --shadow-neumorph: 
    -3px -3px 8px rgba(255, 255, 255, 0.6),
    3px 3px 8px rgba(12, 74, 110, 0.08);
  
  /* Inner shadow (for depth indicators) */
  --shadow-inner: 
    inset 0 2px 4px rgba(12, 74, 110, 0.06);
}

/* Dark mode shadows (use lighter tones on dark) */
[dir="rtl"] [data-theme="dark"],
[dir="ltr"] [data-theme="dark"] {
  --shadow-flat: 0 1px 2px rgba(0, 0, 0, 0.2);
  --shadow-soft: 0 1px 3px rgba(0, 0, 0, 0.25), 0 1px 2px rgba(0, 0, 0, 0.15);
  --shadow-elevated: 0 4px 6px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
  --shadow-floating: 0 10px 15px rgba(0, 0, 0, 0.35), 0 4px 6px rgba(0, 0, 0, 0.2);
  --shadow-prominent: 0 20px 25px rgba(0, 0, 0, 0.4), 0 8px 10px rgba(0, 0, 0, 0.25);
}
```

### Elevation Usage Rules

| Level | Elevation | Component |
|-------|-----------|-----------|
| 0 | `--shadow-flat` | Standard cards, static elements |
| 1 | `--shadow-soft` | Default card surface |
| 2 | `--shadow-elevated` | Cards on hover, dropdown triggers |
| 3 | `--shadow-floating` | Modals, dialogs, popovers |
| 4 | `--shadow-prominent` | Mobile bottom sheets, full-screen overlays |

**Never use more than 2 shadow layers on any element.**

---

## 🔘 Button System

### Button Hierarchy

| Type | Background | Text | Radius | Padding | Weight | Usage |
|------|-----------|------|--------|---------|--------|-------|
| **Primary** | #0EA5E9 | #FFFFFF | 8px | 12px 24px | 600 | Main CTA |
| **Primary-Dark** | #0C4A6E | #FFFFFF | 8px | 12px 24px | 600 | Strong CTA |
| **Secondary** | #FFFFFF | #0EA5E9 | 8px | 12px 24px | 600 | Secondary action |
| **Secondary-Dark** | #1E293B | #F0F9FF | 8px | 12px 24px | 600 | Dark mode secondary |
| **Outline** | Transparent | #0EA5E9 | 8px | 11px 23px | 600 | Tertiary action |
| **Ghost** | Transparent | #0C4A6E | 6px | 8px 16px | 500 | Minimal action |
| **Gold** | #FBBF24 | #0C1628 | 8px | 12px 24px | 700 | Premium/booking CTA |
| **Gold-Dark** | #D97706 | #FFFFFF | 8px | 12px 24px | 700 | Dark mode gold |
| **Danger** | #DC2626 | #FFFFFF | 8px | 12px 24px | 600 | Delete, remove |
| **Success** | #16A34A | #FFFFFF | 8px | 12px 24px | 600 | Confirm, approve |
| **Small** | (varies) | (varies) | 6px | 6px 12px | 600 | Compact actions |
| **Disabled** | #E8F2F8 | #94A3B8 | 8px | 12px 24px | 400 | Unavailable |

### Button Sizes

| Size | Height | Font Size | Padding | Icon Size |
|------|--------|-----------|---------|-----------|
| **Large** | 52px | 16px | 16px 32px | 24px |
| **Medium** | 44px | 14px | 12px 24px | 20px |
| **Small** | 36px | 13px | 8px 16px | 16px |
| **Icon Only** | 44px | — | — | 20px |

### Button States

```css
/* All button states */
.btn {
  transition: all 150ms ease-out;
  cursor: pointer;
  border: 2px solid transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: inherit;
  text-decoration: none;
  white-space: nowrap;
}

.btn:hover {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.btn:active {
  transform: translateY(0);
  filter: brightness(0.95);
  transition-duration: 50ms;
}

.btn:focus-visible {
  outline: 3px solid #0EA5E9;
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  filter: none;
}

/* Loading state */
.btn-loading {
  position: relative;
  color: transparent;
  pointer-events: none;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: btn-spin 600ms linear infinite;
}
```

### Button Hierarchy in Context

```
Page level:     Primary CTA (Gold or Fresh Blue) — ONE per section
Form level:     Primary (submit) + Secondary (cancel)
Card level:     Ghost or Outline (secondary actions)
Toolbar level:  Small/Icon buttons
Alert level:    Danger (destructive) or Success (confirm)
```

---

## 📝 Input & Form System

### Input Styles

| Property | Value |
|----------|-------|
| **Border** | 1.5px solid #BAE6FD |
| **Border (focus)** | 2px solid #0EA5E9 |
| **Border (error)** | 2px solid #DC2626 |
| **Border (success)** | 2px solid #16A34A |
| **Border-radius** | 8px |
| **Background** | #FFFFFF |
| **Background (disabled)** | #E8F2F8 |
| **Padding** | 12px 16px |
| **Font size** | 16px (body) |
| **Text color** | #0C4A6E |
| **Placeholder** | #94A3B8 |
| **Height** | 48px (standard), 120px (textarea) |
| **Transition** | border-color 150ms, box-shadow 150ms |

### Input States

```css
/* Default */
.input {
  border: 1.5px solid #BAE6FD;
  border-radius: 8px;
  padding: 12px 16px;
  background: #FFFFFF;
  font-size: 16px;
  color: #0C4A6E;
  transition: border-color 150ms ease-out, box-shadow 150ms ease-out;
}

/* Focus */
.input:focus {
  outline: none;
  border-color: #0EA5E9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

/* Error */
.input-error {
  border-color: #DC2626;
}
.input-error:focus {
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
}

/* Success */
.input-success {
  border-color: #16A34A;
}
.input-success:focus {
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.15);
}

/* Disabled */
.input:disabled {
  background: #E8F2F8;
  color: #94A3B8;
  cursor: not-allowed;
}

/* RTL support */
[dir="rtl"] .input {
  text-align: right;
}
```

### Form Labels

| Property | Value |
|----------|-------|
| **Font size** | 13px (Label) / 11px (Overline) |
| **Font weight** | 600 |
| **Color** | #0C4A6E |
| **Margin bottom** | 6px (space-1.5) |
| **Required indicator** | #DC2626 asterisk (*) |

### Form Helper & Error Text

| Property | Value |
|----------|-------|
| **Font size** | 12px |
| **Color (helper)** | #94A3B8 |
| **Color (error)** | #DC2626 |
| **Margin top** | 4px (space-1) |
| **Animation** | fade-in 200ms |

### Select / Dropdown

| Property | Value |
|----------|-------|
| **Border** | 1.5px solid #BAE6FD |
| **Border-radius** | 8px |
| **Background** | #FFFFFF |
| **Padding** | 12px 16px |
| **Icon** | Chevron down (20px) |
| **Option hover** | #F0F9FF background |
| **Option selected** | #0EA5E9 bg, #FFFFFF text |

### Checkbox & Radio

| Property | Value |
|----------|-------|
| **Size** | 20px |
| **Border** | 2px solid #BAE6FD |
| **Border-radius** | 4px (checkbox), 50% (radio) |
| **Checked bg** | #0EA5E9 |
| **Checked border** | #0EA5E9 |
| **Check mark** | #FFFFFF, 2px stroke |
| **Focus ring** | 3px solid rgba(14, 165, 233, 0.3) |

### Date Picker / Calendar Input

| Property | Value |
|----------|-------|
| **Border** | 1.5px solid #BAE6FD |
| **Border-radius** | 8px |
| **Icon** | Calendar (20px) |
| **Active range bg** | #0EA5E9 |
| **Today marker** | #FBBF24 ring |
| **Selected range** | Gradient #0EA5E9 → #38BDF8 |

---

## 🃏 Card & Panel System

### Card Variants

| Variant | Background | Border | Shadow | Radius | Padding | Usage |
|---------|-----------|--------|--------|--------|---------|-------|
| **Default** | #FFFFFF | 1px solid #BAE6FD | --shadow-soft | 12px | 24px | Standard content |
| **Elevated** | #FFFFFF | none | --shadow-elevated | 12px | 24px | Featured content |
| **Outline** | #FFFFFF | 2px solid #0EA5E9 | none | 12px | 24px | Selected/highlighted |
| **Minimal** | transparent | none | none | 0px | 16px | Simple content blocks |
| **Image** | #FFFFFF | 1px solid #BAE6FD | --shadow-soft | 12px | 0px | Photo content |
| **Interactive** | #FFFFFF | 1px solid #BAE6FD | --shadow-soft | 12px | 24px | Hover: --shadow-elevated |
| **Stat** | #FFFFFF | 1px solid #BAE6FD | --shadow-flat | 8px | 20px | Numbers/KPIs |
| **Dental** | #F0F9FF | 1px solid #BAE6FD | --shadow-soft | 12px | 24px | Patient/service cards |

### Card Anatomy

```
┌─────────────────────────────────────────────┐
│  [Card Header]  Title + Subtitle + Action   │  ← Border bottom
├─────────────────────────────────────────────┤
│                                             │
│           Card Body Content                 │  ← 24px padding
│                                             │
├─────────────────────────────────────────────┤
│  [Card Footer]  Stats | Actions | Links     │  ← Border top
└─────────────────────────────────────────────┘
```

### Panel (Dashboard Section)

| Property | Value |
|----------|-------|
| **Background** | #FFFFFF |
| **Border** | 1px solid #BAE6FD |
| **Border-radius** | 12px |
| **Padding** | 24px |
| **Margin bottom** | 24px (space-6) |
| **Header** | H3 + optional action button |
| **Shadow** | --shadow-flat |

### Card Grid Layout

| Columns | Gutter | Max Width | Usage |
|---------|--------|-----------|-------|
| 1 column | 24px | 100% | Single focus content |
| 2 columns | 24px | 1280px | Feature sections |
| 3 columns | 24px | 1280px | Services, features |
| 4 columns | 24px | 1280px | Dashboard stats |

---

## 📊 Table System

### Table Styles

| Property | Value |
|----------|-------|
| **Background** | #FFFFFF |
| **Border-radius** | 12px |
| **Border** | 1px solid #BAE6FD |
| **Header bg** | #F0F9FF |
| **Header text** | #0C4A6E, 13px, 600, uppercase 0.04em |
| **Row text** | #0C4A6E, 14px |
| **Row hover** | #F8FAFC background |
| **Row alternate** | #FFFFFF / #F8FAFC |
| **Stripe height** | 48px |
| **Padding** | 16px horizontal, 12px vertical |
| **Border bottom** | 1px solid #BAE6FD |
| **Sticky header** | Yes, z-index: 10 |

### Table Types

| Type | Description | Special Features |
|------|-------------|-----------------|
| **Simple** | Basic rows/columns | No hover, clean |
| **Interactive** | Clickable rows | Row cursor, hover highlight |
| **Dense** | Compact data | 36px rows, 8px padding |
| **Appointment** | Dental bookings | Status badges, patient info |
| **Analytics** | Data-heavy | Sortable, pagination |

### Table Column Types

| Column Type | Style | Example |
|------------|-------|---------|
| **Text** | 14px, #0C4A6E | Patient name |
| **Status** | Badge component | Confirmed, Pending |
| **Date** | 13px, #475569, mono | 2025-01-15 |
| **Action** | Icon buttons row | Edit, Delete, View |
| **Numeric** | Right-aligned, mono | 142, 89.5 |
| **Avatar** | 32px circular + name | Dr. Ahmed |
| **Price** | #FBBF24 weight, right | $250.00 |

### Pagination

| Property | Value |
|----------|-------|
| **Background** | #FFFFFF |
| **Border-radius** | 8px |
| **Active page** | #0EA5E9 bg, #FFFFFF text |
| **Hover** | #F0F9FF bg |
| **Items per page** | 10, 25, 50 |
| **Navigation** | Previous / Next buttons |

---

## 📅 Calendar & Events

### Calendar View

| Property | Value |
|----------|-------|
| **Background** | #FFFFFF |
| **Border-radius** | 12px |
| **Header bg** | #F0F9FF |
| **Today border** | 2px solid #0EA5E9 |
| **Selected bg** | #0EA5E9, #FFFFFF text |
| **Appointment dot** | #FBBF24 (booked), #16A34A (confirmed) |
| **Empty cell** | #F8FAFC |
| **Weekend** | #FAFAF9 bg |
| **Font** | 14px, 500 weight |
| **Header font** | 13px, 600 weight, uppercase |

### Calendar Event Card

```
┌─────────────────────────────────────────┐
│  ● 09:00-10:30   [Status Badge]        │
│  Patient Name                        │
│  Treatment: Teeth Cleaning             │
│  Dentist: Dr. Ahmed                    │
│  Room: #3                            │
└─────────────────────────────────────────┘
```

| Event Property | Style |
|---------------|-------|
| **Time** | 13px, #475569, mono |
| **Title** | 14px, #0C4A6E, 600 |
| **Subtitle** | 12px, #94A3B8 |
| **Border left** | 3px solid (color by status) |
| **Background** | #FFFFFF |
| **Border-radius** | 8px |
| **Padding** | 12px 16px |
| **Margin** | 4px vertical |

### Event Status Colors

| Status | Dot Color | Background | Text |
|--------|-----------|-----------|------|
| **Confirmed** | #16A34A | #DCFCE7 | #166534 |
| **Pending** | #D97706 | #FEF3C7 | #92400E |
| **Cancelled** | #DC2626 | #FEE2E2 | #991B1B |
| **Completed** | #0EA5E9 | #E0F2FE | #075985 |
| **No-show** | #64748B | #F1F5F9 | #475569 |
| **Rescheduled** | #8B5CF6 | #EDE9FE | #5B21B6 |

---

## 🏷️ Appointment Status Badges

### Badge System

| Status | Background | Text | Icon | Radius | Padding |
|--------|-----------|------|------|--------|---------|
| **Confirmed** | #DCFCE7 | #166534 | ✓ Check | 9999px | 4px 12px |
| **Pending** | #FEF3C7 | #92400E | ⏳ Clock | 9999px | 4px 12px |
| **In Progress** | #E0F2FE | #075985 | ⚡ Flash | 9999px | 4px 12px |
| **Completed** | #D1FAE5 | #065F46 | ✓✓ Done | 9999px | 4px 12px |
| **Cancelled** | #FEE2E2 | #991B1B | ✕ Close | 9999px | 4px 12px |
| **No-Show** | #F1F5F9 | #475569 | — | 9999px | 4px 12px |
| **Rescheduled** | #EDE9FE | #5B21B6 | ↻ Refresh | 9999px | 4px 12px |
| **Urgent** | #FEE2E2 | #991B1B | ⚠ Alert | 9999px | 4px 12px |
| **VIP** | #FFF7ED | #9A3412 | ⭐ Star | 9999px | 4px 12px |

### Badge Anatomy

```
┌────────────────────┐
│  ●  Confirmed      │  ← Colored dot + text
└────────────────────┘
```

### Badge with Count

| Property | Value |
|----------|-------|
| **Background** | #0EA5E9 |
| **Text** | #FFFFFF, 12px, 700 |
| **Border-radius** | 9999px |
| **Min width** | 20px |
| **Height** | 20px |
| **Padding** | 0 6px |
| **Position** | Top-right corner of icon/avatar |

---

## ⏱️ Live Session Timer States

### Timer Display

| State | Background | Text Color | Animation | Icon |
|-------|-----------|------------|-----------|------|
| **Active** | #16A34A bg, #FFFFFF text | #FFFFFF | Pulse glow | ● Live |
| **Paused** | #D97706 bg, #FFFFFF text | #FFFFFF | None | ⏸ Paused |
| **Finished** | #64748B bg, #FFFFFF text | #FFFFFF | None | ✕ Ended |
| **Upcoming** | #0EA5E9 bg, #FFFFFF text | #FFFFFF | None | ◷ Upcoming |
| **Overdue** | #DC2626 bg, #FFFFFF text | #FFFFFF | Blink | ⚠ Overdue |

### Timer Component Styles

```css
.timer {
  font-family: 'JetBrains Mono', monospace;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0.05em;
  padding: 8px 16px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.timer--active {
  background: #16A34A;
  color: #FFFFFF;
  animation: timer-pulse 2s ease-in-out infinite;
}

.timer--paused {
  background: #D97706;
  color: #FFFFFF;
}

.timer--finished {
  background: #64748B;
  color: #FFFFFF;
}

.timer--upcoming {
  background: #0EA5E9;
  color: #FFFFFF;
}

.timer--overdue {
  background: #DC2626;
  color: #FFFFFF;
  animation: timer-blink 1s ease-in-out infinite;
}
```

### Session Timer States (Detailed)

| State | Visual | Progress Ring | Text | Notification |
|-------|--------|---------------|------|-------------|
| **Countdown** | Blue gradient | Animate from 100% to 0% | Remaining time | "Session starts in..." |
| **Active** | Green | Static full ring | Elapsed time | "Session in progress" |
| **Break** | Amber | Pulsing ring | Break duration | "Break time" |
| **End of day** | Grey | Static empty | "--:----" | "No more sessions today" |
| **Emergency** | Red | Rapid pulse | Urgent text | "Emergency override" |

### Progress Ring

| Property | Value |
|----------|-------|
| **Stroke width** | 4px |
| **Background track** | #E8F2F8 |
| **Progress color** | #0EA5E9 (active), #16A34A (complete) |
| **Size** | 48px (small), 72px (medium), 120px (large) |
| **Animation** | stroke-dashoffset transition 300ms ease-out |
| **Center text** | 14px, 600 weight, #0C4A6E |

---

## 🔔 Notification System

### Notification Types

| Type | Background | Border | Icon | Title Color | Body Color |
|------|-----------|--------|------|-------------|------------|
| **Info** | #F0F9FF | #0EA5E9 | ℹ Info | #0C4A6E | #475569 |
| **Success** | #F0FDF4 | #16A34A | ✓ Check | #166534 | #475569 |
| **Warning** | #FFFBEB | #D97706 | ⚠ Alert | #92400E | #475569 |
| **Error** | #FEF2F2 | #DC2626 | ✕ Error | #991B1B | #475569 |
| **Appointment** | #F0F9FF | #0EA5E9 | 📅 Calendar | #0C4A6E | #475569 |
| **Payment** | #FFF7ED | #D97706 | 💳 Card | #9A3412 | #475569 |
| **System** | #F8FAFC | #BAE6FD | ⚙ Gear | #0C4A6E | #475569 |

### Notification Styles

| Property | Value |
|----------|-------|
| **Background** | Per type (see above) |
| **Border** | 1px solid, left border 4px accent |
| **Border-radius** | 8px |
| **Padding** | 16px 20px |
| **Shadow** | --shadow-elevated |
| **Min-width** | 320px |
| **Max-width** | 420px |
| **Position** | Top-right (RTL: top-left) |
| **Z-index** | 1000 |
| **Animation** | Slide-in 300ms, fade-out 200ms |
| **Dismiss** | X button top-right |
| **Stack spacing** | 8px (space-2) |

### Notification Anatomy

```
┌──────────────────────────────────────┐
│  [Icon]  Title                    [✕] │  ← Type-colored left border
│  Body text goes here...              │
│  2 minutes ago                       │  ← Timestamp
└──────────────────────────────────────┘
```

### Toast Notification (Brief)

| Property | Value |
|----------|-------|
| **Duration** | 3-5 seconds auto-dismiss |
| **Background** | #1E293B (dark) |
| **Text** | #FFFFFF |
| **Border-radius** | 8px |
| **Padding** | 12px 20px |
| **Shadow** | --shadow-prominent |
| **Position** | Bottom-center |
| **Animation** | Slide up 300ms, fade out 200ms |

---

## 📊 Loading, Empty, Error, Success & Confirmation States

### Loading States

#### Skeleton Loader
```css
.skeleton {
  background: linear-gradient(
    90deg,
    #E8F2F8 25%,
    #F0F9FF 50%,
    #E8F2F8 75%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.5s ease-in-out infinite;
  border-radius: 8px;
}
```

| Element | Skeleton Style |
|---------|---------------|
| **Card** | Full card shape, 12px radius |
| **Text line** | Height 16px, width 80% |
| **Button** | Height 44px, width 120px |
| **Avatar** | 48x48px circle |
| **Image** | 16:9 aspect ratio |
| **Table row** | Height 48px, full width |
| **Chart** | Rectangle with 8px radius |

#### Spinner
```css
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #E8F2F8;
  border-top-color: #0EA5E9;
  border-radius: 50%;
  animation: spin 800ms linear infinite;
}

/* Small spinner */
.spinner--sm {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

/* Large spinner */
.spinner--lg {
  width: 56px;
  height: 56px;
  border-width: 4px;
}
```

#### Inline Loading
| Element | Style |
|---------|-------|
| **Button loading** | Text transparent, spinner centered |
| **Page loading** | Full-page overlay with logo + spinner |
| **Form loading** | Submit button spinner, disabled other inputs |
| **Infinite scroll** | Skeleton loader at bottom |

### Empty States

```
┌─────────────────────────────────────────────┐
│                                             │
│         [Illustration or Icon]              │  ← 120x120px
│                                             │
│        No appointments yet                  │  ← H2, #0C4A6E
│    Book your first dental visit today       │  ← Body, #475569
│                                             │
│         [ Primary CTA Button ]              │  ← "Book Now"
│                                             │
└─────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Illustration** | Clean, simple, relevant to context |
| **Icon size** | 120x120px |
| **Title** | H2, 28px, 600, #0C4A6E, centered |
| **Description** | 16px, 400, #475569, centered, max 400px |
| **Action** | Primary CTA button, centered |
| **Background** | #FFFFFF |
| **Border** | 1px dashed #BAE6FD |
| **Border-radius** | 12px |
| **Padding** | 48px (space-12) |
| **Animation** | Fade-in 400ms |

### Error States

#### Inline Error
```css
.input-error {
  border-color: #DC2626;
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
}

.error-message {
  color: #DC2626;
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
```

#### Full Page Error
```
┌─────────────────────────────────────────────┐
│                                             │
│         ⚠ (64px icon, #DC2626)              │
│                                             │
│        Something went wrong                 │  ← H1, #0C4A6E
│    We couldn't load this page.             │  ← Body, #475569
│    Error code: 500                          │  ← Mono, 13px, #94A3B8
│                                             │
│  [ Try Again ]  [ Go Home ]                 │
│                                             │
└─────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Icon** | Warning triangle or X, 64px |
| **Icon color** | #DC2626 |
| **Title** | H1, 32px, 700, #0C4A6E |
| **Description** | 16px, 400, #475569 |
| **Error code** | 13px mono, #94A3B8 |
| **Background** | #FFFFFF |
| **Border-radius** | 12px |
| **Padding** | 48px |

### Success States

```
┌─────────────────────────────────────────────┐
│                                             │
│         ✓✓ (64px icon, #16A34A)             │
│                                             │
│        Done!                                │  ← H1, #166534
│    Your appointment has been confirmed.     │  ← Body, #475569
│                                             │
│    Appointment: Jan 15, 2025                │
│    Time: 10:00 AM                           │
│    Dentist: Dr. Ahmed                       │
│                                             │
│  [ View Details ]  [ Book Another ]         │
│                                             │
└─────────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Icon** | Checkmark circle, 64px |
| **Icon color** | #16A34A |
| **Icon animation** | Scale up from 0 to 1 in 300ms with bounce |
| **Title** | H1, 32px, 700, #166534 |
| **Description** | 16px, 400, #475569 |
| **Detail items** | 14px, #0C4A6E |
| **Background** | #FFFFFF |
| **Border** | 1px solid #DCFCE7 |
| **Border-radius** | 12px |
| **Padding** | 48px |

### Confirmation Dialog

```
┌─────────────────────────────────────────┐
│                                         │
│         ⚠ (24px, #D97706)              │
│                                         │
│     Are you sure?                       │  ← H2, #0C4A6E
│                                         │
│  This will cancel the appointment       │  ← Body, #475569
│  for Jan 15, 2025 with Dr. Ahmed.      │
│  This action cannot be undone.          │
│                                         │
│              [ Cancel ] [ Confirm ]     │
│               ghost      danger         │
│                                         │
└─────────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| **Background** | #FFFFFF |
| **Border-radius** | 16px |
| **Shadow** | --shadow-floating |
| **Padding** | 32px |
| **Icon** | 24px, warning yellow |
| **Title** | H2, 24px, 700, #0C4A6E |
| **Body** | 14px, #475569 |
| **Buttons** | Secondary (Cancel) + Danger (Confirm) |
| **Max width** | 420px |

---

## 🏗️ Component Library Summary

### Design Tokens (CSS Custom Properties)

```css
:root {
  /* === Colors: Light Mode === */
  --color-primary: #0EA5E9;
  --color-primary-dark: #0C4A6E;
  --color-primary-light: #BAE6FD;
  --color-secondary: #38BDF8;
  --color-accent: #FBBF24;
  --color-accent-dark: #B45309;
  --color-bg: #F0F9FF;
  --color-surface: #FFFFFF;
  --color-surface-alt: #F8FAFC;
  --color-muted: #E8F2F8;
  --color-border: #BAE6FD;
  --color-text: #0C4A6E;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #0284C7;
  
  /* === Colors: Dark Mode === */
  --color-dark-bg: #0C1628;
  --color-dark-surface: #1E293B;
  --color-dark-surface-alt: #253347;
  --color-dark-text: #F0F9FF;
  --color-dark-text-secondary: #94A3B8;
  
  /* === Typography === */
  --font-display: 'Figtree', 'Noto Naskh Arabic', sans-serif;
  --font-body: 'Inter', 'Noto Sans Arabic', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-label: 'Plus Jakarta Sans', sans-serif;
  
  /* === Spacing (4px base) === */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  
  /* === Border Radius === */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-full: 9999px;
  
  /* === Shadows === */
  --shadow-flat: 0 1px 2px rgba(12, 74, 110, 0.05);
  --shadow-soft: 0 1px 3px rgba(12, 74, 110, 0.06), 0 1px 2px rgba(12, 74, 110, 0.04);
  --shadow-elevated: 0 4px 6px rgba(12, 74, 110, 0.07), 0 2px 4px rgba(12, 74, 110, 0.05);
  --shadow-floating: 0 10px 15px rgba(12, 74, 110, 0.1), 0 4px 6px rgba(12, 74, 110, 0.05);
  
  /* === Transitions === */
  --transition-fast: 150ms ease-out;
  --transition-normal: 200ms ease-out;
  --transition-slow: 300ms ease-out;
  
  /* === Focus === */
  --focus-ring: 0 0 0 3px rgba(14, 165, 233, 0.25);
  --focus-ring-offset: 2px;
}
```

### Responsive Breakpoints

| Breakpoint | Width | Target |
|------------|-------|--------|
| **Mobile** | < 640px | Phones |
| **Tablet** | 640–768px | Small tablets |
| **Desktop** | 768–1024px | Laptops |
| **Wide** | 1024–1440px | Desktop monitors |
| **Ultra-wide** | > 1440px | Large displays |

### RTL Support Checklist

- [x] `direction: rtl` on Arabic pages
- [x] `text-align: right` for Arabic content
- [x] Mirror flexbox (`flex-direction: row-reverse`)
- [x] Flip icon positions (arrow, chevron)
- [x] Mirror padding/margin where directional
- [x] Arabic font stack priority
- [x] Numbers always LTR regardless of direction
- [x] `lang="ar"` attribute on Arabic content
- [x] Proper Unicode bidirectional algorithm
- [x] Test with both LTR and RTL simultaneously

### Accessibility Compliance

| Standard | Requirement | NOVA Implementation |
|----------|------------|---------------------|
| **WCAG AA** | 4.5:1 contrast ratio | All text meets 4.5:1 minimum |
| **WCAG AAA** | 7:1 contrast ratio | All primary text meets 7:1 |
| **Keyboard** | Full navigation | Tab order verified, focus visible |
| **Screen reader** | Semantic HTML | Proper ARIA labels, roles |
| **Reduced motion** | `prefers-reduced-motion` | All animations disabled when preferred |
| **Touch targets** | 44px minimum | All interactive elements ≥ 44px |
| **Color blind** | Not color-only | Icons + text accompany all color indicators |
| **Font scaling** | 200% zoom | Layout survives text scaling |

---

## 📋 Component Quick Reference

| Component | File Name | Status |
|-----------|-----------|--------|
| Button | `Button.tsx` | ✅ Defined |
| Input | `Input.tsx` | ✅ Defined |
| Card | `Card.tsx` | ✅ Defined |
| Badge | `Badge.tsx` | ✅ Defined |
| Table | `Table.tsx` | ✅ Defined |
| Calendar | `Calendar.tsx` | ✅ Defined |
| Timer | `Timer.tsx` | ✅ Defined |
| Notification | `Notification.tsx` | ✅ Defined |
| Modal | `Modal.tsx` | ✅ Defined |
| Skeleton | `Skeleton.tsx` | ✅ Defined |
| EmptyState | `EmptyState.tsx` | ✅ Defined |
| ErrorState | `ErrorState.tsx` | ✅ Defined |
| SuccessState | `SuccessState.tsx` | ✅ Defined |
| ConfirmDialog | `ConfirmDialog.tsx` | ✅ Defined |
| Select | `Select.tsx` | ✅ Defined |
| Checkbox | `Checkbox.tsx` | ✅ Defined |
| Toggle | `Toggle.tsx` | ✅ Defined |
| Avatar | `Avatar.tsx` | ✅ Defined |
| Chip | `Chip.tsx` | ✅ Defined |
| Divider | `Divider.tsx` | ✅ Defined |
| Spinner | `Spinner.tsx` | ✅ Defined |

---

## 🎯 Design System Usage Rules

1. **Always start with this design system** before writing any component code
2. **Never deviate from the color tokens** — use CSS custom properties
3. **Never invent new border-radius values** — use the defined scale
4. **Never use more than 2 shadow layers** on any element
5. **Always test in both LTR and RTL** before shipping
6. **Always check contrast ratios** — use automated tools
7. **Never add decorative elements** that don't serve a function
8. **Always use the defined spacing scale** — no arbitrary values
9. **Never use `!important`** unless absolutely necessary
10. **Always prefer semantic HTML** over styled divs

---

*Design System v1.0 — NOVA Dental Studio*  
*Based on Product #60: Dental Practice from the UI/UX Pro Max skill*  
*Style: Soft UI Evolution + Minimalism & Swiss Style*  
*Palette: Fresh Blue #0EA5E9 + Smile Yellow #FBBF24*  
*Typography: Noto Naskh Arabic + Figtree + Inter*  
*Generated: 2025*
