import { Text } from '@/components/text';
import { getGame, insertGamePlayerGuesses, updateGamePlayerRole } from '@/functions/supabase.function';
import discord from '@/libs/discord';
import { useSupabaseRealtimeChannel } from '@/libs/supabase/client';
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

  useSupabaseRealtimeChannel<{ ready: boolean }>(
    `game:${game.id}:players-ready`,
    ({ ready }) => ready && navigate({ to: '/game', replace: true }),
    { enabled: !game.ready },
  );

  if (!player) return <></>;

  return (
    <div className="flex flex-col items-center gap-10">
      <Text font="display" size="10" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <GameLeaderboard game={game} />
      {!game.ready ? (
        <GameRoleSpinner
          game={game}
          player={player}
          onRoleSelected={(roleId) => updateGamePlayerRole(player.id, roleId)}
        />
      ) : (
        <GameBoard
          game={game}
          player={player}
          onSubmit={({ completed, guesses }) =>
            insertGamePlayerGuesses(
              game.id,
              player.id,
              completed,
              guesses.map((guess) => ({ playerId: guess.id, roleId: guess.role.id })),
            )
          }
        />
      )}
    </div>
  );
}
