import { Label as LabelPrimitive, Radio, RadioGroup } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv, VariantProps } from 'tailwind-variants';
import { Text, TextVariants } from './text';

export type RadioGroupRootProps = Omit<React.ComponentProps<typeof RadioGroup>, 'className'> & { className?: string };
export type RadioGroupLabelProps = React.ComponentProps<typeof LabelPrimitive> & TextVariants;
export type RadioGroupItemsProps = React.ComponentProps<'div'> & RadioGroupItemsVariants;
export type RadioGroupItemProps = Omit<React.ComponentProps<typeof Radio>, 'children' | 'className'> &
  RadioGroupItemVariants & { children?: React.ReactNode; className?: string };

export type RadioGroupItemsVariants = VariantProps<typeof radioGroupItemsVariants>;
export type RadioGroupItemVariants = VariantProps<typeof radioGroupItemVariants>;

export const radioGroupItemsVariants = tv({
  base: 'flex flex-wrap gap-x-6 gap-y-4',
  defaultVariants: { orientation: 'vertical' },
  variants: { orientation: { vertical: 'flex-col', horizontal: 'items-center' } },
});

export const radioGroupItemVariants = tv({
  slots: {
    base: 'group flex max-w-max items-center gap-2.5 select-none disabled:pointer-events-none disabled:opacity-50',
    control: [
      'relative flex shrink-0 appearance-none items-center justify-center overflow-hidden rounded-full border',
      'group-focus-visible:ring-accent-8 group-focus-visible:ring group-focus-visible:outline-none',
      'group-selected:bg-accent-9 group-selected:border-transparent group-not-selected:group-pressed:scale-[0.95]',
      'before:absolute before:inset-0 before:rounded-[inherit]',
      'before:from-accent-contrast before:to-accent-contrast/60 before:bg-linear-to-br',
      'group-not-selected:before:scale-0 group-selected:before:scale-40',
      'motion-safe:transition-all motion-safe:before:transition-all',
    ],
  },
  defaultVariants: { size: '2', variant: 'soft-outline' },
  variants: {
    elevation: { '1': { control: 'elevation-1' }, '2': { control: 'elevation-2' }, '3': { control: 'elevation-3' } },
    size: {
      '1': { control: 'size-3.5' },
      '2': { control: 'size-4' },
      '3': { control: 'size-4.5' },
      '4': { control: 'size-5' },
      '5': { control: 'size-5.5' },
    },
    variant: {
      solid: { control: 'bg-gray-1 border-transparent' },
      'solid-outline': { control: 'bg-gray-1 border-gray-7' },
      soft: { control: 'bg-gray-3 border-transparent' },
      'soft-outline': { control: 'bg-gray-3 border-gray-7' },
      outline: { control: 'border-gray-7' },
    },
  },
});

export function Root({ className, ...props }: RadioGroupRootProps) {
  return <RadioGroup className={twMerge('flex flex-col gap-1.5', className)} {...props} />;
}

export function Label({ className, ...props }: RadioGroupLabelProps) {
  return <Text as={LabelPrimitive} className={twMerge('flex items-center gap-2', className)} {...props} />;
}

export function Items({ className, orientation, ...props }: RadioGroupItemsProps) {
  return <div className={radioGroupItemsVariants({ orientation, className })} {...props} />;
}

export function Item({ children, className, elevation, size, variant, ...props }: RadioGroupItemProps) {
  const { base, control } = radioGroupItemVariants({ elevation, size, variant });
  return (
    <Radio className={base({ className })} {...props}>
      <div className={control()} />
      {children}
    </Radio>
  );
}
