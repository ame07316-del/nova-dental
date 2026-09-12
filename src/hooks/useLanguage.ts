'use client';

import { useCallback } from 'react';
import { useLanguage } from '@/components/layout/LanguageProvider';
import type { Language } from '@/components/layout/LanguageProvider';

// Extended language hook with additional utilities
export function useTranslation() {
  const { language, setLanguage, t, direction } = useLanguage();

  const isRTL = direction === 'rtl';
  const isLTR = direction === 'ltr';

  const switchLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  }, [language, setLanguage]);

  return {
    language,
    setLanguage,
    t,
    direction,
    isRTL,
    isLTR,
    switchLanguage,
    isArabic: language === 'ar',
    isEnglish: language === 'en',
  };
}

// Hook for formatting numbers in RTL context
export function useRTLNumber(value: number, options?: Intl.NumberFormatOptions) {
  const { language, direction } = useLanguage();

  const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', options).format(value);

  return {
    formatted,
    dir: direction,
    isRTL: direction === 'rtl',
  };
}

// Hook for language-aware formatting
export function useLocale() {
  const { language } = useLanguage();

  const locale = language === 'ar' ? 'ar-EG' : 'en-US';
  const dateFormat = language === 'ar' ? 'DD/MM/YYYY' : 'MM/DD/YYYY';
  const timeFormat = language === 'ar' ? 'hh:mm a' : 'hh:mm A';

  return { locale, dateFormat, timeFormat };
}
