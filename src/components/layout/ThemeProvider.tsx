'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useTheme as UseTheme } from 'next-themes';
import { storage } from '@/lib/utils';

// Theme types
type Theme = 'light' | 'dark' | 'system';

// Theme context type
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme: setNextTheme, resolvedTheme } = UseTheme();

  // Initialize from storage — default to light mode for demo polish.
  useEffect(() => {
    const stored = storage.get<Theme>('nova-theme', 'light');
    setNextTheme(stored);
    setMounted(true);
  }, [setNextTheme]);

  // Sync theme changes to storage
  const handleSetTheme = useCallback((newTheme: Theme) => {
    storage.set('nova-theme', newTheme);
    setNextTheme(newTheme);
  }, [setNextTheme]);

  const toggleTheme = useCallback(() => {
    const current = resolvedTheme === 'dark' ? 'light' : 'dark';
    handleSetTheme(current as Theme);
  }, [resolvedTheme, handleSetTheme]);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    const resolved = resolvedTheme ?? 'light';

    root.setAttribute('data-theme', resolved);
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);

    if (resolved === 'dark') {
      root.style.colorScheme = 'dark';
    } else {
      root.style.colorScheme = 'light';
    }
  }, [resolvedTheme, mounted]);

  // Prevent flash of wrong theme
  useEffect(() => {
    if (!mounted) return;
    const stored = storage.get<Theme>('nova-theme', 'light');
    const root = document.documentElement;

    if (stored === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const resolved = prefersDark ? 'dark' : 'light';
      root.setAttribute('data-theme', resolved);
      root.style.colorScheme = resolved;
    } else {
      root.setAttribute('data-theme', stored);
      root.style.colorScheme = stored;
    }
  }, [mounted]);

  return (
    <ThemeContext.Provider
      value={{
        theme: (theme ?? 'system') as Theme,
        resolvedTheme: (resolvedTheme ?? 'light') as 'light' | 'dark',
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

// Theme toggle button component
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-nova-border bg-nova-surface text-nova-text transition-all duration-200 hover:bg-nova-muted hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nova-primary"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {resolvedTheme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
