import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

// Function to check if Supabase credentials are available (evaluated at runtime)
export function getIsSupabaseConfigured(): boolean {
  // Direct access to env vars - Next.js replaces these at build time
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isConfigured = Boolean(url && key && url.length > 0 && key.length > 0);

  // Log configuration status for debugging (only in development)
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('[Supabase] Configuration check:', {
      isConfigured,
      hasUrl: Boolean(url),
      hasKey: Boolean(key),
      url: url ? `${url.substring(0, 20)}...` : 'missing'
    });
  }

  return isConfigured;
}

// For backward compatibility - evaluated at runtime via getter
export const isSupabaseConfigured = getIsSupabaseConfigured();

// Create a Supabase client for browser/client-side usage
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.warn('[Supabase] Missing environment variables. Using local data fallback.');
    // Return a dummy client during build time when env vars aren't available
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }

  try {
    return createBrowserClient<Database>(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      global: {
        fetch: (url, options = {}) => {
          // Add timeout to fetch requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        },
      },
    });
  } catch (error) {
    console.error('[Supabase] Failed to create client:', error);
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }
}

// Singleton instance for client-side usage
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }
  if (!clientInstance) {
    clientInstance = createClient();
  }
  return clientInstance;
}
