'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/supabase/auth';
import { toast } from '@/lib/hooks/useToast';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp' | 'forgot'>('login');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp, signInWithOTP, verifyOTP, signInWithGoogle, resetPassword } = useAuth();

  if (!isOpen) return null;

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);

    const result = await signInWithOTP({ phone: `+91${phone}` });

    setIsLoading(false);

    if (result.success) {
      setAuthMode('otp');
      toast.success('OTP sent successfully');
    } else {
      toast.error(result.error || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      toast.error('Please enter the complete 6-digit OTP');
      return;
    }

    setIsLoading(true);

    const result = await verifyOTP(`+91${phone}`, otpValue);

    setIsLoading(false);

    if (result.success) {
      toast.success('Signed in successfully!');
      onClose();
      resetForm();
    } else {
      toast.error(result.error || 'Invalid OTP');
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    setIsLoading(true);

    const result = await signIn({ email, password });

    setIsLoading(false);

    if (result.success) {
      toast.success('Signed in successfully!');
      onClose();
      resetForm();
    } else {
      toast.error(result.error || 'Invalid credentials');
    }
  };

  const handleEmailSignUp = async () => {
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    const result = await signUp({
      email,
      password,
      name: name || undefined,
      phone: phone ? `+91${phone}` : undefined,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success('Account created! Please check your email to verify your account.');
      setAuthMode('login');
    } else {
      toast.error(result.error || 'Sign up failed');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const result = await signInWithGoogle();

    if (!result.success) {
      setIsLoading(false);
      toast.error(result.error || 'Google sign in failed');
    }
    // If successful, user will be redirected
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    const result = await resetPassword(email);

    setIsLoading(false);

    if (result.success) {
      toast.success('Password reset email sent! Check your inbox.');
      setAuthMode('login');
    } else {
      toast.error(result.error || 'Failed to send reset email');
    }
  };

  const resetForm = () => {
    setPhone('');
    setEmail('');
    setPassword('');
    setName('');
    setOtp(['', '', '', '', '', '']);
    setAuthMode('login');
    setShowPassword(false);
  };

  return (
    <div className="auth-modal-overlay">
      {/* Backdrop */}
      <div
        className="auth-modal-backdrop"
        onClick={() => {
          onClose();
          resetForm();
        }}
      />

      {/* Modal */}
      <div className="auth-modal">
        {/* Header */}
        <div className="auth-modal-header">
          <h2 className="auth-modal-title">
            {authMode === 'otp' ? 'Verify OTP' :
             authMode === 'signup' ? 'Create Account' :
             authMode === 'forgot' ? 'Reset Password' : 'Sign In'}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="auth-modal-close"
          >
            <svg className="auth-modal-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="auth-modal-body">
          {authMode === 'otp' ? (
            /* OTP Verification */
            <div className="otp-section">
              <div className="otp-text-center">
                <p className="otp-subtitle">
                  Enter the 6-digit OTP sent to
                </p>
                <p className="otp-phone">+91 {phone}</p>
              </div>

              <div className="otp-input-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="otp-input"
                  />
                ))}
              </div>

              <button
                onClick={handleVerifyOtp}
                disabled={isLoading || otp.join('').length !== 6}
                className="auth-btn-primary"
              >
                {isLoading ? 'Verifying...' : 'Verify OTP'}
              </button>

              <div className="otp-text-center">
                <button
                  onClick={() => {
                    setAuthMode('login');
                    setOtp(['', '', '', '', '', '']);
                  }}
                  className="auth-link"
                >
                  Change phone number
                </button>
              </div>

              <div className="resend-otp-section">
                <span className="resend-otp-text">Didn&apos;t receive OTP? </span>
                <button
                  className="auth-link-primary"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          ) : authMode === 'forgot' ? (
            /* Forgot Password */
            <div className="auth-form">
              <p className="auth-form-description">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
              <div className="auth-form-group">
                <label className="auth-form-label">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                />
              </div>
              <button
                onClick={handleForgotPassword}
                disabled={isLoading || !email}
                className="auth-btn-primary"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <div className="auth-mode-toggle">
                <button
                  onClick={() => setAuthMode('login')}
                  className="auth-mode-btn"
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          ) : (
            /* Login / Signup Form */
            <div className="auth-form">
              {/* Phone Input */}
              <div className="auth-form-group">
                <label className="auth-form-label">Mobile Number</label>
                <div className="phone-input-wrapper">
                  <span className="phone-country-code">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="auth-input auth-input-phone"
                  />
                </div>
              </div>

              {authMode === 'signup' && (
                <div className="auth-form-group">
                  <label className="auth-form-label">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                  />
                </div>
              )}

              <button
                onClick={handleSendOtp}
                disabled={isLoading || phone.length !== 10}
                className="auth-btn-primary"
              >
                {isLoading ? 'Sending OTP...' : 'Continue with OTP'}
              </button>

              <div className="auth-divider">
                <div className="auth-divider-line">
                  <div className="auth-divider-line-inner"></div>
                </div>
                <div className="auth-divider-text">
                  <span>or continue with</span>
                </div>
              </div>

              {/* Google Login */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="google-login-btn"
              >
                <svg className="google-icon" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Email Login */}
              <div className="email-login-section">
                <div className="auth-form-group">
                  <label className="auth-form-label">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input"
                  />
                </div>
                <div className="auth-form-group">
                  <label className="auth-form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="auth-input auth-input-password"
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <svg className="password-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="password-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {authMode === 'login' && (
                  <button
                    onClick={() => setAuthMode('forgot')}
                    className="auth-forgot-link"
                  >
                    Forgot password?
                  </button>
                )}

                <button
                  onClick={authMode === 'signup' ? handleEmailSignUp : handleEmailLogin}
                  disabled={isLoading || !email || !password}
                  className={`auth-btn-secondary ${email && password ? 'ready' : ''}`}
                >
                  {isLoading ? (authMode === 'signup' ? 'Creating account...' : 'Signing in...') :
                   (authMode === 'signup' ? 'Create Account' : 'Sign in with Email')}
                </button>
              </div>

              {/* Toggle Auth Mode */}
              <div className="auth-mode-toggle">
                {authMode === 'login' ? (
                  <p className="auth-mode-text">
                    Don&apos;t have an account?{' '}
                    <button
                      onClick={() => setAuthMode('signup')}
                      className="auth-mode-btn"
                    >
                      Sign up
                    </button>
                  </p>
                ) : (
                  <p className="auth-mode-text">
                    Already have an account?{' '}
                    <button
                      onClick={() => setAuthMode('login')}
                      className="auth-mode-btn"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
