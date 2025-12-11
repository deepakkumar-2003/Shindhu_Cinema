import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';

// POST /api/promo/validate - Validate a promo code
export async function POST(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { code, orderAmount } = body;

    if (!code || !orderAmount) {
      return NextResponse.json(
        { error: 'code and orderAmount are required' },
        { status: 400 }
      );
    }

    // Call the validate_promo_code function
    const { data, error } = await supabase.rpc('validate_promo_code', {
      p_code: code,
      p_order_amount: orderAmount,
    });

    if (error) {
      console.error('Error validating promo code:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Promo validation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
