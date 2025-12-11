'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useBookingStore, useUIStore } from '@/lib/store';
import { useAuth } from '@/lib/supabase/auth';
import CityModal from '../modals/CityModal';
import AuthModal from '../modals/AuthModal';
import SignOutModal from '../modals/SignOutModal';
import './Header.css';

// Sample trending and recent searches for demo
const trendingSearches = [
  { id: 1, title: 'Avatar 3', type: 'movie' },
  { id: 2, title: 'Pushpa 2', type: 'movie' },
  { id: 3, title: 'Salaar', type: 'movie' },
];

const recentSearches = [
  { id: 1, query: 'Action movies' },
  { id: 2, query: 'IMAX shows' },
  { id: 3, query: 'Weekend offers' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOffCanvasOpen, setIsOffCanvasOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const { selectedCity } = useBookingStore();
  const { profile, isAuthenticated, signOut, isLoading: authLoading } = useAuth();
  const { setIsCityModalOpen, setIsAuthModalOpen, isCityModalOpen, isAuthModalOpen } = useUIStore();

  // Helper function to check if a nav link is active
  const isActiveLink = (href: string) => {
    if (href === '/') {
      // Movies tab is active on home page or any /movie/* page
      return pathname === '/' || pathname.startsWith('/movie');
    }
    return pathname === href || pathname.startsWith(href);
  };

  // Get display name from profile or email
  const displayName = profile?.name || profile?.email?.split('@')[0] || 'User';

  // Handle ESC key to close search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchFocused) {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
        mobileSearchInputRef.current?.blur();
      }
      // Ctrl/Cmd + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchFocused(true);
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchFocused]);

  // Handle click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = (e: React.FocusEvent) => {
    // Don't blur if clicking within search suggestions
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.closest('.search-suggestions')) {
      return;
    }
    // Small delay to allow click events on suggestions
    setTimeout(() => {
      setIsSearchFocused(false);
    }, 150);
  };

  const handleOverlayClick = () => {
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
    mobileSearchInputRef.current?.blur();
  };

  const handleSuggestionClick = (query: string) => {
    setSearchQuery(query);
    setIsSearchFocused(false);
  };

  const clearRecentSearches = () => {
    // In a real app, this would clear from localStorage/state
    console.log('Clear recent searches');
  };

  return (
    <>
      {/* Search Overlay */}
      <div
        className={`search-overlay ${isSearchFocused ? 'active' : ''}`}
        onClick={handleOverlayClick}
      />

      <header className="header">
        <div className="header-container">
          <div className="header-content">
            {/* Logo */}
            <Link href="/" className="logo-link">
              {/* <div className="logo-icon-wrapper">
                <svg className="logo-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 4l2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z" />
                </svg>
              </div> */}
              {/* <span className="logo-text">Shindhu Cinemas</span> */}
              <Image src="/images/logo.jpg" alt="Shindhu Cinemas" width={120} height={48} priority />
            </Link>

            {/* Search Bar - Desktop */}
            <div className={`search-container-desktop ${isSearchFocused ? 'focused' : ''}`}>
              <div className="search-wrapper">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for movies, events, plays, sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className="search-input"
                />
                <svg
                  className="search-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {/* Search Suggestions Dropdown */}
                <div className={`search-suggestions ${isSearchFocused ? 'visible' : ''}`}>
                  {searchQuery.length === 0 ? (
                    <>
                      {/* Recent Searches */}
                      <div className="search-suggestions-header">
                        <span className="search-suggestions-title">Recent Searches</span>
                        <button className="search-suggestions-clear" onClick={clearRecentSearches}>
                          Clear
                        </button>
                      </div>
                      {recentSearches.map((item) => (
                        <div
                          key={item.id}
                          className="search-suggestion-item"
                          onClick={() => handleSuggestionClick(item.query)}
                        >
                          <svg className="search-suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="search-suggestion-title">{item.query}</span>
                        </div>
                      ))}

                      {/* Trending */}
                      <div className="search-suggestions-header">
                        <span className="search-suggestions-title">Trending Now</span>
                      </div>
                      {trendingSearches.map((item) => (
                        <Link
                          key={item.id}
                          href={`/movie/${item.id}`}
                          className="search-suggestion-item"
                          onClick={() => setIsSearchFocused(false)}
                        >
                          <svg className="search-suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          <div className="search-suggestion-content">
                            <span className="search-suggestion-title">{item.title}</span>
                          </div>
                          <span className="search-suggestion-badge">Trending</span>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <>
                      {/* Search Results */}
                      <div className="search-suggestions-header">
                        <span className="search-suggestions-title">Results for &quot;{searchQuery}&quot;</span>
                      </div>
                      {trendingSearches
                        .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                        .map((item) => (
                          <Link
                            key={item.id}
                            href={`/movie/${item.id}`}
                            className="search-suggestion-item"
                            onClick={() => setIsSearchFocused(false)}
                          >
                            <svg className="search-suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                            <div className="search-suggestion-content">
                              <span className="search-suggestion-title">{item.title}</span>
                              <span className="search-suggestion-meta">Movie • Now Showing</span>
                            </div>
                          </Link>
                        ))}
                      {trendingSearches.filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="search-no-results">
                          <svg className="search-no-results-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="search-no-results-text">No results found for &quot;{searchQuery}&quot;</p>
                        </div>
                      )}
                    </>
                  )}

                  {/* Keyboard Hint */}
                  <div className="search-keyboard-hint">
                    <span className="search-keyboard-key">ESC</span>
                    <span>to close</span>
                    <span style={{ margin: '0 0.5rem' }}>•</span>
                    <span className="search-keyboard-key">⌘</span>
                    <span className="search-keyboard-key">K</span>
                    <span>to search</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="header-right">
              {/* City Selector */}
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="city-selector"
              >
                <svg className="city-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="city-name">{selectedCity?.name || 'Select City'}</span>
                <svg className="chevron-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Auth Buttons */}
              {authLoading ? (
                <div className="auth-loading">
                  <div className="auth-loading-spinner"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="user-menu-container" ref={userMenuRef}>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="user-menu-button"
                  >
                    <div className="user-avatar">
                      <span className="user-avatar-text">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="user-name">{displayName.split(' ')[0]}</span>
                  </button>

                  {isMenuOpen && (
                    <div className="dropdown-menu">
                      <Link
                        href="/profile"
                        className="dropdown-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/profile/bookings"
                        className="dropdown-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <Link
                        href="/profile/wallet"
                        className="dropdown-link"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Wallet
                      </Link>
                      <hr className="dropdown-divider" />
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsSignOutModalOpen(true);
                        }}
                        className="dropdown-logout"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className="sign-in-button"
                >
                  Sign In
                </button>
              )}

              {/* Menu Button - Opens Off-Canvas Panel */}
              <button
                onClick={() => setIsOffCanvasOpen(true)}
                className="menu-button"
              >
                <svg className="menu-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className={`mobile-search-container ${isSearchFocused ? 'focused' : ''}`}>
            <div className="search-wrapper">
              <input
                ref={mobileSearchInputRef}
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="search-input"
              />
              <svg
                className="search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              {/* Mobile Search Suggestions */}
              <div className={`search-suggestions ${isSearchFocused ? 'visible' : ''}`}>
                {searchQuery.length === 0 ? (
                  <>
                    <div className="search-suggestions-header">
                      <span className="search-suggestions-title">Trending Now</span>
                    </div>
                    {trendingSearches.map((item) => (
                      <Link
                        key={item.id}
                        href={`/movie/${item.id}`}
                        className="search-suggestion-item"
                        onClick={() => setIsSearchFocused(false)}
                      >
                        <svg className="search-suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <span className="search-suggestion-title">{item.title}</span>
                        <span className="search-suggestion-badge">Trending</span>
                      </Link>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="search-suggestions-header">
                      <span className="search-suggestions-title">Results</span>
                    </div>
                    {trendingSearches
                      .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((item) => (
                        <Link
                          key={item.id}
                          href={`/movie/${item.id}`}
                          className="search-suggestion-item"
                          onClick={() => setIsSearchFocused(false)}
                        >
                          <svg className="search-suggestion-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                          </svg>
                          <span className="search-suggestion-title">{item.title}</span>
                        </Link>
                      ))}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <div className="nav-container">
            <div className="nav-links">
              <Link href="/" className={`nav-link ${isActiveLink('/') ? 'nav-link-active' : ''}`}>
                Movies
              </Link>
              <Link href="/coming-soon" className={`nav-link ${isActiveLink('/coming-soon') ? 'nav-link-active' : ''}`}>
                Coming Soon
              </Link>
              <Link href="/snacks" className={`nav-link ${isActiveLink('/snacks') ? 'nav-link-active' : ''}`}>
                Food & Beverages
              </Link>
              <Link href="/offers" className={`nav-link ${isActiveLink('/offers') ? 'nav-link-active' : ''}`}>
                Offers
              </Link>
              <Link href="/advertisement" className={`nav-link ${isActiveLink('/advertisement') ? 'nav-link-active' : ''}`}>
                Advertisement
              </Link>
              <Link href="/about" className={`nav-link ${isActiveLink('/about') ? 'nav-link-active' : ''}`}>
                About Us
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Off-Canvas Overlay */}
      <div
        className={`offcanvas-overlay ${isOffCanvasOpen ? 'open' : ''}`}
        onClick={() => setIsOffCanvasOpen(false)}
      />

      {/* Off-Canvas Panel */}
      <div className={`offcanvas-panel ${isOffCanvasOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="offcanvas-header">
          <h2 className="offcanvas-title">Menu</h2>
          <button
            onClick={() => setIsOffCanvasOpen(false)}
            className="offcanvas-close"
          >
            <svg className="offcanvas-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="offcanvas-content">
          {/* Navigation Links */}
          <div className="offcanvas-section">
            <div className="offcanvas-nav-links">
              <Link href="/" className={`offcanvas-nav-link ${isActiveLink('/') ? 'offcanvas-nav-link-active' : ''}`} onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="offcanvas-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                Movies
              </Link>
              <Link href="/coming-soon" className={`offcanvas-nav-link ${isActiveLink('/coming-soon') ? 'offcanvas-nav-link-active' : ''}`} onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="offcanvas-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Coming Soon
              </Link>
              <Link href="/snacks" className={`offcanvas-nav-link ${isActiveLink('/snacks') ? 'offcanvas-nav-link-active' : ''}`} onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="offcanvas-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Food & Beverages
              </Link>
              <Link href="/offers" className={`offcanvas-nav-link ${isActiveLink('/offers') ? 'offcanvas-nav-link-active' : ''}`} onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="offcanvas-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                Offers
              </Link>
              <Link href="/advertisement" className={`offcanvas-nav-link ${isActiveLink('/advertisement') ? 'offcanvas-nav-link-active' : ''}`} onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="offcanvas-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
                Advertisement
              </Link>
              <Link href="/about" className={`offcanvas-nav-link ${isActiveLink('/about') ? 'offcanvas-nav-link-active' : ''}`} onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="offcanvas-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </Link>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="offcanvas-section">
            <div className="rewards-card">
              <div className="rewards-card-header">
                <svg className="rewards-card-icon" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <h3 className="rewards-card-title">Shindhu Rewards</h3>
              </div>
              <div className="rewards-card-points">1,250</div>
              <div className="rewards-card-label">Available Points</div>
              <div className="rewards-card-progress">
                <div className="rewards-progress-bar">
                  <div className="rewards-progress-fill" style={{ width: '62%' }}></div>
                </div>
                <div className="rewards-progress-text">750 points to Gold status</div>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="offcanvas-section">
            <div className="offcanvas-section-title">Notifications</div>
            <div className="notification-card notification-unread">
              <div className="notification-card-header">
                <h4 className="notification-card-title">Booking Confirmed!</h4>
                <span className="notification-card-time">2h ago</span>
              </div>
              <p className="notification-card-text">Your tickets for &quot;Avatar 3&quot; have been confirmed. Show starts at 7:00 PM.</p>
            </div>
            <div className="notification-card">
              <div className="notification-card-header">
                <h4 className="notification-card-title">Weekend Offer</h4>
                <span className="notification-card-time">1d ago</span>
              </div>
              <p className="notification-card-text">Get 20% off on all bookings this weekend. Use code: WEEKEND20</p>
            </div>
            <div className="notification-card">
              <div className="notification-card-header">
                <h4 className="notification-card-title">New Movie Alert</h4>
                <span className="notification-card-time">3d ago</span>
              </div>
              <p className="notification-card-text">&quot;Mission Impossible 8&quot; is now showing! Book your tickets now.</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="offcanvas-section">
            <div className="offcanvas-section-title">Quick Actions</div>
            <div className="quick-actions">
              <Link href="/offers" className="quick-action-button" onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
                <span className="quick-action-label">Offers</span>
              </Link>
              <Link href="/profile/wallet" className="quick-action-button" onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span className="quick-action-label">Wallet</span>
              </Link>
              <Link href="/profile/bookings" className="quick-action-button" onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
                <span className="quick-action-label">My Tickets</span>
              </Link>
              <Link href="/snacks" className="quick-action-button" onClick={() => setIsOffCanvasOpen(false)}>
                <svg className="quick-action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="quick-action-label">Food Menu</span>
              </Link>
            </div>
          </div>

          {/* More Options */}
          <div className="offcanvas-section">
            <div className="offcanvas-section-title">More Options</div>
            <Link href="/profile" className="offcanvas-item" onClick={() => setIsOffCanvasOpen(false)}>
              <svg className="offcanvas-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div className="offcanvas-item-content">
                <span className="offcanvas-item-label">Settings</span>
                <span className="offcanvas-item-description">Account preferences</span>
              </div>
            </Link>
            <Link href="/help" className="offcanvas-item" onClick={() => setIsOffCanvasOpen(false)}>
              <svg className="offcanvas-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="offcanvas-item-content">
                <span className="offcanvas-item-label">Help & Support</span>
                <span className="offcanvas-item-description">FAQs, Contact us</span>
              </div>
            </Link>
            <Link href="/about" className="offcanvas-item" onClick={() => setIsOffCanvasOpen(false)}>
              <svg className="offcanvas-item-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="offcanvas-item-content">
                <span className="offcanvas-item-label">About Us</span>
                <span className="offcanvas-item-description">Learn more about Shindhu</span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Modals */}
      <CityModal isOpen={isCityModalOpen} onClose={() => setIsCityModalOpen(false)} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={signOut}
      />
    </>
  );
}
