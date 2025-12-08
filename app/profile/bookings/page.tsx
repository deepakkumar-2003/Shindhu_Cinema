'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store';
import { movies } from '@/lib/data';
import './page.css';

// Sample booking history
const sampleBookings = [
  {
    id: 'SHC001',
    movie: movies[0],
    theater: 'PVR Cinemas - Phoenix Mall',
    date: '2024-12-10',
    time: '19:15',
    seats: ['H5', 'H6'],
    format: '3D',
    total: 980,
    status: 'upcoming',
  },
  {
    id: 'SHC002',
    movie: movies[1],
    theater: 'INOX - Nariman Point',
    date: '2024-11-25',
    time: '16:00',
    seats: ['J8', 'J9', 'J10'],
    format: 'IMAX',
    total: 1650,
    status: 'completed',
  },
  {
    id: 'SHC003',
    movie: movies[4],
    theater: 'Cinepolis - Andheri',
    date: '2024-11-15',
    time: '21:30',
    seats: ['E3', 'E4'],
    format: '2D',
    total: 520,
    status: 'cancelled',
  },
];

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const upcomingBookings = sampleBookings.filter((b) => b.status === 'upcoming');
  const pastBookings = sampleBookings.filter((b) => b.status !== 'upcoming');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <span className="bookings-badge bookings-badge-upcoming">Upcoming</span>;
      case 'completed':
        return <span className="bookings-badge bookings-badge-completed">Completed</span>;
      case 'cancelled':
        return <span className="bookings-badge bookings-badge-cancelled">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <Link href="/profile" className="bookings-back-link">
          <svg className="bookings-back-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="bookings-title">My Bookings</h1>
      </div>

      {/* Upcoming Bookings */}
      <section className="bookings-section">
        <h2 className="bookings-section-title">Upcoming</h2>
        {upcomingBookings.length > 0 ? (
          <div className="bookings-list">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="bookings-card">
                <div className="bookings-card-content">
                  <img
                    src={booking.movie.poster}
                    alt={booking.movie.title}
                    className="bookings-poster"
                  />
                  <div className="bookings-card-details">
                    <div className="bookings-card-header">
                      <div>
                        <h3 className="bookings-movie-title">{booking.movie.title}</h3>
                        <p className="bookings-theater">{booking.theater}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="bookings-info-grid">
                      <div>
                        <p className="bookings-info-label">Date</p>
                        <p className="bookings-info-value">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Time</p>
                        <p className="bookings-info-value">{booking.time}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Seats</p>
                        <p className="bookings-info-value">{booking.seats.join(', ')}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Format</p>
                        <p className="bookings-info-value">{booking.format}</p>
                      </div>
                    </div>
                    <div className="bookings-card-footer">
                      <div>
                        <p className="bookings-order-id">Order #{booking.id}</p>
                        <p className="bookings-total primary">₹{booking.total}</p>
                      </div>
                      <div className="bookings-actions">
                        <button className="bookings-view-btn">
                          View Ticket
                        </button>
                        <button className="bookings-cancel-btn">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bookings-empty">
            <svg className="bookings-empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="bookings-empty-text">No upcoming bookings</p>
            <Link href="/" className="bookings-book-btn">
              Book Now
            </Link>
          </div>
        )}
      </section>

      {/* Past Bookings */}
      <section className="bookings-section">
        <h2 className="bookings-section-title">Past Bookings</h2>
        {pastBookings.length > 0 ? (
          <div className="bookings-list">
            {pastBookings.map((booking) => (
              <div key={booking.id} className="bookings-card past">
                <div className="bookings-card-content">
                  <img
                    src={booking.movie.poster}
                    alt={booking.movie.title}
                    className="bookings-poster grayscale"
                  />
                  <div className="bookings-card-details">
                    <div className="bookings-card-header">
                      <div>
                        <h3 className="bookings-movie-title">{booking.movie.title}</h3>
                        <p className="bookings-theater">{booking.theater}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="bookings-info-grid">
                      <div>
                        <p className="bookings-info-label">Date</p>
                        <p className="bookings-info-value">
                          {new Date(booking.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            day: 'numeric',
                            month: 'short',
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Time</p>
                        <p className="bookings-info-value">{booking.time}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Seats</p>
                        <p className="bookings-info-value">{booking.seats.join(', ')}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Format</p>
                        <p className="bookings-info-value">{booking.format}</p>
                      </div>
                    </div>
                    <div className="bookings-card-footer">
                      <div>
                        <p className="bookings-order-id">Order #{booking.id}</p>
                        <p className="bookings-total">₹{booking.total}</p>
                      </div>
                      {booking.status === 'completed' && (
                        <button className="bookings-again-btn">
                          Book Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bookings-empty">
            <p className="bookings-empty-text">No past bookings</p>
          </div>
        )}
      </section>
    </div>
  );
}
