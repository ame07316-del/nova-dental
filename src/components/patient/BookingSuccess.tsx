'use client';

import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useLanguage } from '@/components/layout/LanguageProvider';
import { useRouter } from 'next/navigation';

// Booking success page
export function BookingSuccess() {
  const { language } = useLanguage();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 via-nova-bg to-nova-surface p-4">
      <Card variant="elevated" className="max-w-md w-full overflow-hidden">
        <CardBody className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-nova-text">
            {language === 'ar' ? 'تم حجز الموعد بنجاح!' : 'Appointment Booked!'}
          </h1>
          <p className="mt-3 text-nova-text-secondary">
            {language === 'ar'
              ? 'لقد تم حجز موعدك بنجاح. سنتواصل معك قريباً لتأكيد الموعد.'
              : 'Your appointment has been booked successfully. We&apos;ll contact you soon to confirm.'}
          </p>

          <div className="mt-6 space-y-3 rounded-lg bg-nova-muted/30 p-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-sm text-nova-text-muted">{language === 'ar' ? 'رقم الحجز' : 'Booking Reference'}</span>
              <span className="text-sm font-bold text-nova-primary">#NVA-20260911-001</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-nova-text-muted">{language === 'ar' ? 'الدفع' : 'Payment'}</span>
              <span className="text-sm font-semibold text-nova-text">{language === 'ar' ? 'عند العيادة' : 'At Clinic'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-nova-text-muted">{language === 'ar' ? 'الإلغاء' : 'Cancellation'}</span>
              <span className="text-sm font-semibold text-nova-text">{language === 'ar' ? 'قبل 24 ساعة' : '24 hours before'}</span>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button className="w-full" onClick={() => router.push('/')}>
              {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => router.push('/book')}>
              {language === 'ar' ? 'حجز موعد آخر' : 'Book Another Appointment'}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
