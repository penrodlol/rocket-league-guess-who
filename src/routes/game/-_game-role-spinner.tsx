import * as Dialog from '@/components/dialog';
import Separator from '@/components/separator';
import { Surface } from '@/components/surface';
import { Text } from '@/components/text';
import * as Wheel from '@/components/wheel';
import { GetGameResponse } from '@/functions/supabase.function';
import { getSupabaseImageURL } from '@/libs/supabase/client';
import { useState } from 'react';

export type GameRoleSpinnerProps = {
  game: GetGameResponse;
  player: GetGameResponse['players'][0] | undefined;
  onRoleSelected: (role: GetGameResponse['roles'][0]['id']) => void;
};

export function GameRoleSpinner({ game, player, onRoleSelected }: GameRoleSpinnerProps) {
  const [role, setRole] = useState<NonNullable<typeof player>['role'] | undefined>(player?.role);

  return (
    <Surface rounded elevation="3" variant="gray-soft-outline" className="flex w-full flex-col gap-10 px-6 pt-4 pb-10">
      <div>
        <Text font="display" size="6">
          Select Your Role
        </Text>
        <Text variant="soft">Spin the wheel to determine your role</Text>
      </div>
      <Wheel.Root
        className="flex flex-col items-center gap-8"
        items={game.roles}
        valueAccessor={(item) => item.name}
        onSpinStop={async (item) => {
          setRole(item);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          onRoleSelected(item.id);
        }}
      >
        <Wheel.Items />
        <Wheel.Trigger font="display" elevation="3" size="5">
          Spin
        </Wheel.Trigger>
      </Wheel.Root>
      {role && (
        <Dialog.Root isOpen>
          <Dialog.Content className="flex flex-col items-center text-center text-balance">
            <img
              src={getSupabaseImageURL('guess_who_roles', `${role.name.toLowerCase()}.png`)}
              alt={role.name}
              className="drop-shadow-accent-9/50 aspect-square size-80 self-center object-contain drop-shadow-md"
            />
            <Text size="6">{role.description}</Text>
            <Separator className="mt-6 mb-4" />
            <Text font="display" size="6" className="motion-safe:animate-pulse">
              Waiting for other players to select their roles...
            </Text>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Surface>
  );
}
