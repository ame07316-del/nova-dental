'use client';

import Image from 'next/image';
import { useLiveData } from '@/hooks/useLiveData';
import { Card, CardBody } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

interface GalleryGridProps {
  images?: GalleryImage[];
  loading?: boolean;
}

export function GalleryGrid({ images, loading: loadingProp }: GalleryGridProps) {
  const live = useLiveData();
  const loading = loadingProp ?? live.loading;
  // Gallery has no dedicated table yet: derive from dentist avatars when
  // no explicit images are passed, so the page never shows fake gradients.
  const items: GalleryImage[] =
    images ??
    live.dentists
      .filter((d) => d.avatarUrl)
      .map((d) => ({
        id: d.id,
        url: d.avatarUrl as string,
        alt: `${d.firstName ?? ''} ${d.lastName ?? ''}`.trim() || 'Clinic photo',
      }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-nova-text">Gallery</h1>
        <p className="text-sm text-nova-text-secondary">Clinic photos and smile results</p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Card key={i}><CardBody><Skeleton className="h-48 w-full" /></CardBody></Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="No photos yet" description="Clinic photos will appear here once uploaded to storage." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((img) => (
            <Card key={img.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={img.url} alt={img.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover" />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
