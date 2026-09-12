import { redirect } from 'next/navigation';
import { getSessionUser } from '@/app/actions';
import { AppLayout } from '@/components/layout/AppLayout';
import { SecretaryDashboardContent } from '@/components/secretary/SecretaryDashboardContent';

export const dynamic = 'force-dynamic';

export default async function SecretaryDashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect('/login');
  }

  if (user.role !== 'secretary' && user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <AppLayout>
      <SecretaryDashboardContent />
    </AppLayout>
  );
}