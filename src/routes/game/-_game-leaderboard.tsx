import { Avatar } from '@/components/avatar';
import { Progress } from '@/components/progress';
import { Text } from '@/components/text';
import * as Tooltip from '@/components/tooltip';
import { GetGameResponse } from '@/functions/supabase.function';
import { getSupabaseImageURL } from '@/libs/supabase/client';

export type GameLeaderboardProps = { game: GetGameResponse };

export function GameLeaderboard({ game }: GameLeaderboardProps) {
  return (
    <ul className="flex w-full flex-col gap-2">
      {game.players.map((player) => {
        const left = (player.score / game.scoreToWin) * 100;
        return (
          <li key={player.id} className="flex items-center gap-4">
            <Tooltip.Root delay={200} closeDelay={200}>
              <Tooltip.Trigger>
                <Avatar elevation="3" size="1" src={player.avatarUrl} alt={player.username} />
              </Tooltip.Trigger>
              <Tooltip.Content elevation="3">{player.username}</Tooltip.Content>
            </Tooltip.Root>
            <div className="relative w-full">
              <Progress
                elevation="3"
                size="1"
                variant="accent-stripes"
                id={`score-${player.id}`}
                max={game.scoreToWin}
                value={player.score}
              />
              <img
                src={getSupabaseImageURL('guess_who_cars', player.carImage ?? 'red')}
                alt={player.carImage ?? 'Car'}
                aria-hidden="true"
                style={{ left: `max(0px, calc(${left}% - calc(var(--spacing)*14)))` } as React.CSSProperties}
                className="absolute top-1/2 z-50 aspect-square size-14 shrink-0 -translate-y-[55%] object-contain"
              />
            </div>
            <Text as="label" font="display" size="4" variant="accent" htmlFor={`score-${player.id}`}>
              {player.score}
            </Text>
          </li>
        );
      })}
    </ul>
  );
}
