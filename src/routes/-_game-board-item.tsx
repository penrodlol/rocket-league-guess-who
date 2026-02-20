import { Avatar } from '@/components/avatar';
import Icon from '@/components/icon';
import { surfaceVariants } from '@/components/surface';
import { Text } from '@/components/text';
import { GripIcon } from 'lucide-react';
import { GridList, GridListItem, isTextDropItem, ListData, useDragAndDrop } from 'react-aria-components';
import { ClassNameValue, twMerge } from 'tailwind-merge';
import { type GameBoardItem } from './game.board';

export type GameBoardItemProps = {
  list: ListData<GameBoardItem>;
  role: GameBoardItem['role'];
  className?: ClassNameValue;
};

export function GameBoardItem({ className, list, role }: GameBoardItemProps) {
  const players = list.items.filter((player) => player.role === role);
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
      aria-label={role?.name ?? 'None'}
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
