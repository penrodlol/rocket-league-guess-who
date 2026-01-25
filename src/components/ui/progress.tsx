import { tv, VariantProps } from 'tailwind-variants';

export type ProgressProps = React.ComponentProps<'progress'> & ProgressVariants;

export type ProgressVariants = VariantProps<typeof progressVariants>;

export const progressVariants = tv({
  base: [
    'w-full appearance-none rounded overflow-hidden',
    '[&::-webkit-progress-bar]:rounded [&::-webkit-progress-value]:rounded',
    '[&::-webkit-progress-value]:starting:-translate-x-full ',
    '[&::-webkit-progress-value]:motion-safe:transition-all',
    '[&::-webkit-progress-value]:motion-safe:duration-1000',
  ],
  defaultVariants: { size: '2', variant: 'accent-solid-outline' },
  variants: {
    elevation: { '1': 'elevation-1', '2': 'elevation-2', '3': 'elevation-3' },
    size: { '1': 'h-3', '2': 'h-4', '3': 'h-5', '4': 'h-6', '5': 'h-7' },
    variant: {
      'gray-solid': '[&::-webkit-progress-bar]:bg-gray-3 [&::-webkit-progress-value]:bg-gray-9',
      'gray-solid-outline': [
        '[&::-webkit-progress-bar]:bg-gray-3 [&::-webkit-progress-bar]:border [&::-webkit-progress-bar]:border-gray-7',
        '[&::-webkit-progress-value]:bg-gray-9',
      ],
      'gray-outline': [
        '[&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-bar]:border [&::-webkit-progress-bar]:border-gray-8',
        '[&::-webkit-progress-value]:bg-gray-9',
      ],
      'accent-solid': '[&::-webkit-progress-bar]:bg-accent-3 [&::-webkit-progress-value]:bg-accent-9',
      'accent-solid-outline': [
        '[&::-webkit-progress-bar]:bg-accent-3 [&::-webkit-progress-bar]:border [&::-webkit-progress-bar]:border-accent-7',
        '[&::-webkit-progress-value]:bg-accent-9',
      ],
      'accent-soft-outline': [
        '[&::-webkit-progress-bar]:bg-accent-3 [&::-webkit-progress-bar]:border [&::-webkit-progress-bar]:border-accent-7',
        '[&::-webkit-progress-value]:bg-accent-5',
      ],
      'accent-outline': [
        '[&::-webkit-progress-bar]:bg-transparent [&::-webkit-progress-bar]:border [&::-webkit-progress-bar]:border-accent-8',
        '[&::-webkit-progress-value]:bg-accent-9',
      ],
      'accent-stripes': [
        '[&::-webkit-progress-bar]:bg-inherit [&::-webkit-progress-bar]:border [&::-webkit-progress-bar]:border-accent-7',
        '[&::-webkit-progress-value]:bg-accent-4 [&::-webkit-progress-value]:bg-size-[1rem_1rem]',
        '[&::-webkit-progress-value]:bg-[repeating-linear-gradient(45deg,#fff3_0_25%,transparent_25%_50%)]',
      ],
    },
  },
});

export function Progress({ className, elevation, size, variant, ...props }: ProgressProps) {
  return <progress className={progressVariants({ elevation, size, variant, className })} {...props} />;
}
