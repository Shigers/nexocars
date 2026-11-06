import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://hjucmnxzrxvzfgzwitus.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqdWNtbnh6cnh2emZnendpdHVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQwMDM4ODAsImV4cCI6MjEwOTU3OTg4MH0.uF5IsqbDgBF23e7-HhC06CIWkwXeVR-spri47aR5l-4";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
