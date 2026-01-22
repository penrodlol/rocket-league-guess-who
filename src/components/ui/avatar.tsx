import { tv, VariantProps } from 'tailwind-variants';

export type AvatarProps = React.ComponentProps<'img'> & AvatarVariants;

export type AvatarVariants = VariantProps<typeof avatarVariants>;

export const avatarVariants = tv({
  slots: {
    base: 'flex items-center justify-center overflow-hidden rounded-full shrink-0',
    image: 'aspect-square size-full object-cover rounded-[inherit]',
  },
  defaultVariants: { size: '2', variant: 'accent-soft-outline' },
  variants: {
    elevation: { '1': 'elevation-1', '2': 'elevation-2', '3': 'elevation-3' },
    size: { '1': 'size-9', '2': 'size-10', '3': 'size-11', '4': 'size-12', '5': 'size-13' },
    variant: {
      'gray-solid': 'bg-gray-9 text-gray-contrast',
      'gray-soft': 'bg-gray-3 text-gray-11',
      'gray-soft-outline': 'bg-gray-3 text-gray-11 border-gray-7 border',
      'gray-outline': 'text-gray-11 border-gray- border',
      'accent-solid': 'bg-accent-9 text-accent-contrast',
      'accent-soft': 'bg-accent-3 text-accent-11',
      'accent-soft-outline': 'bg-accent-3 text-accent-11 border-accent-7 border',
      'accent-outline': 'text-accent-11 border-accent-8 border',
    },
  },
});

export function Avatar({ className, elevation, size, variant, ...props }: AvatarProps) {
  const variants = avatarVariants({ size, variant });
  return (
    <div className={variants.base({ className })}>
      <img className={variants.image()} {...props} />
    </div>
  );
}
