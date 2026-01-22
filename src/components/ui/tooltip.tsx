import { composeChildren } from '@/libs/primitive';
import { Focusable, OverlayArrow, Tooltip, TooltipTrigger } from 'react-aria-components';
import { tv, VariantProps } from 'tailwind-variants';

export type TooltipRootProps = React.ComponentProps<typeof TooltipTrigger>;
export type TooltipTriggerProps = React.ComponentProps<typeof Focusable>;
export type TooltipContentProps = React.PrimitiveComponentProps<typeof Tooltip> & TooltipContentVariants;

export type TooltipContentVariants = VariantProps<typeof tooltipContentVariants>;

export const tooltipContentVariants = tv({
  slots: {
    base: [
      'rounded entering:opacity-0 entering:scale-50 origin-(--trigger-anchor-point) motion-safe:transition-all',
      'placement-bottom:entering:-translate-y-1 placement-top:entering:translate-y-1',
      'placement-left:entering:translate-x-1 placement-right:entering:-translate-x-1',
    ],
    arrow: '',
  },
  defaultVariants: { elevation: '3', size: '2', variant: 'accent-solid' },
  variants: {
    elevation: { '1': 'elevation-1', '2': 'elevation-2', '3': 'elevation-3' },
    size: {
      '1': { base: 'px-2 py-0.5 text-xs', arrow: 'size-1.5' },
      '2': { base: 'px-3 py-1 text-sm', arrow: 'size-2' },
      '3': { base: 'px-4 py-1.5 text-base', arrow: 'size-2.5' },
      '4': { base: 'px-5 py-2 text-lg', arrow: 'size-3' },
      '5': { base: 'px-6 py-2.5 text-xl', arrow: 'size-3.5' },
    },
    variant: {
      'gray-solid': { base: 'bg-gray-9 text-gray-contrast', arrow: 'fill-gray-9' },
      'gray-soft': { base: 'bg-gray-3 text-gray-11', arrow: 'fill-gray-3' },
      'gray-soft-outline': { base: 'bg-gray-3 text-gray-11 border-gray-7 border', arrow: 'fill-gray-3' },
      'gray-outline': { base: 'text-gray-11 border-gray- border', arrow: 'fill-gray-11' },
      'accent-solid': { base: 'bg-accent-9 text-accent-contrast', arrow: 'fill-accent-9' },
      'accent-soft': { base: 'bg-accent-3 text-accent-11', arrow: 'fill-accent-3' },
      'accent-soft-outline': { base: 'bg-accent-3 text-accent-11 border-accent-7 border', arrow: 'fill-accent-3' },
      'accent-outline': { base: 'text-accent-11 border-accent-8 border', arrow: 'fill-accent-11' },
    },
  },
});

export function Root(props: TooltipRootProps) {
  return <TooltipTrigger {...props} />;
}

export function Trigger(props: TooltipTriggerProps) {
  return <Focusable {...props} />;
}

export function Content({ children, className, elevation, size, variant, ...props }: TooltipContentProps) {
  const variants = tooltipContentVariants({ elevation, size, variant });
  return (
    <Tooltip offset={10} className={variants.base({ className })} {...props}>
      {(renderProps) => (
        <>
          <OverlayArrow>
            <svg viewBox="0 0 8 8" className={variants.arrow()}>
              <path d="M0 0 L4 4 L8 0" />
            </svg>
          </OverlayArrow>
          {composeChildren(children, renderProps)}
        </>
      )}
    </Tooltip>
  );
}
