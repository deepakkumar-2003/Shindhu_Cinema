'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store';
import './page.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, setUser, logout } = useUserStore();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleSave = () => {
    setUser({
      ...user,
      name,
      email,
      phone,
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="profile-page">
      <h1 className="profile-title">My Profile</h1>

      <div className="profile-grid">
        {/* Sidebar */}
        <div>
          <div className="profile-sidebar-card">
            {/* Avatar */}
            <div className="profile-avatar-section">
              <div className="profile-avatar">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="profile-user-name">{user.name}</h2>
              <p className="profile-user-email">{user.email}</p>
            </div>

            {/* Navigation */}
            <nav className="profile-nav">
              <Link href="/profile" className="profile-nav-link active">
                <svg className="profile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Profile
              </Link>
              <Link href="/profile/bookings" className="profile-nav-link">
                <svg className="profile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                My Bookings
              </Link>
              <Link href="/profile/wallet" className="profile-nav-link">
                <svg className="profile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Wallet
              </Link>
              <button onClick={handleLogout} className="profile-logout-btn">
                <svg className="profile-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="profile-main-content">
          {/* Personal Information */}
          <div className="profile-card">
            <div className="profile-section-header">
              <h2 className="profile-section-title">Personal Information</h2>
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="profile-edit-btn">
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="profile-form">
                <div className="profile-form-group">
                  <label className="profile-form-label">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="profile-form-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-form-label">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="profile-form-input"
                  />
                </div>
                <div className="profile-form-group">
                  <label className="profile-form-label">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="profile-form-input"
                  />
                </div>
                <div className="profile-form-buttons">
                  <button onClick={handleSave} className="profile-save-btn">
                    Save Changes
                  </button>
                  <button onClick={() => setIsEditing(false)} className="profile-cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info-grid">
                <div>
                  <p className="profile-info-label">Full Name</p>
                  <p className="profile-info-value">{user.name}</p>
                </div>
                <div>
                  <p className="profile-info-label">Email</p>
                  <p className="profile-info-value">{user.email}</p>
                </div>
                <div>
                  <p className="profile-info-label">Phone</p>
                  <p className="profile-info-value">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="profile-info-label">City</p>
                  <p className="profile-info-value">{user.city}</p>
                </div>
              </div>
            )}
          </div>

          {/* Wallet Balance */}
          <div className="profile-card">
            <h2 className="profile-section-title" style={{ marginBottom: '1rem' }}>Wallet</h2>
            <div className="profile-wallet-box">
              <div>
                <p className="profile-wallet-label">Available Balance</p>
                <p className="profile-wallet-balance">₹{user.walletBalance}</p>
              </div>
              <button className="profile-add-money-btn">Add Money</button>
            </div>
          </div>

          {/* Referral */}
          <div className="profile-card">
            <h2 className="profile-section-title" style={{ marginBottom: '1rem' }}>Refer & Earn</h2>
            <p className="profile-referral-text">
              Share your referral code with friends and earn ₹100 wallet credit for each successful referral!
            </p>
            <div className="profile-referral-box">
              <div className="profile-referral-code-box">
                <p className="profile-referral-code-label">Your Referral Code</p>
                <p className="profile-referral-code">{user.referralCode}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user.referralCode);
                  alert('Referral code copied!');
                }}
                className="profile-copy-btn"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Preferences */}
          <div className="profile-card">
            <h2 className="profile-section-title" style={{ marginBottom: '1rem' }}>Preferences</h2>
            <div className="profile-preferences">
              <div className="profile-preference-item">
                <div>
                  <p className="profile-preference-title">Email Notifications</p>
                  <p className="profile-preference-desc">Receive booking confirmations and offers</p>
                </div>
                <label className="profile-toggle">
                  <input type="checkbox" className="profile-toggle-input" defaultChecked />
                  <div className="profile-toggle-slider"></div>
                </label>
              </div>
              <div className="profile-preference-item">
                <div>
                  <p className="profile-preference-title">SMS Notifications</p>
                  <p className="profile-preference-desc">Receive booking updates via SMS</p>
                </div>
                <label className="profile-toggle">
                  <input type="checkbox" className="profile-toggle-input" defaultChecked />
                  <div className="profile-toggle-slider"></div>
                </label>
              </div>
              <div className="profile-preference-item">
                <div>
                  <p className="profile-preference-title">Promotional Emails</p>
                  <p className="profile-preference-desc">Receive offers and promotions</p>
                </div>
                <label className="profile-toggle">
                  <input type="checkbox" className="profile-toggle-input" />
                  <div className="profile-toggle-slider"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
