'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useLanguage } from './LanguageProvider';
import { useApp } from './AppProvider';
import { useTheme } from '@/components/layout/ThemeProvider';
import { useDemoData } from '@/components/layout/DemoDataProvider';

// Route key map for page titles
const routeTitleMap: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/appointments': 'appointments',
  '/patients': 'patients',
  '/dentists': 'dentists',
  '/doctors': 'dentists',
  '/services': 'services',
  '/gallery': 'gallery',
  '/settings': 'settings',
  '/book': 'book',
};

function getTitleKey(pathname: string): string {
  if (routeTitleMap[pathname]) return routeTitleMap[pathname];
  const segment = `/${pathname.split('/').filter(Boolean)[0] ?? ''}`;
  return routeTitleMap[segment] ?? 'dashboard';
}

// Header component
export function Header() {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const { sidebarOpen, toggleSidebar } = useApp();
  const pathname = usePathname();
  const { dentists } = useDemoData();
  const [searchQuery, setSearchQuery] = useState('');
  const currentDentist = dentists[0];

  const signedInName = user?.user_metadata?.first_name
    ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ''}`.trim()
    : user?.email;
  const fallbackName = currentDentist
    ? `${currentDentist.firstName} ${currentDentist.lastName}`
    : 'User';
  const displayName = signedInName || fallbackName;
  const signedInInitial =
    user?.user_metadata?.first_name?.charAt(0) || user?.email?.charAt(0);
  const displayInitial =
    signedInInitial || (currentDentist?.firstName ?? '').charAt(0) || '?';

  return (
    <header className="sticky top-0 z-20 border-b border-nova-border bg-nova-surface/80 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section */}
        <div className="flex items-center gap-3">
          {/* Mobile sidebar toggle */}
          <button
            onClick={toggleSidebar}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-nova-border bg-nova-surface text-nova-text transition-colors hover:bg-nova-muted md:hidden"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Page title */}
          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-nova-text">
              {t(`nav.${getTitleKey(pathname)}`)}
            </h1>
          </div>
        </div>

        {/* Center - Search (desktop) */}
        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <svg
              className="absolute start-3 top-1/2 -translate-y-1/2 text-nova-text-muted"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="search"
              placeholder={t('nav.search')}
              aria-label={t('nav.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-nova-border bg-nova-muted py-2 ps-10 pe-4 text-sm text-nova-text placeholder:text-nova-text-muted transition-colors focus:border-nova-primary focus:bg-nova-surface focus:outline-none focus:ring-2 focus:ring-nova-primary/20"
            />
          </div>
        </div>

        {/* Quick Links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link href="/services" className="rounded-md px-3 py-1.5 text-sm font-medium text-nova-text-muted transition-colors hover:text-nova-primary hover:bg-nova-muted">{t('nav.services')}</Link>
          <Link href="/doctors" className="rounded-md px-3 py-1.5 text-sm font-medium text-nova-text-muted transition-colors hover:text-nova-primary hover:bg-nova-muted">{t('nav.dentists')}</Link>
          <Link href="/book" className="rounded-md bg-nova-primary px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-nova-primary/90">{t('nav.book')}</Link>
        </nav>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcherCompact />

          {/* Theme Toggle */}
          <ThemeToggleCompact />

          {/* Notifications */}
          <button
            aria-label={t('nav.notifications')}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-nova-border bg-nova-surface text-nova-text transition-colors hover:bg-nova-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-nova-error" />
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-nova-primary text-white text-sm font-bold">
              {displayInitial}
            </div>
            <div className="hidden items-center md:flex">
              <span className="text-sm font-medium text-nova-text">
                {displayName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Compact theme toggle — مخفي: الموقع فاتح فقط
function ThemeToggleCompact() {
  return null;
}

// Compact language switcher — مخفي: الموقع عربي 100%
function LanguageSwitcherCompact() {
  return (
    <div className="flex h-9 items-center rounded-lg bg-nova-muted px-3 text-xs font-medium text-nova-text">
      <span className="font-arabic">العربية</span>
    </div>
  );
}
