import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// For Vite CSR SPA we use the standard createClient
export const supabase = createClient(supabaseUrl, supabaseAnonKey);