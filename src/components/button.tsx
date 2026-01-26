import { tv, type VariantProps } from 'tailwind-variants';
import Icon from './icon';

export type ButtonProps = React.ComponentProps<'button'> &
  ButtonVariants & { icon?: React.ComponentProps<typeof Icon> };

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export const buttonVariants = tv({
  base: [
    'inline-flex shrink-0 items-center justify-center gap-2 rounded font-medium whitespace-nowrap select-none',
    'disabled:pointer-events-none disabled:opacity-50 ',
    'focus-visible:ring-accent-8 focus-visible:ring-2 focus-visible:outline-none',
    'motion-safe:active:scale-[0.97] motion-safe:transition-all',
  ],
  defaultVariants: { size: '2', variant: 'accent-solid' },
  variants: {
    font: { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono', display: 'font-display' },
    elevation: { '1': 'elevation-1', '2': 'elevation-2', '3': 'elevation-3' },
    size: {
      '1': '[&_svg]:size-3 [&_svg]:text-current/80 h-8 px-4 text-sm',
      '2': '[&_svg]:size-3.5 [&_svg]:text-current/80 h-9 px-6',
      '3': '[&_svg]:size-4 [&_svg]:text-current/80 h-10 px-8 text-lg',
      '4': '[&_svg]:size-5 [&_svg]:text-current/80 h-11 px-10 text-xl',
      '5': '[&_svg]:size-6 [&_svg]:text-current/80 h-12 px-12 text-2xl',
      '1-icon': 'size-8 [&_svg]:size-4',
      '2-icon': 'size-9 [&_svg]:size-5',
      '3-icon': 'size-10 [&_svg]:size-6',
      '4-icon': 'size-11 [&_svg]:size-7',
      '5-icon': 'size-12 [&_svg]:size-8',
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

export function Button({ children, className, font, elevation, variant, size, icon, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ font, elevation, variant, size, className })} {...props}>
      {icon && <Icon {...icon} />}
      {children}
    </button>
  );
}
