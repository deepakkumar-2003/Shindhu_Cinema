'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUserStore } from '@/lib/store';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import './page.css';

interface LocalBooking {
  orderId: string;
  movie: {
    title: string;
    poster: string;
    certification: string;
    language: string;
  };
  theater: {
    name: string;
    location: string;
    id?: string;
  };
  showtime: {
    date: string;
    time: string;
    format: string;
    id?: string;
  };
  seats: Array<{
    id: string;
    row: string;
    number: number;
  }>;
  totalAmount: number;
  status: string;
  bookingDate: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const { isAuthenticated } = useUserStore();
  const [bookings, setBookings] = useState<LocalBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<LocalBooking | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const loadBookings = () => {
      setIsLoading(true);

      // Load bookings from localStorage
      const allBookings: LocalBooking[] = [];

      // Get the last booking
      const lastBookingStr = localStorage.getItem('lastBooking');
      if (lastBookingStr) {
        try {
          const lastBooking = JSON.parse(lastBookingStr);
          allBookings.push(lastBooking);
        } catch (error) {
          console.error('Error parsing last booking:', error);
        }
      }

      // Get all bookings history
      const bookingsHistoryStr = localStorage.getItem('bookingsHistory');
      if (bookingsHistoryStr) {
        try {
          const bookingsHistory = JSON.parse(bookingsHistoryStr);
          if (Array.isArray(bookingsHistory)) {
            allBookings.push(...bookingsHistory);
          }
        } catch (error) {
          console.error('Error parsing bookings history:', error);
        }
      }

      // Remove duplicates based on orderId
      const uniqueBookings = allBookings.filter((booking, index, self) =>
        index === self.findIndex((b) => b.orderId === booking.orderId)
      );

      // Sort by booking date (newest first)
      uniqueBookings.sort((a, b) =>
        new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );

      setBookings(uniqueBookings);
      setIsLoading(false);
    };

