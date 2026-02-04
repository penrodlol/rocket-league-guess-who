import { Database } from '@/database';
import { createServerClient } from '@supabase/ssr';
import { getCookies, setCookie } from '@tanstack/react-start/server';
import z from 'zod';

const supabaseServerGlobal = globalThis as typeof globalThis & {
  supabase?: ReturnType<typeof createServerClient<Database>>;
};

export default supabaseServerGlobal.supabase ??= createServerClient<Database>(
  z.url().parse(process.env.VITE_SUPABASE_URL),
  z.string().parse(process.env.VITE_SUPABASE_PUBLISHABLE_KEY),
  {
    cookies: {
      getAll: () => Object.entries(getCookies()).map(([name, value]) => ({ name, value })),
      setAll: (cookies) => cookies.forEach((cookie) => setCookie(cookie.name, cookie.value)),
    },
  },
);
