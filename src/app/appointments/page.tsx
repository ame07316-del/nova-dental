import { redirect } from 'next/navigation';
import { requireStaffGuard } from '@/app/guard';
import { AppLayout } from '@/components/layout/AppLayout';
import AppointmentsContent from '@/components/appointments/AppointmentsPage';

export default async function AppointmentsPage() {
  await requireStaffGuard();

  return (
    <AppLayout>
      <AppointmentsContent />
    </AppLayout>
  );
}
