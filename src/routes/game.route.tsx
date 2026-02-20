import { Text } from '@/components/text';
import { getGame } from '@/functions/supabase.function';
import discord from '@/libs/discord';
import { useSupabaseRealtimeChannels } from '@/libs/supabase/client';
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { GameLeaderboard } from './-_game-leaderboard';

export const Route = createFileRoute('/game')({
  component: RouteComponent,
  loader: async () => {
    const response = await getGame({ data: discord.instanceId });
    if (!response.success) throw new Error(response.error);
    return response.data;
  },
});

function RouteComponent() {
  const game = Route.useLoaderData();
  const navigate = Route.useNavigate();

  useSupabaseRealtimeChannels([
    {
      name: `game:${game.id}:players-ready`,
      callback: () => setTimeout(() => navigate({ to: '/game/board', replace: true }), 2000),
    },
    {
      name: `game:${game.id}:guesses-submitted`,
      callback: () => setTimeout(() => navigate({ to: `/game/results`, replace: true }), 2000),
    },
    { name: `game:${game.id}:next-round`, callback: () => navigate({ to: '/game/spinner', replace: true }) },
  ]);

  return (
    <div className="flex flex-col items-center gap-10">
      <Text font="display" size="10" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <GameLeaderboard game={game} />
      <Outlet />
    </div>
  );
}
