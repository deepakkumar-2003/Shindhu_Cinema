'use client';

import { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingStore, useUIStore } from '@/lib/store';
import { useAuth } from '@/lib/supabase/auth';
import { generateSeatLayout } from '@/lib/data';
import { Seat, SeatLayout } from '@/lib/types';
import AuthModal from '@/components/modals/AuthModal';
import './page.css';

const MIN_ZOOM = 1;
const MAX_ZOOM = 2.5;
const ZOOM_STEP = 0.25;

function SeatSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null);
  const [timeLeft, setTimeLeft] = useState(480); // 8 minutes in seconds
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);
  const initializedRef = useRef(false);

  // Touch gesture refs
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const isPinching = useRef(false);
  const isDragging = useRef(false);
  const lastPanPosition = useRef<{ x: number; y: number } | null>(null);

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

  const { isAuthenticated } = useAuth();
  const { isAuthModalOpen, setIsAuthModalOpen } = useUIStore();

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
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle timer expiry - redirect when time runs out
  useEffect(() => {
    if (timeLeft === 0) {
      clearSeats();
      router.push('/');
    }
  }, [timeLeft, clearSeats, router]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === 'booked' || seat.status === 'locked') return;

    // Check if user is authenticated before allowing seat selection
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

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

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  // Reset pan when zoom returns to 1
  useEffect(() => {
    if (zoomLevel <= 1) {
      setPanX(0);
      setPanY(0);
    }
  }, [zoomLevel]);

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate center point between two touches
  const getCenter = (touch1: React.Touch, touch2: React.Touch) => {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  // Constrain pan within bounds
  const constrainPan = useCallback((x: number, y: number, zoom: number) => {
    if (!containerRef.current) return { x, y };

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate max pan based on zoom level
    const maxPanX = Math.max(0, (containerWidth * (zoom - 1)) / 2);
    const maxPanY = Math.max(0, (containerHeight * (zoom - 1)) / 2);

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, y)),
    };
  }, []);

  // Touch start handler
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch gesture started
      isPinching.current = true;
      isDragging.current = false;
      lastTouchDistance.current = getDistance(e.touches[0], e.touches[1]);
      lastTouchCenter.current = getCenter(e.touches[0], e.touches[1]);
    } else if (e.touches.length === 1 && zoomLevel > 1) {
      // Single finger drag (only when zoomed in)
      isDragging.current = true;
      isPinching.current = false;
      lastPanPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }, [zoomLevel]);

  // Touch move handler
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching.current && lastTouchDistance.current !== null) {
      // Pinch zoom
      e.preventDefault();

      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / lastTouchDistance.current;

      setZoomLevel((prev) => {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev * scale));
        return newZoom;
      });

      // Update pan to follow pinch center
      const currentCenter = getCenter(e.touches[0], e.touches[1]);
      if (lastTouchCenter.current) {
        const dx = currentCenter.x - lastTouchCenter.current.x;
        const dy = currentCenter.y - lastTouchCenter.current.y;

        setPanX((prev) => {
          const newX = prev + dx;
          return constrainPan(newX, panY, zoomLevel).x;
        });
        setPanY((prev) => {
          const newY = prev + dy;
          return constrainPan(panX, newY, zoomLevel).y;
        });
      }

      lastTouchDistance.current = currentDistance;
      lastTouchCenter.current = currentCenter;
    } else if (e.touches.length === 1 && isDragging.current && lastPanPosition.current && zoomLevel > 1) {
      // Single finger pan (only when zoomed in)
      e.preventDefault();

      const dx = e.touches[0].clientX - lastPanPosition.current.x;
      const dy = e.touches[0].clientY - lastPanPosition.current.y;

      const constrained = constrainPan(panX + dx, panY + dy, zoomLevel);
      setPanX(constrained.x);
      setPanY(constrained.y);

      lastPanPosition.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
    // When zoomLevel === 1 and single finger, allow default scroll behavior (don't preventDefault)
  }, [zoomLevel, panX, panY, constrainPan]);

  // Touch end handler
  const handleTouchEnd = useCallback(() => {
    isPinching.current = false;
    isDragging.current = false;
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
    lastPanPosition.current = null;
  }, []);

  // Keyboard navigation for zoom
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      handleZoomIn();
    } else if (e.key === '-' || e.key === '_') {
      e.preventDefault();
      handleZoomOut();
    } else if (e.key === '0') {
      e.preventDefault();
      setZoomLevel(1);
      setPanX(0);
      setPanY(0);
    } else if (zoomLevel > 1) {
      // Arrow keys for panning when zoomed
      const PAN_STEP = 50;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const constrained = constrainPan(panX + PAN_STEP, panY, zoomLevel);
        setPanX(constrained.x);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        const constrained = constrainPan(panX - PAN_STEP, panY, zoomLevel);
        setPanX(constrained.x);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const constrained = constrainPan(panX, panY + PAN_STEP, zoomLevel);
        setPanY(constrained.y);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const constrained = constrainPan(panX, panY - PAN_STEP, zoomLevel);
        setPanY(constrained.y);
      }
    }
  }, [zoomLevel, panX, panY, constrainPan, handleZoomIn, handleZoomOut]);

  if (!isHydrated || !selectedMovie || !selectedTheater || !selectedShowtime || !seatLayout) {
    return (
      <div className="seats-loading">
        <p className="seats-loading-text">Loading...</p>
      </div>
    );
  }

  return (
    <div className="seats-page">
      {/* Sign-in Warning Banner - Only shown when not authenticated */}
      {!isAuthenticated && (
        <div className="seats-auth-warning">
          <svg className="seats-auth-warning-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Please sign in to select and book seats</span>
          <button
            className="seats-auth-warning-btn"
            onClick={() => setIsAuthModalOpen(true)}
          >
            Sign In
          </button>
        </div>
      )}

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

      {/* Zoom Controls */}
      <div className="seats-zoom-wrapper">
        <button
          onClick={handleZoomOut}
          disabled={zoomLevel <= MIN_ZOOM}
          className="seats-zoom-btn"
          aria-label="Zoom Out"
        >
          <svg className="seats-zoom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
        <span className="seats-zoom-level">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={handleZoomIn}
          disabled={zoomLevel >= MAX_ZOOM}
          className="seats-zoom-btn"
          aria-label="Zoom In"
        >
          <svg className="seats-zoom-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
      </div>
      <p className="seats-touch-hint">Pinch to zoom • Drag to pan when zoomed • Scroll to view all seats</p>
      <p className="seats-keyboard-hint">Keyboard: +/- to zoom • Arrow keys to pan • 0 to reset</p>

      {/* Seat Map Wrapper */}
      <div className="seats-map-wrapper">
        {/* Fixed Left Row Labels */}
        <div
          className="seats-fixed-labels seats-fixed-labels-left"
          style={{
            transform: `translateY(${panY}px) scaleY(${zoomLevel})`,
            transformOrigin: 'top center',
          }}
        >
          <div className="seats-fixed-labels-spacer"></div>
          {seatLayout.rows.map((row) => (
            <div key={`left-${row.label}`} className="seats-fixed-label">
              {row.label}
            </div>
          ))}
        </div>

        {/* Seat Map */}
        <div
          ref={containerRef}
          className={`seats-map-container ${zoomLevel > 1 ? 'zoomed-in' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="application"
          aria-label="Seat map. Use + and - keys to zoom, arrow keys to pan when zoomed, 0 to reset."
        >
          <div
            className="seats-map-inner"
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel})`,
              transformOrigin: 'top center',
            }}
          >
            {/* Screen */}
            <div className="seats-screen-wrapper">
              <div className="seats-screen"></div>
              <p className="seats-screen-text">Screen this way</p>
            </div>

            {/* Seats */}
            <div className="seats-rows">
              {seatLayout.rows.map((row) => (
                <div key={row.label} className="seats-row">
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

        {/* Fixed Right Row Labels */}
        <div
          className="seats-fixed-labels seats-fixed-labels-right"
          style={{
            transform: `translateY(${panY}px) scaleY(${zoomLevel})`,
            transformOrigin: 'top center',
          }}
        >
          <div className="seats-fixed-labels-spacer"></div>
          {seatLayout.rows.map((row) => (
            <div key={`right-${row.label}`} className="seats-fixed-label">
              {row.label}
            </div>
          ))}
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
              <p className="seats-placeholder-text">
                {isAuthenticated ? 'Select seats to continue' : 'Sign in to select seats'}
              </p>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
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
