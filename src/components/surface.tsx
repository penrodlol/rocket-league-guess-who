import { tv, type VariantProps } from 'tailwind-variants';

export type SurfaceProps<T extends React.ElementType> = Omit<React.ComponentProps<T>, 'size'> &
  SurfaceVariants & { as?: T };

export type SurfaceVariants = VariantProps<typeof surfaceVariants>;

export const surfaceVariants = tv({
  variants: {
    rounded: { true: 'rounded' },
    elevation: { '1': 'elevation-1', '2': 'elevation-2', '3': 'elevation-3' },
    variant: {
      'gray-solid': 'bg-gray-1',
      'gray-soft': 'bg-gray-2',
      'gray-solid-gradient': 'from-gray-1 to-gray-2 bg-linear-to-tr',
      'gray-soft-gradient': 'from-gray-2 to-gray-3 bg-linear-to-tr',
      'gray-solid-outline': 'bg-gray-1 border-gray-6 border',
      'gray-soft-outline': 'bg-gray-2 border-gray-6 border',
      'gray-solid-outline-gradient': 'from-gray-2 to-gray-3 border-gray-6 border bg-linear-to-tr',
      'gray-soft-outline-gradient': 'from-gray-2 to-gray-3 border-gray-6 border bg-linear-to-tr',
      'gray-transparent-outline': 'border-gray-6 border',
      'accent-solid': 'bg-accent-3',
      'accent-soft': 'bg-accent-2',
      'accent-solid-gradient': 'from-accent-3 to-accent-2 bg-linear-to-tr',
      'accent-soft-gradient': 'from-accent-2 to-accent-1 bg-linear-to-tr',
      'accent-solid-outline': 'bg-accent-3 border-accent-7 border',
      'accent-soft-outline': 'bg-accent-2 border-accent-7 border',
      'accent-solid-outline-gradient': 'from-accent-3 to-accent-2 border-accent-7 border bg-linear-to-tr',
      'accent-soft-outline-gradient': 'from-accent-2 to-accent-1 border-accent-7 border bg-linear-to-tr',
      'accent-transparent-outline': 'border-accent-7 border',
    },
  },
});

export function Surface<T extends React.ElementType = 'div'>({
  as,
  className,
  rounded,
  elevation,
  variant,
  ...props
}: SurfaceProps<T>) {
  const Tag = as ?? 'div';
  return <Tag className={surfaceVariants({ rounded, elevation, variant, className })} {...props} />;
}
