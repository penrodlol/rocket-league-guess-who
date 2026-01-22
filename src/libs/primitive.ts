import { type RenderProps } from 'react-aria-components';

declare global {
  namespace React {
    type PrimitiveComponentProps<T extends React.ElementType> = Omit<React.ComponentProps<T>, 'className'> & {
      className?: string | undefined;
    };
  }
}

export type Children<T> = RenderProps<T>['children'];
export type ChildrenProps<T> = Parameters<Extract<Children<T>, Function>>[0];

export function composeChildren<T>(children: Children<T>, props: ChildrenProps<T>) {
  return typeof children === 'function' ? children(props) : children;
}
