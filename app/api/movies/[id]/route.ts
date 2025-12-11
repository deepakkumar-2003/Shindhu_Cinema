import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/movies/[id] - Fetch a single movie by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = createRouteHandlerClient(request);

    const { data, error } = await supabase
      .from('movies')
      .select(`
        *,
        cast_members (*),
        crew_members (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Movie not found' }, { status: 404 });
      }
      console.error('Error fetching movie:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Movie API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
