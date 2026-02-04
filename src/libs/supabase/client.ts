import { Database } from '@/database';
import { createBrowserClient } from '@supabase/ssr';

const supabaseClientGlobal = globalThis as typeof globalThis & {
  supabase?: ReturnType<typeof createBrowserClient<Database>>;
};

export default supabaseClientGlobal.supabase ??= createBrowserClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);
