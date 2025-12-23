'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabaseClient, getIsSupabaseConfigured, isSupabaseConfigured } from './client';
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
  sendPhoneOtp: (phone: string, isSignup?: boolean) => Promise<AuthResult>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<AuthResult>;
  sendEmailOtp: (email: string, isSignup?: boolean) => Promise<AuthResult>;
  verifyEmailOtp: (email: string, token: string) => Promise<AuthResult>;
  checkEmailExists: (email: string) => Promise<{ exists: boolean; error?: string }>;
  checkPhoneExists: (phone: string) => Promise<{ exists: boolean; error?: string }>;
}

// Demo mode storage key
const DEMO_USERS_KEY = 'demo_users';
const DEMO_CURRENT_USER_KEY = 'demo_current_user';

// Helper functions for demo mode (when Supabase is not configured)
function getDemoUsers(): Record<string, { email: string; password: string; name: string; phone: string }> {
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

  const [isHydrated, setIsHydrated] = useState(false);

  const supabase = getSupabaseClient();
  const { setUser: setStoreUser, logout: storeLogout } = useUserStore();

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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
  const fetchProfile = useCallback(async (userId: string, userEmail?: string, userName?: string): Promise<Profile | null> => {
    if (!isSupabaseConfigured || !supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      // If profile exists, return it
      if (data && !error) {
        return data;
      }

      // If profile doesn't exist (PGRST116 error code), create it
      if (error && error.code === 'PGRST116') {
        console.log('[Auth] Profile not found, creating new profile for user:', userId);

        const newProfile = {
          id: userId,
          email: userEmail || '',
          name: userName || 'User',
          phone: null,
          avatar_url: null,
          city: null,
          wallet_balance: 0,
          referral_code: 'SHINDHU' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        };

        const { data: createdProfile, error: createError } = await (supabase
          .from('profiles') as any)
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('[Auth] Error creating profile:', createError);
          return null;
        }

        console.log('[Auth] Profile created successfully');
        return createdProfile;
      }

      // Other errors
      console.error('[Auth] Error fetching profile:', error);
      return null;
    } catch (err) {
      console.error('[Auth] Unexpected error in fetchProfile:', err);
      return null;
    }
  }, [supabase]);

  // Initialize auth state
  useEffect(() => {
    // Wait for client-side hydration before checking localStorage
    if (!isHydrated) {
      console.log('[Auth] Waiting for hydration...');
      return;
    }

    console.log('[Auth] Initializing auth state...');

    // If Supabase is not configured, check for demo user
    if (!isSupabaseConfigured || !supabase) {
      const demoUserEmail = getDemoCurrentUser();
      console.log('[Auth] Demo mode - checking for stored user:', demoUserEmail);

      if (demoUserEmail) {
        const demoUser = getDemoUser(demoUserEmail);
        console.log('[Auth] Restoring demo user session:', { email: demoUserEmail, user: demoUser });

        // Restore session even if no demoUser data exists (use defaults)
        setState({
          user: { id: 'demo-user', email: demoUserEmail } as User,
          session: null,
          profile: {
            id: 'demo-user',
            email: demoUserEmail,
            name: demoUser?.name || 'Demo User',
            phone: demoUser?.phone || null,
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

      console.log('[Auth] No stored user found, setting not authenticated');
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user) {
          const profile = await fetchProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata?.full_name || session.user.user_metadata?.name
          );
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
          const profile = await fetchProfile(
            session.user.id,
            session.user.email,
            session.user.user_metadata?.full_name || session.user.user_metadata?.name
          );
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
  }, [isHydrated, supabase, fetchProfile]);

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
          },
        },
      });

      if (error) throw error;

      // Check if user was actually created (Supabase returns user but no session if email already exists)
      if (data.user && !data.session && data.user.identities?.length === 0) {
        return {
          success: false,
          error: 'This email is already registered. Please sign in instead.',
        };
      }

      return {
        success: true,
        user: data.user ?? undefined,
      };
    } catch (error) {
      const authError = error as AuthError;

      // Provide user-friendly error messages for common scenarios
      let errorMessage = authError.message || 'Sign up failed';

      if (errorMessage.toLowerCase().includes('already registered') ||
          errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('user already')) {
        errorMessage = 'This email is already registered. Please sign in instead.';
      }

      return {
        success: false,
        error: errorMessage,
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
    // Check Supabase configuration dynamically at runtime
    const isConfigured = getIsSupabaseConfigured();

    // Get a fresh supabase client to ensure it's available
    const supabaseClient = getSupabaseClient();

    console.log('[Auth] Google sign-in initiated, Supabase configured:', isConfigured, 'Client exists:', !!supabaseClient);

    // Try real Google OAuth authentication with Supabase first
    if (isConfigured && supabaseClient) {
      try {
        console.log('[Auth] Attempting real Google OAuth sign-in...');

        const { data, error } = await supabaseClient.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              access_type: 'offline',
              prompt: 'consent',
            },
          },
        });

        if (error) {
          console.error('[Auth] Google OAuth error:', error);
          throw error;
        }

        console.log('[Auth] Google OAuth initiated successfully - redirecting to Google...');

        // The function will redirect to Google's login page
        // After successful authentication, Google will redirect back to the callback URL
        return { success: true };
      } catch (error) {
        const authError = error as AuthError;
        console.error('[Auth] Google sign-in failed:', authError);

        // Return error instead of falling back to demo mode
        return {
          success: false,
          error: authError.message || 'Google sign in failed',
        };
      }
    }

    // Only use demo mode if Supabase is not configured
    console.warn('[Auth] Supabase not configured, using demo mode');
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

    console.log('[Auth] Google sign-in (demo mode) completed');
    return { success: true };
  };

  // Sign out
  const signOut = async (): Promise<AuthResult> => {
    console.log('[Auth] Sign out initiated');

    // Clear demo user session
    setDemoCurrentUser(null);

    console.log('[Auth] Cleared demo_current_user from localStorage');

    // Immediately clear local state for instant UI feedback
    setState({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAuthenticated: false,
    });

    console.log('[Auth] Auth state cleared');

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
      const profile = await fetchProfile(state.user.id, state.user.email);
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
      // Redirect directly to reset-password page which will handle the code exchange
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

  // Send phone OTP for verification
  // For signup: Only sends OTP if phone is NOT already registered
  const sendPhoneOtp = async (phone: string, isSignup: boolean = true): Promise<AuthResult> => {
    // Check if Supabase is configured
    const isConfigured = getIsSupabaseConfigured();

    if (!isConfigured || !supabase) {
      console.warn('[Auth] Supabase not configured, using demo mode for phone OTP');
      // Demo mode - check if phone already exists
      if (isSignup) {
        const users = getDemoUsers();
        const exists = Object.values(users).some(user => user.phone === phone);
        if (exists) {
          return {
            success: false,
            error: 'This phone number is already registered. Please sign in instead.',
          };
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    }

    try {
      console.log('[Auth] Sending phone OTP to:', phone);
      console.log('[Auth] Is signup mode:', isSignup);

      // Validate phone format
      if (!phone.startsWith('+')) {
        console.error('[Auth] Phone number must start with + and country code');
        return {
          success: false,
          error: 'Phone number must include country code (e.g., +919876543210)',
        };
      }

      // For signup: First check if phone is already registered
      if (isSignup) {
        console.log('[Auth] Checking if phone is already registered...');

        // Try to send OTP with shouldCreateUser: false
        // If it succeeds, the user already exists
        const { error: checkError } = await supabase.auth.signInWithOtp({
          phone: phone,
          options: {
            shouldCreateUser: false, // Don't create user, just check if exists
            channel: 'sms',
          },
        });

        // If NO error, the phone is already registered (OTP was sent to existing user)
        if (!checkError) {
          console.log('[Auth] Phone is already registered');
          return {
            success: false,
            error: 'This phone number is already registered. Please sign in instead.',
          };
        }

        // Check the error message
        const errorMsg = checkError.message?.toLowerCase() || '';
        console.log('[Auth] Check error:', checkError.message);

        // If error indicates user doesn't exist, that's what we want for signup
        if (errorMsg.includes('signups not allowed') ||
            errorMsg.includes('user not found') ||
            errorMsg.includes('no user found') ||
            errorMsg.includes('otp disabled') ||
            errorMsg.includes('phone not allowed')) {
          console.log('[Auth] Phone is not registered, proceeding with signup OTP');
          // Continue to send OTP for new user
        } else {
          // Some other error - might still mean user exists
          if (!errorMsg.includes('not') && !errorMsg.includes('disabled')) {
            console.log('[Auth] Unclear error, assuming phone might exist');
            return {
              success: false,
              error: 'This phone number is already registered. Please sign in instead.',
            };
          }
        }
      }

      // Send OTP for phone verification
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          shouldCreateUser: true, // Allow sending to new phones
          channel: 'sms',
          data: {
            phone: phone,
          }
        },
      });

      if (error) {
        console.error('[Auth] Phone OTP error:', error);

        // Provide more helpful error messages
        if (error.message?.includes('Database error')) {
          console.error('[Auth] Database error - likely missing trigger. Run supabase-phone-auth-setup.sql');
          return {
            success: false,
            error: 'Database setup required. Please contact support.',
          };
        }

        throw error;
      }

      console.log('[Auth] Phone OTP sent successfully', data);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      console.error('[Auth] Send phone OTP failed:', authError);

      // Provide user-friendly error messages
      let errorMessage = authError.message || 'Failed to send OTP';

      if (errorMessage.includes('Database error saving new user')) {
        errorMessage = 'Database setup error. Please run the setup script in Supabase.';
        console.error('[Auth] Run: supabase-phone-auth-setup.sql in your Supabase SQL Editor');
      } else if (errorMessage.includes('Invalid phone number')) {
        errorMessage = 'Invalid phone number format. Use: +919876543210';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Verify phone OTP
  const verifyPhoneOtp = async (phone: string, token: string): Promise<AuthResult> => {
    // Check if Supabase is configured
    const isConfigured = getIsSupabaseConfigured();

    if (!isConfigured || !supabase) {
      console.warn('[Auth] Supabase not configured, using demo mode for phone verification');
      // Demo mode - accept "123456" as valid
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (token === '123456') {
        return { success: true };
      } else {
        return { success: false, error: 'Invalid OTP' };
      }
    }

    try {
      console.log('[Auth] Verifying phone OTP for:', phone);
      console.log('[Auth] OTP token:', token);

      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms',
      });

      if (error) {
        console.error('[Auth] Phone OTP verification error:', error);
        console.error('[Auth] Error details:', {
          message: error.message,
          status: error.status,
          phone: phone,
          tokenLength: token.length
        });

        // Provide specific error messages
        if (error.message?.includes('expired')) {
          return {
            success: false,
            error: 'OTP has expired. Please request a new one.',
          };
        } else if (error.message?.includes('invalid')) {
          return {
            success: false,
            error: 'Invalid OTP. Please check and try again.',
          };
        } else if (error.message?.includes('already been used')) {
          return {
            success: false,
            error: 'This OTP has already been used. Please request a new one.',
          };
        }

        throw error;
      }

      console.log('[Auth] Phone OTP verified successfully', data);
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      console.error('[Auth] Verify phone OTP failed:', authError);

      let errorMessage = authError.message || 'Invalid or expired OTP';

      // More specific error messages
      if (errorMessage.includes('Token has expired')) {
        errorMessage = 'OTP has expired. Please click "Resend OTP" to get a new code.';
      } else if (errorMessage.includes('invalid')) {
        errorMessage = 'Incorrect OTP. Please check the code and try again.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Send email OTP for verification (6-digit code)
  // For signup: Only sends OTP if email is NOT already registered
  const sendEmailOtp = async (email: string, isSignup: boolean = true): Promise<AuthResult> => {
    // Check if Supabase is configured
    const isConfigured = getIsSupabaseConfigured();

    if (!isConfigured || !supabase) {
      console.warn('[Auth] Supabase not configured, using demo mode for email OTP');
      // Demo mode - check if email already exists
      if (isSignup) {
        const existingUser = getDemoUser(email);
        if (existingUser) {
          return {
            success: false,
            error: 'This email is already registered. Please sign in instead.',
          };
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    }

    try {
      console.log('[Auth] Sending 6-digit email OTP to:', email);
      console.log('[Auth] Is signup mode:', isSignup);

      // Validate email format
      if (!email || !email.includes('@')) {
        console.error('[Auth] Invalid email format');
        return {
          success: false,
          error: 'Please enter a valid email address',
        };
      }

      // For signup: First check if email is already registered
      if (isSignup) {
        console.log('[Auth] Checking if email is already registered...');

        // Try to send OTP with shouldCreateUser: false
        // If it succeeds, the user already exists
        const { error: checkError } = await supabase.auth.signInWithOtp({
          email: email,
          options: {
            shouldCreateUser: false, // Don't create user, just check if exists
          },
        });

        // If NO error, the email is already registered (OTP was sent to existing user)
        if (!checkError) {
          console.log('[Auth] Email is already registered');
          return {
            success: false,
            error: 'This email is already registered. Please sign in instead.',
          };
        }

        // Check the error message
        const errorMsg = checkError.message?.toLowerCase() || '';
        console.log('[Auth] Check error:', checkError.message);

        // If error indicates user doesn't exist, that's what we want for signup
        if (errorMsg.includes('signups not allowed') ||
            errorMsg.includes('user not found') ||
            errorMsg.includes('no user found') ||
            errorMsg.includes('otp disabled') ||
            errorMsg.includes('email not allowed')) {
          console.log('[Auth] Email is not registered, proceeding with signup OTP');
          // Continue to send OTP for new user
        } else {
          // Some other error - might still mean user exists
          // To be safe, check if the error suggests the email exists
          if (!errorMsg.includes('not') && !errorMsg.includes('disabled')) {
            console.log('[Auth] Unclear error, assuming email might exist');
            return {
              success: false,
              error: 'This email is already registered. Please sign in instead.',
            };
          }
        }
      }

      // Send OTP code for email verification
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: true, // Allow sending to new emails
          emailRedirectTo: undefined, // No redirect - we want OTP code, not magic link
          data: {
            email: email,
            email_verification_only: true,
          }
        },
      });

      if (error) {
        console.error('[Auth] Email OTP error:', error);
        throw error;
      }

      console.log('[Auth] 6-digit email OTP sent successfully', data);
      console.log('[Auth] Check your email inbox for the verification code');
      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      console.error('[Auth] Send email OTP failed:', authError);

      let errorMessage = authError.message || 'Failed to send OTP';

      // Provide user-friendly error messages
      if (errorMessage.includes('rate limit')) {
        errorMessage = 'Too many OTP requests. Please wait a minute and try again.';
      } else if (errorMessage.includes('Invalid email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Please check your email for the verification code.';
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  // Verify email OTP
  const verifyEmailOtp = async (email: string, token: string): Promise<AuthResult> => {
    // Check if Supabase is configured
    const isConfigured = getIsSupabaseConfigured();

    if (!isConfigured || !supabase) {
      console.warn('[Auth] Supabase not configured, using demo mode for email verification');
      // Demo mode - accept "123456" as valid
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (token === '123456') {
        return { success: true };
      } else {
        return { success: false, error: 'Invalid OTP' };
      }
    }

    // Validate inputs
    if (!email || !email.includes('@')) {
      console.error('[Auth] Invalid email format for verification');
      return {
        success: false,
        error: 'Invalid email address',
      };
    }

    if (!token || token.length !== 6) {
      console.error('[Auth] Invalid OTP format');
      return {
        success: false,
        error: 'OTP must be 6 digits',
      };
    }

    try {
      console.log('[Auth] Verifying email OTP for:', email);
      console.log('[Auth] OTP token:', token);

      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: token,
        type: 'email',
      });

      if (error) {
        console.error('[Auth] Email OTP verification error:', error);
        const errorMsg = error.message || String(error) || '';
        console.error('[Auth] Error message:', errorMsg);

        // Check for expired token (most common issue - default is 60 seconds)
        if (errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('token has expired')) {
          return {
            success: false,
            error: 'OTP has expired (codes expire in 60 seconds). Please click "Resend OTP" to get a new code.'
          };
        }

        // Check for invalid token
        if (errorMsg.toLowerCase().includes('invalid')) {
          return {
            success: false,
            error: 'Invalid OTP. Please check the code in your email and try again.'
          };
        }

        // Check for already used
        if (errorMsg.toLowerCase().includes('already been used') || errorMsg.toLowerCase().includes('already used')) {
          return {
            success: false,
            error: 'This OTP has already been used. Please request a new one.'
          };
        }

        // Generic error
        return {
          success: false,
          error: errorMsg || 'Verification failed. Please try again or request a new OTP.'
        };
      }

      console.log('[Auth] Email OTP verified successfully', data);

      // Sign out the temporary session created by OTP verification
      // We only wanted to verify the email, not log the user in yet
      // They will create their account with password later
      try {
        await supabase.auth.signOut();
        console.log('[Auth] Signed out temporary session after email verification');
      } catch (signOutError) {
        console.warn('[Auth] Could not sign out temporary session:', signOutError);
        // Continue anyway - verification was successful
      }

      return { success: true };
    } catch (error) {
      const authError = error as AuthError;
      const errorMsg = authError?.message || String(error) || '';
      console.error('[Auth] Verify email OTP failed:', errorMsg);

      // Enhanced error messages for common scenarios
      if (errorMsg.toLowerCase().includes('expired') || errorMsg.toLowerCase().includes('token has expired')) {
        return {
          success: false,
          error: 'OTP has expired (codes expire in 60 seconds). Please click "Resend OTP" to get a new code.'
        };
      }

      if (errorMsg.toLowerCase().includes('invalid')) {
        return {
          success: false,
          error: 'Incorrect OTP. Please check the code in your email and try again.'
        };
      }

      if (errorMsg.toLowerCase().includes('rate limit')) {
        return {
          success: false,
          error: 'Too many verification attempts. Please wait a minute and try again.'
        };
      }

      return {
        success: false,
        error: errorMsg || 'Verification failed. Please try again or request a new OTP.'
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
      const profile = await fetchProfile(
        session.user.id,
        session.user.email,
        session.user.user_metadata?.full_name || session.user.user_metadata?.name
      );
      setState({
        user: session.user,
        session,
        profile,
        isLoading: false,
        isAuthenticated: true,
      });
    }
  };

  // Check if email already exists in the database (for preventing duplicate registrations)
  // Note: Due to RLS restrictions, we can't directly query profiles for anonymous users
  // The actual duplicate check happens during signup via Supabase's built-in validation
  const checkEmailExists = async (email: string): Promise<{ exists: boolean; error?: string }> => {
    // Demo mode - check localStorage
    if (!isSupabaseConfigured || !supabase) {
      const existingUser = getDemoUser(email);
      return { exists: !!existingUser };
    }

    // For Supabase mode, we skip the pre-check due to RLS restrictions
    // The signup function will catch and handle duplicate emails
    console.log('[Auth] Email pre-check skipped (RLS), will validate at signup');
    return { exists: false };
  };

  // Check if phone already exists in the database (for preventing duplicate registrations)
  // Note: Due to RLS restrictions, we can't directly query profiles for anonymous users
  // The actual duplicate check happens during signup via Supabase's built-in validation
  const checkPhoneExists = async (phone: string): Promise<{ exists: boolean; error?: string }> => {
    // Demo mode - check localStorage
    if (!isSupabaseConfigured || !supabase) {
      const users = getDemoUsers();
      const exists = Object.values(users).some(user => user.phone === phone);
      return { exists };
    }

    // For Supabase mode, we skip the pre-check due to RLS restrictions
    // The signup function will catch and handle duplicate phones
    console.log('[Auth] Phone pre-check skipped (RLS), will validate at signup');
    return { exists: false };
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
    sendPhoneOtp,
    verifyPhoneOtp,
    sendEmailOtp,
    verifyEmailOtp,
    checkEmailExists,
    checkPhoneExists,
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
