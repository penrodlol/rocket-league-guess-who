import { Dialog, DialogTrigger, Heading as HeadingPrimitive, Modal, ModalOverlay } from 'react-aria-components';
import { twMerge } from 'tailwind-merge';
import { tv, VariantProps } from 'tailwind-variants';
import { Button } from './button';
import { Text, TextVariants } from './text';

export type DialogRootProps = React.ComponentProps<typeof DialogTrigger>;
export type DialogContentProps = Omit<React.ComponentProps<typeof ModalOverlay>, 'children' | 'className'> &
  DialogContentVariants & {
    children?: React.ReactNode;
    className?: string;
    dialogProps?: React.ComponentProps<typeof Dialog>;
  };
export type DialogHeadingProps = React.ComponentProps<typeof HeadingPrimitive> & TextVariants;
export type DialogCloseProps = React.ComponentProps<typeof Button>;

export type DialogContentVariants = VariantProps<typeof dialogContentVariants>;

export const dialogContentVariants = tv({
  slots: {
    base: [
      'absolute top-0 left-0 w-full h-(--page-height) isolate z-20 bg-gray-12/20 backdrop-blur-sm',
      'entering:opacity-0 exiting:opacity-0 entering:ease-in exiting:ease-out',
      'motion-safe:duration-200 motion-safe:transition-all',
    ],
    modalContainer: 'sticky top-0 left-0 w-full h-(--visual-viewport-height) flex items-center justify-center',
    modal: [
      'border border-gray-6 w-full max-w-xl max-h-[calc(var(--visual-viewport-height)*.9)] rounded bg-gray-1',
      'entering:scale-95 entering:opacity-0 exiting:scale-95 exiting:opacity-0',
      'entering:ease-in exiting:ease-out motion-safe:duration-200 motion-safe:transition-all',
    ],
    dialog: 'relative flex flex-col gap-4 outline-none p-6 max-h-[inherit] overflow-auto rounded-[inherit]',
  },
  defaultVariants: { elevation: '3' },
  variants: {
    elevation: { '1': { dialog: 'elevation-1' }, '2': { dialog: 'elevation-2' }, '3': { dialog: 'elevation-3' } },
  },
});

export const Root = DialogTrigger;

export function Content({ children, className, elevation, dialogProps, ...props }: DialogContentProps) {
  const slots = dialogContentVariants({ elevation });
  return (
    <ModalOverlay className={slots.base({ className })} {...props}>
      <div className={slots.modalContainer()}>
        <Modal className={slots.modal()} {...props}>
          <Dialog className={slots.dialog()} {...dialogProps}>
            {children}
          </Dialog>
        </Modal>
      </div>
    </ModalOverlay>
  );
}

export function Heading({ children, className, ...props }: DialogHeadingProps) {
  return (
    <div className={twMerge('flex items-center gap-2', className)}>
      {children}
      <Text as={HeadingPrimitive} slot="title" font="display" size="5" {...props} />
    </div>
  );
}

export function Close({ className, ...props }: DialogCloseProps) {
  return <Button slot="close" className={twMerge('self-end', className)} {...props} />;
}
