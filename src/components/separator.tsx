import { VariantProps, tv } from 'tailwind-variants';

export type SeperatorProps = Omit<React.ComponentProps<'div'>, 'children' | 'role'> & SeparatorVariants;

export type SeparatorVariants = VariantProps<typeof separatorVariants>;

export const separatorVariants = tv({
  base: 'bg-gray-6 rounded',
  defaultVariants: { orientation: 'horizontal' },
  variants: { orientation: { horizontal: 'h-px w-full', vertical: 'h-full w-px' } },
});

export default function Separator({ className, orientation, ...props }: SeperatorProps) {
  return <div role="separator" className={separatorVariants({ orientation, className })} {...props} />;
}
