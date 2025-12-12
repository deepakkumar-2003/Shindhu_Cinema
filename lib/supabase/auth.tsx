'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './client';
import type { Profile } from './database.types';
import { useUserStore } from '../store';

// Types for auth state
export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Types for auth operations
export interface SignUpCredentials {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dateOfBirth?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface OTPCredentials {
  phone: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}

// Auth context type
interface AuthContextType extends AuthState {
  signUp: (credentials: SignUpCredentials) => Promise<AuthResult>;
  signIn: (credentials: SignInCredentials) => Promise<AuthResult>;
  signInWithOTP: (credentials: OTPCredentials) => Promise<AuthResult>;
  verifyOTP: (phone: string, token: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
  updateProfile: (updates: Partial<Profile>) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  refreshSession: () => Promise<void>;
}

// Demo mode storage key
const DEMO_USERS_KEY = 'demo_users';
const DEMO_CURRENT_USER_KEY = 'demo_current_user';

// Helper functions for demo mode (when Supabase is not configured)
function getDemoUsers(): Record<string, { email: string; password: string; name: string; phone: string; gender: string; dateOfBirth: string }> {
  if (typeof window === 'undefined') return {};
  const users = localStorage.getItem(DEMO_USERS_KEY);
  return users ? JSON.parse(users) : {};
}

function saveDemoUser(credentials: SignUpCredentials): void {
  if (typeof window === 'undefined') return;
  const users = getDemoUsers();
  users[credentials.email] = {
    email: credentials.email,
    password: credentials.password,
    name: credentials.name || '',
    phone: credentials.phone || '',
    gender: credentials.gender || '',
    dateOfBirth: credentials.dateOfBirth || '',
  };
  localStorage.setItem(DEMO_USERS_KEY, JSON.stringify(users));
}

function getDemoUser(email: string) {
  const users = getDemoUsers();
  return users[email] || null;
}

function setDemoCurrentUser(email: string | null): void {
  if (typeof window === 'undefined') return;
  if (email) {
    localStorage.setItem(DEMO_CURRENT_USER_KEY, email);
  } else {
    localStorage.removeItem(DEMO_CURRENT_USER_KEY);
  }
}

function getDemoCurrentUser(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(DEMO_CURRENT_USER_KEY);
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const supabase = getSupabaseClient();
  const { setUser: setStoreUser, logout: storeLogout } = useUserStore();

  // Sync auth state to useUserStore
  useEffect(() => {
    if (state.isAuthenticated && state.user) {
      setStoreUser({
        id: state.user.id,
        email: state.user.email || '',
        name: state.profile?.name || 'User',
        phone: state.profile?.phone || '',
        city: state.profile?.city || '',
        walletBalance: state.profile?.wallet_balance || 0,
        referralCode: state.profile?.referral_code || 'DEMO123',
        bookings: [],
      });
    } else if (!state.isLoading && !state.isAuthenticated) {
      storeLogout();
    }
  }, [state.isAuthenticated, state.user, state.profile, state.isLoading, setStoreUser, storeLogout]);

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    if (!isSupabaseConfigured || !supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    // If Supabase is not configured, check for demo user
    if (!isSupabaseConfigured || !supabase) {
      const demoUserEmail = getDemoCurrentUser();
      if (demoUserEmail) {
        const demoUser = getDemoUser(demoUserEmail);
        // Restore session even if no demoUser data exists (use defaults)
        setState({
          user: { id: 'demo-user', email: demoUserEmail } as User,
          session: null,
          profile: {
            id: 'demo-user',
            email: demoUserEmail,
            name: demoUser?.name || 'Demo User',
            phone: demoUser?.phone || null,
            gender: (demoUser?.gender as 'male' | 'female' | 'other') || null,
            date_of_birth: demoUser?.dateOfBirth || null,
            avatar_url: null,
            city: null,
            wallet_balance: 0,
            referral_code: 'DEMO123',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          isLoading: false,
          isAuthenticated: true,
        });
        return;
      }
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);

        if (session?.user) {
          const profile = await fetchProfile(session.user.id);
          setState({
            user: session.user,
            session,
            profile,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            session: null,
            profile: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile]);

  // Sign up with email/password
  const signUp = async (credentials: SignUpCredentials): Promise<AuthResult> => {
    // Demo mode - save user to localStorage
    if (!isSupabaseConfigured || !supabase) {
      // Check if user already exists
      const existingUser = getDemoUser(credentials.email);
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }

      // Save new demo user
      saveDemoUser(credentials);
      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            phone: credentials.phone,
            gender: credentials.gender,
            date_of_birth: credentials.dateOfBirth,
          },
        },
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user ?? undefined,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: authError.message || 'Sign up failed',
      };
    }
  };

