'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTheme as UseNextTheme } from 'next-themes';
import { storage } from '@/lib/utils';

// Theme hook for components that need more control
export function useTheme() {
  const { theme, setTheme, resolvedTheme } = UseNextTheme();

  const toggleTheme = useCallback(() => {
    const current = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(current);
  }, [resolvedTheme, setTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
  };
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value;
      window.localStorage.setItem(key, JSON.stringify(newValue));
      return newValue;
    });
  }, [key]);

  const removeValue = useCallback(() => {
    window.localStorage.removeItem(key);
    setStoredValue(initialValue);
  }, [key, initialValue]);

  return { value: storedValue, setValue, removeValue };
}

// Window size hook
export function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Click outside hook
export function useClickOutside<T extends HTMLElement>(onClickOutside: () => void) {
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref && !ref.contains(event.target as Node)) {
        onClickOutside();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClickOutside, ref]);

  return ref;
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
