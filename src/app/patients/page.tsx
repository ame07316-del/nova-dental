import { redirect } from 'next/navigation';
import { requireStaffGuard } from '@/app/guard';
import { AppLayout } from '@/components/layout/AppLayout';
import { PatientList } from '@/components/patients/PatientList';

export default async function PatientsPage() {
  await requireStaffGuard();

  return (
    <AppLayout>
      <PatientList />
    </AppLayout>
  );
}
