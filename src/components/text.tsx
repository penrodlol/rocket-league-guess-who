import { tv, type VariantProps } from 'tailwind-variants';

export type TextProps<T extends React.ElementType> = Omit<React.ComponentProps<T>, 'size'> & TextVariants & { as?: T };

export type TextVariants = VariantProps<typeof textVariants>;

export const textVariants = tv({
  base: 'text-gray-12 max-w-prose',
  defaultVariants: { font: 'sans', size: '3', weight: '4' },
  variants: {
    font: { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono', display: 'font-display' },
    italic: { true: 'italic' },
    underline: { true: 'underline underline-offset-6' },
    variant: { soft: 'text-gray-11', accent: 'text-accent-11 selection:bg-accent-5' },
    size: {
      '1': 'text-xs',
      '2': 'text-sm',
      '3': 'text-base',
      '4': 'text-lg',
      '5': 'text-xl',
      '6': 'text-2xl',
      '7': 'text-3xl',
      '8': 'text-4xl',
      '9': 'text-5xl',
      '10': 'text-6xl',
      '11': 'text-7xl',
      '12': 'text-8xl',
      '13': 'text-9xl',
    },
    weight: {
      '1': 'font-thin',
      '2': 'font-extralight',
      '3': 'font-light',
      '4': 'font-normal',
      '5': 'font-medium',
      '6': 'font-semibold',
      '7': 'font-bold',
      '8': 'font-extrabold',
      '9': 'font-black',
    },
  },
});

export function Text<T extends React.ElementType = 'p'>({
  as,
  className,
  font,
  italic,
  underline,
  variant,
  size,
  weight,
  ...props
}: TextProps<T>) {
  const Tag = as ?? 'p';
  return <Tag className={textVariants({ font, italic, underline, variant, size, weight, className })} {...props} />;
}
