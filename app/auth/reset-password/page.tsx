'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase/client';
import { toast } from '@/lib/hooks/useToast';
import './page.css';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if user has a valid recovery session
  useEffect(() => {
    const handleRecoverySession = async () => {
      const supabase = getSupabaseClient();
      if (!supabase) {
        setErrorMessage('Authentication service is not configured');
        setIsCheckingSession(false);
        return;
      }

      try {
        // For password reset, Supabase sends tokens in the URL hash
        // The Supabase client automatically handles this via onAuthStateChange
        // We need to wait for the session to be established from the hash tokens

        // First, check if there are hash parameters (recovery tokens)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        console.log('[Reset Password] Hash params - type:', type, 'hasAccessToken:', !!accessToken);

        // If we have recovery tokens in the URL, set the session
        if (accessToken && type === 'recovery') {
          console.log('[Reset Password] Setting session from recovery tokens...');

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error('[Reset Password] Error setting session:', error);
            setErrorMessage(error.message || 'Invalid or expired reset link');
            setIsCheckingSession(false);
            return;
          }

          if (data.session) {
            console.log('[Reset Password] Session established from recovery tokens');
            setIsValidSession(true);
            setIsCheckingSession(false);

            // Clear the hash from the URL for cleaner appearance
            window.history.replaceState(null, '', window.location.pathname);
            return;
          }
        }

        // Also listen for auth state changes (alternative flow)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('[Reset Password] Auth event:', event);

            if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
              console.log('[Reset Password] Recovery session detected');
              setIsValidSession(true);
              setIsCheckingSession(false);
              subscription.unsubscribe();
            }
          }
        );

        // Check for existing session (if already logged in via recovery)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Reset Password] Session error:', error);
          setErrorMessage(error.message || 'Failed to verify reset link');
          setIsCheckingSession(false);
          subscription.unsubscribe();
          return;
        }

        if (session) {
          console.log('[Reset Password] Existing session found');
          setIsValidSession(true);
          setIsCheckingSession(false);
          subscription.unsubscribe();
          return;
        }

        // Wait a bit for the auth state change to fire (hash token processing)
        setTimeout(() => {
          if (isCheckingSession) {
            console.log('[Reset Password] No valid session found after waiting');
            setIsCheckingSession(false);
            subscription.unsubscribe();
          }
        }, 3000);

      } catch (err) {
        console.error('[Reset Password] Error:', err);
        setErrorMessage('An unexpected error occurred');
        setIsCheckingSession(false);
      }
    };

    handleRecoverySession();
  }, []);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    if (!password) {
      toast.error('Please enter a new password');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = getSupabaseClient();
      if (!supabase) {
        toast.error('Authentication service is not configured');
        setIsLoading(false);
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      toast.success('Password updated successfully!');

      // Sign out and redirect to home page
      await supabase.auth.signOut();

      // Redirect to home page after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1500);

    } catch (error: any) {
      console.error('[Reset Password] Update error:', error);
      toast.error(error.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking session
  if (isCheckingSession) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="reset-password-loading">
              <div className="reset-password-spinner"></div>
              <p>Verifying your reset link...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no valid session
  if (!isValidSession) {
    return (
      <div className="reset-password-page">
        <div className="reset-password-container">
          <div className="reset-password-card">
            <div className="reset-password-error">
              <svg className="reset-password-error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="reset-password-error-title">Invalid or Expired Link</h2>
              <p className="reset-password-error-text">
                {errorMessage || 'This password reset link is invalid or has expired. Please request a new password reset link.'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="reset-password-btn"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <div className="reset-password-icon-wrapper">
              <svg className="reset-password-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <h1 className="reset-password-title">Set New Password</h1>
            <p className="reset-password-subtitle">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleResetPassword} className="reset-password-form">
            <div className="reset-password-field">
              <label className="reset-password-label">New Password</label>
              <div className="reset-password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="reset-password-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              <p className="reset-password-hint">Minimum 6 characters</p>
            </div>

            <div className="reset-password-field">
              <label className="reset-password-label">Confirm Password</label>
              <div className="reset-password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="reset-password-input"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="reset-password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword}
              className="reset-password-submit"
            >
              {isLoading ? 'Updating Password...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
