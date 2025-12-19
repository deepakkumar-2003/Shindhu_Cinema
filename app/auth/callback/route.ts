import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  // Check for Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Auth Callback] Supabase is not configured');
    return NextResponse.redirect(`${origin}/?error=supabase_not_configured`);
  }

  if (code) {
    // Create response to set cookies on
    const response = NextResponse.redirect(origin);

    // Create Supabase client that can read request cookies and write to response cookies
    const supabase = createServerClient<Database>(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Error exchanging code for session:', error.message);
      return NextResponse.redirect(`${origin}/?error=auth_failed&message=${encodeURIComponent(error.message)}`);
    }

    console.log('[Auth Callback] Successfully exchanged code for session');
    return response;
  }

  // No code provided, redirect to home
  console.warn('[Auth Callback] No code provided in callback URL');
  return NextResponse.redirect(origin);
}
