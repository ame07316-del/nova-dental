'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { AuthLayout } from '@/components/layout/AppLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';
import { notify } from '@/components/ui/Notification';
import { cn } from '@/lib/utils';

type Mode = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState<'secretary' | 'doctor'>('secretary');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      notify('error', 'Missing fields', 'Enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      notify('success', 'Welcome back', 'Signed in successfully.');
      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      notify('error', 'Sign in failed', (err as Error).message || 'Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password || !firstName) {
      notify('error', 'Missing fields', 'Name, email and password are required.');
      return;
    }
    if (password.length < 6) {
      notify('error', 'Weak password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role,
          },
        },
      });
      if (error) throw error;
      notify('success', 'Account created', `Staff profile (${role}) created. You can now sign in.`);
      setMode('signin');
      setPassword('');
    } catch (err) {
      notify('error', 'Sign up failed', (err as Error).message || 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card variant="elevated">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-nova-primary text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4.27 16.2C5.12 17.2 6.31 18 7.62 18c.6 0 1-.18 1.41-.54l2.1-2.1" />
              <path d="M20.38 11.2l-7.3-7.3-6.2 6.2-2.5-2.5c-1 1-1.58 2.36-1.58 3.9 0 1.54.58 2.9 1.58 3.9l2.5-2.5 6.2 6.2 7.3-7.3z" />
            </svg>
          </div>
          <CardTitle className="text-xl">NOVA Dental Studio</CardTitle>
          <p className="mt-1 text-sm text-nova-text-secondary">
            {mode === 'signin' ? 'Staff sign in' : 'Create a staff account'}
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex gap-1 rounded-lg bg-nova-muted p-1">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={cn(
                  'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all',
                  mode === m ? 'bg-nova-primary text-white shadow-soft' : 'text-nova-text-secondary hover:text-nova-text'
                )}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {mode === 'signup' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-nova-text">First name</label>
                <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-nova-text">Last name</label>
                <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-nova-text">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@novadental.com" />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-nova-text">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {mode === 'signup' && (
            <div>
              <label className="mb-1 block text-xs font-medium text-nova-text">Role</label>
              <Select value={role} onChange={(e) => setRole(e.target.value as 'secretary' | 'doctor')} className="w-full">
                <option value="secretary">Secretary (clinic front desk)</option>
                <option value="doctor">Doctor (dentist)</option>
              </Select>
              <p className="mt-1 text-xs text-nova-text-muted">
                A dentist record is created automatically when a doctor signs up.
              </p>
            </div>
          )}

          <Button onClick={mode === 'signin' ? handleSignIn : handleSignUp} className="w-full" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </Button>

          <p className="text-center text-xs text-nova-text-muted">
            {mode === 'signin'
              ? "Don't have an account? Switch to Create Account above."
              : 'Existing staff can sign in directly.'}
          </p>
        </CardBody>
      </Card>
    </AuthLayout>
  );
}