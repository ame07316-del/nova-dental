'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { services as allServices } from '@/data/demo';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Hero section
export function HeroSection() {
  const { language, direction } = useLanguage();
  const router = useRouter();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-nova-primary-light via-nova-bg to-nova-surface">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PGZpbHRlciBpZD0ibm9uZSI+PGZhdGE+IDwvZmF0YT48L2ZpbHRlcj48cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIGZpbHRlciJ1cmwoIm5vbmUpIiBmaWxsPSIjMGZmMDAwIiBvZmZzZXQ9IjAuMCIvPjwvc3ZnPg==')] opacity-[0.03]" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-32 lg:px-8 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <Badge variant="primary" className="mb-4">NOVA Dental Studio</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-nova-text sm:text-5xl lg:text-6xl">
              {language === 'ar'
                ? 'ابتسامتك تستحق العناية المثالية'
                : 'Your Smile Deserves Perfect Care'}
            </h1>
            <p className="mt-6 text-lg text-nova-text-secondary leading-relaxed">
              {language === 'ar'
                ? 'عيادة طب الأسنان الحديثة بقيادة أطباء محترفين. خدمات شاملة تشمل التجميل، التقويم، والجراحة.'
                : 'Modern dental clinic led by professional dentists. Comprehensive services including cosmetic, orthodontic, and surgical care.'}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => router.push('/book')}>
                {language === 'ar' ? 'احجز موعداً الآن' : 'Book an Appointment'}
              </Button>
              <Button variant="outline" size="lg" onClick={() => router.push('/services')}>
                {language === 'ar' ? 'استكشف الخدمات' : 'Explore Services'}
              </Button>
            </div>
          </div>
          <div className="hidden lg:flex lg:items-center lg:justify-center">
            <div className="relative h-80 w-full">
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-gradient-to-br from-nova-primary to-nova-primary-dark p-8 shadow-prominent">
                <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" />
                  <line x1="15" y1="9" x2="15.01" y2="9" />
                </svg>
              </div>
              <div className="absolute -left-4 top-8 rounded-2xl bg-nova-surface p-4 shadow-soft" dir="ltr">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-nova-text">500+ Treatments</span>
                </div>
              </div>
              <div className="absolute -right-4 top-20 rounded-2xl bg-nova-surface p-4 shadow-soft" dir="ltr">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-nova-primary-light">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" strokeWidth="2">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-nova-text">Expert Dentists</span>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-2xl bg-nova-surface p-4 shadow-soft" dir="ltr">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-nova-text">15 Min Wait</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Features section
export function FeaturesSection() {
  const { language } = useLanguage();

  const features = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4.27 16.2C5.12 17.2 6.31 18 7.62 18c.6 0 1-.18 1.41-.54l2.1-2.1" /><path d="M19.73 7.8C18.88 6.8 17.69 6 16.38 6c-.6 0-1 .18-1.41.54l-2.1 2.1" /><path d="M12 12h.01" />
        </svg>
      ),
      title: language === 'ar' ? 'أطباء خبراء' : 'Expert Dentists',
      description: language === 'ar' ? 'فريق من أطباء الأسنان المتخصصين ذوي الخبرة العالية' : 'A team of highly experienced specialized dentists',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
      title: language === 'ar' ? 'حجز مواعيد سهل' : 'Easy Booking',
      description: language === 'ar' ? 'احجز موعدك أونلاين خلال دقائق' : 'Book your appointment online in minutes',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 6a6 6 0 0 1 0 12" />
        </svg>
      ),
      title: language === 'ar' ? 'خدمة على مدار الساعة' : 'Round-the-Clock Service',
      description: language === 'ar' ? 'نقدم خدماتنا في أيام الأسبوع من الأحد إلى الخميس' : 'We provide services Sunday to Thursday',
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: language === 'ar' ? 'خصوصية وأمان' : 'Privacy & Security',
      description: language === 'ar' ? 'بياناتك محمية وفق أعلى معايير الأمان' : 'Your data is protected with the highest security standards',
    },
  ];

  return (
    <section className="bg-nova-surface py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold text-nova-text sm:text-4xl">
          {language === 'ar' ? 'لماذا نوفا؟' : 'Why Choose NOVA?'}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-nova-text-secondary">
          {language === 'ar'
            ? 'نوفر تجربة طب أسنان شاملة مع أحدث التقنيات وأطباء محترفين'
            : 'We provide a comprehensive dental experience with cutting-edge technology and professional dentists'}
        </p>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index} variant="interactive" className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-nova-primary-light text-nova-primary-dark">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-nova-text">{feature.title}</h3>
              <p className="mt-2 text-sm text-nova-text-secondary">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA section
export function CTASection() {
  const { language, direction } = useLanguage();
  const router = useRouter();

  return (
    <section className="bg-gradient-to-r from-nova-primary to-nova-primary-dark py-24">
      <div className="mx-auto max-w-4xl px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          {language === 'ar' ? 'هل أنت مستعد لابتسامة مثالية؟' : 'Ready for a Perfect Smile?'}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-nova-primary-light">
          {language === 'ar'
            ? 'احجز موعدك الآن ودع أطبائنا المحترفين يعيدون لك ابتسامتك'
            : 'Book your appointment now and let our professional dentists restore your smile'}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" variant="gold" onClick={() => router.push('/book')}>
            {language === 'ar' ? 'احجز الآن' : 'Book Now'}
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" onClick={() => router.push('/doctors')}>
            {language === 'ar' ? 'تعرف على أطبائنا' : 'Meet Our Doctors'}
          </Button>
        </div>
      </div>
    </section>
  );
}
