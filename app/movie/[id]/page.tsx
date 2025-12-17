'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useMovie } from '@/lib/hooks/useMovies';
import { reviews } from '@/lib/data';
import './page.css';

interface MoviePageProps {
  params: Promise<{ id: string }>;
}

export default function MoviePage({ params }: MoviePageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { movie, isLoading, error } = useMovie(id);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Force page refresh on client-side navigation for correct alignment
  useEffect(() => {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const isClientNavigation = navigationEntry?.type === 'navigate' && document.referrer.includes(window.location.origin);

    // Check if this is a client-side navigation (not initial load or refresh)
    if (isClientNavigation && !sessionStorage.getItem(`movie-page-${id}-refreshed`)) {
      sessionStorage.setItem(`movie-page-${id}-refreshed`, 'true');
      window.location.reload();
      return;
    }

    // Clear the refresh flag after a short delay to allow future refreshes
    const timeout = setTimeout(() => {
      sessionStorage.removeItem(`movie-page-${id}-refreshed`);
    }, 1000);

    setIsHydrated(true);

    return () => clearTimeout(timeout);
  }, [id]);

  // Show loading state until hydration is complete
  if (!isHydrated || isLoading) {
    return (
      <div className="movie-not-found">
        <div className="movie-loading-spinner"></div>
        <p>Loading movie...</p>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-not-found">
        <h1 className="movie-not-found-title">Movie not found</h1>
        <button onClick={() => router.push('/')} className="movie-not-found-btn">
          Go Home
        </button>
      </div>
    );
  }

  const movieReviews = reviews.filter((r) => r.movieId === movie.id);

  return (
    <div className="movie-page">
      {/* Hero Section */}
      <div className="movie-hero">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="movie-hero-backdrop"
        />
        <div className="movie-hero-gradient" />

        {/* Movie Info Overlay */}
        <div className="movie-info-overlay">
          <div className="movie-info-container">
            {/* Poster */}
            <div className="movie-poster-wrapper">
              <img
                src={movie.poster}
                alt={movie.title}
                className="movie-poster"
              />
            </div>

            {/* Info */}
            <div className="movie-info">
              <div className="movie-badges">
                {movie.format.map((fmt) => (
                  <span key={fmt} className="movie-badge movie-badge-primary">{fmt}</span>
                ))}
                <span className="movie-badge movie-badge-secondary">{movie.certification}</span>
              </div>

              <h1 className="movie-title">{movie.title}</h1>

              <div className="movie-meta">
                <div className="movie-rating">
                  <svg className="movie-rating-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="movie-rating-value">{movie.rating.toFixed(1)}/10</span>
                  <span>({(movie.totalRatings / 1000).toFixed(0)}K votes)</span>
                </div>
                <span>|</span>
                <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                <span>|</span>
                <span>{movie.language}</span>
                <span>|</span>
                <span>{new Date(movie.releaseDate).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}</span>
              </div>

              <div className="movie-genres">
                {movie.genres.map((genre) => (
                  <span key={genre} className="movie-genre-tag">
                    {genre}
                  </span>
                ))}
              </div>

              <div className="movie-actions">
                {movie.status === 'now_showing' ? (
                  <button
                    onClick={() => router.push(`/movie/${id}/showtimes`)}
                    className="movie-btn-primary"
                  >
                    Book Tickets
                  </button>
                ) : (
                  <button className="movie-btn-primary">
                    Notify Me
                  </button>
                )}
                <button
                  onClick={() => setShowTrailer(true)}
                  className="movie-btn-secondary"
                >
                  <svg className="movie-btn-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="movie-content">
        {/* About */}
        <section className="movie-section">
          <h2 className="movie-section-title">About the Movie</h2>
          <p className="movie-synopsis">{movie.synopsis}</p>
        </section>

        {/* Cast */}
        <section className="movie-section">
          <h2 className="movie-section-title">Cast</h2>
          <div className="movie-people-scroll">
            {movie.cast.map((member) => (
              <div key={member.id} className="movie-person">
                <div className="movie-person-image-wrapper">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="movie-person-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=e50914&color=fff`;
                    }}
                  />
                </div>
                <p className="movie-person-name">{member.name}</p>
                <p className="movie-person-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Crew */}
        <section className="movie-section">
          <h2 className="movie-section-title">Crew</h2>
          <div className="movie-people-scroll">
            {movie.crew.map((member) => (
              <div key={member.id} className="movie-person">
                <div className="movie-person-image-wrapper">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="movie-person-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=1a1a1a&color=fff`;
                    }}
                  />
                </div>
                <p className="movie-person-name">{member.name}</p>
                <p className="movie-person-role">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="movie-section">
          <div className="movie-reviews-header">
            <h2 className="movie-section-title">User Reviews</h2>
            <button className="movie-write-review-btn">
              Write a Review
            </button>
          </div>
          {movieReviews.length > 0 ? (
            <div className="movie-reviews-list">
              {movieReviews.map((review) => (
                <div key={review.id} className="movie-review-card">
                  <div className="movie-review-header">
                    <div className="movie-review-user">
                      <div className="movie-review-avatar">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="movie-review-username">{review.userName}</p>
                        <p className="movie-review-date">{review.createdAt}</p>
                      </div>
                    </div>
                    <div className="movie-review-rating">
                      <svg className="movie-review-rating-icon" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      <span className="movie-review-rating-value">{review.rating}/5</span>
                    </div>
                  </div>
                  <p className="movie-review-comment">{review.comment}</p>
                  <div className="movie-review-actions">
                    <button className="movie-review-like-btn">
                      <svg className="movie-review-like-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                      </svg>
                      {review.likes}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="movie-no-reviews">No reviews yet. Be the first to review!</p>
          )}
        </section>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="movie-trailer-modal">
          <div className="movie-trailer-container">
            <button
              onClick={() => setShowTrailer(false)}
              className="movie-trailer-close"
            >
              <svg className="movie-trailer-close-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="movie-trailer-video">
              <iframe
                src={movie.trailerUrl}
                title={`${movie.title} Trailer`}
                className="movie-trailer-iframe"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
