import { Avatar } from '@/components/avatar';
import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import Spinner from '@/components/spinner';
import { Surface } from '@/components/surface';
import { Text } from '@/components/text';
import * as Tooltip from '@/components/tooltip';
import { Role, roles } from '@/data/roles';
import { useDiscord } from '@/providers/discord.provider';
import { useForm } from '@tanstack/react-form';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { CheckIcon } from 'lucide-react';
import { twJoin, twMerge } from 'tailwind-merge';

type RoleCardProps = Omit<React.ComponentProps<'input'>, 'role'> & { role: Role };

export const Route = createFileRoute('/')({ component: App });

function App() {
  const { players } = useDiscord();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: { roles: roles.map((role) => role.name) },
    onSubmit: async (values) => {
      console.log('Form submitted with values:', values);
      navigate({ to: '/game', replace: true });
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
                    <Avatar elevation="3" size="3" src={player.avatarUrl} alt={player.username} />
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
            name="roles"
            mode="array"
            children={(field) => {
              return (
                <fieldset
                  aria-label="Roles"
                  aria-describedby="roles-select-description"
                  className="mt-4 grid grid-cols-4 gap-4"
                >
                  {roles.map((role) => (
                    <RoleCard
                      defaultChecked
                      key={role.name}
                      name={role.name}
                      value={role.name}
                      checked={field.state.value.includes(role.name)}
                      role={role}
                      onChange={(e) => {
                        if (e.target.checked) field.pushValue(role.name);
                        else field.removeValue(field.state.value.indexOf(role.name));
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

export function RoleCard({ className, role, ...props }: RoleCardProps) {
  return (
    <Surface
      rounded
      elevation="3"
      variant="accent-solid-outline-gradient"
      className={twMerge(
        'group/role-card relative flex flex-col gap-2 p-2 select-none',
        'not-has-checked:scale-[0.97] not-has-checked:opacity-50',
        'motion-safe:transition-all',
        className,
      )}
    >
      <Badge
        aria-hidden="true"
        icon={{ source: <CheckIcon /> }}
        className={twJoin(
          'absolute -top-2 -right-2 motion-safe:transition-all',
          'group-not-has-checked/role-card:opacity-0',
          'group-not-has-checked/role-card:scale-[0.95]',
        )}
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
        rounded
        elevation="2"
        variant="accent-soft-outline"
        id={`${role.name}-description`}
        className="flex min-h-20 items-center justify-center p-2 text-center text-balance"
      >
        <Text size="2">{role.description}</Text>
      </Surface>
      <input
        type="checkbox"
        aria-label={role.name}
        aria-describedby={`${role.name}-description`}
        className="absolute inset-0 appearance-none rounded-[inherit] focus-visible:outline-none"
        {...props}
      />
    </Surface>
  );
}
