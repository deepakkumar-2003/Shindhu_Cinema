import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Intercept root path with a code parameter (Supabase auth callback)
  // This handles cases where Supabase redirects to root instead of /auth/callback
  if (pathname === '/' && searchParams.has('code')) {
    const code = searchParams.get('code');
    const type = searchParams.get('type');

    // Build the callback URL with all parameters
    const callbackUrl = new URL('/auth/callback', request.url);
    callbackUrl.searchParams.set('code', code!);

    // Preserve the type parameter if present (for recovery)
    if (type) {
      callbackUrl.searchParams.set('type', type);
    }

    console.log('[Proxy] Redirecting code from root to /auth/callback');
    return NextResponse.redirect(callbackUrl);
  }

  // Continue with session update for other requests
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
