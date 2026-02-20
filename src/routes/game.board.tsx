import { Button } from '@/components/button';
import * as Dialog from '@/components/dialog';
import * as RadioGroup from '@/components/radio-group';
import Separator from '@/components/separator';
import { Surface } from '@/components/surface';
import { Text } from '@/components/text';
import { getGame, GetGameResponse, submitPlayerGuesses } from '@/functions/supabase.function';
import discord from '@/libs/discord';
import { getSupabaseImageURL } from '@/libs/supabase/client';
import { useDiscord } from '@/providers/discord.provider';
import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useMemo } from 'react';
import { useListData } from 'react-aria-components';
import { twJoin } from 'tailwind-merge';
import { GameBoardItem } from './-_game-board-item';

export type GameBoardItem = GetGameResponse['players'][number] & { role: GetGameResponse['roles'][number] | null };

export const Route = createFileRoute('/game/board')({
  component: RouteComponent,
  loader: async () => {
    const response = await getGame({ data: discord.instanceId });
    if (!response.success) throw new Error(response.error);
    return response.data;
  },
});

function RouteComponent() {
  const game = Route.useLoaderData();
  const { user } = useDiscord();
  const player = useMemo(() => game.players.find((player) => player.userId === user?.id), [game, user]);

  const submitPlayerGuessesFn = useServerFn(submitPlayerGuesses);
  const submitPlayerGuessesFnMutation = useMutation({ mutationFn: submitPlayerGuessesFn });

  const playersDragAndDropList = useListData<GameBoardItem>({
    initialItems: game.players.map((player) => ({ ...player, role: null })),
  });

  const form = useForm({
    defaultValues: { completed: '' },
    onSubmit: async ({ value }) => {
      if (!player) return;
      const completed = value.completed === 'yes';
      const guesses = playersDragAndDropList.items.map((item) => ({ playerId: item.id, roleId: item.role?.id! }));
      submitPlayerGuessesFnMutation.mutate({ data: { gameId: game.id, playerId: player.id, completed, guesses } });
    },
  });

  return (
    <>
      <form onSubmit={(e) => (e.preventDefault(), e.stopPropagation(), form.handleSubmit())}>
        <Surface
          rounded
          variant="gray-soft-outline"
          className="flex w-full snap-both snap-mandatory flex-col px-6 py-4"
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <Text font="display" size="6">
                Guess The Player Roles
              </Text>
              <Text variant="soft">Drag and drop players on to the role cards</Text>
            </div>
            {!player?.role?.special ? (
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
            ) : (
              <div className="flex flex-col items-end">
                <Text>Current Role:</Text>
                <Text font="display" size="6" variant="accent">
                  {player?.role?.name}
                </Text>
              </div>
            )}
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
            selector={(state) => [
              state.isPristine,
              state.isFormValid,
              state.isSubmitting,
              state.isSubmitSuccessful,
              state.values.completed === 'yes',
            ]}
            children={([isPristine, isFormValid, isSubmitting, isSubmitSuccessful, completed]) => {
              return (
                <>
                  <Button
                    type="submit"
                    font="display"
                    size="4"
                    className="self-end"
                    isDisabled={
                      (!player?.role?.special && (isPristine || !isFormValid || isSubmitting)) ||
                      playersDragAndDropList.items.some((item) => !item.role)
                    }
                  >
                    Submit
                  </Button>
                  {isSubmitSuccessful && (
                    <Dialog.Root isOpen>
                      <Dialog.Content className="flex flex-col items-center text-center text-balance">
                        <img
                          src={getSupabaseImageURL('guess_who_roles', `${player?.role?.name.toLowerCase()}.png`)}
                          alt={player?.role?.name}
                          className={twJoin(
                            'drop-shadow-accent-9/50 mb-4 aspect-square size-60 self-center object-contain drop-shadow-md',
                            !completed && 'opacity-50 grayscale',
                          )}
                        />
                        <div className="flex flex-col gap-4">
                          {!player?.role?.special && (
                            <>
                              <Text font="display" size="9" variant={completed ? 'accent' : 'danger'}>
                                {completed ? 'Mission Success' : 'Mission Failed'}
                              </Text>
                              <div className="flex items-center justify-center gap-1.5">
                                <Text size="6">Points Earned:</Text>
                                <Text
                                  font="display"
                                  size="6"
                                  variant={completed ? 'accent' : 'soft'}
                                  className="translate-y-px"
                                >
                                  {completed ? 4 : 0}
                                </Text>
                              </div>
                            </>
                          )}
                          <Surface
                            rounded
                            elevation="1"
                            variant="accent-soft-outline"
                            className="flex flex-col gap-4 px-2 py-4"
                          >
                            {!!player?.role?.special && (
                              <Text weight="6">
                                Please wait for players to submit their guesses to see if you have succeeded or failed
                                your role.
                              </Text>
                            )}
                            <Text>
                              More points can be earned based on the accuracy of your guesses. You will earn 1 point for
                              each correct guess.
                            </Text>
                          </Surface>
                        </div>
                        <Separator className="my-4" />
                        <Text font="display" size="6" className="motion-safe:animate-pulse">
                          Waiting for other players to make their guesses...
                        </Text>
                      </Dialog.Content>
                    </Dialog.Root>
                  )}
                </>
              );
            }}
          />
        </Surface>
      </form>
    </>
  );
}
