'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { createClientComponentClient, type User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/utils';

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

  // Initialize Supabase client
  useEffect(() => {
    const supabase = createClientComponentClient();

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
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    router.refresh();
  }, [router]);

  const signUp = useCallback(async (email: string, password: string, data?: Record<string, unknown>) => {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...data,
        },
      },
    });
    if (error) throw error;
    router.refresh();
  }, [router]);

  const signOut = useCallback(async () => {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    storage.remove('nova-auth');
    router.push('/');
    router.refresh();
  }, [router]);

  const refreshSession = useCallback(async () => {
    const supabase = createClientComponentClient();
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

// HOC to protect routes
export function requireAuth(Component: React.ComponentType<Record<string, unknown>>) {
  return function ProtectedComponent(props: Record<string, unknown>) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
      window.location.href = '/';
      return null;
    }

    return <Component {...props} />;
  };
}

// Export auth types
export type { AuthUser };
