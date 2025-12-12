import { NextResponse } from 'next/server';
import { createServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  // If Supabase is not configured, redirect with error
  if (!isSupabaseConfigured) {
    console.error('Auth callback error: Supabase is not configured');
    return NextResponse.redirect(`${origin}/?error=supabase_not_configured`);
  }

  if (code) {
    const supabase = await createServerSupabaseClient();

    if (!supabase) {
      console.error('Auth callback error: Failed to create Supabase client');
      return NextResponse.redirect(`${origin}/?error=auth_failed`);
    }

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${origin}/?error=auth_failed`);
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(origin);
}
