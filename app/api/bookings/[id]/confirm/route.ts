import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// POST /api/bookings/[id]/confirm - Confirm a booking after payment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify booking belongs to user and is pending
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .eq('booking_status', 'pending')
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        { error: 'Booking not found or already confirmed' },
        { status: 404 }
      );
    }

    // Call the confirm_booking function
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: confirmed, error: confirmError } = await (supabase.rpc as any)(
      'confirm_booking',
      { p_booking_id: id }
    );

    if (confirmError || !confirmed) {
      console.error('Error confirming booking:', confirmError);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      );
    }

    // Fetch the updated booking
    const { data: updatedBooking, error: refetchError } = await supabase
      .from('bookings')
      .select(`
        *,
        movies (*),
        theaters (*),
        showtimes (*),
        booked_seats (*),
        booked_snacks (
          *,
          snacks (*)
        )
      `)
      .eq('id', id)
      .single();

    if (refetchError) {
      console.error('Error fetching updated booking:', refetchError);
      return NextResponse.json({ success: true, bookingId: id });
    }

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error('Confirm booking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
