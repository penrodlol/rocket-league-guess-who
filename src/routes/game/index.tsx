import { Text } from '@/components/text';
import { getGame, submitPlayerGuesses, submitPlayerRole } from '@/functions/supabase.function';
import discord from '@/libs/discord';
import { useSupabaseRealtimeChannels } from '@/libs/supabase/client';
import { useDiscord } from '@/providers/discord.provider';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
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

  const submitPlayerRoleFn = useServerFn(submitPlayerRole);
  const submitPlayerRoleFnMutation = useMutation({ mutationFn: submitPlayerRoleFn });

  const submitPlayerGuessesFn = useServerFn(submitPlayerGuesses);
  const submitPlayerGuessesFnMutation = useMutation({ mutationFn: submitPlayerGuessesFn });

  useSupabaseRealtimeChannels([
    { name: `game:${game.id}:players-ready`, callback: () => navigate({ to: '/game', replace: true }) },
  ]);

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
          onRoleSelected={(roleId) => submitPlayerRoleFnMutation.mutate({ data: { playerId: player.id, roleId } })}
        />
      ) : (
        <GameBoard
          game={game}
          player={player}
          onSubmit={({ completed, guesses }) =>
            submitPlayerGuessesFnMutation.mutate({ data: { gameId: game.id, playerId: player.id, completed, guesses } })
          }
        />
      )}
    </div>
  );
}