  // Sign in with email/password
  const signIn = async (credentials: SignInCredentials): Promise<AuthResult> => {
    // Demo mode - accept any email/password
    if (!isSupabaseConfigured || !supabase) {
      // Check if user exists in demo storage (from sign up)
      let demoUser = getDemoUser(credentials.email);

      // If user doesn't exist, create a demo user entry for persistence
      if (!demoUser) {
        saveDemoUser({
          email: credentials.email,
          password: credentials.password,
          name: 'Demo User',
        });
        demoUser = getDemoUser(credentials.email);
      }

      // Set demo current user
      setDemoCurrentUser(credentials.email);

      // Update state - allow any email/password
      setState({
        user: { id: 'demo-user', email: credentials.email } as User,
        session: null,
        profile: {
          id: 'demo-user',
          email: credentials.email,
          name: demoUser?.name || 'Demo User',
          phone: demoUser?.phone || null,
          gender: (demoUser?.gender as 'male' | 'female' | 'other') || null,
          date_of_birth: demoUser?.dateOfBirth || null,
          avatar_url: null,
          city: null,
          wallet_balance: 0,
          referral_code: 'DEMO123',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        isLoading: false,
        isAuthenticated: true,
      });

      return { success: true };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user ?? undefined,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: authError.message || 'Sign in failed',
      };
    }
  };

  // Sign in with OTP (phone)
  const signInWithOTP = async (credentials: OTPCredentials): Promise<AuthResult> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: credentials.phone,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: authError.message || 'Failed to send OTP',
      };
    }
  };

  // Verify OTP
  const verifyOTP = async (phone: string, token: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user ?? undefined,
      };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: authError.message || 'OTP verification failed',
      };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<AuthResult> => {
    // Demo mode - sign in as demo Google user (always use demo for now)
    const demoEmail = 'demo.google@example.com';

    // Save demo user
    saveDemoUser({
      email: demoEmail,
      password: 'google-oauth',
      name: 'Google User',
    });

    // Set demo current user
    setDemoCurrentUser(demoEmail);

    // Update state
    setState({
      user: { id: 'demo-google-user', email: demoEmail } as User,
      session: null,
      profile: {
        id: 'demo-google-user',
        email: demoEmail,
        name: 'Google User',
        phone: null,
        gender: null,
        date_of_birth: null,
        avatar_url: null,
        city: null,
        wallet_balance: 0,
        referral_code: 'DEMO123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      isLoading: false,
      isAuthenticated: true,
    });

    return { success: true };
  };

  // Sign out
  const signOut = async (): Promise<AuthResult> => {
    // Clear demo user session
    setDemoCurrentUser(null);

    // Immediately clear local state for instant UI feedback
    setState({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });

    if (!isSupabaseConfigured || !supabase) {
      return { success: true };
    }

    try {
      // Then sign out from Supabase (with timeout)
      const signOutPromise = supabase.auth.signOut();
      const timeoutPromise = new Promise<{ error: null }>((resolve) =>
        setTimeout(() => resolve({ error: null }), 3000)
      );

      // Race between sign out and timeout - whichever finishes first
      const { error } = await Promise.race([signOutPromise, timeoutPromise]);

      if (error) {
        console.error('Sign out error:', error);
      }

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Sign out error:', authError);
      return {
        success: false,
        error: authError.message || 'Sign out failed',
      };
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>): Promise<AuthResult> => {
    if (!state.user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { error } = await (supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .from('profiles') as any)
        .update(updates)
        .eq('id', state.user.id);

      if (error) throw error;

      // Refresh profile
      const profile = await fetchProfile(state.user.id);
      setState(prev => ({ ...prev, profile }));

      return { success: true };
    } catch (error) {
      const dbError = error as { message: string };
      return {
        success: false,
        error: dbError.message || 'Profile update failed',
      };
    }
  };

  // Reset password
  const resetPassword = async (email: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: authError.message || 'Password reset failed',
      };
    }
  };

  // Refresh session
  const refreshSession = async (): Promise<void> => {
    if (!isSupabaseConfigured || !supabase) {
      return;
    }

    const { data: { session } } = await supabase.auth.refreshSession();
    if (session) {
      const profile = await fetchProfile(session.user.id);
      setState({
        user: session.user,
        session,
        profile,
        isLoading: false,
        isAuthenticated: true,
      });
    }
  };

  const value: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signInWithOTP,
    verifyOTP,
    signInWithGoogle,
    signOut,
    updateProfile,
    resetPassword,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
