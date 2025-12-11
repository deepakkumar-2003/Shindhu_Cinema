import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/snacks - Fetch all snacks with variants and addons
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const popularOnly = searchParams.get('popular') === 'true';

    let query = supabase
      .from('snacks')
      .select(`
        *,
        snack_variants (*),
        snack_addons (*)
      `)
      .eq('is_available', true)
      .order('is_popular', { ascending: false })
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    if (popularOnly) {
      query = query.eq('is_popular', true);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching snacks:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Snacks API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
