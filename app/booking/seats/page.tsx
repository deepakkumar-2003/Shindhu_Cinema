'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/lib/store';
import { generateSeatLayout } from '@/lib/data';
import { Seat, SeatLayout } from '@/lib/types';
import './page.css';

function SeatSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes in seconds
  const [isZoomed, setIsZoomed] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const initializedRef = useRef(false);

  const {
    selectedMovie,
    selectedTheater,
    selectedShowtime,
    selectedSeats,
    addSeat,
    removeSeat,
    clearSeats,
    getTicketTotal,
  } = useBookingStore();

  // Wait for hydration before checking state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isHydrated) return;

    if (!selectedMovie || !selectedTheater || !selectedShowtime) {
      router.push('/');
      return;
    }

    const layout = generateSeatLayout(selectedShowtime.id, selectedShowtime.price);
    setSeatLayout(layout);

    // Only clear seats on first visit, not when navigating back
    // Check if this is a fresh showtime selection (from URL param) or back navigation
    const showtimeParam = searchParams.get('showtime');
    if (showtimeParam && !initializedRef.current) {
      // Fresh selection from showtime page - clear any old seats
      clearSeats();
      initializedRef.current = true;
    }
  }, [isHydrated, selectedMovie, selectedTheater, selectedShowtime, searchParams]);

  // Countdown timer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          clearSeats();
          router.push('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;

    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) {
      removeSeat(seat.id);
    } else {
      if (selectedSeats.length >= 10) {
        alert('Maximum 10 seats allowed per booking');
        return;
      }
      addSeat({ ...seat, status: 'selected' });
    }
  };

  const getSeatClass = (seat: Seat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);
    if (isSelected) return 'seat-selected';
    if (seat.status === 'booked') return 'seat-booked';
    if (seat.status === 'locked') return 'seat-booked';

    switch (seat.type) {
      case 'premium':
        return 'seat-premium seat-available';
      case 'recliner':
        return 'seat-recliner seat-available';
      case 'vip':
        return 'seat-vip seat-available';
      default:
        return 'seat-available';
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    router.push('/booking/snacks');
  };

  if (!isHydrated || !selectedMovie || !selectedTheater || !selectedShowtime || !seatLayout) {
    return (
      <div className="seats-loading">
        <p className="seats-loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="seats-page">
      {/* Header */}
      <div className="seats-header">
        <div>
          <h1 className="seats-title">{selectedMovie.title}</h1>
          <p className="seats-subtitle">
            {selectedTheater.name} | {selectedShowtime.date} | {selectedShowtime.time} | {selectedShowtime.format}
          </p>
        </div>

        {/* Timer */}
        <div className={`seats-timer ${timeLeft < 60 ? 'warning' : ''}`}>
          <svg className="seats-timer-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="seats-timer-value">{formatTime(timeLeft)}</span>
          <span className="seats-timer-label">left</span>
        </div>
      </div>

      {/* Seat Legend */}
      <div className="seats-legend">
        <div className="seats-legend-item">
          <div className="seats-legend-box seat-available"></div>
          <span className="seats-legend-text">Available</span>
        </div>
        <div className="seats-legend-item">
          <div className="seats-legend-box seat-selected"></div>
          <span className="seats-legend-text">Selected</span>
        </div>
        <div className="seats-legend-item">
          <div className="seats-legend-box seat-booked"></div>
          <span className="seats-legend-text">Booked</span>
        </div>
        <div className="seats-legend-item">
          <div className="seats-legend-box seat-premium"></div>
          <span className="seats-legend-text">Premium (₹{selectedShowtime.price.premium})</span>
        </div>
        <div className="seats-legend-item">
          <div className="seats-legend-box seat-recliner"></div>
          <span className="seats-legend-text">Recliner (₹{selectedShowtime.price.recliner})</span>
        </div>
        <div className="seats-legend-item">
          <div className="seats-legend-box seat-vip"></div>
          <span className="seats-legend-text">VIP (₹{selectedShowtime.price.vip})</span>
        </div>
      </div>

      {/* Zoom Toggle (Mobile) */}
      <div className="seats-zoom-wrapper">
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="seats-zoom-btn"
        >
          <svg className="seats-zoom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isZoomed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            )}
          </svg>
          {isZoomed ? 'Zoom Out' : 'Zoom In'}
        </button>
      </div>

      {/* Seat Map */}
      <div className={`seats-map-container ${isZoomed ? 'zoomed' : ''}`}>
        <div className="seats-map-inner">
          {/* Screen */}
          <div className="seats-screen-wrapper">
            <div className="seats-screen"></div>
            <p className="seats-screen-text">Screen this way</p>
          </div>

          {/* Seats */}
          <div className="seats-rows">
            {seatLayout.rows.map((row) => (
              <div key={row.label} className="seats-row">
                <span className="seats-row-label">
                  {row.label}
                </span>
                <div className="seats-row-section">
                  {row.seats.slice(0, 8).map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'booked' || seat.status === 'locked'}
                      className={`seats-seat ${getSeatClass(seat)}`}
                      title={`${seat.id} - ₹${seat.price}`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
                {/* Aisle */}
                <div className="seats-aisle"></div>
                <div className="seats-row-section">
                  {row.seats.slice(8).map((seat) => (
                    <button
                      key={seat.id}
                      onClick={() => handleSeatClick(seat)}
                      disabled={seat.status === 'booked' || seat.status === 'locked'}
                      className={`seats-seat ${getSeatClass(seat)}`}
                      title={`${seat.id} - ₹${seat.price}`}
                    >
                      {seat.number}
                    </button>
                  ))}
                </div>
                <span className="seats-row-label">
                  {row.label}
                </span>
              </div>
            ))}
          </div>

          {/* Section Labels */}
          <div className="seats-section-labels">
            <div className="seats-section-item">
              <p className="seats-section-name">STANDARD</p>
              <p className="seats-section-price">₹{selectedShowtime.price.standard}</p>
            </div>
            <div className="seats-section-item">
              <p className="seats-section-name">PREMIUM</p>
              <p className="seats-section-price">₹{selectedShowtime.price.premium}</p>
            </div>
            <div className="seats-section-item">
              <p className="seats-section-name">RECLINER</p>
              <p className="seats-section-price">₹{selectedShowtime.price.recliner}</p>
            </div>
            <div className="seats-section-item">
              <p className="seats-section-name">VIP</p>
              <p className="seats-section-price">₹{selectedShowtime.price.vip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="seats-bottom-bar">
        <div className="seats-bottom-content">
          <div className="seats-selection-info">
            {selectedSeats.length > 0 ? (
              <>
                <div className="seats-info-block">
                  <p className="seats-info-label">Selected Seats</p>
                  <p className="seats-info-value">
                    {selectedSeats.map((s) => s.id).join(', ')}
                  </p>
                </div>
                <div className="seats-info-block">
                  <p className="seats-info-label">Total Amount</p>
                  <p className="seats-info-total">
                    ₹{getTicketTotal()}
                  </p>
                </div>
              </>
            ) : (
              <p className="seats-placeholder-text">Select seats to continue</p>
            )}
          </div>
          <div className="seats-actions">
            <button
              onClick={() => router.back()}
              className="seats-back-btn"
            >
              Back
            </button>
            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="seats-proceed-btn"
            >
              Proceed to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SeatSelectionPage() {
  return (
    <Suspense fallback={
      <div className="seats-loading">
        <p className="seats-loading-text">Loading...</p>
      </div>
    }>
      <SeatSelectionContent />
    </Suspense>
  );
}
