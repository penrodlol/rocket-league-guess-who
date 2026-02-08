import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import { Text } from '@/components/text';
import { GetGameResponse } from '@/functions/supabase.function';
import { getSupabaseImageURL } from '@/libs/supabase/client';
import { useListData } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import { GameBoardItem } from './-_game-board-item';

export type GameBoardProps = { game: GetGameResponse };
export type GameBoardItem = GetGameResponse['players'][number] & { role: GetGameResponse['roles'][number] | null };

export function GameBoard({ game }: GameBoardProps) {
  const playersDragAndDropList = useListData<GameBoardItem>({
    initialItems: game.players.map((player) => ({ ...player, role: null })),
  });

  return (
    <Surface rounded variant="gray-soft-outline" className="flex w-full snap-both snap-mandatory flex-col px-6 py-4">
      <div>
        <Text font="display" size="6">
          Guess The Player Roles
        </Text>
        <Text variant="soft">Drag and drop players on to the role cards</Text>
      </div>
      <Surface as="section" className="relative min-h-24 select-none">
        <GameBoardItem list={playersDragAndDropList} role={null} className="flex flex-wrap items-center gap-4" />
      </Surface>
      <div className="mb-10 grid grid-cols-4 gap-4 select-none">
        {game?.roles.map((role) => (
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
            <GameBoardItem
              list={playersDragAndDropList}
              role={role}
              className="flex flex-col gap-1 rounded-[inherit] p-2"
            />
            <Surface className="h-40 overflow-hidden py-2">
              <img
                src={getSupabaseImageURL('guess_who_roles', `${role.name.toLowerCase()}.png`)}
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
        isDisabled={playersDragAndDropList.items.some((item) => !item.role)}
      >
        Submit
      </Button>
    </Surface>
  );
}
