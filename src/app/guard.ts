import { redirect } from 'next/navigation';
import { getSessionUser } from '@/app/actions';

/**
 * Server-side guard: redirects to `/login` if not signed in,
 * and to `/` if the user is not a staff member.
 */
export async function requireStaffGuard() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }
  const isStaff = user.role === 'doctor' || user.role === 'secretary' || user.role === 'admin';
  if (!isStaff) {
    redirect('/');
  }
  return user;
}
