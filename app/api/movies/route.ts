import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/movies - Fetch all movies with optional filters
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);
    const { searchParams } = new URL(request.url);

    const status = searchParams.get('status');
    const language = searchParams.get('language');
    const genre = searchParams.get('genre');
    const format = searchParams.get('format');

    let query = supabase
      .from('movies')
      .select(`
        *,
        cast_members (*),
        crew_members (*)
      `)
      .order('release_date', { ascending: false });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (language) {
      query = query.eq('language', language);
    }

    if (genre) {
      query = query.contains('genres', [genre]);
    }

    if (format) {
      query = query.contains('formats', [format]);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching movies:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Movies API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
