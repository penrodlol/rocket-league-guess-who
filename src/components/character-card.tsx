import { Character } from '@/data/characters';
import { CheckIcon } from 'lucide-react';
import { twJoin, twMerge } from 'tailwind-merge';
import { Badge } from './ui/badge';
import { Surface } from './ui/surface';
import { Text } from './ui/text';

export type CharacterCardProps = React.ComponentProps<'input'> & { character: Character };

export function CharacterCard({ className, character, ...props }: CharacterCardProps) {
  return (
    <Surface
      rounded
      elevation="3"
      variant="accent-solid-outline-gradient"
      className={twMerge(
        'group/character-card relative flex flex-col gap-2 p-2',
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
          'group-not-has-checked/character-card:opacity-0',
          'group-not-has-checked/character-card:scale-[0.95]',
        )}
      />
      <Surface className="h-48 overflow-hidden py-2">
        <img
          src={`/characters/${character.name.toLowerCase()}.png`}
          alt={character.name}
          aria-hidden="true"
          className="drop-shadow-accent-9/50 aspect-square size-full object-contain drop-shadow-md"
        />
      </Surface>
      <Surface
        rounded
        elevation="2"
        variant="accent-soft-outline"
        id={`${character.name}-description`}
        className="flex min-h-20 items-center justify-center p-2 text-center text-balance"
      >
        <Text size="2">{character.description}</Text>
      </Surface>
      <input
        type="checkbox"
        aria-label={character.name}
        aria-describedby={`${character.name}-description`}
        className="absolute inset-0 appearance-none rounded-[inherit] focus-visible:outline-none"
        {...props}
      />
    </Surface>
  );
}
