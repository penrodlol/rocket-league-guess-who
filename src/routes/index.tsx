import { CharacterCard } from '@/components/character-card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Spinner from '@/components/ui/spinner';
import { Surface } from '@/components/ui/surface';
import { Text } from '@/components/ui/text';
import * as Tooltip from '@/components/ui/tooltip';
import { characters } from '@/data/characters';
import { useDiscord } from '@/providers/discord.provider';
import { useForm } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  const { players } = useDiscord();
  const form = useForm({
    defaultValues: { characters: characters.map((character) => character.name) },
    onSubmit: async (values) => {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      console.log('Form submitted with values:', values);
    },
  });

  return (
    <div className="flex flex-col items-center gap-10">
      <Text font="display" size="10" weight="8" variant="accent">
        ROCKET LEAGUE GUESS WHO
      </Text>
      <div className="flex w-full flex-col gap-10 px-10">
        <Surface
          rounded
          elevation="1"
          variant="accent-soft-outline-gradient"
          className="flex items-center justify-between gap-4 p-4"
        >
          <div className="flex items-center gap-2">
            <Text font="display" size="5">
              Score to win:
            </Text>
            <Text font="display" variant="accent" size="5">
              {18}
            </Text>
          </div>
          <ul className="flex items-center">
            {players.map((player) => (
              <li key={player.id} className="not-last:-mr-2">
                <Tooltip.Root delay={200} closeDelay={200}>
                  <Tooltip.Trigger>
                    <Avatar elevation="3" src={player.avatarUrl} alt={player.username} />
                  </Tooltip.Trigger>
                  <Tooltip.Content elevation="3">{player.username}</Tooltip.Content>
                </Tooltip.Root>
              </li>
            ))}
          </ul>
        </Surface>
        <form
          className="flex flex-col gap-10"
          onSubmit={(e) => (e.preventDefault(), e.stopPropagation(), form.handleSubmit())}
        >
          <form.Field
            name="characters"
            mode="array"
            children={(field) => {
              return (
                <fieldset
                  aria-label="Characters"
                  aria-describedby="characters-select-description"
                  className="mt-4 grid grid-cols-4 gap-4"
                >
                  {characters.map((character) => (
                    <CharacterCard
                      defaultChecked
                      key={character.name}
                      name={character.name}
                      value={character.name}
                      checked={field.state.value.includes(character.name)}
                      character={character}
                      onChange={(e) => {
                        if (e.target.checked) field.pushValue(character.name);
                        else field.removeValue(field.state.value.indexOf(character.name));
                      }}
                    />
                  ))}
                </fieldset>
              );
            }}
          />
          <form.Subscribe
            selector={(state) => [state.isSubmitting]}
            children={([isSubmitting]) => {
              return (
                <Button
                  type="submit"
                  font="display"
                  elevation="3"
                  size="5"
                  className="gap-4 self-center"
                  disabled={isSubmitting ?? false}
                >
                  {isSubmitting && <Spinner />}
                  Start Game
                </Button>
              );
            }}
          />
        </form>
      </div>
    </div>
  );
}
