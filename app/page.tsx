'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MovieCard from '@/components/movies/MovieCard';
import { useMoviesByStatus } from '@/lib/hooks/useMovies';
import './Page.css';

const languages = ['All', 'Hindi', 'English', 'Telugu', 'Tamil', 'Malayalam'];
const genres = ['All', 'Action', 'Comedy', 'Drama', 'Horror', 'Sci-Fi', 'Romance', 'Thriller'];
const formats = ['All', '2D', '3D', 'IMAX'];

const AUTO_SLIDE_INTERVAL = 5000; // 5 seconds

export default function Home() {
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const { movies: nowShowingMovies, isLoading: nowShowingLoading } = useMoviesByStatus('now_showing');
  const { movies: comingSoonMovies, isLoading: comingSoonLoading } = useMoviesByStatus('coming_soon');

  // Get movies for hero banner (limit to first 5 for slideshow)
  const heroMovies = useMemo(() => nowShowingMovies.slice(0, 5), [nowShowingMovies]);

  const filteredMovies = useMemo(() => {
    return nowShowingMovies.filter((movie) => {
      if (selectedLanguage !== 'All' && movie.language !== selectedLanguage) return false;
      if (selectedGenre !== 'All' && !movie.genres.includes(selectedGenre)) return false;
      if (selectedFormat !== 'All' && !movie.format.includes(selectedFormat as '2D' | '3D' | 'IMAX')) return false;
      return true;
    });
  }, [nowShowingMovies, selectedLanguage, selectedGenre, selectedFormat]);

  // Navigate to next slide
  const goToNextSlide = useCallback(() => {
    if (heroMovies.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % heroMovies.length);
  }, [heroMovies.length]);

  // Navigate to previous slide
  const goToPrevSlide = useCallback(() => {
    if (heroMovies.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + heroMovies.length) % heroMovies.length);
  }, [heroMovies.length]);

  // Navigate to specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    // Resume auto-play after 10 seconds
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying || heroMovies.length <= 1) return;

    const interval = setInterval(goToNextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isAutoPlaying, heroMovies.length, goToNextSlide]);

  // Reset current slide when movies change
  useEffect(() => {
    if (currentSlide >= heroMovies.length && heroMovies.length > 0) {
      setCurrentSlide(0);
    }
  }, [heroMovies.length, currentSlide]);

  // Handle arrow navigation
  const handlePrevClick = () => {
    goToPrevSlide();
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const handleNextClick = () => {
    goToNextSlide();
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Current hero movie
  const currentHeroMovie = heroMovies[currentSlide];

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero-section">
        {nowShowingLoading ? (
          <div className="hero-banner hero-loading">
            <div className="hero-loading-spinner"></div>
          </div>
        ) : heroMovies.length > 0 ? (
          <div className="hero-slider">
            {/* Slides Container */}
            <div className="hero-slides">
              {heroMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className={`hero-slide ${index === currentSlide ? 'hero-slide-active' : ''}`}
                >
                  <div className="hero-banner">
                    <img
                      src={movie.backdrop}
                      alt={movie.title}
                      className="hero-image"
                    />
                    <div className="hero-gradient" />
                    <div className="hero-content">
                      <div className="hero-content-inner">
                        <span className="hero-badge">Now Showing</span>
                        <h1 className="hero-title">{movie.title}</h1>
                        <p className="hero-description">{movie.synopsis}</p>
                        <div className="hero-buttons">
                          <Link href={`/movie/${movie.id}`} className="hero-btn-primary">
                            Book Tickets
                          </Link>
                          <Link href={`/movie/${movie.id}`} className="hero-btn-secondary">
                            <svg className="hero-btn-icon" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                            Watch Trailer
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {heroMovies.length > 1 && (
              <>
                <button
                  className="hero-arrow hero-arrow-prev"
                  onClick={handlePrevClick}
                  aria-label="Previous slide"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  className="hero-arrow hero-arrow-next"
                  onClick={handleNextClick}
                  aria-label="Next slide"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {heroMovies.length > 1 && (
              <div className="hero-dots">
                {heroMovies.map((_, index) => (
                  <button
                    key={index}
                    className={`hero-dot ${index === currentSlide ? 'hero-dot-active' : ''}`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="filters-container">
          <h2 className="filters-title">Now Showing</h2>

          <div className="filters-row">
            {/* Language Filter */}
            <div className="filter-group">
              <span className="filter-label">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="filter-select"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>

            {/* Genre Filter */}
            <div className="filter-group">
              <span className="filter-label">Genre:</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="filter-select"
              >
                {genres.map((genre) => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Format Filter */}
            <div className="filter-group">
              <span className="filter-label">Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="filter-select"
              >
                {formats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Now Showing Movies */}
      <section className="movies-section">
        {nowShowingLoading ? (
          <div className="movies-loading">
            <div className="movies-loading-spinner"></div>
            <p>Loading movies...</p>
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="movies-grid">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="no-movies">
            <svg className="no-movies-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="no-movies-text">No movies found matching your filters</p>
            <button
              onClick={() => {
                setSelectedLanguage('All');
                setSelectedGenre('All');
                setSelectedFormat('All');
              }}
              className="clear-filters-btn"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>

      {/* Coming Soon */}
      <section className="coming-soon-section">
        <div className="section-header">
          <h2 className="section-title">Coming Soon</h2>
          <a href="/coming-soon" className="view-all-link">
            View All
          </a>
        </div>
        {comingSoonLoading ? (
          <div className="movies-loading">
            <div className="movies-loading-spinner"></div>
          </div>
        ) : (
          <div className="movies-grid">
            {comingSoonMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showStatus />
            ))}
          </div>
        )}
      </section>

      {/* Promotional Banners */}
      <section className="promotions-section">
        <h2 className="section-title promotions-title">Offers & Promotions</h2>
        <div className="promotions-grid">
          <div className="promo-card promo-card-primary">
            <h3 className="promo-card-title">First Booking Offer</h3>
            <p className="promo-card-text">Get 20% off on your first movie booking. Use code: FIRST20</p>
            <button className="promo-card-link promo-card-link-primary">
              Learn More
            </button>
          </div>
          <div className="promo-card promo-card-accent">
            <h3 className="promo-card-title">Combo Deals</h3>
            <p className="promo-card-text">Book tickets + snacks together and save up to 30%!</p>
            <button className="promo-card-link promo-card-link-accent">
              View Combos
            </button>
          </div>
          <div className="promo-card promo-card-success">
            <h3 className="promo-card-title">Refer & Earn</h3>
            <p className="promo-card-text">Refer friends and earn wallet credits worth ₹100 each!</p>
            <button className="promo-card-link promo-card-link-success">
              Start Referring
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <h2 className="features-title">Why Choose Shindhu Cinemas?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon-wrapper feature-icon-wrapper-primary">
              <svg className="feature-icon feature-icon-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="feature-title">Instant Booking</h3>
            <p className="feature-text">Book tickets in seconds with our fast checkout</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper feature-icon-wrapper-accent">
              <svg className="feature-icon feature-icon-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="feature-title">Choose Your Seat</h3>
            <p className="feature-text">Pick your favorite seats with our interactive seat map</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper feature-icon-wrapper-success">
              <svg className="feature-icon feature-icon-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="feature-title">Skip the Queue</h3>
            <p className="feature-text">Pre-order snacks and pick up without waiting</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon-wrapper feature-icon-wrapper-purple">
              <svg className="feature-icon feature-icon-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="feature-title">Secure Payments</h3>
            <p className="feature-text">100% secure payments with multiple options</p>
          </div>
        </div>
      </section>
    </div>
  );
}
