'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore, useUserStore, useUIStore } from '@/lib/store';
import { createBooking } from '@/lib/supabase/services/bookings';
import './page.css';

const paymentMethods = [
  { id: 'upi', name: 'UPI', icon: '📱', description: 'Pay using any UPI app' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks supported' },
  { id: 'wallet', name: 'Wallets', icon: '👛', description: 'Paytm, PhonePe, Amazon Pay' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const hasCheckedState = useRef(false);

  const { isAuthenticated } = useUserStore();
  const { setIsAuthModalOpen } = useUIStore();
  const {
    selectedMovie,
    selectedTheater,
    selectedShowtime,
    selectedSeats,
    cartSnacks,
    snackPickupTime,
    getTicketTotal,
    getSnackTotal,
    getConvenienceFee,
    getTax,
    getGrandTotal,
  } = useBookingStore();

  // Wait for hydration and store rehydration before checking state
  useEffect(() => {
    // Give the persist middleware time to rehydrate from localStorage
    const timer = setTimeout(() => {
      setIsHydrated(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Only redirect after hydration is complete and we've confirmed no booking data
  useEffect(() => {
    if (isHydrated && !hasCheckedState.current) {
      hasCheckedState.current = true;
      if (!selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
        router.push('/');
      }
    }
  }, [isHydrated, selectedMovie, selectedTheater, selectedShowtime, selectedSeats, router]);

  if (!isHydrated || !selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="checkout-loading">
        <p className="checkout-loading-text">Loading...</p>
      </div>
    );
  }

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'FIRST20') {
      const discount = Math.round(getTicketTotal() * 0.2);
      setPromoDiscount(discount);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
  };

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsProcessing(true);

    try {
      // Validate required data
      if (!selectedMovie?.id || !selectedTheater?.id || !selectedShowtime?.id) {
        throw new Error('Missing required booking information. Please start over.');
      }

      if (selectedSeats.length === 0) {
        throw new Error('Please select at least one seat.');
      }

      // Simulate payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate a demo order ID
      const orderId = 'DEMO-' + Date.now().toString(36).toUpperCase();

      // Store booking data in localStorage for confirmation page
      const bookingData = {
        orderId,
        movie: selectedMovie,
        theater: selectedTheater,
        showtime: selectedShowtime,
        seats: selectedSeats,
        snacks: cartSnacks,
        snackPickupTime: snackPickupTime,
        ticketAmount: getTicketTotal(),
        snackAmount: getSnackTotal(),
        convenienceFee: getConvenienceFee(),
        taxAmount: getTax(),
        discountAmount: promoDiscount,
        promoCode: promoApplied ? promoCode : null,
        paymentMethod: selectedPayment,
        totalAmount: finalTotal,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
      };

      // Save as last booking
      localStorage.setItem('lastBooking', JSON.stringify(bookingData));

      // Add to bookings history
      const existingHistory = localStorage.getItem('bookingsHistory');
      const bookingsHistory = existingHistory ? JSON.parse(existingHistory) : [];
      bookingsHistory.unshift(bookingData); // Add to beginning
      localStorage.setItem('bookingsHistory', JSON.stringify(bookingsHistory));

      setIsProcessing(false);

      // Navigate to confirmation with order ID
      router.push(`/booking/confirmation?orderId=${orderId}`);
    } catch (error) {
      setIsProcessing(false);
      console.error('Payment error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payment. Please try again.';
      alert(`Payment Failed: ${errorMessage}`);
    }
  };

  const finalTotal = getGrandTotal() - promoDiscount;

  return (
    <div className="checkout-container">
      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div className="progress-step">
          <div className="progress-circle progress-circle-completed">✓</div>
          <span className="progress-label">Seats</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="progress-circle progress-circle-completed">✓</div>
          <span className="progress-label">Snacks</span>
        </div>
        <div className="progress-line"></div>
        <div className="progress-step">
          <div className="progress-circle progress-circle-active">3</div>
          <span className="progress-label progress-label-active">Payment</span>
        </div>
      </div>

      <div className="checkout-grid">
        {/* Main Content */}
        <div className="checkout-main">
          {/* Booking Details */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">Booking Summary</h2>

            {/* Movie Info */}
            <div className="movie-info">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="movie-poster"
              />
              <div className="movie-details">
                <h3 className="movie-title">{selectedMovie.title}</h3>
                <p className="movie-meta">{selectedMovie.certification} • {selectedMovie.language}</p>
                <p className="movie-showtime">
                  {selectedShowtime.format} • {new Date(selectedShowtime.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })} • {selectedShowtime.time}
                </p>
                <p className="movie-theater">{selectedTheater.name}</p>
              </div>
            </div>

            {/* Seats */}
            <div className="tickets-section">
              <div className="tickets-row">
                <div>
                  <p className="tickets-label">{selectedSeats.length} Ticket(s)</p>
                  <p className="tickets-seats">
                    Seats: {selectedSeats.map((s) => s.id).join(', ')}
                  </p>
                </div>
                <p className="tickets-price">₹{getTicketTotal()}</p>
              </div>
            </div>

            {/* Snacks */}
            {cartSnacks.length > 0 && (
              <div className="snacks-section">
                <p className="snacks-title">Snacks & Beverages</p>
                {cartSnacks.map((item, index) => (
                  <div key={index} className="snack-item">
                    <span className="snack-name">
                      {item.quantity}x {item.snack.name}
                      {item.variant.size !== 'regular' && ` (${item.variant.size})`}
                    </span>
                    <span>
                      ₹{(item.variant.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="snacks-total">
                  <span className="snacks-pickup">Pickup: {snackPickupTime === 'pre-show' ? 'Before Movie' : 'During Interval'}</span>
                  <span className="snacks-total-price">₹{getSnackTotal()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Promo Code */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">Promo Code</h2>
            {promoApplied ? (
              <div className="promo-applied">
                <div className="promo-applied-left">
                  <svg className="promo-applied-icon" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="promo-applied-text">{promoCode.toUpperCase()} applied</span>
                </div>
                <div className="promo-applied-right">
                  <span className="promo-discount">-₹{promoDiscount}</span>
                  <button onClick={handleRemovePromo} className="promo-remove">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="promo-input-row">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="promo-input"
                />
                <button onClick={handleApplyPromo} className="promo-apply-btn">
                  Apply
                </button>
              </div>
            )}
            <p className="promo-hint">Try: FIRST20 for 20% off on first booking</p>
          </div>

          {/* Payment Methods */}
          <div className="checkout-card">
            <h2 className="checkout-card-title">Payment Method</h2>
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`payment-method-btn ${selectedPayment === method.id ? 'payment-method-btn-selected' : ''}`}
                >
                  <span className="payment-icon">{method.icon}</span>
                  <div className="payment-info">
                    <p className="payment-name">{method.name}</p>
                    <p className="payment-description">{method.description}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <svg className="payment-check-icon" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Payment Details Form */}
            {selectedPayment === 'upi' && (
              <div className="payment-form">
                <div className="payment-form-group">
                  <label className="payment-form-label">Enter UPI ID</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@upi"
                    className="payment-form-input"
                  />
                </div>
              </div>
            )}

            {selectedPayment === 'card' && (
              <div className="payment-form">
                <div className="payment-form-group">
                  <label className="payment-form-label">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    className="payment-form-input"
                  />
                </div>
                <div className="payment-form-row">
                  <div className="payment-form-group">
                    <label className="payment-form-label">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="payment-form-input"
                    />
                  </div>
                  <div className="payment-form-group">
                    <label className="payment-form-label">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="***"
                      className="payment-form-input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Order Summary */}
        <div className="checkout-sidebar">
          <div className="sidebar-card">
            <h2 className="sidebar-title">Order Total</h2>

            <div className="order-summary-items">
              <div className="order-row">
                <span className="order-label">Tickets ({selectedSeats.length})</span>
                <span>₹{getTicketTotal()}</span>
              </div>
              {cartSnacks.length > 0 && (
                <div className="order-row">
                  <span className="order-label">Snacks</span>
                  <span>₹{getSnackTotal()}</span>
                </div>
              )}
              <div className="order-row">
                <span className="order-label">Convenience Fee</span>
                <span>₹{getConvenienceFee()}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="order-row order-row-success">
                  <span>Promo Discount</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}
            </div>

            <div className="order-subtotal">
              <div className="order-subtotal-row">
                <span className="order-label">Sub Total</span>
                <span>₹{getTicketTotal() + getSnackTotal() + getConvenienceFee() - promoDiscount}</span>
              </div>
              <div className="order-subtotal-row">
                <span className="order-label">GST (18%)</span>
                <span>₹{getTax()}</span>
              </div>
            </div>

            <div className="order-total">
              <div className="order-total-row">
                <span className="order-total-label">Total Amount</span>
                <span className="order-total-amount">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="pay-button"
            >
              {isProcessing ? (
                <>
                  <svg className="spinner" viewBox="0 0 24 24">
                    <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{finalTotal}
                </>
              )}
            </button>

            <div className="security-badge">
              <svg className="security-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              100% Secure Payment
            </div>

            <p className="terms-text">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
