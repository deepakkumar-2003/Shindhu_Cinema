'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBookingStore, useUserStore, useUIStore } from '@/lib/store';

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
    resetBooking,
  } = useBookingStore();

  // Wait for hydration before checking state
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Only redirect after hydration is complete
  useEffect(() => {
    if (isHydrated && (!selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0)) {
      router.push('/');
    }
  }, [isHydrated, selectedMovie, selectedTheater, selectedShowtime, selectedSeats, router]);

  if (!isHydrated || !selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted">Loading...</p>
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

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order ID
    const orderId = 'SHC' + Date.now().toString(36).toUpperCase();

    setIsProcessing(false);

    // Navigate to confirmation with order ID
    router.push(`/booking/confirmation?orderId=${orderId}`);
  };

  const finalTotal = getGrandTotal() - promoDiscount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="text-sm">Seats</span>
        </div>
        <div className="w-8 h-0.5 bg-success"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-success text-white flex items-center justify-center text-sm">
            ✓
          </div>
          <span className="text-sm">Snacks</span>
        </div>
        <div className="w-8 h-0.5 bg-success"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
            3
          </div>
          <span className="text-sm font-medium">Payment</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Details */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Booking Summary</h2>

            {/* Movie Info */}
            <div className="flex gap-4 pb-4 border-b border-border">
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="w-20 h-28 object-cover rounded-lg"
              />
              <div>
                <h3 className="font-semibold text-lg">{selectedMovie.title}</h3>
                <p className="text-sm text-muted">{selectedMovie.certification} • {selectedMovie.language}</p>
                <p className="text-sm mt-2">
                  {selectedShowtime.format} • {new Date(selectedShowtime.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    day: 'numeric',
                    month: 'short',
                  })} • {selectedShowtime.time}
                </p>
                <p className="text-sm text-muted mt-1">{selectedTheater.name}</p>
              </div>
            </div>

            {/* Seats */}
            <div className="py-4 border-b border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{selectedSeats.length} Ticket(s)</p>
                  <p className="text-sm text-muted">
                    Seats: {selectedSeats.map((s) => s.id).join(', ')}
                  </p>
                </div>
                <p className="font-semibold">₹{getTicketTotal()}</p>
              </div>
            </div>

            {/* Snacks */}
            {cartSnacks.length > 0 && (
              <div className="py-4 border-b border-border">
                <p className="font-medium mb-2">Snacks & Beverages</p>
                {cartSnacks.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span className="text-muted">
                      {item.quantity}x {item.snack.name}
                      {item.variant.size !== 'regular' && ` (${item.variant.size})`}
                    </span>
                    <span>
                      ₹{(item.variant.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.quantity}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between mt-2">
                  <span className="text-muted">Pickup: {snackPickupTime === 'pre-show' ? 'Before Movie' : 'During Interval'}</span>
                  <span className="font-semibold">₹{getSnackTotal()}</span>
                </div>
              </div>
            )}
          </div>

          {/* Promo Code */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Promo Code</h2>
            {promoApplied ? (
              <div className="flex items-center justify-between p-3 bg-success/10 border border-success/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  <span className="font-medium text-success">{promoCode.toUpperCase()} applied</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-success">-₹{promoDiscount}</span>
                  <button onClick={handleRemovePromo} className="text-muted hover:text-error text-sm">
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="input flex-1"
                />
                <button onClick={handleApplyPromo} className="btn-secondary">
                  Apply
                </button>
              </div>
            )}
            <p className="text-xs text-muted mt-2">Try: FIRST20 for 20% off on first booking</p>
          </div>

          {/* Payment Methods */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full p-4 rounded-lg border flex items-center gap-4 transition-all ${
                    selectedPayment === method.id
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-muted'
                  }`}
                >
                  <span className="text-2xl">{method.icon}</span>
                  <div className="text-left flex-1">
                    <p className="font-medium">{method.name}</p>
                    <p className="text-sm text-muted">{method.description}</p>
                  </div>
                  {selectedPayment === method.id && (
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>

            {/* Payment Details Form */}
            {selectedPayment === 'upi' && (
              <div className="mt-4 p-4 bg-secondary rounded-lg">
                <label className="block text-sm font-medium mb-2">Enter UPI ID</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="yourname@upi"
                  className="input"
                />
              </div>
            )}

            {selectedPayment === 'card' && (
              <div className="mt-4 p-4 bg-secondary rounded-lg space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                    placeholder="1234 5678 9012 3456"
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      placeholder="***"
                      className="input"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Order Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-32">
            <h2 className="text-xl font-bold mb-4">Order Total</h2>

            <div className="space-y-3 pb-4 border-b border-border">
              <div className="flex justify-between">
                <span className="text-muted">Tickets ({selectedSeats.length})</span>
                <span>₹{getTicketTotal()}</span>
              </div>
              {cartSnacks.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">Snacks</span>
                  <span>₹{getSnackTotal()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Convenience Fee</span>
                <span>₹{getConvenienceFee()}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Promo Discount</span>
                  <span>-₹{promoDiscount}</span>
                </div>
              )}
            </div>

            <div className="py-4 border-b border-border">
              <div className="flex justify-between">
                <span className="text-muted">Sub Total</span>
                <span>₹{getTicketTotal() + getSnackTotal() + getConvenienceFee() - promoDiscount}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-muted">GST (18%)</span>
                <span>₹{getTax()}</span>
              </div>
            </div>

            <div className="py-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">₹{finalTotal}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="btn-primary w-full text-lg py-4 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Pay ₹{finalTotal}
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              100% Secure Payment
            </div>

            <p className="text-xs text-muted text-center mt-4">
              By proceeding, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
