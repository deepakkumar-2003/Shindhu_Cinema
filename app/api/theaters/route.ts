import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/theaters - Fetch theaters with optional city filter
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);
    const { searchParams } = new URL(request.url);

    const cityId = searchParams.get('cityId');

    let query = supabase
      .from('theaters')
      .select(`
        *,
        cities (*),
        screens (*)
      `)
      .order('name', { ascending: true });

    if (cityId) {
      query = query.eq('city_id', cityId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching theaters:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Theaters API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
