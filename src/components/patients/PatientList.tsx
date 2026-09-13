'use client';

import { useState } from 'react';
import { useLiveData } from '@/hooks/useLiveData';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { Avatar } from '@/components/dental/AvatarsAndMore';
import type { Patient } from '@/lib/supabase/types';

interface PatientListProps {
  data?: Patient[];
  loading?: boolean;
}

export function PatientList({ data, loading: loadingProp }: PatientListProps) {
  const live = useLiveData();
  const patients = data ?? live.patients;
  const loading = loadingProp ?? live.loading;
  const [query, setQuery] = useState('');

  const q = query.trim().toLowerCase();
  const filtered = q
    ? patients.filter((p) =>
        `${p.firstName ?? ''} ${p.lastName ?? ''} ${p.email ?? ''} ${p.phone ?? ''}`.toLowerCase().includes(q)
      )
    : patients;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Patients</h1>
          <p className="text-sm text-nova-text-secondary">Search and manage patient records</p>
        </div>
        <Input
          type="search"
          aria-label="Search patients"
          placeholder="Search name, email, phone…"
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
        <EmptyState title="No patients found" description={q ? `No match for “${query}”.` : 'No patient records yet.'} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.id} variant="interactive">
              <CardBody className="flex items-center gap-3">
                <Avatar name={`${p.firstName ?? ''} ${p.lastName ?? ''}`} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-nova-text">
                    {p.firstName} {p.lastName}
                  </p>
                  <p className="truncate text-xs text-nova-text-muted">{p.email ?? p.phone ?? '—'}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
