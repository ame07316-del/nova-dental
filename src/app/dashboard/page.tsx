import { redirect } from 'next/navigation';
import { getSessionUser } from '@/app/actions';
import { AppLayout } from '@/components/layout/AppLayout';
import { DoctorDashboardContent } from '@/components/doctor/DoctorDashboardContent';
import { SecretaryDashboardContent } from '@/components/secretary/SecretaryDashboardContent';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  const isStaff = user.role === 'doctor' || user.role === 'secretary' || user.role === 'admin';
  if (!isStaff) {
    redirect('/');
  }

  // Admins use the secretary desk.
  if (user.role === 'admin') {
    redirect('/dashboard/secretary');
  }

  const showSecretary = user.role === 'secretary';

  return (
    <AppLayout>
      {showSecretary ? <SecretaryDashboardContent /> : <DoctorDashboardContent />}
    </AppLayout>
  );
}