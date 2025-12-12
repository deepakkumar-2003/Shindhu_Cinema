'use client';

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/lib/store';
import './page.css';

// Generate confetti styles once, outside render
function generateConfettiStyles() {
  const colors = ['#e50914', '#ffd700', '#22c55e', '#3b82f6', '#a855f7'];
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${(i * 17 + 7) % 100}%`,
    animationDelay: `${(i * 0.04) % 2}s`,
    backgroundColor: colors[i % 5],
    borderRadius: i % 2 === 0 ? '50%' : '0',
  }));
}

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [showConfetti, setShowConfetti] = useState(true);

  // Memoize confetti styles to avoid regenerating on each render
  const confettiStyles = useMemo(() => generateConfettiStyles(), []);

  const {
    selectedMovie,
    selectedTheater,
    selectedShowtime,
    selectedSeats,
    cartSnacks,
    snackPickupTime,
    getGrandTotal,
    resetBooking,
  } = useBookingStore();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Prevent going back to previous booking pages after confirmation
  useEffect(() => {
    // Replace history state so back button goes to home
    window.history.replaceState(null, '', window.location.href);

    // Push home page to history, so when user presses back, they go to home
    window.history.pushState(null, '', window.location.href);

    const handlePopState = () => {
      // When user presses back, redirect to home
      router.replace('/');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);

  if (!selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="confirmation-no-booking">
        <h1 className="confirmation-no-booking-title">No booking found</h1>
        <button onClick={() => router.push('/')} className="confirmation-home-btn">
          Go Home
        </button>
      </div>
    );
  }

  const handleNewBooking = () => {
    resetBooking();
    router.push('/');
  };

  // Generate QR code URL using a free QR code API
  const ticketQRData = `SHINDHU|${orderId}|${selectedMovie.title}|${selectedSeats.map(s => s.id).join(',')}|${selectedShowtime.date}|${selectedShowtime.time}`;
  const ticketQRUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticketQRData)}`;

  const snackQRData = cartSnacks.length > 0 ? `SNACK|${orderId}|${snackPickupTime}|${cartSnacks.map(s => `${s.quantity}x${s.snack.name}`).join(',')}` : '';
  const snackQRUrl = snackQRData ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(snackQRData)}` : '';

  return (
    <div className="confirmation-page">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="confirmation-confetti-container">
          {confettiStyles.map((style) => (
            <div
              key={style.id}
              className="confirmation-confetti"
              style={{
                left: style.left,
                animationDelay: style.animationDelay,
                backgroundColor: style.backgroundColor,
                width: '10px',
                height: '10px',
                borderRadius: style.borderRadius,
              }}
            />
          ))}
        </div>
      )}

      {/* Success Header */}
      <div className="confirmation-header">
        <div className="confirmation-success-icon">
          <svg fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your tickets have been booked successfully</p>
        <p className="confirmation-order-id">Order ID: <span>{orderId}</span></p>
      </div>

      {/* Ticket Card */}
      <div className="confirmation-ticket-card">
        {/* Movie Banner */}
        <div className="confirmation-banner">
          <img src={selectedMovie.backdrop} alt={selectedMovie.title} />
          <div className="confirmation-banner-overlay" />
        </div>

        <div className="confirmation-ticket-content">
          <div className="confirmation-ticket-details">
            {/* Movie Details */}
            <div className="confirmation-movie-info">
              <h2 className="confirmation-movie-title">{selectedMovie.title}</h2>
              <div className="confirmation-badges">
                <span className="confirmation-badge confirmation-badge-primary">{selectedShowtime.format}</span>
                <span className="confirmation-badge confirmation-badge-secondary">{selectedMovie.language}</span>
                <span className="confirmation-badge confirmation-badge-secondary">{selectedMovie.certification}</span>
              </div>

              <div className="confirmation-info-grid">
                <div>
                  <p className="confirmation-info-label">Date</p>
                  <p className="confirmation-info-value">
                    {new Date(selectedShowtime.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="confirmation-info-label">Time</p>
                  <p className="confirmation-info-value">{selectedShowtime.time}</p>
                </div>
                <div>
                  <p className="confirmation-info-label">Cinema</p>
                  <p className="confirmation-info-value">{selectedTheater.name}</p>
                </div>
                <div>
                  <p className="confirmation-info-label">Screen</p>
                  <p className="confirmation-info-value">Screen 1</p>
                </div>
                <div className="confirmation-info-full">
                  <p className="confirmation-info-label">Seats</p>
                  <p className="confirmation-seats-value">
                    {selectedSeats.map((s) => s.id).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="confirmation-qr-container">
              <img src={ticketQRUrl} alt="Ticket QR Code" />
              <p className="confirmation-qr-text">Scan at Entry</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="confirmation-divider">
          <div className="confirmation-divider-left"></div>
          <div className="confirmation-divider-right"></div>
          <div className="confirmation-divider-line"></div>
        </div>

        {/* Footer */}
        <div className="confirmation-ticket-footer">
          <div>
            <p className="confirmation-total-label">Total Paid</p>
            <p className="confirmation-total-value">₹{getGrandTotal()}</p>
          </div>
          <div className="confirmation-footer-right">
            <p className="confirmation-footer-text">{selectedSeats.length} Ticket(s)</p>
            <p className="confirmation-footer-text">{selectedTheater.location}</p>
          </div>
        </div>
      </div>

      {/* Snacks QR (if any) */}
      {cartSnacks.length > 0 && (
        <div className="confirmation-snacks-card">
          <div className="confirmation-snacks-content">
            <div className="confirmation-snacks-info">
              <h3 className="confirmation-snacks-title">Snack Order</h3>
              <div className="confirmation-snacks-list">
                {cartSnacks.map((item, index) => (
                  <div key={index} className="confirmation-snack-item">
                    <span>
                      {item.quantity}x {item.snack.name}
                      {item.variant.size !== 'regular' && ` (${item.variant.size})`}
                    </span>
                    <span>
                      ₹{(item.variant.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="confirmation-pickup-info">
                <svg className="confirmation-pickup-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="confirmation-pickup-title">
                    Pickup: {snackPickupTime === 'pre-show' ? '15 mins before showtime' : 'During Interval'}
                  </p>
                  <p className="confirmation-pickup-subtitle">Counter will be displayed on screen</p>
                </div>
              </div>
            </div>
            <div className="confirmation-snack-qr">
              <img src={snackQRUrl} alt="Snack QR Code" />
              <p className="confirmation-snack-qr-text">Scan at Counter</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="confirmation-actions">
        <button onClick={() => window.print()} className="confirmation-btn confirmation-btn-secondary">
          <svg className="confirmation-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Ticket
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'My Movie Ticket',
                text: `I'm watching ${selectedMovie.title} at ${selectedTheater.name} on ${selectedShowtime.date} at ${selectedShowtime.time}!`,
              });
            }
          }}
          className="confirmation-btn confirmation-btn-secondary"
        >
          <svg className="confirmation-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        <button onClick={handleNewBooking} className="confirmation-btn confirmation-btn-primary">
          <svg className="confirmation-btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Book Another
        </button>
      </div>

      {/* Important Notes */}
      <div className="confirmation-notes">
        <h3 className="confirmation-notes-title">Important Information</h3>
        <ul className="confirmation-notes-list">
          <li className="confirmation-note-item">
            <svg className="confirmation-note-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Please arrive at least 15 minutes before the showtime
          </li>
          <li className="confirmation-note-item">
            <svg className="confirmation-note-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Show the QR code at the entry for ticket verification
          </li>
          <li className="confirmation-note-item">
            <svg className="confirmation-note-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Outside food and beverages are not allowed
          </li>
          <li className="confirmation-note-item">
            <svg className="confirmation-note-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Cancellation is allowed up to 2 hours before showtime
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div className="confirmation-contact">
        <p>Need help? Contact us at <a href="mailto:support@shindhucinemas.com">support@shindhucinemas.com</a></p>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="confirmation-loading">
        <p className="confirmation-loading-text">Loading...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
