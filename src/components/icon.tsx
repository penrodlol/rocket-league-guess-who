import { cloneElement, isValidElement } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

export type IconProps = React.ComponentProps<'svg'> & IconVariants & { source: React.JSX.Element };

export type IconVariants = VariantProps<typeof iconVariants>;

export const iconVariants = tv({
  base: 'shrink-0',
  defaultVariants: { size: '2' },
  variants: {
    variant: { soft: 'text-gray-11', accent: 'text-accent-11' },
    size: { '1': 'size-4', '2': 'size-5', '3': 'size-6', '4': 'size-7', '5': 'size-8' },
  },
});

export default function Icon({ className, variant, size, source, ...props }: IconProps) {
  if (!isValidElement(source)) return null;
  return cloneElement(source as React.JSX.Element, { className: iconVariants({ variant, size, className }), ...props });
}
