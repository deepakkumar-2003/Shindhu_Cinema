'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore } from '@/lib/store';
import { movies as moviesData, theaters, showTimingsData } from '@/lib/data';
import { Showtime } from '@/lib/types';
import './page.css';

// Demo data for 4 screens
const screens = [
  {
    id: 1,
    name: 'Screen 1 - Dolby Atmos',
    capacity: 280,
    features: ['Dolby Atmos', '4K Laser', 'Recliner Seats'],
    type: 'dolby',
  },
  {
    id: 2,
    name: 'Screen 2 - Dolby Atmos',
    capacity: 220,
    features: ['Dolby Atmos', '4K Projection', 'Premium Sound'],
    type: 'dolby',
  },
  {
    id: 3,
    name: 'Screen 3 - Dolby Atmos',
    capacity: 180,
    features: ['Dolby Atmos', 'Digital Projection', 'Surround Sound'],
    type: 'dolby',
  },
  {
    id: 4,
    name: 'Screen 4 - Dolby Atmos',
    capacity: 150,
    features: ['Dolby Atmos', 'Digital Projection', 'Surround Sound'],
    type: 'dolby',
  },
];

// Build showTimings from shared data, enriching with movie details
const showTimings = showTimingsData.map(timing => {
  // Find movie by title (case-insensitive)
  const movie = moviesData.find(m => m.title.toLowerCase() === timing.movieTitle.toLowerCase());
  return {
    movieId: movie?.id || '',
    title: timing.movieTitle,
    language: movie?.language || 'Tamil',
    genre: movie?.genres.join(', ') || '',
    duration: movie ? `${Math.floor(movie.duration / 60)}h ${movie.duration % 60}min` : '',
    rating: movie?.certification || 'UA',
    poster: movie?.poster || '',
    shows: timing.shows,
  };
}).filter(timing => {
  // Only include movies that exist and are now_showing
  const movie = moviesData.find(m => m.title.toLowerCase() === timing.title.toLowerCase());
  return movie && movie.status === 'now_showing';
});

// Generate dates for the next 7 days
const generateDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      date: date,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    });
  }

  return dates;
};

