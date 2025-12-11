'use client';

import { getSupabaseClient } from '../client';
import type { Booking as SupabaseBooking } from '../database.types';

// App format types
export interface TransformedBooking {
  id: string;
  movieId: string;
  theaterId: string;
  showtimeId: string;
  bookingDate: string;
  totalAmount: number;
  ticketAmount: number;
  snackAmount: number;
  convenienceFee: number;
  taxAmount: number;
  discountAmount: number;
  promoCode: string | null;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  ticketQR: string | null;
  snackQR: string | null;
  createdAt: string;
  // Related data (when fetched with joins)
  movie?: {
    title: string;
    poster: string;
  };
  theater?: {
    name: string;
    location: string;
  };
  showtime?: {
    date: string;
    time: string;
    format: string;
  };
  seats?: {
    row: string;
    number: number;
    type: string;
    price: number;
  }[];
  snacks?: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

function transformBooking(booking: SupabaseBooking & {
  movies?: { title: string; poster: string };
  theaters?: { name: string; location: string };
  showtimes?: { show_date: string; show_time: string; format: string };
  booked_seats?: { row_label: string; seat_number: number; seat_type: string; price: number }[];
  booked_snacks?: { quantity: number; unit_price: number; snacks?: { name: string } }[];
}): TransformedBooking {
  return {
    id: booking.id,
    movieId: booking.movie_id,
    theaterId: booking.theater_id,
    showtimeId: booking.showtime_id,
    bookingDate: booking.booking_date,
    totalAmount: booking.total_amount,
    ticketAmount: booking.ticket_amount,
    snackAmount: booking.snack_amount,
    convenienceFee: booking.convenience_fee,
    taxAmount: booking.tax_amount,
    discountAmount: booking.discount_amount,
    promoCode: booking.promo_code,
    paymentMethod: booking.payment_method,
    paymentStatus: booking.payment_status,
    bookingStatus: booking.booking_status,
    ticketQR: booking.ticket_qr,
    snackQR: booking.snack_qr,
    createdAt: booking.created_at,
    movie: booking.movies ? {
      title: booking.movies.title,
      poster: booking.movies.poster,
    } : undefined,
    theater: booking.theaters ? {
      name: booking.theaters.name,
      location: booking.theaters.location,
    } : undefined,
    showtime: booking.showtimes ? {
      date: booking.showtimes.show_date,
      time: booking.showtimes.show_time,
      format: booking.showtimes.format,
    } : undefined,
    seats: booking.booked_seats?.map(s => ({
      row: s.row_label,
      number: s.seat_number,
      type: s.seat_type,
      price: s.price,
    })),
    snacks: booking.booked_snacks?.map(s => ({
      name: s.snacks?.name || 'Unknown',
      quantity: s.quantity,
      price: s.unit_price * s.quantity,
    })),
  };
}

// Fetch user's bookings
export async function fetchUserBookings(): Promise<TransformedBooking[]> {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      movies (title, poster),
      theaters (name, location),
      showtimes (show_date, show_time, format),
      booked_seats (row_label, seat_number, seat_type, price),
      booked_snacks (
        quantity,
        unit_price,
        snacks (name)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data.map(transformBooking);
}

// Fetch single booking by ID
export async function fetchBookingById(id: string): Promise<TransformedBooking | null> {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      movies (title, poster),
      theaters (name, location),
      showtimes (show_date, show_time, format),
      booked_seats (row_label, seat_number, seat_type, price),
      booked_snacks (
        quantity,
        unit_price,
        snacks (name)
      )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }

  return transformBooking(data);
}

// Create a new booking
export interface CreateBookingData {
  movieId: string;
  theaterId: string;
  showtimeId: string;
  seats: { id: string; row: string; number: number; type: string; price: number }[];
  snacks?: {
    snackId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    addons: { id: string; name: string; price: number }[];
  }[];
  snackPickupTime?: 'pre-show' | 'interval';
  ticketAmount: number;
  snackAmount?: number;
  convenienceFee: number;
  taxAmount: number;
  discountAmount?: number;
  promoCode?: string;
  paymentMethod: string;
}

export async function createBooking(data: CreateBookingData): Promise<{ id: string } | null> {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Error creating booking:', error);
    return null;
  }

  return response.json();
}

// Confirm a booking
export async function confirmBooking(bookingId: string): Promise<boolean> {
  const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
    method: 'POST',
  });

  return response.ok;
}

// Subscribe to booking updates
export function subscribeBookingUpdates(
  bookingId: string,
  onUpdate: (booking: TransformedBooking) => void
) {
  const supabase = getSupabaseClient();

  const channel = supabase
    .channel(`booking:${bookingId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'bookings',
        filter: `id=eq.${bookingId}`,
      },
      async () => {
        const booking = await fetchBookingById(bookingId);
        if (booking) {
          onUpdate(booking);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
