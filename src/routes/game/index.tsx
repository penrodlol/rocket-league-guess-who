import { Text } from '@/components/text';
import { getGame, updateGamePlayerRole } from '@/functions/supabase.function';
import discord from '@/libs/discord';
import { useDiscord } from '@/providers/discord.provider';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
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
  const player = useMemo(() => game.players.find((player) => player.userId === user?.id), [game, user]);

  return (
    <div className="flex flex-col items-center gap-10">
      <Text font="display" size="10" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <GameLeaderboard game={game} />
      {!player?.role?.id ? (
        <GameRoleSpinner
          game={game}
          onRoleSelected={async (roleId) => {
            const response = await updateGamePlayerRole(player?.id!, roleId);
            if (response.success) navigate({ to: '/game', replace: true });
          }}
        />
      ) : (
        <GameBoard game={game} />
      )}
    </div>
  );
}
