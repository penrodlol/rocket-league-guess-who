import * as Wheel from '@/components/wheel';
import { GetGameResponse } from '@/functions/supabase.function';

export type GameRoleSpinnerProps = {
  game: GetGameResponse;
  onRoleSelected: (role: GetGameResponse['roles'][0]['id']) => void;
};

export function GameRoleSpinner({ game, onRoleSelected }: GameRoleSpinnerProps) {
  return (
    <Wheel.Root
      className="flex flex-col items-center gap-12"
      items={game.roles}
      valueAccessor={(item) => item.name}
      onSpinStop={(item) => onRoleSelected(item.id)}
    >
      <Wheel.Items />
      <Wheel.Trigger font="display" elevation="3" size="5">
        Spin
      </Wheel.Trigger>
    </Wheel.Root>
  );
}
