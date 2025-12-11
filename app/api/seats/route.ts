import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/seats - Fetch seats for a showtime
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);
    const { searchParams } = new URL(request.url);

    const showtimeId = searchParams.get('showtimeId');

    if (!showtimeId) {
      return NextResponse.json({ error: 'showtimeId is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('seats')
      .select('*')
      .eq('showtime_id', showtimeId)
      .order('row_label', { ascending: true })
      .order('seat_number', { ascending: true });

    if (error) {
      console.error('Error fetching seats:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Seats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/seats - Lock seats for booking
export async function POST(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { showtimeId, seatIds, lockDuration = 8 } = body;

    if (!showtimeId || !seatIds || !Array.isArray(seatIds)) {
      return NextResponse.json(
        { error: 'showtimeId and seatIds array are required' },
        { status: 400 }
      );
    }

    // Call the lock_seats function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('lock_seats', {
      p_showtime_id: showtimeId,
      p_seat_ids: seatIds,
      p_user_id: user.id,
      p_lock_duration_minutes: lockDuration,
    });

    if (error) {
      console.error('Error locking seats:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Lock seats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/seats - Release seat locks
export async function DELETE(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const showtimeId = searchParams.get('showtimeId');

    if (!showtimeId) {
      return NextResponse.json({ error: 'showtimeId is required' }, { status: 400 });
    }

    // Call the release_seat_locks function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase.rpc as any)('release_seat_locks', {
      p_showtime_id: showtimeId,
      p_user_id: user.id,
    });

    if (error) {
      console.error('Error releasing seat locks:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: data });
  } catch (error) {
    console.error('Release seats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
