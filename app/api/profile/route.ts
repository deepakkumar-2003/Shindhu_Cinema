import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@/lib/supabase/server';
import type { UpdateTables } from '@/lib/supabase/database.types';

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/profile - Update current user's profile
export async function PATCH(request: NextRequest) {
  try {
    const { supabase } = createRouteHandlerClient(request);

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, city, avatar_url } = body;

    // Build update object with only provided fields
    const updates: UpdateTables<'profiles'> = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (city !== undefined) updates.city = city;
    if (avatar_url !== undefined) updates.avatar_url = avatar_url;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const { data, error } = await (supabase
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .from('profiles') as any)
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
