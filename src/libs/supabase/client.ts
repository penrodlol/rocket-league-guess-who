import { Database } from '@/database';
import { createBrowserClient } from '@supabase/ssr';

const supabaseClientGlobal = globalThis as typeof globalThis & {
  supabase?: ReturnType<typeof createBrowserClient<Database>>;
};

export default supabaseClientGlobal.supabase ??= createBrowserClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

export function getSupabaseImageURL(bucket: string, object: string) {
  const url = supabaseClientGlobal.supabase?.storage.from(bucket).getPublicUrl(object).data.publicUrl ?? '';
  return url.replace(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_DISCORD_PATH);
}
