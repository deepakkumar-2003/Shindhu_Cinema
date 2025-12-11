import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './database.types';

// Check if Supabase credentials are available
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Flag to check if Supabase is configured
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Create a Supabase client for browser/client-side usage
export function createClient() {
  if (!isSupabaseConfigured) {
    // Return a dummy client during build time when env vars aren't available
    // This will be replaced with real client at runtime
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
}

// Singleton instance for client-side usage
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null;

export function getSupabaseClient() {
  if (!isSupabaseConfigured) {
    return null as unknown as ReturnType<typeof createBrowserClient<Database>>;
  }
  if (!clientInstance) {
    clientInstance = createClient();
  }
  return clientInstance;
}
