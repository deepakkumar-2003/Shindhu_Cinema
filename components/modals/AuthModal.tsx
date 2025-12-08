'use client';

import { useState } from 'react';
import { useUserStore, useUIStore } from '@/lib/store';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const { setUser } = useUserStore();

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

  const handleSendOtp = async () => {
    if (!phone || phone.length !== 10) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setAuthMode('otp');
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user creation
    setUser({
      id: '1',
      name: name || 'User',
      email: email || `user${phone}@example.com`,
      phone,
      city: 'Mumbai',
      walletBalance: 0,
      referralCode: 'SHINDHU' + Math.random().toString(36).substring(7).toUpperCase(),
      bookings: [],
    });

    setIsLoading(false);
    onClose();
    resetForm();
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return;
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUser({
      id: '1',
      name: email.split('@')[0],
      email,
      phone: '',
      city: 'Mumbai',
      walletBalance: 100,
      referralCode: 'SHINDHU' + Math.random().toString(36).substring(7).toUpperCase(),
      bookings: [],
    });

    setIsLoading(false);
    onClose();
    resetForm();
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setUser({
      id: '1',
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '',
      city: 'Mumbai',
      walletBalance: 50,
      referralCode: 'SHINDHU' + Math.random().toString(36).substring(7).toUpperCase(),
      bookings: [],
    });

    setIsLoading(false);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setPhone('');
    setEmail('');
    setPassword('');
    setName('');
    setOtp(['', '', '', '', '', '']);
    setAuthMode('login');
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
            {authMode === 'otp' ? 'Verify OTP' : authMode === 'signup' ? 'Create Account' : 'Sign In'}
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
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
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
                  onClick={() => setAuthMode('login')}
                  className="auth-link"
                >
                  Change phone number
                </button>
              </div>

              <div className="resend-otp-section">
                <span className="resend-otp-text">Didn&apos;t receive OTP? </span>
                <button className="auth-link-primary">
                  Resend OTP
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
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="auth-input"
                  />
                </div>
                <button
                  onClick={handleEmailLogin}
                  disabled={isLoading || !email || !password}
                  className="auth-btn-secondary"
                >
                  {isLoading ? 'Signing in...' : 'Sign in with Email'}
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
