import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import Icon from '@/components/icon';
import { Progress } from '@/components/progress';
import { Surface, surfaceVariants } from '@/components/surface';
import { Text } from '@/components/text';
import * as Tooltip from '@/components/tooltip';
import { roles } from '@/data/roles';
import { DiscordPlayer, useDiscord } from '@/providers/discord.provider';
import { createFileRoute } from '@tanstack/react-router';
import { GripIcon } from 'lucide-react';
import { GridList, GridListItem, isTextDropItem, ListData, useDragAndDrop, useListData } from 'react-aria-components';
import { twJoin, twMerge } from 'tailwind-merge';

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

type DragAndDropItem = DiscordPlayer & { role: 'None' | (typeof roles)[number]['name'] };
type DropAreaProps = { role: DragAndDropItem['role']; list: ListData<DragAndDropItem>; className?: string };

export const Route = createFileRoute('/game')({ component: RouteComponent });

function RouteComponent() {
  const { players } = useDiscord();
  const playersDragAndDropList = useListData<DragAndDropItem>({
    initialItems: players.map((player) => ({ ...player, role: 'None' })),
  });

  return (
    <div className="flex flex-col items-center gap-10">
      <Text font="display" size="10" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <ul className="flex w-full flex-col gap-2">
        {playersDragAndDropList.items.map((player) => {
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
                <Progress
                  elevation="3"
                  size="1"
                  variant="accent-stripes"
                  id={`score-${player.id}`}
                  max={18}
                  value={value}
                />
                <img
                  src={`/fennecs/${fennec}.png`}
                  alt="Fennec"
                  aria-hidden="true"
                  style={{ left: `max(0px, calc(${left}% - calc(var(--spacing)*14)))` } as React.CSSProperties}
                  className="absolute top-1/2 z-50 aspect-square size-14 shrink-0 -translate-y-[55%] object-contain"
                />
              </div>
              <Text as="label" font="display" size="4" variant="accent" htmlFor={`score-${player.id}`}>
                {value}
              </Text>
            </li>
          );
        })}
      </ul>
      <Surface rounded variant="gray-soft-outline" className="flex w-full snap-both snap-mandatory flex-col px-6 py-4">
        <div>
          <Text font="display" size="6">
            Guess The Player Roles
          </Text>
          <Text variant="soft">Drag and drop players on to the role cards</Text>
        </div>
        <Surface as="section" className="relative min-h-24 select-none">
          <DropArea list={playersDragAndDropList} role="None" className="flex flex-wrap items-center gap-4" />
        </Surface>
        <div className="mb-10 grid grid-cols-4 gap-4 select-none">
          {roles.map((role) => (
            <Surface
              as="section"
              rounded
              elevation="3"
              variant="accent-solid-outline-gradient"
              className={twJoin(
                'relative flex flex-col gap-2 border-4 border-dashed p-2',
                'has-drop-target:border-accent-8 has-drop-target:scale-[0.99] motion-safe:transition-[scale]',
              )}
            >
              <DropArea
                list={playersDragAndDropList}
                role={role.name}
                className="flex flex-col gap-1 rounded-[inherit] p-2"
              />
              <Surface className="h-40 overflow-hidden py-2">
                <img
                  src={`/roles/${role.name.toLowerCase()}.png`}
                  alt={role.name}
                  aria-hidden="true"
                  className="drop-shadow-accent-9/50 aspect-square size-full object-contain drop-shadow-md"
                />
              </Surface>
              <Surface
                id={`${role.name}-description`}
                rounded
                elevation="2"
                variant="accent-soft-outline"
                className="flex min-h-20 items-center justify-center p-2 text-center text-balance"
              >
                <Text size="2">{role.description}</Text>
              </Surface>
            </Surface>
          ))}
        </div>
        <Button
          font="display"
          size="4"
          className="self-end"
          disabled={playersDragAndDropList.items.some((item) => item.role === 'None')}
        >
          Submit
        </Button>
      </Surface>
    </div>
  );
}

function DropArea({ list, role, className }: DropAreaProps) {
  const players = list.items.filter((item) => item.role === role);
  const { dragAndDropHooks } = useDragAndDrop({
    getItems: (_, items: typeof players) => items.map((item) => ({ id: item.id, ['text/plain']: item.username })),
    acceptedDragTypes: ['id'],
    getDropOperation: () => 'move',
    onInsert: async (event) => {
      const ids = await Promise.all(event.items.filter(isTextDropItem).map((item) => item.getText('id')));
      ids.forEach((id) => list.update(id, { ...list.getItem(id)!, role }));
      if (event.target.dropPosition === 'before') list.moveBefore(event.target.key, ids);
      else if (event.target.dropPosition === 'after') list.moveAfter(event.target.key, ids);
    },
    onRootDrop: async (event) => {
      const ids = await Promise.all(event.items.filter(isTextDropItem).map((item) => item.getText('id')));
      ids.forEach((id) => list.update(id, { ...list.getItem(id)!, role }));
    },
    onReorder: async (event) => {
      if (event.target.dropPosition === 'before') list.moveBefore(event.target.key, event.keys);
      else if (event.target.dropPosition === 'after') list.moveAfter(event.target.key, event.keys);
    },
  });

  return (
    <GridList
      items={players}
      aria-label={role}
      dragAndDropHooks={dragAndDropHooks}
      selectionMode="single"
      className={twMerge('absolute inset-0 z-50', className)}
    >
      {(player) => {
        return (
          <GridListItem
            key={player.id}
            id={player.id}
            textValue={player.username}
            className={surfaceVariants({
              rounded: true,
              elevation: '3',
              variant: 'gray-solid-outline',
              className: [
                'flex max-w-max cursor-grab items-center gap-2 px-4 py-2 *:pointer-events-none',
                'pressed:cursor-grabbing dragging:opacity-50 pressed:scale-[0.95] motion-safe:transition-all',
              ],
            })}
          >
            <Avatar elevation="3" size="1" src={player.avatarUrl} alt={player.username} />
            <Text weight="6">{player.username}</Text>
            <Icon size="1" variant="soft" source={<GripIcon />} className="ml-2" />
          </GridListItem>
        );
      }}
    </GridList>
  );
}
