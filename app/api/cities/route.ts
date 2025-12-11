import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/cities - Fetch all cities
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching cities:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Cities API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
