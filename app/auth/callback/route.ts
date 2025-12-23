import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/lib/supabase/database.types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const type = requestUrl.searchParams.get('type');
  const origin = requestUrl.origin;

  console.log('[Auth Callback] Request received - code:', !!code, 'type:', type);

  // Check for Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[Auth Callback] Supabase is not configured');
    return NextResponse.redirect(`${origin}/?error=supabase_not_configured`);
  }

  if (code) {
    // Default redirect URL (will be updated based on session type)
    let finalRedirectUrl = origin;

    // Create a temporary response for cookie handling
    const tempResponse = NextResponse.next();

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
              tempResponse.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('[Auth Callback] Error exchanging code for session:', error.message);
      return NextResponse.redirect(`${origin}/?error=auth_failed&message=${encodeURIComponent(error.message)}`);
    }

    console.log('[Auth Callback] Successfully exchanged code for session');
    console.log('[Auth Callback] Session user:', data?.session?.user?.email);

    // Detect if this is a password recovery session
    // Check multiple indicators for recovery:
    // 1. URL type parameter is 'recovery'
    // 2. User has recovery_sent_at timestamp
    // 3. AMR (Authentication Methods Reference) contains recovery
    const isRecoveryFromType = type === 'recovery';
    const isRecoveryFromUser = data?.session?.user?.recovery_sent_at != null;
    const amr = data?.session?.user?.app_metadata?.amr || [];
    const isRecoveryFromAmr = Array.isArray(amr) && amr.some((m: any) => m?.method === 'recovery');

    console.log('[Auth Callback] Recovery detection - fromType:', isRecoveryFromType, 'fromUser:', isRecoveryFromUser, 'fromAmr:', isRecoveryFromAmr);

    const isRecovery = isRecoveryFromType || isRecoveryFromUser || isRecoveryFromAmr;

    if (isRecovery) {
      console.log('[Auth Callback] Detected recovery session, redirecting to reset-password');
      finalRedirectUrl = `${origin}/auth/reset-password`;
    }

    // Create the final response with redirect
    const response = NextResponse.redirect(finalRedirectUrl);

    // Copy cookies from temp response to final response
    tempResponse.cookies.getAll().forEach((cookie) => {
      response.cookies.set(cookie.name, cookie.value);
    });

    return response;
  }

  // No code provided, redirect to home
  console.warn('[Auth Callback] No code provided in callback URL');
  return NextResponse.redirect(origin);
}
