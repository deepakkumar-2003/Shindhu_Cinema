'use client';

import { useEffect, useState, useCallback } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import type { TransformedSeat, SeatLayout, SeatRow, SeatType } from '@/lib/supabase/services/seats';
import type { Tables } from '@/lib/supabase/database.types';

type SeatRow_DB = Tables<'seats'>;

interface UseRealtimeSeatsOptions {
  showtimeId: string;
  prices: {
    standard: number;
    premium: number;
    recliner: number;
    vip: number;
  };
  selectedSeatIds?: string[];
}

interface UseRealtimeSeatsReturn {
  seatLayout: SeatLayout | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRealtimeSeats({
  showtimeId,
  prices,
  selectedSeatIds = [],
}: UseRealtimeSeatsOptions): UseRealtimeSeatsReturn {
  const [seatLayout, setSeatLayout] = useState<SeatLayout | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseClient();

  // Function to generate layout from DB seats
  const buildLayoutFromSeats = useCallback(
    (seats: TransformedSeat[]): SeatLayout => {
      // Group seats by row
      const rowMap = new Map<string, TransformedSeat[]>();
      seats.forEach((seat) => {
        const existing = rowMap.get(seat.row) || [];
        // Mark selected seats
        const seatWithSelection = {
          ...seat,
          status: selectedSeatIds.includes(seat.id) ? 'selected' as const : seat.status,
        };
        existing.push(seatWithSelection);
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
    },
    [showtimeId, selectedSeatIds]
  );

  // Function to generate fallback layout
  const generateFallbackLayout = useCallback((): SeatLayout => {
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

      const seats: TransformedSeat[] = Array.from({ length: seatsPerRow }, (_, i) => {
        const seatId = `${label}${i + 1}`;
        let status: 'available' | 'booked' | 'selected' | 'locked' = 'available';

        if (selectedSeatIds.includes(seatId)) {
          status = 'selected';
        } else if (bookedSeats.has(seatId)) {
          status = 'booked';
        }

        return {
          id: seatId,
          row: label,
          number: i + 1,
          type,
          status,
          price: prices[type],
        };
      });

      return { label, seats, type };
    });

    return {
      showtimeId,
      rows,
      screen: 'Screen 1',
    };
  }, [showtimeId, prices, selectedSeatIds]);

  // Fetch seats from database
  const fetchSeats = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('seats')
        .select('*')
        .eq('showtime_id', showtimeId)
        .order('row_label', { ascending: true })
        .order('seat_number', { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data && data.length > 0) {
        // Type assertion for seats data
        const seatsData = data as SeatRow_DB[];

        // Transform DB seats
        const transformedSeats: TransformedSeat[] = seatsData.map((seat) => ({
          id: seat.seat_id,
          row: seat.row_label,
          number: seat.seat_number,
          type: seat.seat_type as SeatType,
          status: seat.status === 'locked' ? 'locked' : (seat.status as TransformedSeat['status']),
          price: seat.price,
        }));

        setSeatLayout(buildLayoutFromSeats(transformedSeats));
      } else {
        // No seats in DB, generate fallback
        setSeatLayout(generateFallbackLayout());
      }
    } catch (err) {
      console.error('Error fetching seats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch seats');
      // Use fallback layout on error
      setSeatLayout(generateFallbackLayout());
    } finally {
      setIsLoading(false);
    }
  }, [supabase, showtimeId, buildLayoutFromSeats, generateFallbackLayout]);

  // Initial fetch
  useEffect(() => {
    fetchSeats();
  }, [fetchSeats]);

  // Set up real-time subscription
  useEffect(() => {
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
        () => {
          // Refetch when any seat changes
          fetchSeats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, showtimeId, fetchSeats]);

  // Update selected seats in layout when selection changes
  useEffect(() => {
    if (seatLayout) {
      const updatedRows = seatLayout.rows.map((row) => ({
        ...row,
        seats: row.seats.map((seat) => ({
          ...seat,
          status:
            selectedSeatIds.includes(seat.id) && seat.status !== 'booked' && seat.status !== 'locked'
              ? ('selected' as const)
              : seat.status === 'selected' && !selectedSeatIds.includes(seat.id)
              ? ('available' as const)
              : seat.status,
        })),
      }));

      setSeatLayout({
        ...seatLayout,
        rows: updatedRows,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeatIds.join(',')]);

  return {
    seatLayout,
    isLoading,
    error,
    refetch: fetchSeats,
  };
}
