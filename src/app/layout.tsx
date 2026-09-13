import { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { DemoDataProvider } from '@/components/layout/DemoDataProvider';
import { AppProvider } from '@/components/layout/AppProvider';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { LanguageProvider } from '@/components/layout/LanguageProvider';
import { AuthProvider } from '@/components/layout/AuthProvider';
import { NotificationProvider } from '@/components/notifications';

// نفس خطوط Google (Inter + Noto Naskh Arabic — رخصة OFL، ملفاتهم في src/fonts/)
// لكن self-hosted:
// 1) البناء لا يعتمد على الاتصال بـ fonts.googleapis.com (كان يفشل أوفلاين)
// 2) الخطوط تُطبَّق فعليًا عبر متغيرات --font-inter / --font-arabic الموصولة في tailwind.config.js
const inter = localFont({
  src: '../fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
  style: 'normal',
  display: 'swap',
  variable: '--font-inter',
});

const notoNaskhArabic = localFont({
  src: '../fonts/noto-naskh-arabic-arabic-wght-normal.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-arabic',
});

export const metadata: Metadata = {
  title: {
    default: 'NOVA Dental Studio',
    template: '%s | NOVA Dental Studio',
  },
  description: 'Modern dental clinic operations system powered by AI-driven design intelligence.',
  keywords: ['dental', 'clinic', 'healthcare', 'patient management', 'appointments'],
  authors: [{ name: 'NOVA Dental Studio' }],
  creator: 'NOVA Dental Studio',
  publisher: 'NOVA Dental Studio',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'NOVA Dental Studio',
    description: 'Modern dental clinic operations system.',
    siteName: 'NOVA Dental Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NOVA Dental Studio',
    description: 'Modern dental clinic operations system.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0EA5E9' },
    { media: '(prefers-color-scheme: dark)', color: '#0B1F3A' },
  ],
  colorScheme: 'light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <html
        lang="ar"
        dir="rtl"
        suppressHydrationWarning
        className={`${inter.variable} ${notoNaskhArabic.variable}`}
      >
      <body className="min-h-screen bg-nova-bg font-body antialiased text-nova-text transition-colors duration-200">
        {/* Prevent RTL/LTR flash by setting direction before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var lang = localStorage.getItem('nova-language') || 'ar';
                  var dir = lang === 'ar' ? 'rtl' : 'ltr';
                  document.documentElement.setAttribute('dir', dir);
                  document.documentElement.setAttribute('lang', lang);
                } catch(e) {}
              })();
            `,
          }}
        />
        <AppProvider>
          <ThemeProvider>
            <LanguageProvider>
              <DemoDataProvider>
                <AuthProvider>
                  <NotificationProvider>
                    {children}
                  </NotificationProvider>
                </AuthProvider>
              </DemoDataProvider>
            </LanguageProvider>
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
