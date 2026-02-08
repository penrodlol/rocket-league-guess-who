import { Text } from '@/components/text';
import { getGame, updateGamePlayerRole } from '@/functions/supabase.function';
import discord from '@/libs/discord';
import { useSupabaseRealtimeChannel } from '@/libs/supabase/client';
import { useDiscord } from '@/providers/discord.provider';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { GameBoard } from './-_game-board';
import { GameLeaderboard } from './-_game-leaderboard';
import { GameRoleSpinner } from './-_game-role-spinner';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
  loader: async () => {
    const response = await getGame({ data: discord.instanceId });
    if (!response.success) throw new Error(response.error);
    return response.data;
  },
});

function RouteComponent() {
  const game = Route.useLoaderData();
  const navigate = useNavigate();
  const { user } = useDiscord();
  const [ready, setReady] = useState(game.ready);
  const player = useMemo(() => game.players.find((player) => player.userId === user?.id), [game, user]);

  useSupabaseRealtimeChannel<{ ready: boolean }>(`game:${game.id}`, async ({ ready }) => {
    setReady(ready);
    if (ready) navigate({ to: '/game', replace: true });
  });

  return (
    <div className="flex flex-col items-center gap-10">
      <Text font="display" size="10" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <GameLeaderboard game={game} />
      {!ready ? (
        <GameRoleSpinner
          game={game}
          player={player}
          onRoleSelected={(roleId) => updateGamePlayerRole(player?.id!, roleId)}
        />
      ) : (
        <GameBoard game={game} />
      )}
    </div>
  );
}
