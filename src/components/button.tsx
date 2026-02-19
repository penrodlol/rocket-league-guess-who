import { Button as ButtonPrimitive } from 'react-aria-components';
import { tv, type VariantProps } from 'tailwind-variants';
import Icon from './icon';

export type ButtonProps = Omit<React.ComponentProps<typeof ButtonPrimitive>, 'children' | 'className'> &
  ButtonVariants & { children?: React.ReactNode; className?: string; icon?: React.ComponentProps<typeof Icon> };

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export const buttonVariants = tv({
  base: [
    'inline-flex shrink-0 items-center justify-center gap-2 rounded font-medium whitespace-nowrap select-none',
    'disabled:pointer-events-none disabled:opacity-50 ',
    'focus-visible:ring-accent-8 focus-visible:ring-2 focus-visible:outline-none',
    'motion-safe:pressed:scale-[0.97] motion-safe:transition-all',
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
      'warn-solid': 'bg-warn-9 text-warn-contrast hover:bg-warn-10 focus:ring-warn-8',
      'warn-soft': 'bg-warn-3 text-warn-11 hover:bg-warn-4 focus:ring-warn-8',
      'warn-soft-outline': 'bg-warn-3 text-warn-11 border-warn-7 hover:border-warn-8 border focus:ring-warn-8',
      'warn-outline': 'text-warn-11 border-warn-8 hover:bg-warn-3 border focus:ring-warn-8',
      'warn-ghost': 'text-warn-11 hover:bg-warn-3 focus:ring-warn-8',
      'danger-solid': 'bg-danger-9 text-danger-contrast hover:bg-danger-10 focus:ring-danger-8',
      'danger-soft': 'bg-danger-3 text-danger-11 hover:bg-danger-4 focus:ring-danger-8',
      'danger-soft-outline':
        'bg-danger-3 text-danger-11 border-danger-7 hover:border-danger-8 border focus:ring-danger-8',
      'danger-outline': 'text-danger-11 border-danger-8 hover:bg-danger-3 border focus:ring-danger-8',
      'danger-ghost': 'text-danger-11 hover:bg-danger-3 focus:ring-danger-8',
    },
  },
});

export function Button({ children, className, font, elevation, variant, size, icon, ...props }: ButtonProps) {
  return (
    <ButtonPrimitive className={buttonVariants({ font, elevation, variant, size, className })} {...props}>
      {icon && <Icon {...icon} />}
      {children}
    </ButtonPrimitive>
  );
}
