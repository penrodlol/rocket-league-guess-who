'use client';

import { LoaderCircleIcon } from 'lucide-react';
import { tv, VariantProps } from 'tailwind-variants';
import Icon, { iconVariants } from './icon';

export type SpinnerProps = Omit<React.ComponentProps<typeof Icon>, 'source'> &
  SpinnerVariants & { source?: React.ComponentProps<typeof Icon>['source'] };

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;

export const spinnerVariants = tv({
  extend: iconVariants,
  base: 'motion-safe:animate-spin',
  variants: { size: { '1': 'size-4', '2': 'size-6', '3': 'size-8', '4': 'size-10', '5': 'size-12' } },
});

export default function Spinner({ className, size, variant, ...props }: SpinnerProps) {
  return (
    <Icon
      role="status"
      source={<LoaderCircleIcon />}
      className={spinnerVariants({ size, variant, className })}
      {...props}
    />
  );
}
