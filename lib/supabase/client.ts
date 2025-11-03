import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Для Client Components используем createBrowserClient из @supabase/ssr
// Это обеспечивает правильную работу с cookies в Next.js App Router
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
