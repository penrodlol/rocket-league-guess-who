import Spinner from '@/components/spinner';
import { DiscordProvider, useDiscord } from '@/providers/discord.provider';
import type { QueryClient } from '@tanstack/react-query';
import { HeadContent, Scripts, createRootRouteWithContext } from '@tanstack/react-router';
import { twJoin } from 'tailwind-merge';
import css from '../index.css?url';

type RouterContext = { queryClient: QueryClient };

export const Route = createRootRouteWithContext<RouterContext>()({
  shellComponent: RootDocument,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Rocket League Guess Who' },
    ],
    links: [
      { rel: 'stylesheet', href: css },
      { rel: 'icon', href: '/favicon.svg' },
    ],
  }),
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <DiscordProvider>
      <html
        lang="en"
        className={twJoin(
          'selection:bg-accent-3 min-h-svh w-full bg-[url("/background.png")] bg-cover bg-fixed bg-center antialiased',
          '[scrollbar-color:var(--color-gray-3)_transparent] [scrollbar-gutter:stable]',
        )}
      >
        <head>
          <HeadContent />
        </head>
        <body className="mx-auto flex min-h-svh w-full max-w-6xl flex-col p-10">
          <main className="bg-gray-1/90 text-gray-12 shadow-gray-12 flex-1 rounded px-8 py-10 shadow-2xl backdrop-blur-sm">
            <RootActivity>{children}</RootActivity>
          </main>
          <Scripts />
        </body>
      </html>
    </DiscordProvider>
  );
}

function RootActivity({ children }: { children: React.ReactNode }) {
  const { loading } = useDiscord();
  if (loading) return <Spinner variant="accent" size="5" className="absolute top-1/2 left-1/2 -translate-1/2" />;
  return children;
}
