import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Surface } from '@/components/surface';
import * as Table from '@/components/table';
import { Text } from '@/components/text';
import { GetGamePlayersGuessesResponse, GetGameResponse } from '@/functions/supabase.function';
import { getSupabaseImageURL } from '@/libs/supabase/client';

export type GameBoardGuessResultsProps = {
  hosting: boolean;
  completed: boolean;
  roles: GetGameResponse['roles'];
  playersGuesses: GetGamePlayersGuessesResponse;
  onNextRound: () => void;
};

export function GameBoardGuessResults({
  hosting,
  completed,
  roles,
  playersGuesses,
  onNextRound,
}: GameBoardGuessResultsProps) {
  return (
    <>
      <Surface rounded variant="gray-soft-outline" className="flex w-full flex-col gap-12 px-6 py-4">
        <div className="flex justify-between gap-4">
          <div>
            <Text font="display" size="6">
              Guess Who Results
            </Text>
            <Text variant="soft">See how your guesses compared to everyone elses.</Text>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-accent-11 size-4 rounded" />
              <Text font="display" size="2" variant="accent">
                Correct
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-danger-11 size-4 rounded" />
              <Text font="display" size="2" variant="danger">
                Incorrect
              </Text>
            </div>
          </div>
        </div>
        <Table.Root rounded elevation="3" variant="gray-solid-outline">
          <Table.Header>
            {playersGuesses
              .sort((a, b) => a.userId.localeCompare(b.userId))
              .map((player) => {
                return (
                  <Table.Row key={player.id}>
                    <Table.Head className="bg-gray-3 elevation-3 w-48">Player</Table.Head>
                    <Table.Head className="bg-gray-3 elevation-3 w-48">Role</Table.Head>
                    {[...player.guesses, ...player.guesses, ...player.guesses, ...player.guesses, ...player.guesses]
                      .sort((a, b) => a.player.userId.localeCompare(b.player.userId))
                      .map((guess) => (
                        <Table.Head key={guess.id}>{guess.player.username}</Table.Head>
                      ))}
                    <Table.Head className="bg-gray-3 elevation-3 w-[6ch]">Points</Table.Head>
                  </Table.Row>
                );
              })}
          </Table.Header>
          <Table.Body>
            {[...playersGuesses, ...playersGuesses, ...playersGuesses, ...playersGuesses, ...playersGuesses]
              .sort((a, b) => a.userId.localeCompare(b.userId))
              .map((player) => {
                return (
                  <Table.Row key={player.id}>
                    <Table.Cell className="bg-gray-3 elevation-3 w-48">
                      <div className="flex items-center gap-2">
                        <Avatar size="1" src={player.avatarUrl} alt={player.username} />
                        {player.username}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="bg-gray-3 elevation-3 w-48">
                      <div className="flex items-center gap-2">
                        {player.role?.name}
                        <Text italic variant="soft" size="2">
                          ({player.completed ? 'Completed' : 'Failed'})
                        </Text>
                      </div>
                    </Table.Cell>
                    {[...player.guesses, ...player.guesses, ...player.guesses, ...player.guesses, ...player.guesses]
                      .sort((a, b) => a.player.userId.localeCompare(b.player.userId))
                      .map((guess) => (
                        <Table.Cell key={guess.id}>
                          <Text weight="6" variant={guess.correct ? 'accent' : 'danger'}>
                            {guess.role?.name}
                          </Text>
                        </Table.Cell>
                      ))}
                    <Table.Cell className="bg-gray-3 elevation-3 w-[6ch]">
                      {player.guesses.reduce((acc, guess) => acc + (guess.correct ? 1 : 0), 0) +
                        (player.completed ? 4 : 0)}
                    </Table.Cell>
                  </Table.Row>
                );
              })}
          </Table.Body>
        </Table.Root>
        {!completed &&
          (hosting ? (
            <Button font="display" size="4" className="self-end" onClick={onNextRound}>
              Next Round
            </Button>
          ) : (
            <Text font="display" className="self-center motion-safe:animate-pulse">
              Waiting for host to start the next round...
            </Text>
          ))}
      </Surface>
      <ul className="grid grid-cols-4 gap-4">
        {roles.map((role) => (
          <Surface
            key={role.id}
            as="li"
            rounded
            elevation="3"
            variant="accent-solid-outline-gradient"
            className="flex flex-col gap-2 p-2"
          >
            <Surface className="h-40 overflow-hidden py-2">
              <img
                src={getSupabaseImageURL('guess_who_roles', `${role.name.toLowerCase()}.png`)}
                alt={role.name}
                aria-hidden="true"
                className="drop-shadow-accent-9/50 aspect-square size-full object-contain drop-shadow-md"
              />
            </Surface>
            <Surface
              rounded
              elevation="2"
              variant="accent-soft-outline"
              className="flex min-h-20 items-center justify-center p-2 text-center text-balance"
            >
              <Text size="2">{role.description}</Text>
            </Surface>
          </Surface>
        ))}
      </ul>
    </>
  );
}
