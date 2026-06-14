import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

// Create client only if env vars are present to avoid runtime errors
export const supabase = hasSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
