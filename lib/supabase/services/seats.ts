'use client';

import { getSupabaseClient } from '../client';
import type { Seat as SupabaseSeat } from '../database.types';

// App format types
export type SeatType = 'standard' | 'premium' | 'recliner' | 'vip';
export type SeatStatus = 'available' | 'booked' | 'selected' | 'locked';

export interface TransformedSeat {
  id: string;
  row: string;
  number: number;
  type: SeatType;
  status: SeatStatus;
  price: number;
}

export interface SeatRow {
  label: string;
  seats: TransformedSeat[];
  type: SeatType;
}

export interface SeatLayout {
  showtimeId: string;
  rows: SeatRow[];
  screen: string;
}

function transformSeat(seat: SupabaseSeat): TransformedSeat {
  return {
    id: seat.seat_id,
    row: seat.row_label,
    number: seat.seat_number,
    type: seat.seat_type,
    status: seat.status === 'locked' ? 'locked' : seat.status as SeatStatus,
    price: seat.price,
  };
}

// Fetch seats for a showtime
export async function fetchSeatsByShowtime(showtimeId: string): Promise<TransformedSeat[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('seats')
    .select('*')
    .eq('showtime_id', showtimeId)
    .order('row_label', { ascending: true })
    .order('seat_number', { ascending: true });

  if (error) {
    console.error('Error fetching seats:', error);
    return [];
  }

  return data.map(transformSeat);
}

// Fetch seat layout for a showtime
export async function fetchSeatLayout(
  showtimeId: string,
  prices: { standard: number; premium: number; recliner: number; vip: number }
): Promise<SeatLayout> {
  const seats = await fetchSeatsByShowtime(showtimeId);

  // If no seats in DB, generate layout
  if (seats.length === 0) {
    return generateSeatLayout(showtimeId, prices);
  }

  // Group seats by row
  const rowMap = new Map<string, TransformedSeat[]>();
  seats.forEach(seat => {
    const existing = rowMap.get(seat.row) || [];
    existing.push(seat);
    rowMap.set(seat.row, existing);
  });

  // Convert to SeatRow array
  const rows: SeatRow[] = Array.from(rowMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, rowSeats]) => ({
      label,
      seats: rowSeats.sort((a, b) => a.number - b.number),
      type: rowSeats[0]?.type || 'standard',
    }));

  return {
    showtimeId,
    rows,
    screen: 'Screen 1',
  };
}

// Generate seat layout (fallback)
export function generateSeatLayout(
  showtimeId: string,
  prices: { standard: number; premium: number; recliner: number; vip: number }
): SeatLayout {
  const rowLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];
  const seatsPerRow = 16;

  // Random booked seats
  const bookedSeats = new Set<string>();
  const numBooked = Math.floor(Math.random() * 50) + 20;
  for (let i = 0; i < numBooked; i++) {
    const row = rowLabels[Math.floor(Math.random() * rowLabels.length)];
    const num = Math.floor(Math.random() * seatsPerRow) + 1;
    bookedSeats.add(`${row}${num}`);
  }

  const rows: SeatRow[] = rowLabels.map((label, rowIndex) => {
    let type: SeatType;
    if (rowIndex < 3) type = 'standard';
    else if (rowIndex < 7) type = 'premium';
    else if (rowIndex < 10) type = 'recliner';
    else type = 'vip';

    const seats: TransformedSeat[] = Array.from({ length: seatsPerRow }, (_, i) => ({
      id: `${label}${i + 1}`,
      row: label,
      number: i + 1,
      type,
      status: bookedSeats.has(`${label}${i + 1}`) ? 'booked' : 'available',
      price: prices[type],
    }));

    return { label, seats, type };
  });

  return {
    showtimeId,
    rows,
    screen: 'Screen 1',
  };
}

// Lock seats for booking
export async function lockSeats(
  showtimeId: string,
  seatIds: string[],
  lockDuration: number = 8
): Promise<{ success: boolean; message: string; lockedSeats: string[] }> {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Not authenticated', lockedSeats: [] };
  }

  const { data, error } = await supabase.rpc('lock_seats', {
    p_showtime_id: showtimeId,
    p_seat_ids: seatIds,
    p_user_id: user.id,
    p_lock_duration_minutes: lockDuration,
  });

  if (error) {
    console.error('Error locking seats:', error);
    return { success: false, message: error.message, lockedSeats: [] };
  }

  return {
    success: data.success,
    message: data.message,
    lockedSeats: data.locked_seats || [],
  };
}

// Release seat locks
export async function releaseSeatLocks(showtimeId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data, error } = await supabase.rpc('release_seat_locks', {
    p_showtime_id: showtimeId,
    p_user_id: user.id,
  });

  if (error) {
    console.error('Error releasing seat locks:', error);
    return false;
  }

  return data;
}

// Subscribe to seat updates (real-time)
export function subscribeSeatUpdates(
  showtimeId: string,
  onUpdate: (seats: TransformedSeat[]) => void
) {
  const supabase = getSupabaseClient();

  const channel = supabase
    .channel(`seats:${showtimeId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'seats',
        filter: `showtime_id=eq.${showtimeId}`,
      },
      async () => {
        // Refetch all seats when any change occurs
        const seats = await fetchSeatsByShowtime(showtimeId);
        onUpdate(seats);
      }
    )
    .subscribe();

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
  };
}
