import { createClient } from "@supabase/supabase-js";
import { Database } from "@shared/database.types";
import { SUPABASE_PROJECT_URL, SUPABASE_PUBLISHABLE_KEY } from "@shared/supabaseProject";

const url = import.meta.env.VITE_SUPABASE_URL?.trim() || SUPABASE_PROJECT_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
