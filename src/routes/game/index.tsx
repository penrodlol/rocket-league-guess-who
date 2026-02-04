import Spinner from '@/components/spinner';
import { Text } from '@/components/text';
import { getGame } from '@/functions/supabase.function';
import { useDiscord } from '@/providers/discord.provider';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { GameBoard } from './-_game-board';
import { GameLeaderboard } from './-_game-leaderboard';

export const Route = createFileRoute('/game/')({ component: RouteComponent });

function RouteComponent() {
  const { instanceId } = useDiscord();
  const { data: game, isLoading } = useQuery({
    queryKey: ['gameData'],
    queryFn: async () => {
      const response = await getGame(instanceId);
      if (!response.success) throw new Error(response.error);
      return response.data;
    },
  });

  if (!game || isLoading)
    return <Spinner variant="accent" size="5" className="absolute top-1/2 left-1/2 -translate-1/2" />;

  return (
    <div className="flex flex-col items-center gap-10">
      <Text font="display" size="10" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <GameLeaderboard game={game} />
      <GameBoard game={game} />
    </div>
  );
}
