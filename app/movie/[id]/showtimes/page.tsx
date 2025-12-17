'use client';

import { useState, useMemo, use, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { theaters, generateShowtimes } from '@/lib/data';
import { useMovie } from '@/lib/hooks/useMovies';
import { useBookingStore } from '@/lib/store';
import { Showtime, Theater } from '@/lib/types';
import './Page.css';

interface ShowtimesPageProps {
  params: Promise<{ id: string }>;
}

// Generate initial date (today) - stable function
function getInitialDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Custom hook to check if component is mounted (hydrated)
function useIsHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function ShowtimesPage({ params }: ShowtimesPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { movie, isLoading: movieLoading } = useMovie(id);
  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate);
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const isHydrated = useIsHydrated();

  const { selectedCity, setSelectedMovie, setSelectedTheater, setSelectedShowtime, setSelectedDate: setBookingDate } = useBookingStore();

  // Generate dates for next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      return {
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
      };
    });
  }, []);

  // Filter screens based on selected city (location)
  const locationScreens = useMemo(() => {
    if (!isHydrated || !selectedCity) return [];
    return theaters.filter(
      (theater) => theater.city === selectedCity.name || theater.location === selectedCity.name
    );
  }, [isHydrated, selectedCity]);

  // Generate showtimes using useMemo for efficiency
  // Pass movie title and language to support both local IDs and Supabase UUIDs
  const showtimes = useMemo(() => {
    if (!selectedDate || !movie) return [];
    return generateShowtimes(movie.id, selectedDate, movie.title, movie.language);
  }, [selectedDate, movie]);

  if (movieLoading) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p>Loading movie...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="error-container">
        <div className="error-content">
          <h1 className="error-title">Movie not found</h1>
          <button onClick={() => router.push('/')} className="btn-primary">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (movie.status !== 'now_showing') {
    return (
      <div className="error-container">
        <div className="error-content">
          <h1 className="error-title">Showtimes not available</h1>
          <p className="error-message">This movie is not currently showing.</p>
          <button onClick={() => router.push(`/movie/${id}`)} className="btn-primary">
            Back to Movie
          </button>
        </div>
      </div>
    );
  }

  // Helper function to check if a showtime has passed
  const isShowtimePassed = (showtimeDate: string, showtimeTime: string): boolean => {
    const now = new Date();

    // Parse time - handle both 24-hour (09:00) and 12-hour (09:00 AM) formats
    let hours = 0;
    let minutes = 0;

    if (showtimeTime.includes('AM') || showtimeTime.includes('PM')) {
      // 12-hour format with AM/PM
      const isPM = showtimeTime.includes('PM');
      const timeWithoutPeriod = showtimeTime.replace(/AM|PM/g, '').trim();
      const [hourStr, minuteStr] = timeWithoutPeriod.split(':');
      hours = parseInt(hourStr);
      minutes = parseInt(minuteStr);

      // Convert to 24-hour format
      if (isPM && hours !== 12) {
        hours += 12;
      } else if (!isPM && hours === 12) {
        hours = 0;
      }
    } else {
      // 24-hour format
      const [hourStr, minuteStr] = showtimeTime.split(':');
      hours = parseInt(hourStr);
      minutes = parseInt(minuteStr);
    }

    const showDateTime = new Date(showtimeDate);
    showDateTime.setHours(hours, minutes, 0, 0);

    return showDateTime < now;
  };

  // Group showtimes by screen for the selected location
  const groupedShowtimes = locationScreens.map((screen) => ({
    theater: screen,
    shows: showtimes.filter(
      (s) =>
        s.theaterId === screen.id &&
        (selectedFormat === 'All' || s.format === selectedFormat) &&
        !isShowtimePassed(s.date, s.time) // Filter out past showtimes
    ),
  })).filter((g) => g.shows.length > 0);

  const handleShowtimeSelect = (theater: Theater, showtime: Showtime) => {
    setSelectedMovie(movie);
    setSelectedTheater(theater);
    setSelectedShowtime(showtime);
    setBookingDate(selectedDate);
    router.push(`/booking/seats?showtime=${showtime.id}`);
  };

  return (
    <div className="showtimes-container">
      {/* Header */}
      <div className="showtimes-header">
        <div className="header-content">
          <button
            onClick={() => router.push(`/movie/${id}`)}
            className="back-button"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="movie-info">
            <img
              src={movie.poster}
              alt={movie.title}
              className="movie-poster"
            />
            <div>
              <h1 className="movie-title">{movie.title}</h1>
              <p className="movie-meta">
                {movie.certification} • {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="date-section">
        <div className="date-container">
          <div className="date-scroll">
            {dates.map((d) => (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`date-button ${selectedDate === d.date ? 'selected' : ''}`}
              >
                <p className="date-day">{d.day}</p>
                <p className="date-num">{d.dayNum}</p>
                <p className="date-month">{d.month}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Format Filter */}
      <div className="format-section">
        <div className="format-buttons">
          {['All', '2D', 'Dolby Atmos'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`format-button ${selectedFormat === fmt ? 'selected' : ''}`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Screens and Showtimes */}
      <div className="theaters-section">
        <div className="theaters-list">
          {groupedShowtimes.map(({ theater, shows }) => (
            <div key={theater.id} className="theater-card">
              <div className="theater-header">
                <div className="theater-info">
                  <div>
                    <h3 className="theater-name">{theater.name}</h3>
                    <p className="theater-location">{theater.location}</p>
                  </div>
                  <div className="theater-info-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Info</span>
                  </div>
                </div>
                <div className="amenities-list">
                  {theater.amenities.map((amenity) => (
                    <span key={amenity} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div className="showtimes-list">
                {shows.map((show) => (
                  <button
                    key={show.id}
                    onClick={() => handleShowtimeSelect(theater, show)}
                    className="showtime-button"
                  >
                    <span className="showtime-time">{show.time}</span>
                    <span className="showtime-format">{show.format}</span>

                    {/* Tooltip */}
                    <div className="showtime-tooltip">
                      <p className="tooltip-price">From ₹{show.price.standard}</p>
                      <p className="tooltip-seats">{show.availableSeats} seats available</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}

          {!isHydrated && (
            <div className="empty-state">
              <p className="empty-title">Loading...</p>
            </div>
          )}

          {isHydrated && !selectedCity && (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="empty-title">Please select a location</p>
              <p className="empty-subtitle">Choose Anthiyur or Komarapalayam to view showtimes</p>
            </div>
          )}

          {isHydrated && selectedCity && groupedShowtimes.length === 0 && (
            <div className="empty-state">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="empty-title">No showtimes available for selected filters</p>
              <p className="empty-subtitle">Try selecting a different date or format</p>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="legend-bar">
        <div className="legend-content">
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-icon available"></div>
              <span className="legend-label">Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon filling-fast"></div>
              <span className="legend-label">Filling Fast</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon sold-out"></div>
              <span className="legend-label">Sold Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
