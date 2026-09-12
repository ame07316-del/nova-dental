import { redirect } from 'next/navigation';
import { requireStaffGuard } from '@/app/guard';
import { AppLayout } from '@/components/layout/AppLayout';
import { DentistList } from '@/components/dentists/DentistList';

export default async function DentistsPage() {
  await requireStaffGuard();

  return (
    <AppLayout>
      <DentistList />
    </AppLayout>
  );
}
