/**
 * Browser-side Supabase Client.
 * Uses @supabase/ssr createBrowserClient so auth state syncs with cookies.
 */

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  client = createBrowserClient(url, anonKey);
  return client;
}
