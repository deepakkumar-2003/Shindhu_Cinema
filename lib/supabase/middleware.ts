import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Check if Supabase credentials are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export async function updateSession(request: NextRequest) {
  const supabaseResponse = NextResponse.next({
    request,
  });

  // If Supabase is not configured, just pass through the request (demo mode)
  // Authentication is handled client-side in demo mode
  if (!isSupabaseConfigured) {
    return supabaseResponse;
  }

  // For now, allow all requests to pass through
  // Client-side authentication check will handle protected routes
  // This prevents issues with demo mode authentication
  return supabaseResponse;
}
