'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase/browser';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Auth user type
interface AuthUser {
  id: string;
  email: string;
  user_metadata?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    role?: 'patient' | 'doctor' | 'secretary' | 'admin';
  };
}

function mapUser(user: User | null): AuthUser | null {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email ?? '',
    user_metadata: user.user_metadata as AuthUser['user_metadata'],
  };
}

// Auth context type
interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, data?: Record<string, unknown>) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize session from the SHARED browser client (same storage as login).
  useEffect(() => {
    const supabase = getSupabaseBrowser();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(mapUser(session?.user ?? null));
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(mapUser(session?.user ?? null));
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    router.refresh();
  }, [router]);

  const signUp = useCallback(async (email: string, password: string, data?: Record<string, unknown>) => {
    const supabase = getSupabaseBrowser();
    // Role is always forced to patient: caller-controlled metadata must never
    // mint staff roles (the staff trigger only honors doctor/secretary and
    // never admin, but public signup has no business requesting either).
    const { role: _ignored, ...safeData } = data ?? {};
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...safeData,
          role: 'patient',
        },
      },
    });
    if (error) throw error;
    router.refresh();
  }, [router]);

  const signOut = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    router.push('/');
    router.refresh();
  }, [router]);

  const refreshSession = useCallback(async () => {
    const supabase = getSupabaseBrowser();
    const { data } = await supabase.auth.getSession();
    setUser(mapUser(data.session?.user ?? null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