    loadBookings();
  }, [isAuthenticated, router]);

  const handleCancelClick = (booking: LocalBooking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const handleCancelConfirm = () => {
    if (!bookingToCancel) return;

    // Free up the seats in localStorage
    const showtimeKey = `booked_seats_${bookingToCancel.showtime.id || 'unknown'}`;
    const bookedSeatsStr = localStorage.getItem(showtimeKey);

    if (bookedSeatsStr) {
      try {
        const bookedSeats: string[] = JSON.parse(bookedSeatsStr);
        // Remove the canceled booking's seats
        const seatIdsToRemove = bookingToCancel.seats.map(s => s.id);
        const updatedSeats = bookedSeats.filter(seatId => !seatIdsToRemove.includes(seatId));

        if (updatedSeats.length > 0) {
          localStorage.setItem(showtimeKey, JSON.stringify(updatedSeats));
        } else {
          localStorage.removeItem(showtimeKey);
        }
      } catch (error) {
        console.error('Error updating booked seats:', error);
      }
    }

    // Update booking status to cancelled
    const updatedBooking = { ...bookingToCancel, status: 'cancelled' };

    // Update lastBooking if it matches
    const lastBookingStr = localStorage.getItem('lastBooking');
    if (lastBookingStr) {
      try {
        const lastBooking = JSON.parse(lastBookingStr);
        if (lastBooking.orderId === bookingToCancel.orderId) {
          localStorage.setItem('lastBooking', JSON.stringify(updatedBooking));
        }
      } catch (error) {
        console.error('Error updating last booking:', error);
      }
    }

    // Update bookings history
    const bookingsHistoryStr = localStorage.getItem('bookingsHistory');
    if (bookingsHistoryStr) {
      try {
        const bookingsHistory = JSON.parse(bookingsHistoryStr);
        const updatedHistory = bookingsHistory.map((b: LocalBooking) =>
          b.orderId === bookingToCancel.orderId ? updatedBooking : b
        );
        localStorage.setItem('bookingsHistory', JSON.stringify(updatedHistory));
      } catch (error) {
        console.error('Error updating bookings history:', error);
      }
    }

    // Update UI
    setBookings(prevBookings =>
      prevBookings.map(b =>
        b.orderId === bookingToCancel.orderId ? updatedBooking : b
      )
    );

    setBookingToCancel(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  // Filter bookings based on status and date
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Set to start of today for accurate date comparison

  const upcomingBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (!b.showtime?.date) return false;

    const showDate = new Date(b.showtime.date);
    showDate.setHours(0, 0, 0, 0); // Set to start of day

    // Show is upcoming if it's today or in the future
    return showDate >= now;
  });

  const pastBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return true;
    if (!b.showtime?.date) return false;

    const showDate = new Date(b.showtime.date);
    showDate.setHours(0, 0, 0, 0); // Set to start of day

    // Show is past if it was before today
    return showDate < now;
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="bookings-badge bookings-badge-upcoming">Pending</span>;
      case 'confirmed':
        return <span className="bookings-badge bookings-badge-upcoming">Confirmed</span>;
      case 'completed':
        return <span className="bookings-badge bookings-badge-completed">Completed</span>;
      case 'cancelled':
        return <span className="bookings-badge bookings-badge-cancelled">Cancelled</span>;
      default:
        return <span className="bookings-badge bookings-badge-upcoming">{status}</span>;
    }
  };

  // Format seat labels
  const formatSeats = (seats?: Array<{ id?: string; row?: string; number?: number }>) => {
    if (!seats || seats.length === 0) return 'N/A';
    return seats.map(s => s.id || `${s.row}${s.number}`).join(', ');
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
        {isLoading ? (
          <div className="bookings-empty">
            <p className="bookings-empty-text">Loading bookings...</p>
          </div>
        ) : upcomingBookings.length > 0 ? (
          <div className="bookings-list">
            {upcomingBookings.map((booking) => (
              <div key={booking.orderId} className="bookings-card">
                <div className="bookings-card-content">
                  <img
                    src={booking.movie?.poster || '/placeholder-poster.jpg'}
                    alt={booking.movie?.title || 'Movie'}
                    className="bookings-poster"
                  />
                  <div className="bookings-card-details">
                    <div className="bookings-card-header">
                      <div>
                        <h3 className="bookings-movie-title">{booking.movie?.title || 'Unknown Movie'}</h3>
                        <p className="bookings-theater">{booking.theater?.name || 'Unknown Theater'}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="bookings-info-grid">
                      <div>
                        <p className="bookings-info-label">Date</p>
                        <p className="bookings-info-value">
                          {booking.showtime?.date
                            ? new Date(booking.showtime.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Time</p>
                        <p className="bookings-info-value">{booking.showtime?.time || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Seats</p>
                        <p className="bookings-info-value">{formatSeats(booking.seats)}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Format</p>
                        <p className="bookings-info-value">{booking.showtime?.format || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="bookings-card-footer">
                      <div>
                        <p className="bookings-order-id">Order #{booking.orderId}</p>
                        <p className="bookings-total primary">₹{booking.totalAmount.toFixed(2)}</p>
                      </div>
                      <div className="bookings-actions">
                        <button className="bookings-view-btn">
                          View Ticket
                        </button>
                        <button
                          className="bookings-cancel-btn"
                          onClick={() => handleCancelClick(booking)}
                        >
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
        {isLoading ? (
          <div className="bookings-empty">
            <p className="bookings-empty-text">Loading bookings...</p>
          </div>
        ) : pastBookings.length > 0 ? (
          <div className="bookings-list">
            {pastBookings.map((booking) => (
              <div key={booking.orderId} className="bookings-card past">
                <div className="bookings-card-content">
                  <img
                    src={booking.movie?.poster || '/placeholder-poster.jpg'}
                    alt={booking.movie?.title || 'Movie'}
                    className="bookings-poster grayscale"
                  />
                  <div className="bookings-card-details">
                    <div className="bookings-card-header">
                      <div>
                        <h3 className="bookings-movie-title">{booking.movie?.title || 'Unknown Movie'}</h3>
                        <p className="bookings-theater">{booking.theater?.name || 'Unknown Theater'}</p>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                    <div className="bookings-info-grid">
                      <div>
                        <p className="bookings-info-label">Date</p>
                        <p className="bookings-info-value">
                          {booking.showtime?.date
                            ? new Date(booking.showtime.date).toLocaleDateString('en-US', {
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short',
                              })
                            : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Time</p>
                        <p className="bookings-info-value">{booking.showtime?.time || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Seats</p>
                        <p className="bookings-info-value">{formatSeats(booking.seats)}</p>
                      </div>
                      <div>
                        <p className="bookings-info-label">Format</p>
                        <p className="bookings-info-value">{booking.showtime?.format || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="bookings-card-footer">
                      <div>
                        <p className="bookings-order-id">Order #{booking.orderId}</p>
                        <p className="bookings-total">₹{booking.totalAmount.toFixed(2)}</p>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        message={`Are you sure you want to cancel this booking? Your seats ${bookingToCancel?.seats.map(s => s.id).join(', ')} will become available for others to book.`}
        confirmText="Yes"
        cancelText="No"
      />
    </div>
  );
}
