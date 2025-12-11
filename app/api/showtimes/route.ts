import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/showtimes - Fetch showtimes with filters
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);
    const { searchParams } = new URL(request.url);

    const movieId = searchParams.get('movieId');
    const theaterId = searchParams.get('theaterId');
    const date = searchParams.get('date');
    const cityId = searchParams.get('cityId');

    let query = supabase
      .from('showtimes')
      .select(`
        *,
        movies (*),
        theaters (*),
        screens (*)
      `)
      .eq('is_active', true)
      .order('show_time', { ascending: true });

    if (movieId) {
      query = query.eq('movie_id', movieId);
    }

    if (theaterId) {
      query = query.eq('theater_id', theaterId);
    }

    if (date) {
      query = query.eq('show_date', date);
    }

    // For city filter, we need to filter through theaters
    if (cityId) {
      // First get theaters in the city
      const { data: theaterData } = await supabase
        .from('theaters')
        .select('id')
        .eq('city_id', cityId);

      if (theaterData && theaterData.length > 0) {
        const theaterIds = theaterData.map(t => t.id);
        query = query.in('theater_id', theaterIds);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching showtimes:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Showtimes API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
