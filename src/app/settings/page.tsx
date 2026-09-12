import { redirect } from 'next/navigation';
import { requireStaffGuard } from '@/app/guard';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardHeader, CardTitle, CardBody, EmptyState } from '@/components/ui';

export default async function SettingsPage() {
  await requireStaffGuard();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-nova-text">Settings</h1>
          <p className="text-sm text-nova-text-secondary">Manage your account and preferences</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
          </CardHeader>
          <CardBody>
            <EmptyState
              title="Settings coming soon"
              description="Full settings management will be available in the next release."
            />
          </CardBody>
        </Card>
      </div>
    </AppLayout>
  );
}
