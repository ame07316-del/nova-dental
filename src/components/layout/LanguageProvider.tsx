'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { storage } from '@/lib/utils';

// Language types
type Language = 'en' | 'ar';

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'NOVA Dental Studio',
    'nav.dashboard': 'Dashboard',
    'nav.appointments': 'Appointments',
    'nav.patients': 'Patients',
    'nav.dentists': 'Dentists',
    'nav.services': 'Services',
    'nav.gallery': 'Gallery',
    'nav.settings': 'Settings',
    'nav.book': 'Book Appointment',
    'nav.notifications': 'Notifications',
    'nav.profile': 'Profile',
    'nav.logout': 'Logout',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.search': 'Search...',
    'btn.confirm': 'Confirm',
    'btn.cancel': 'Cancel',
    'btn.save': 'Save',
    'btn.delete': 'Delete',
    'btn.edit': 'Edit',
    'btn.add': 'Add',
    'btn.book': 'Book Appointment',
    'btn.view': 'View',
    'btn.close': 'Close',
    'btn.submit': 'Submit',
    'btn.loading': 'Loading...',
    'status.confirmed': 'Confirmed',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    'status.cancelled': 'Cancelled',
    'status.in-progress': 'In Progress',
    'welcome': 'Welcome back',
    'today': "Today's Schedule",
    'upcoming': 'Upcoming Appointments',
    'search': 'Search...',
    'no-data': 'No data available',
    'error': 'Something went wrong',
    'success': 'Action completed successfully',
    'empty': 'No records found',
  },
  ar: {
    'app.name': 'عيادة نوفا لطب الأسنان',
    'nav.dashboard': 'لوحة التحكم',
    'nav.appointments': 'المواعيد',
    'nav.patients': 'المرضى',
    'nav.dentists': 'أطباء الأسنان',
    'nav.services': 'الخدمات',
    'nav.gallery': 'المعرض',
    'nav.settings': 'الإعدادات',
    'nav.book': 'حجز موعد',
    'nav.notifications': 'الإشعارات',
    'nav.profile': 'الملف الشخصي',
    'nav.logout': 'تسجيل الخروج',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.search': 'بحث...',
    'btn.confirm': 'تأكيد',
    'btn.cancel': 'إلغاء',
    'btn.save': 'حفظ',
    'btn.delete': 'حذف',
    'btn.edit': 'تعديل',
    'btn.add': 'إضافة',
    'btn.book': 'حجز موعد',
    'btn.view': 'عرض',
    'btn.close': 'إغلاق',
    'btn.submit': 'إرسال',
    'btn.loading': 'جاري التحميل...',
    'status.confirmed': 'مؤكد',
    'status.pending': 'قيد الانتظار',
    'status.completed': 'مكتمل',
    'status.cancelled': 'ملغي',
    'status.in-progress': 'قيد التنفيذ',
    'welcome': 'مرحباً بعودتك',
    'today': 'جدول اليوم',
    'upcoming': 'المواعيد القادمة',
    'search': 'بحث...',
    'no-data': 'لا توجد بيانات',
    'error': 'حدث خطأ',
    'success': 'تمت العملية بنجاح',
    'empty': 'لم يتم العثور على سجلات',
  },
};

// Language context type
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  direction: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  // Sync from storage on mount only. Reading storage in the state
  // initializer causes hydration mismatches, so default to 'ar' first.
  useEffect(() => {
    const stored = storage.get<Language>('nova-language', 'ar'); // forced ar
    if (stored === 'en' || stored === 'ar') {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    storage.set('nova-language', lang);
    setLanguageState(lang);

    // Update document direction and lang
    const root = document.documentElement;
    if (lang === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
  }, []);

  // Initialize language on mount
  useEffect(() => {
    const root = document.documentElement;
    if (language === 'ar') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'ar');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
  }, [language]);

  const t = useCallback(
    (key: string): string => {
      return translations[language][key] || key;
    },
    [language]
  );

  const direction = language === 'ar' ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        direction,
      }}
    >
      <div dir={direction} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

// Hook to use language
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

// Language switcher — مخفي: الموقع عربي 100%
export function LanguageSwitcher() {
  return (
    <div className="flex h-9 items-center rounded-lg bg-nova-muted px-3 text-sm font-medium text-nova-text">
      <span className="font-arabic">العربية</span>
    </div>
  );
}

// Translation hook for components
export function useTranslation() {
  return useLanguage();
}

// Export translations for server components
export { translations };
export type { Language };
