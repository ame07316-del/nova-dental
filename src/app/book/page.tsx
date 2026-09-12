'use client';

import { Suspense } from 'react';
import { BookingFlow } from '@/components/patient/BookingFlow';

export default function BookPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-nova-text-muted">Loading booking...</div>}>
      <BookingFlow />
    </Suspense>
  );
}
