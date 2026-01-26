import { tv, VariantProps } from 'tailwind-variants';
import Icon from './icon';

export type BadgeProps = React.ComponentProps<'div'> & BadgeVariant & { icon?: React.ComponentProps<typeof Icon> };

export type BadgeVariant = VariantProps<typeof badgeVariants>;

export const badgeVariants = tv({
  base: 'flex items-center justify-center gap-2 rounded-full select-none has-[svg:only-child]:p-0',
  defaultVariants: { size: '2', variant: 'accent-solid' },
  variants: {
    elevation: { '1': 'elevation-1', '2': 'elevation-2', '3': 'elevation-3' },
    size: {
      '1': 'text-xs has-[svg:only-child]:size-4 [&_svg]:size-3',
      '2': 'text-sm has-[svg:only-child]:size-5 [&_svg]:size-4',
      '3': 'text-base has-[svg:only-child]:size-6 [&_svg]:size-5',
      '4': 'text-lg has-[svg:only-child]:size-8 [&_svg]:size-7',
      '5': 'text-xl has-[svg:only-child]:size-9 [&_svg]:size-8',
    },
    variant: {
      'gray-solid': 'bg-gray-9 text-gray-contrast hover:bg-gray-10',
      'gray-soft': 'bg-gray-3 text-gray-11 hover:bg-gray-4',
      'gray-soft-outline': 'bg-gray-3 text-gray-11 border-gray-7 hover:border-gray-8 border',
      'gray-outline': 'text-gray-11 border-gray-8 hover:bg-gray-3 border',
      'gray-ghost': 'text-gray-11 hover:bg-gray-3',
      'accent-solid': 'bg-accent-9 text-accent-contrast hover:bg-accent-10',
      'accent-soft': 'bg-accent-3 text-accent-11 hover:bg-accent-4',
      'accent-soft-outline': 'bg-accent-3 text-accent-11 border-accent-7 hover:border-accent-8 border',
      'accent-outline': 'text-accent-11 border-accent-8 hover:bg-accent-3 border',
      'accent-ghost': 'text-accent-11 hover:bg-accent-3',
    },
  },
});

export function Badge({ children, className, icon, ...props }: BadgeProps) {
  return (
    <div className={badgeVariants({ className })} {...props}>
      {icon && <Icon {...icon} />}
      {children}
    </div>
  );
}
