'use client';

import { useRouter, usePathname } from 'next/navigation';
import './BookingHeader.css';

export default function BookingHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const isConfirmationPage = pathname?.includes('/booking/confirmation');

  const handleBack = () => {
    if (isConfirmationPage) {
      // On confirmation page, go to home
      router.push('/');
    } else {
      // On other booking pages, go back
      router.back();
    }
  };

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname?.includes('/booking/seats')) return 'Select Seats';
    if (pathname?.includes('/booking/snacks')) return 'Add Snacks';
    if (pathname?.includes('/booking/checkout')) return 'Checkout';
    if (pathname?.includes('/booking/confirmation')) return 'Booking Confirmed';
    return 'Booking';
  };

  return (
    <header className="booking-header">
      <button
        className="booking-header-back"
        onClick={handleBack}
        aria-label={isConfirmationPage ? 'Go to Home' : 'Go back'}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="booking-header-title">{getPageTitle()}</h1>
      <div className="booking-header-spacer"></div>
    </header>
  );
}
