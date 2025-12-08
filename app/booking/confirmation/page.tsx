'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBookingStore } from '@/lib/store';

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [showConfetti, setShowConfetti] = useState(true);

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

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!selectedMovie || !selectedTheater || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">No booking found</h1>
        <button onClick={() => router.push('/')} className="btn-primary">
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                backgroundColor: ['#e50914', '#ffd700', '#22c55e', '#3b82f6', '#a855f7'][
                  Math.floor(Math.random() * 5)
                ],
                width: '10px',
                height: '10px',
                borderRadius: Math.random() > 0.5 ? '50%' : '0',
              }}
            />
          ))}
        </div>
      )}

      {/* Success Header */}
      <div className="text-center mb-8 pt-8">
        <div className="w-20 h-20 mx-auto mb-4 bg-success/20 rounded-full flex items-center justify-center animate-bounce">
          <svg className="w-10 h-10 text-success" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
        <p className="text-muted">Your tickets have been booked successfully</p>
        <p className="text-sm text-muted mt-2">Order ID: <span className="font-mono font-semibold text-foreground">{orderId}</span></p>
      </div>

      {/* Ticket Card */}
      <div className="card overflow-hidden mb-6">
        {/* Movie Banner */}
        <div className="relative h-32 sm:h-48">
          <img
            src={selectedMovie.backdrop}
            alt={selectedMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Movie Details */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">{selectedMovie.title}</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="badge badge-primary">{selectedShowtime.format}</span>
                <span className="badge bg-secondary">{selectedMovie.language}</span>
                <span className="badge bg-secondary">{selectedMovie.certification}</span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted">Date</p>
                  <p className="font-semibold">
                    {new Date(selectedShowtime.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-muted">Time</p>
                  <p className="font-semibold">{selectedShowtime.time}</p>
                </div>
                <div>
                  <p className="text-muted">Cinema</p>
                  <p className="font-semibold">{selectedTheater.name}</p>
                </div>
                <div>
                  <p className="text-muted">Screen</p>
                  <p className="font-semibold">Screen 1</p>
                </div>
                <div className="col-span-2">
                  <p className="text-muted">Seats</p>
                  <p className="font-semibold text-lg text-primary">
                    {selectedSeats.map((s) => s.id).join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg">
              <img src={ticketQRUrl} alt="Ticket QR Code" className="w-40 h-40" />
              <p className="text-black text-xs mt-2 font-medium">Scan at Entry</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute left-0 w-6 h-6 bg-background rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute right-0 w-6 h-6 bg-background rounded-full translate-x-1/2 -translate-y-1/2"></div>
          <div className="border-t border-dashed border-border mx-8"></div>
        </div>

        {/* Footer */}
        <div className="p-6 flex flex-wrap justify-between items-center gap-4">
          <div>
            <p className="text-sm text-muted">Total Paid</p>
            <p className="text-2xl font-bold text-primary">₹{getGrandTotal()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">{selectedSeats.length} Ticket(s)</p>
            <p className="text-sm text-muted">{selectedTheater.location}</p>
          </div>
        </div>
      </div>

      {/* Snacks QR (if any) */}
      {cartSnacks.length > 0 && (
        <div className="card p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-4">Snack Order</h3>
              <div className="space-y-2 mb-4">
                {cartSnacks.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
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
              <div className="flex items-center gap-2 p-3 bg-accent/10 rounded-lg">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium">
                    Pickup: {snackPickupTime === 'pre-show' ? '15 mins before showtime' : 'During Interval'}
                  </p>
                  <p className="text-xs text-muted">Counter will be displayed on screen</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center p-4 bg-white rounded-lg">
              <img src={snackQRUrl} alt="Snack QR Code" className="w-32 h-32" />
              <p className="text-black text-xs mt-2 font-medium">Scan at Counter</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="btn-secondary flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share
        </button>
        <button onClick={handleNewBooking} className="btn-primary flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Book Another
        </button>
      </div>

      {/* Important Notes */}
      <div className="mt-8 p-4 bg-secondary rounded-lg">
        <h3 className="font-semibold mb-3">Important Information</h3>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Please arrive at least 15 minutes before the showtime
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Show the QR code at the entry for ticket verification
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Outside food and beverages are not allowed
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Cancellation is allowed up to 2 hours before showtime
          </li>
        </ul>
      </div>

      {/* Contact */}
      <div className="mt-6 text-center text-sm text-muted">
        <p>Need help? Contact us at <a href="mailto:support@shindhucinemas.com" className="text-primary hover:underline">support@shindhucinemas.com</a></p>
      </div>

      {/* Add confetti animation styles */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-muted">Loading...</p>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
