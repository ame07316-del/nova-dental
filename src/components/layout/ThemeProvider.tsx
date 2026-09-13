'use client';

import { createContext, useContext, type ReactNode } from 'react';

// Theme قفلناه على الفاتح فقط حسب طلب العميل — مفيش دارك مود
type Theme = 'light';
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light';
  isDark: false;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // دائماً فاتح — نضبط الـ DOM مرة واحدة
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    (document.documentElement.style as any).colorScheme = 'light';
    try { localStorage.setItem('nova-theme', 'light'); } catch {}
  }

  return (
    <ThemeContext.Provider
      value={{
        theme: 'light',
        resolvedTheme: 'light',
        isDark: false,
        setTheme: () => {},
        toggleTheme: () => {},
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// زر الثيم مخفي — الموقع فاتح فقط
export function ThemeToggle() {
  return null;
}
