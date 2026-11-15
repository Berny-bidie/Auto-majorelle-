import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../shared/database.types";
import { SUPABASE_PROJECT_URL, SUPABASE_PUBLISHABLE_KEY } from "../shared/supabaseProject";

export const supabaseUrl = process.env.SUPABASE_URL?.trim() || SUPABASE_PROJECT_URL;
export const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY?.trim()
  || process.env.SUPABASE_ANON_KEY?.trim()
  || SUPABASE_PUBLISHABLE_KEY;

export function createRequestSupabase(accessToken?: string): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabasePublishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    ...(accessToken ? { global: { headers: { Authorization: `Bearer ${accessToken}` } } } : {}),
  });
}
