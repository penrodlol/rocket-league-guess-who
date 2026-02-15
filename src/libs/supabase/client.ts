import { Database } from '@/database';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useRef } from 'react';

export type SupabaseRealtimeChannel = ReturnType<NonNullable<typeof supabaseClientGlobal.supabase>['channel']>;

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

export function useSupabaseRealtimeChannels(channels: Array<{ name: string; callback: (payload: unknown) => void }>) {
  const channelRefs = useRef<Record<string, SupabaseRealtimeChannel>>({});

  useEffect(() => {
    channels.forEach(({ name, callback }) => {
      if (channelRefs.current[name]) return;

      const channel = supabaseClientGlobal.supabase?.channel(name, { config: { private: true } });
      channel?.on('broadcast', { event: '*' }, ({ payload }) => callback(payload)).subscribe();
      if (channel) channelRefs.current[name] = channel;
    });

    return () => {
      Object.values(channelRefs.current).forEach((channel) => supabaseClientGlobal.supabase?.removeChannel(channel));
      channelRefs.current = {};
    };
  }, [channels]);
}
