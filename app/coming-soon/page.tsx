'use client';

import { useState } from 'react';
import MovieCard from '@/components/movies/MovieCard';
import { getMoviesByStatus } from '@/lib/data';
import './page.css';

export default function ComingSoonPage() {
  const [notifyList, setNotifyList] = useState<string[]>([]);
  const comingSoonMovies = getMoviesByStatus('coming_soon');

  const handleNotify = (movieId: string) => {
    if (notifyList.includes(movieId)) {
      setNotifyList(notifyList.filter((id) => id !== movieId));
    } else {
      setNotifyList([...notifyList, movieId]);
    }
  };

  return (
    <div className="coming-soon-page">
      {/* Hero */}
      <div className="cs-hero">
        <h1 className="cs-hero-title">Coming Soon</h1>
        <p className="cs-hero-subtitle">
          Get notified when your most anticipated movies release. Be the first to book!
        </p>
      </div>

      {/* Featured Coming Soon */}
      {comingSoonMovies.length > 0 && (
        <section className="cs-featured-section">
          <div className="cs-featured-banner">
            <img
              src={comingSoonMovies[0].backdrop}
              alt={comingSoonMovies[0].title}
              className="cs-featured-image"
            />
            <div className="cs-featured-gradient" />
            <div className="cs-featured-content">
              <div className="cs-featured-content-inner">
                <span className="cs-featured-badge">Coming Soon</span>
                <h2 className="cs-featured-title">
                  {comingSoonMovies[0].title}
                </h2>
                <p className="cs-featured-synopsis">
                  {comingSoonMovies[0].synopsis}
                </p>
                <div className="cs-featured-meta">
                  <span>{comingSoonMovies[0].language}</span>
                  <span className="cs-featured-meta-dot">•</span>
                  <span>{comingSoonMovies[0].genres.join(', ')}</span>
                  <span className="cs-featured-meta-dot">•</span>
                  <span>
                    {new Date(comingSoonMovies[0].releaseDate).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <button
                  onClick={() => handleNotify(comingSoonMovies[0].id)}
                  className={`cs-notify-btn ${
                    notifyList.includes(comingSoonMovies[0].id)
                      ? 'cs-notify-btn-secondary'
                      : 'cs-notify-btn-primary'
                  }`}
                >
                  {notifyList.includes(comingSoonMovies[0].id) ? (
                    <>
                      <svg className="cs-notify-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      Notification Set
                    </>
                  ) : (
                    <>
                      <svg className="cs-notify-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Notify Me
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* All Coming Soon Movies */}
      <section>
        <h2 className="cs-movies-section-title">All Upcoming Movies</h2>
        {comingSoonMovies.length > 0 ? (
          <div className="cs-movies-grid">
            {comingSoonMovies.map((movie) => (
              <div key={movie.id} className="cs-movie-item">
                <MovieCard movie={movie} showStatus />
                {notifyList.includes(movie.id) && (
                  <div className="cs-notification-badge">
                    Notification Set
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="cs-empty-state">
            <svg className="cs-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="cs-empty-text">No upcoming movies at the moment</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="cs-newsletter-section">
        <div className="cs-newsletter-card">
          <h3 className="cs-newsletter-title">Never Miss a Release</h3>
          <p className="cs-newsletter-text">
            Subscribe to our newsletter and be the first to know about new releases, exclusive offers, and more!
          </p>
          <div className="cs-newsletter-form">
            <input
              type="email"
              placeholder="Enter your email"
              className="cs-newsletter-input"
            />
            <button className="cs-subscribe-btn">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
