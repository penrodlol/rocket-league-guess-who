import { Database } from '@/database';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useRef } from 'react';

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

export function useSupabaseRealtimeChannel<T>(name: string, callback: (payload: T) => void, { enabled = true } = {}) {
  const channelRef = useRef<ReturnType<NonNullable<typeof supabaseClientGlobal.supabase>['channel']>>(undefined);

  useEffect(() => {
    if (!enabled || channelRef.current) return;

    const channel = supabaseClientGlobal.supabase?.channel(name, { config: { private: true } });
    channel?.on('broadcast', { event: '*' }, ({ payload }) => callback((payload ?? {}) as T)).subscribe();
    channelRef.current = channel;

    return () => {
      if (!channelRef.current) return;
      supabaseClientGlobal.supabase?.removeChannel(channelRef.current);
      channelRef.current = undefined;
    };
  }, [name, callback, enabled]);
}
