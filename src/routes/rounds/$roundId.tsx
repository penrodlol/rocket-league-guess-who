import { Avatar } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import * as Tooltip from '@/components/ui/tooltip';
import { useDiscord } from '@/providers/discord.provider';
import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/rounds/$roundId')({ component: RouteComponent });

const colors = [
  'black',
  'blue',
  'brown',
  'gold',
  'gray',
  'green',
  'lavender',
  'orange',
  'pink',
  'red',
  'salmon',
  'silver',
  'turquoise',
  'white',
  'yellow',
];

function RouteComponent() {
  const params = Route.useParams();
  const { players } = useDiscord();

  return (
    <div className="flex flex-col items-center gap-10">
      <Link to="/" className="fixed top-2 left-2 opacity-10">
        Home
      </Link>

      <Text font="display" size="10" weight="8" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <Surface rounded variant="gray-soft-outline" className="flex w-full flex-col gap-6 px-6 py-4">
        <div className="flex items-center justify-between">
          <Text font="display" size="5">
            Scoreboard
          </Text>
          <div className="flex items-center gap-1">
            <Text size="2">Score to win:</Text>
            <Text variant="accent" weight="8">
              {18}
            </Text>
          </div>
        </div>
        <ul className="flex flex-col gap-2">
          {[...players, ...players, ...players, ...players, ...players].map((player) => {
            const value = Math.floor(Math.random() * 12) + 2;
            const left = (value / 18) * 100;
            const fennec = colors[Math.floor(Math.random() * colors.length)];

            return (
              <li key={player.id} className="flex items-center gap-4">
                <Tooltip.Root delay={200} closeDelay={200}>
                  <Tooltip.Trigger>
                    <Avatar elevation="3" size="1" src={player.avatarUrl} alt={player.username} />
                  </Tooltip.Trigger>
                  <Tooltip.Content elevation="3">{player.username}</Tooltip.Content>
                </Tooltip.Root>
                <div className="relative w-full">
                  <Progress elevation="3" variant="accent-stripes" id={`score-${player.id}`} max={18} value={value} />
                  <img
                    src={`/fennecs/${fennec}.png`}
                    alt="Fennec"
                    aria-hidden="true"
                    style={{ '--left': `max(0px, calc(${left}% - calc(var(--spacing)*18)))` } as React.CSSProperties}
                    className="absolute top-1/2 left-(--left) z-50 aspect-square size-18 shrink-0 -translate-y-[55%] object-contain"
                  />
                </div>
                <Text as="label" font="display" size="4" variant="accent" htmlFor={`score-${player.id}`}>
                  {value}
                </Text>
              </li>
            );
          })}
        </ul>
      </Surface>
    </div>
  );
}
