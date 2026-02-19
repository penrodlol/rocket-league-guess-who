import { twMerge } from 'tailwind-merge';
import { Surface, SurfaceVariants } from './surface';

export type TableRootProps = React.ComponentProps<'table'> & SurfaceVariants;
export type TableHeaderProps = React.ComponentProps<'thead'>;
export type TableBodyProps = React.ComponentProps<'tbody'>;
export type TableRowProps = React.ComponentProps<'tr'>;
export type TableHeadProps = React.ComponentProps<'th'>;
export type TableCellProps = React.ComponentProps<'td'>;

export function Root({ className, rounded, elevation, variant, ...props }: TableRootProps) {
  return (
    <Surface
      rounded={rounded}
      elevation={elevation}
      variant={variant}
      className={twMerge('relative w-full overflow-x-auto *:w-full', className)}
    >
      <table {...props} />
    </Surface>
  );
}

export function Header(props: TableHeaderProps) {
  return <thead {...props} />;
}

export function Body(props: TableBodyProps) {
  return <tbody {...props} />;
}

export function Row({ className, ...props }: TableRowProps) {
  return <tr className={twMerge('border-gray-6 border-b last-of-type:border-b-0', className)} {...props} />;
}

export function Head({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={twMerge(
        'h-10 px-2 text-left align-middle text-sm font-medium whitespace-nowrap',
        'border-gray-6 border-r border-b last-of-type:border-r-0',
        className,
      )}
      {...props}
    />
  );
}

export function Cell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={twMerge(
        'p-2 align-middle whitespace-nowrap',
        'border-gray-6 border-r last-of-type:border-r-0',
        className,
      )}
      {...props}
    />
  );
}
