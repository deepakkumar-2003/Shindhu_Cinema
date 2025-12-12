'use client';

import { useEffect, useState, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from './client';
import type { Profile } from './database.types';

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

// Hook to manage authentication state
export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    isLoading: !isSupabaseConfigured, // Not loading if not configured
    isAuthenticated: false,
  });

  const supabase = getSupabaseClient();

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
    // Skip auth initialization if Supabase is not configured
    if (!isSupabaseConfigured || !supabase) {
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
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            name: credentials.name,
            phone: credentials.phone,
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
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is not configured' };
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
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Authentication service is not configured' };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      return {
        success: false,
        error: authError.message || 'Google sign in failed',
      };
    }
  };

  // Sign out
  const signOut = async (): Promise<AuthResult> => {
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

  return {
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
}