export default function ShowTimingsPage() {
  const router = useRouter();
  const { selectedCity, setSelectedMovie, setSelectedTheater, setSelectedShowtime, setSelectedDate: setBookingDate } = useBookingStore();

  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedScreen, setSelectedScreen] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

  const dates = generateDates();
  const languages = ['All', 'Tamil', 'English'];

  // Filter movies based on selected screen and language
  const filteredMovies = showTimings.filter((movie) => {
    const screenMatch = selectedScreen === null || movie.shows.some((show) => show.screenId === selectedScreen);
    const languageMatch = selectedLanguage === null || selectedLanguage === 'All' || movie.language === selectedLanguage;
    return screenMatch && languageMatch;
  });

  const getScreenById = (id: number) => screens.find((s) => s.id === id);

  // Check if a showtime has already passed
  const isShowtimePassed = (showtimeDate: string, showtimeTime: string): boolean => {
    const now = new Date();

    // Parse the time string
    let hours = 0;
    let minutes = 0;

    // Check if time is in 12-hour format (contains AM/PM)
    if (showtimeTime.includes('AM') || showtimeTime.includes('PM')) {
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
      // Assume 24-hour format
      const [hourStr, minuteStr] = showtimeTime.split(':');
      hours = parseInt(hourStr);
      minutes = parseInt(minuteStr);
    }

    // Create a date object for the showtime
    const showDateTime = new Date(showtimeDate);
    showDateTime.setHours(hours, minutes, 0, 0);

    // Compare with current time
    return showDateTime < now;
  };

  // Handle showtime selection - navigate directly to seat selection
  const handleShowtimeClick = (movieId: string, screenId: number, time: string, price: { standard: number; premium: number }) => {
    // Get movie data from lib/data.ts
    const movie = moviesData.find(m => m.id === movieId);
    if (!movie) return;

    // Get the theater/screen based on selected city
    const locationScreens = theaters.filter(
      t => t.city === selectedCity?.name || t.location === selectedCity?.name
    );

    // Map screenId to actual theater screen
    const theaterScreen = locationScreens[screenId - 1] || locationScreens[0];
    if (!theaterScreen) return;

    // Create showtime object
    const dateStr = dates[selectedDate].date.toISOString().split('T')[0];
    const showtime: Showtime = {
      id: `${movieId}-${theaterScreen.id}-${dateStr}-${time}`,
      movieId,
      theaterId: theaterScreen.id,
      time,
      date: dateStr,
      format: 'Dolby Atmos',
      language: movie.language,
      price: {
        standard: price.standard,
        premium: price.premium,
        recliner: Math.round(price.premium * 1.3),
        vip: Math.round(price.premium * 1.8),
      },
      availableSeats: 150,
      totalSeats: 200,
    };

    // Set booking store data
    setSelectedMovie(movie);
    setSelectedTheater(theaterScreen);
    setSelectedShowtime(showtime);
    setBookingDate(dateStr);

    // Navigate to seat selection
    router.push(`/booking/seats?showtime=${showtime.id}`);
  };

  return (
    <div className="showtimings-page">
      {/* Hero Section */}
      <div className="showtimings-hero">
        <h1 className="showtimings-hero-title">Show Timings</h1>
        <p className="showtimings-hero-subtitle">
          Check out the latest show schedules across all 4 screens at Shindhu Cinemas
        </p>
      </div>

      {/* Date Selector */}
      <div className="showtimings-date-selector">
        <div className="date-scroll-container">
          {dates.map((dateInfo, index) => (
            <button
              key={index}
              className={`date-card ${selectedDate === index ? 'date-card-active' : ''}`}
              onClick={() => setSelectedDate(index)}
            >
              <span className="date-day">{dateInfo.isToday ? 'Today' : dateInfo.day}</span>
              <span className="date-num">{dateInfo.dayNum}</span>
              <span className="date-month">{dateInfo.month}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="showtimings-filters">
        <div className="filter-group">
          <label className="filter-label">Screen</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedScreen === null ? 'filter-btn-active' : ''}`}
              onClick={() => setSelectedScreen(null)}
            >
              All Screens
            </button>
            {screens.map((screen) => (
              <button
                key={screen.id}
                className={`filter-btn ${selectedScreen === screen.id ? 'filter-btn-active' : ''}`}
                onClick={() => setSelectedScreen(screen.id)}
              >
                Screen {screen.id}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Language</label>
          <div className="filter-buttons">
            {languages.map((lang) => (
              <button
                key={lang}
                className={`filter-btn ${(selectedLanguage === lang) || (lang === 'All' && selectedLanguage === null) ? 'filter-btn-active' : ''}`}
                onClick={() => setSelectedLanguage(lang === 'All' ? null : lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Screen Info Cards */}
      <div className="screens-overview">
        <h2 className="section-title">Our Screens</h2>
        <div className="screens-grid">
          {screens.map((screen) => (
            <div
              key={screen.id}
              className={`screen-card screen-card-${screen.type}`}
              onClick={() => setSelectedScreen(selectedScreen === screen.id ? null : screen.id)}
            >
              <div className="screen-card-header">
                <div className="screen-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <h3 className="screen-name">{screen.name}</h3>
                  <p className="screen-capacity">{screen.capacity} Seats</p>
                </div>
              </div>
              <div className="screen-features">
                {screen.features.map((feature, index) => (
                  <span key={index} className="feature-tag">{feature}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Movies with Showtimes */}
      <div className="movies-showtimes">
        <h2 className="section-title">
          Movies Playing on {dates[selectedDate].isToday ? 'Today' : `${dates[selectedDate].day}, ${dates[selectedDate].dayNum} ${dates[selectedDate].month}`}
        </h2>

        {filteredMovies.length === 0 ? (
          <div className="no-movies">
            <svg className="no-movies-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p>No movies found for the selected filters.</p>
            <button className="reset-filters-btn" onClick={() => { setSelectedScreen(null); setSelectedLanguage(null); }}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="movies-list">
            {filteredMovies.map((movie) => (
              <div key={movie.movieId} className="movie-showtime-card">
                <div className="movie-info">
                  <div className="movie-poster">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <div className="movie-details">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="movie-rating">{movie.rating}</span>
                      <span className="movie-language">{movie.language}</span>
                      <span className="movie-duration">{movie.duration}</span>
                    </div>
                    <p className="movie-genre">{movie.genre}</p>
                  </div>
                </div>

                <div className="movie-screens">
                  {movie.shows
                    .filter((show) => selectedScreen === null || show.screenId === selectedScreen)
                    .map((show) => {
                      const screen = getScreenById(show.screenId);
                      return (
                        <div key={show.screenId} className="screen-showtimes">
                          <div className="screen-showtime-header">
                            <span className="screen-showtime-name">{screen?.name}</span>
                            <span className="screen-showtime-price">From Rs.{show.price.standard}</span>
                          </div>
                          <div className="showtime-buttons">
                            {show.times
                              .filter(time => !isShowtimePassed(dates[selectedDate].date.toISOString().split('T')[0], time))
                              .map((time, index) => (
                                <button
                                  key={index}
                                  onClick={() => handleShowtimeClick(movie.movieId, show.screenId, time, show.price)}
                                  className={`showtime-btn ${screen?.type === 'premium' ? 'showtime-btn-premium' : screen?.type === 'dolby' ? 'showtime-btn-dolby' : ''}`}
                                >
                                  {time}
                                </button>
                              ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="showtimings-legend">
        <h3 className="legend-title">Screen Types</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-color legend-color-premium"></span>
            <span>Dolby Atmos Premium</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-color-dolby"></span>
            <span>Dolby Atmos</span>
          </div>
          <div className="legend-item">
            <span className="legend-color legend-color-standard"></span>
            <span>Standard</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="showtimings-info">
        <div className="info-card">
          <svg className="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="info-title">Booking Information</h4>
            <p className="info-text">
              Click on any showtime to proceed with booking. Prices may vary based on seat selection and screen type.
              Online booking closes 30 minutes before showtime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
