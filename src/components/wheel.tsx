import { createContext, use, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { Button } from './button';

export type WheelRootProps<T> = React.ComponentProps<'div'> & {
  items: Array<T>;
  valueAccessor: (item: T) => string;
  onSpinStart?: () => void;
  onSpinStop?: (winner: T) => void;
};
export type WheelItemsProps = React.ComponentProps<'canvas'>;
export type WheelTriggerProps = React.ComponentProps<typeof Button>;
export type WheelDrawSliceProps<T> = {
  ctx: CanvasRenderingContext2D;
  item: T;
  index: number;
  rad: number;
  arc: number;
  total: number;
  valueAccessor: (item: T) => string;
};

export type WheelContextValue<T> = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  engineRef: React.RefObject<{ ang: number; angVel: number; friction: number; rAF: number | null }>;
  isSpinning: boolean;
  setIsSpinning: React.Dispatch<React.SetStateAction<boolean>>;
  winner: T | undefined;
  setWinner: React.Dispatch<React.SetStateAction<T | undefined>>;
  onSpinStart?: (() => void) | undefined;
};

export const WheelContext = createContext<WheelContextValue<unknown> | undefined>(undefined);
export function useWheel() {
  const context = use(WheelContext);
  if (!context) throw new Error('useWheelContext must be used within a WheelProvider');
  return context;
}

export function Root<T>({ items, valueAccessor, onSpinStart, onSpinStop, ...props }: WheelRootProps<T>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef({ ang: 0, angVel: 0, friction: 0.995, rAF: null as number | null });
  const [isSpinning, setIsSpinning] = useState<WheelContextValue<unknown>['isSpinning']>(false);
  const [winner, setWinner] = useState<WheelContextValue<unknown>['winner']>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const total = items.length;
    const tau = 2 * Math.PI;
    const arc = tau / items.length;
    const rad = canvas.width / 2;

    const ctx = canvas.getContext('2d');
    if (ctx) items.forEach((item, index) => drawWheelSlice({ ctx, item, index, rad, arc, total, valueAccessor }));

    const frame = () => {
      const { angVel, friction } = engineRef.current;

      if (!angVel) {
      } else {
        engineRef.current.angVel *= friction;
        if (engineRef.current.angVel < 0.002) {
          engineRef.current.angVel = 0;
          setIsSpinning(false);

          const winner = items[Math.floor(total - (engineRef.current.ang / tau) * total) % total];
          if (winner) {
            setWinner(winner);
            onSpinStop?.(winner);
          }
        }

        engineRef.current.ang += engineRef.current.angVel;
        engineRef.current.ang %= tau;
        canvas.style.transform = `rotate(${engineRef.current.ang - Math.PI / 2}rad)`;
      }

      engineRef.current.rAF = requestAnimationFrame(frame);
    };

    frame();

    return () => (engineRef.current.rAF !== null ? cancelAnimationFrame(engineRef.current.rAF) : undefined);
  }, [items]);

  return (
    <WheelContext value={{ canvasRef, engineRef, isSpinning, setIsSpinning, winner, setWinner, onSpinStart }}>
      <div {...props} />
    </WheelContext>
  );
}

export function Items({ className, ...props }: WheelItemsProps) {
  const { canvasRef } = useWheel();
  return (
    <div
      className={twMerge(
        'border-accent-6 elevation-3 relative rounded-full border-8',
        'before:absolute before:-top-5 before:left-1/2 before:-translate-x-1/2',
        'before:size-0 before:border-x-20 before:border-x-transparent',
        'before:border-t-accent-6 before:z-50 before:rounded-lg before:border-t-40',
        'before:drop-shadow-2xl before:drop-shadow-black',
        className,
      )}
    >
      <canvas ref={canvasRef} width={550} height={550} {...props} />
    </div>
  );
}

export function Trigger({ onClick, ...props }: WheelTriggerProps) {
  const { engineRef, isSpinning, setIsSpinning, setWinner, onSpinStart } = useWheel();
  return (
    <Button
      isDisabled={isSpinning}
      onClick={(event) => {
        if (isSpinning) return;
        engineRef.current.angVel = Math.random() * (0.5 - 0.3) + 0.3;
        onSpinStart?.();
        setWinner(undefined);
        setIsSpinning(true);
        onClick?.(event);
      }}
      {...props}
    />
  );
}

export function drawWheelSlice<T>({ ctx, item, index, rad, arc, valueAccessor }: WheelDrawSliceProps<T>) {
  const angle = arc * index;
  ctx.save();

  const root = getComputedStyle(document.documentElement);
  const accent1 = root.getPropertyValue('--color-accent-1').trim();
  const accent11 = root.getPropertyValue('--color-accent-11').trim();
  const accent12 = root.getPropertyValue('--color-accent-12').trim();

  ctx.beginPath();
  ctx.fillStyle = index % 2 === 0 ? accent12 : accent11;
  ctx.moveTo(rad, rad);
  ctx.arc(rad, rad, rad, angle, angle + arc);
  ctx.lineTo(rad, rad);
  ctx.fill();

  ctx.translate(rad, rad);
  ctx.rotate(angle + arc / 2);
  ctx.textAlign = 'center';
  ctx.fillStyle = accent1;
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText(valueAccessor(item), rad * 0.65, 10);
  ctx.restore();
}
