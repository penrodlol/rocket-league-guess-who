import { Button } from '@/components/button';
import * as RadioGroup from '@/components/radio-group';
import { Surface } from '@/components/surface';
import { Text } from '@/components/text';
import { GetGameResponse } from '@/functions/supabase.function';
import { getSupabaseImageURL } from '@/libs/supabase/client';
import { useForm } from '@tanstack/react-form';
import { useListData } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import { GameBoardItem } from './-_game-board-item';

export type GameBoardProps = {
  game: GetGameResponse;
  player: GetGameResponse['players'][number] | undefined;
  onSubmit: (props: {
    completed: boolean;
    guesses: Array<Omit<GameBoardItem, 'role'> & { role: NonNullable<GameBoardItem['role']> }>;
  }) => void;
};
export type GameBoardItem = GetGameResponse['players'][number] & { role: GetGameResponse['roles'][number] | null };

export function GameBoard({ game, player, onSubmit }: GameBoardProps) {
  const playersDragAndDropList = useListData<GameBoardItem>({
    initialItems: game.players.map((player) => ({ ...player, role: null })),
  });

  const form = useForm({
    defaultValues: { completed: '' },
    onSubmit: ({ value }) => {
      const guesses = playersDragAndDropList.items as Parameters<typeof onSubmit>[0]['guesses'];
      onSubmit({ completed: value.completed === 'yes', guesses });
    },
  });

  return (
    <form onSubmit={(e) => (e.preventDefault(), e.stopPropagation(), form.handleSubmit())}>
      <Surface rounded variant="gray-soft-outline" className="flex w-full snap-both snap-mandatory flex-col px-6 py-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <Text font="display" size="6">
              Guess The Player Roles
            </Text>
            <Text variant="soft">Drag and drop players on to the role cards</Text>
          </div>
          <form.Field
            name="completed"
            children={(field) => (
              <RadioGroup.Root isRequired onChange={(value) => field.handleChange(value)} onBlur={field.handleBlur}>
                <RadioGroup.Label>
                  Completed Successfully?
                  <Text font="display" size="5" variant="accent">
                    {player?.role?.name}
                  </Text>
                </RadioGroup.Label>
                <RadioGroup.Items orientation="horizontal" className="justify-end">
                  <RadioGroup.Item elevation="3" size="5" value="yes">
                    Yes
                  </RadioGroup.Item>
                  <RadioGroup.Item elevation="3" size="5" value="no">
                    No
                  </RadioGroup.Item>
                </RadioGroup.Items>
              </RadioGroup.Root>
            )}
          />
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

        <form.Subscribe
          selector={(state) => [state.isPristine, state.isFormValid, state.isSubmitting]}
          children={([isPristine, isFormValid, isSubmitting]) => {
            return (
              <Button
                type="submit"
                font="display"
                size="4"
                className="self-end"
                isDisabled={
                  isPristine || !isFormValid || isSubmitting || playersDragAndDropList.items.some((item) => !item.role)
                }
              >
                Submit
              </Button>
            );
          }}
        />
      </Surface>
    </form>
  );
}
