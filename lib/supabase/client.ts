import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

// Function to check if Supabase credentials are available (evaluated at runtime)
export function getIsSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key);
}

// For backward compatibility - evaluated at runtime via getter
export const isSupabaseConfigured = getIsSupabaseConfigured();

// Create a Supabase client for browser/client-side usage
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // Return a dummy client during build time when env vars aren't available
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }
  return createBrowserClient<Database>(url, key);
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
