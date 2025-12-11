import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// GET /api/bookings - Fetch user's bookings
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
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
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/bookings - Create a new booking
export async function POST(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      movieId,
      theaterId,
      showtimeId,
      seats,
      snacks,
      snackPickupTime = 'pre-show',
      ticketAmount,
      snackAmount = 0,
      convenienceFee,
      taxAmount,
      discountAmount = 0,
      promoCode,
      paymentMethod,
    } = body;

    // Validate required fields
    if (!movieId || !theaterId || !showtimeId || !seats || !ticketAmount || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const totalAmount = ticketAmount + snackAmount + convenienceFee + taxAmount - discountAmount;

    // Start a transaction by creating the booking first
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        movie_id: movieId,
        theater_id: theaterId,
        showtime_id: showtimeId,
        total_amount: totalAmount,
        ticket_amount: ticketAmount,
        snack_amount: snackAmount,
        convenience_fee: convenienceFee,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        promo_code: promoCode,
        payment_method: paymentMethod,
        booking_status: 'pending',
        payment_status: 'pending',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json({ error: bookingError.message }, { status: 500 });
    }

    // Insert booked seats
    const bookedSeats = seats.map((seat: { id: string; row: string; number: number; type: string; price: number }) => ({
      booking_id: booking.id,
      seat_id: seat.id,
      showtime_id: showtimeId,
      row_label: seat.row,
      seat_number: seat.number,
      seat_type: seat.type,
      price: seat.price,
    }));

    const { error: seatsError } = await supabase
      .from('booked_seats')
      .insert(bookedSeats);

    if (seatsError) {
      console.error('Error creating booked seats:', seatsError);
      // Rollback by deleting the booking
      await supabase.from('bookings').delete().eq('id', booking.id);
      return NextResponse.json({ error: seatsError.message }, { status: 500 });
    }

    // Insert booked snacks if any
    if (snacks && snacks.length > 0) {
      const bookedSnacks = snacks.map((item: {
        snackId: string;
        variantId: string;
        quantity: number;
        unitPrice: number;
        addons: object[];
      }) => ({
        booking_id: booking.id,
        snack_id: item.snackId,
        variant_id: item.variantId,
        quantity: item.quantity,
        unit_price: item.unitPrice,
        addons: item.addons,
        pickup_time: snackPickupTime,
      }));

      const { error: snacksError } = await supabase
        .from('booked_snacks')
        .insert(bookedSnacks);

      if (snacksError) {
        console.error('Error creating booked snacks:', snacksError);
        // Snack errors are non-critical, log but don't fail the booking
      }
    }

    // Generate QR codes (using booking ID as data)
    const ticketQR = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
      JSON.stringify({
        bookingId: booking.id,
        type: 'ticket',
        movieId,
        showtimeId,
      })
    )}`;

    const snackQR = snacks && snacks.length > 0
      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
          JSON.stringify({
            bookingId: booking.id,
            type: 'snack',
          })
        )}`
      : null;

    // Update booking with QR codes
    const { error: updateError } = await supabase
      .from('bookings')
      .update({
        ticket_qr: ticketQR,
        snack_qr: snackQR,
      })
      .eq('id', booking.id);

    if (updateError) {
      console.error('Error updating booking QR:', updateError);
    }

    return NextResponse.json({
      ...booking,
      ticket_qr: ticketQR,
      snack_qr: snackQR,
    });
  } catch (error) {
    console.error('Create booking API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
