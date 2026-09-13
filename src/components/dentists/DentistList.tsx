'use client';

import { useState } from 'react';
import { useLiveData } from '@/hooks/useLiveData';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/dental/AvatarsAndMore';
import type { Dentist } from '@/lib/supabase/types';

interface DentistListProps {
  data?: Dentist[];
  loading?: boolean;
}

export function DentistList({ data, loading: loadingProp }: DentistListProps) {
  const live = useLiveData();
  const dentists = data ?? live.dentists;
  const loading = loadingProp ?? live.loading;
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? dentists.filter((d) =>
        `${d.firstName ?? ''} ${d.lastName ?? ''} ${d.specialty ?? ''}`.toLowerCase().includes(q)
      )
    : dentists;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Dentists</h1>
          <p className="text-sm text-nova-text-secondary">Clinic doctors and specialties</p>
        </div>
        <Input
          type="search"
          aria-label="Search dentists"
          placeholder="Search name or specialty…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="sm:w-64"
        />
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}><CardBody><Skeleton className="h-20 w-full" /></CardBody></Card>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No dentists found" description={q ? `No match for “${query}”.` : 'No dentist records yet.'} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <Card key={d.id} variant="interactive">
              <CardBody className="flex items-center gap-3">
                <Avatar name={`${d.firstName ?? ''} ${d.lastName ?? ''}`} src={d.avatarUrl ?? undefined} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-nova-text">
                    {d.firstName} {d.lastName}
                  </p>
                  <p className="truncate text-xs text-nova-text-muted">{d.specialty ?? 'General'}</p>
                  {typeof d.rating === 'number' && (
                    <p className="text-xs text-nova-text-secondary">★ {d.rating.toFixed(1)}</p>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
