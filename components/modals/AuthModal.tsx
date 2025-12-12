'use client';

import { useState, useEffect, useCallback } from 'react';
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
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Email verification states
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailOtpError, setEmailOtpError] = useState('');
  const [emailOtpTimer, setEmailOtpTimer] = useState(0);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);

  const { signIn, signUp, signInWithOTP, verifyOTP, signInWithGoogle, resetPassword } = useAuth();

  // Email OTP timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emailOtpTimer > 0) {
      interval = setInterval(() => {
        setEmailOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emailOtpTimer]);

  // Reset email verification when email changes
  useEffect(() => {
    if (emailOtpSent || emailVerified) {
      setEmailOtpSent(false);
      setEmailVerified(false);
      setEmailOtp(['', '', '', '', '', '']);
      setEmailOtpError('');
      setEmailOtpTimer(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

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

  // Email OTP handlers
  const handleEmailOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...emailOtp];
    newOtp[index] = value;
    setEmailOtp(newOtp);
    setEmailOtpError(''); // Clear error when typing

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`email-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleEmailOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !emailOtp[index] && index > 0) {
      const prevInput = document.getElementById(`email-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSendEmailOtp = useCallback(async () => {
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSendingEmailOtp(true);

    // Simulate sending OTP to email (in real app, call API)
    // For demo, we'll just simulate the OTP being sent
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSendingEmailOtp(false);
    setEmailOtpSent(true);
    setEmailOtpTimer(60);
    setEmailOtp(['', '', '', '', '', '']);
    setEmailOtpError('');
    toast.success('OTP sent to your email');

    // Focus first OTP input
    setTimeout(() => {
      const firstInput = document.getElementById('email-otp-0');
      firstInput?.focus();
    }, 100);
  }, [email]);

  const handleVerifyEmailOtp = async () => {
    const otpValue = emailOtp.join('');
    if (otpValue.length !== 6) {
      setEmailOtpError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifyingEmail(true);

    // Simulate OTP verification (in real app, call API)
    // For demo, accept "123456" as valid OTP
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real implementation, you would verify with your backend
    // For demo purposes, we'll accept "123456" as valid
    if (otpValue === '123456') {
      setEmailVerified(true);
      setEmailOtpError('');
      toast.success('Email verified successfully!');
    } else {
      setEmailOtpError('Incorrect OTP. Please try again.');
    }

    setIsVerifyingEmail(false);
  };

  const handleResendEmailOtp = () => {
    if (emailOtpTimer > 0) return;
    handleSendEmailOtp();
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
    // Validate all required fields
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!dateOfBirth) {
      toast.error('Please enter your date of birth');
      return;
    }

    if (!gender) {
      toast.error('Please select your gender');
      return;
    }

    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!emailVerified) {
      toast.error('Please verify your email address');
      return;
    }

    if (!password) {
      toast.error('Please enter a password');
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
      name,
      phone: `+91${phone}`,
      gender,
      dateOfBirth,
    });

    setIsLoading(false);

    if (result.success) {
      toast.success('Account created successfully! Please sign in to continue.');
      setAuthMode('login');
      // Clear signup-specific fields but keep email for convenience
      setName('');
      setGender('');
      setDateOfBirth('');
      setPassword('');
      setEmailVerified(false);
      setEmailOtpSent(false);
      setEmailOtp(['', '', '', '', '', '']);
    } else {
      toast.error(result.error || 'Sign up failed');
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    const result = await signInWithGoogle();

    setIsLoading(false);

    if (result.success) {
      toast.success('Signed in successfully!');
      onClose();
      resetForm();
    } else {
      toast.error(result.error || 'Google sign in failed');
    }
  };

  const handleAppleLogin = async () => {
    // Apple Sign In - placeholder for future implementation
    toast.error('Apple Sign In coming soon!');
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
    setGender('');
    setDateOfBirth('');
    setOtp(['', '', '', '', '', '']);
    setAuthMode('login');
    setShowPassword(false);
    // Reset email verification states
    setEmailOtp(['', '', '', '', '', '']);
    setEmailOtpSent(false);
    setEmailVerified(false);
    setEmailOtpError('');
    setEmailOtpTimer(0);
  };

  if (!isOpen) return null;

  // Check if all signup fields are filled (including email verification)
  const isSignUpFormValid = name.trim() && dateOfBirth && gender && phone.length === 10 && email && emailVerified && password.length >= 6;

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
          ) : authMode === 'signup' ? (
            /* Sign Up Form - Separate from Login */
            <div className="auth-form">
              {/* Full Name */}
              <div className="auth-form-group">
                <label className="auth-form-label">Full Name <span className="auth-required">*</span></label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="auth-input"
                />
              </div>

              {/* Date of Birth */}
              <div className="auth-form-group">
                <label className="auth-form-label">Date of Birth <span className="auth-required">*</span></label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="auth-input auth-input-date"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Gender */}
              <div className="auth-form-group">
                <label className="auth-form-label">Gender <span className="auth-required">*</span></label>
                <div className="auth-gender-options">
                  <label className={`auth-gender-option ${gender === 'male' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                      className="auth-gender-radio"
                    />
                    <span>Male</span>
                  </label>
                  <label className={`auth-gender-option ${gender === 'female' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                      className="auth-gender-radio"
                    />
                    <span>Female</span>
                  </label>
                  <label className={`auth-gender-option ${gender === 'other' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={gender === 'other'}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other')}
                      className="auth-gender-radio"
                    />
                    <span>Other</span>
                  </label>
                </div>
              </div>

              {/* Phone */}
              <div className="auth-form-group">
                <label className="auth-form-label">Mobile Number <span className="auth-required">*</span></label>
                <div className="phone-input-wrapper">
                  <span className="phone-country-code">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="auth-input auth-input-phone"
                  />
                </div>
              </div>

              {/* Email with Verify Button */}
              <div className="auth-form-group">
                <label className="auth-form-label">Email <span className="auth-required">*</span></label>
                <div className="email-verify-wrapper">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="auth-input auth-input-email-verify"
                    disabled={emailVerified}
                  />
                  {emailVerified ? (
                    <span className="email-verified-tick">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="email-verify-btn"
                      onClick={handleSendEmailOtp}
                      disabled={!email || !email.includes('@') || isSendingEmailOtp || emailOtpSent}
                    >
                      {isSendingEmailOtp ? 'Sending...' : emailOtpSent ? 'OTP Sent' : 'Verify Email'}
                    </button>
                  )}
                </div>

                {/* Email OTP Section - Shows after OTP is sent */}
                {emailOtpSent && !emailVerified && (
                  <div className="email-otp-section">
                    <div className="email-otp-inputs">
                      {emailOtp.map((digit, index) => (
                        <input
                          key={index}
                          id={`email-otp-${index}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleEmailOtpChange(index, e.target.value.replace(/\D/g, ''))}
                          onKeyDown={(e) => handleEmailOtpKeyDown(index, e)}
                          className="email-otp-input"
                        />
                      ))}
                    </div>

                    {/* Error Message */}
                    {emailOtpError && (
                      <p className="email-otp-error">{emailOtpError}</p>
                    )}

                    {/* Confirm Button */}
                    <button
                      type="button"
                      className="email-otp-confirm-btn"
                      onClick={handleVerifyEmailOtp}
                      disabled={isVerifyingEmail || emailOtp.join('').length !== 6}
                    >
                      {isVerifyingEmail ? 'Verifying...' : 'Confirm'}
                    </button>

                    {/* Resend OTP */}
                    <div className="email-otp-resend">
                      <button
                        type="button"
                        className="email-otp-resend-btn"
                        onClick={handleResendEmailOtp}
                        disabled={emailOtpTimer > 0}
                      >
                        Resend OTP {emailOtpTimer > 0 ? `(${emailOtpTimer}s)` : ''}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="auth-form-group">
                <label className="auth-form-label">Password <span className="auth-required">*</span></label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password (min 6 characters)"
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

              {/* Create Account Button */}
              <button
                onClick={handleEmailSignUp}
                disabled={isLoading || !isSignUpFormValid}
                className={`auth-btn-primary ${isSignUpFormValid ? '' : 'disabled'}`}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              {/* Social Sign Up Divider */}
              <div className="auth-divider">
                <div className="auth-divider-line">
                  <div className="auth-divider-line-inner"></div>
                </div>
                <div className="auth-divider-text">
                  <span>or sign up with</span>
                </div>
              </div>

              {/* Google Sign Up */}
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="social-login-btn google-login-btn"
              >
                <svg className="social-icon" viewBox="0 0 24 24">
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

              {/* Apple Sign Up */}
              <button
                onClick={handleAppleLogin}
                disabled={isLoading}
                className="social-login-btn apple-login-btn"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>

              {/* Toggle to Sign In */}
              <div className="auth-mode-toggle">
                <p className="auth-mode-text">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="auth-mode-btn"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          ) : (
            /* Sign In Form */
            <div className="auth-form">
              {/* Phone Input for OTP */}
              <div className="auth-form-group">
                <label className="auth-form-label">Mobile Number</label>
                <div className="phone-input-wrapper">
                  <span className="phone-country-code">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter mobile number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="auth-input auth-input-phone"
                  />
                </div>
              </div>

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
                className="social-login-btn google-login-btn"
              >
                <svg className="social-icon" viewBox="0 0 24 24">
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

              {/* Apple Login */}
              <button
                onClick={handleAppleLogin}
                disabled={isLoading}
                className="social-login-btn apple-login-btn"
              >
                <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span>Continue with Apple</span>
              </button>

              {/* Email Login Section */}
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

                <button
                  onClick={() => setAuthMode('forgot')}
                  className="auth-forgot-link"
                >
                  Forgot password?
                </button>

                <button
                  onClick={handleEmailLogin}
                  disabled={isLoading || !email || !password}
                  className={`auth-btn-secondary ${email && password ? 'ready' : ''}`}
                >
                  {isLoading ? 'Signing in...' : 'Sign in with Email'}
                </button>
              </div>

              {/* Toggle to Sign Up */}
              <div className="auth-mode-toggle">
                <p className="auth-mode-text">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setAuthMode('signup')}
                    className="auth-mode-btn"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
