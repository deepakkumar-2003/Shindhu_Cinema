'use client';

import Link from 'next/link';
import { Movie } from '@/lib/types';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
  showStatus?: boolean;
}

export default function MovieCard({ movie, showStatus = false }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        {/* Poster */}
        <div className="movie-card-poster">
          <img
            src={movie.poster}
            alt={movie.title}
            className="movie-card-poster-img"
          />

          {/* Rating Badge */}
          {movie.rating > 0 && (
            <div className="movie-card-rating">
              <svg className="movie-card-rating-icon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span className="movie-card-rating-text">{movie.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Status Badge */}
          {showStatus && (
            <div className={`movie-card-status ${
              movie.status === 'now_showing' ? 'movie-card-status-now-showing' : 'movie-card-status-coming-soon'
            }`}>
              {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
            </div>
          )}

          {/* Certification */}
          <div className="movie-card-certification">
            {movie.certification}
          </div>

          {/* Format Badges */}
          <div className="movie-card-formats">
            {movie.format.map((fmt) => (
              <span key={fmt} className="movie-card-format">
                {fmt}
              </span>
            ))}
          </div>

          {/* Hover Overlay */}
          <div className="movie-card-overlay">
            <div className="movie-card-overlay-content">
              <button className="movie-card-book-btn">
                {movie.status === 'now_showing' ? 'Book Now' : 'Notify Me'}
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="movie-card-info">
          <h3 className="movie-card-title">
            {movie.title}
          </h3>
          <p className="movie-card-genres">
            {movie.genres.join(', ')}
          </p>
          <div className="movie-card-meta">
            <span>{movie.language}</span>
            <span className="movie-card-meta-separator">•</span>
            <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
          </div>

          {/* User Rating */}
          {movie.totalRatings > 0 && (
            <div className="movie-card-user-rating">
              <div className="movie-card-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`movie-card-star ${
                      star <= Math.round(movie.userRating)
                        ? 'movie-card-star-filled'
                        : 'movie-card-star-empty'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="movie-card-rating-count">
                ({(movie.totalRatings / 1000).toFixed(0)}K)
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
