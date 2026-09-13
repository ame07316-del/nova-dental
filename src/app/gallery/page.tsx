'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';

export default function GalleryPage() {
  return (
    <AppLayout requireAuth={false} showSidebar={false}>
      <GalleryGrid />
    </AppLayout>
  );
}
