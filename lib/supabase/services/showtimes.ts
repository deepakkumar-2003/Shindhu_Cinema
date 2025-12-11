'use client';

import { getSupabaseClient } from '../client';
import type { Showtime as SupabaseShowtime, Tables } from '../database.types';

type TheaterRow = Tables<'theaters'>;

// Transform to app format
export interface TransformedShowtime {
  id: string;
  movieId: string;
  theaterId: string;
  time: string;
  date: string;
  format: '2D' | '3D' | 'IMAX';
  language: string;
  price: {
    standard: number;
    premium: number;
    recliner: number;
    vip: number;
  };
  availableSeats: number;
  totalSeats: number;
}

function transformShowtime(showtime: SupabaseShowtime): TransformedShowtime {
  return {
    id: showtime.id,
    movieId: showtime.movie_id,
    theaterId: showtime.theater_id,
    time: showtime.show_time,
    date: showtime.show_date,
    format: showtime.format as '2D' | '3D' | 'IMAX',
    language: showtime.language,
    price: {
      standard: showtime.price_standard,
      premium: showtime.price_premium,
      recliner: showtime.price_recliner,
      vip: showtime.price_vip,
    },
    availableSeats: showtime.available_seats,
    totalSeats: showtime.total_seats,
  };
}

// Fetch showtimes for a movie on a specific date
export async function fetchShowtimesByMovie(
  movieId: string,
  date: string,
  cityId?: string
): Promise<TransformedShowtime[]> {
  const supabase = getSupabaseClient();

  const query = supabase
    .from('showtimes')
    .select('*')
    .eq('movie_id', movieId)
    .eq('show_date', date)
    .eq('is_active', true)
    .order('show_time', { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching showtimes:', error);
    return [];
  }

  // If cityId is provided, filter by theaters in that city
  if (cityId) {
    const { data: theaterData } = await supabase
      .from('theaters')
      .select('id')
      .eq('city_id', cityId);

    if (theaterData) {
      const theaters = theaterData as Pick<TheaterRow, 'id'>[];
      const theaterIds = new Set(theaters.map(t => t.id));
      const showtimesData = data as SupabaseShowtime[];
      return showtimesData
        .filter(s => theaterIds.has(s.theater_id))
        .map(transformShowtime);
    }
  }

  return data.map(transformShowtime);
}

// Fetch showtimes grouped by theater
export async function fetchShowtimesGroupedByTheater(
  movieId: string,
  date: string,
  cityId?: string
): Promise<Map<string, TransformedShowtime[]>> {
  const showtimes = await fetchShowtimesByMovie(movieId, date, cityId);

  const grouped = new Map<string, TransformedShowtime[]>();

  showtimes.forEach(showtime => {
    const existing = grouped.get(showtime.theaterId) || [];
    existing.push(showtime);
    grouped.set(showtime.theaterId, existing);
  });

  return grouped;
}

// Fetch single showtime by ID
export async function fetchShowtimeById(id: string): Promise<TransformedShowtime | null> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('showtimes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching showtime:', error);
    return null;
  }

  return transformShowtime(data);
}

// Generate showtimes dynamically (fallback for when DB is empty)
export function generateShowtimes(
  movieId: string,
  date: string,
  theaters: { id: string }[]
): TransformedShowtime[] {
  const times = ['09:30', '12:45', '16:00', '19:15', '22:30'];
  const formats: ('2D' | '3D' | 'IMAX')[] = ['2D', '3D', 'IMAX'];
  const showtimes: TransformedShowtime[] = [];

  theaters.forEach((theater) => {
    times.forEach((time, index) => {
      const format = formats[index % formats.length];
      showtimes.push({
        id: `${movieId}-${theater.id}-${date}-${time}`,
        movieId,
        theaterId: theater.id,
        time,
        date,
        format,
        language: 'Hindi',
        price: {
          standard: format === 'IMAX' ? 450 : format === '3D' ? 350 : 250,
          premium: format === 'IMAX' ? 550 : format === '3D' ? 450 : 350,
          recliner: format === 'IMAX' ? 750 : format === '3D' ? 650 : 550,
          vip: format === 'IMAX' ? 1200 : format === '3D' ? 1000 : 850,
        },
        availableSeats: Math.floor(Math.random() * 100) + 50,
        totalSeats: 200,
      });
    });
  });

  return showtimes;
}
