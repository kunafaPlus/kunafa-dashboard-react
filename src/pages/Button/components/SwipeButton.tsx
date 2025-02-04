import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const swipeButtonVariants = cva(
  'group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden cursor-grab active:cursor-grabbing touch-none select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white before:bg-primary-dark after:bg-primary-dark',
        destructive:
          'bg-destructive text-destructive-foreground before:bg-destructive-dark after:bg-destructive-dark',
        outline: 'border border-input bg-background before:bg-accent after:bg-accent',
        secondary:
          'bg-secondary text-secondary-foreground before:bg-secondary-dark after:bg-secondary-dark',
        ghost: 'before:bg-accent after:bg-accent',
        success: 'bg-green-500 text-white before:bg-green-600 after:bg-green-600',
      },
      size: {
        default: 'h-12 px-8 py-3',
        sm: 'h-10 rounded-md px-6 text-xs',
        lg: 'h-14 rounded-md px-10',
        icon: 'h-12 w-12',
      },
      direction: {
        right: 'before:left-0 after:right-0',
        left: 'before:right-0 after:left-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      direction: 'right',
    },
  }
);

interface SwipeButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof swipeButtonVariants> {
  threshold?: number;
  resetDelay?: number;
  swipeText?: string;
  confirmText?: string;
  onChange?: (confirmed: boolean) => void;
  trackColor?: string;
  thumbColor?: string;
  successColor?: string;
  transitionDuration?: string;
}

const SwipeButton = React.forwardRef<HTMLDivElement, SwipeButtonProps>(
  (
    {
      className,
      variant,
      size,
      direction = 'right',
      threshold = 0.7,
      resetDelay = 1000,
      swipeText = 'Swipe to confirm',
      confirmText = 'Confirmed!',
      onChange,
      trackColor,
      thumbColor,
      successColor = '#22c55e',
      transitionDuration = '0.3s',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [startX, setStartX] = React.useState(0);
    const [offsetX, setOffsetX] = React.useState(0);
    const [isConfirmed, setIsConfirmed] = React.useState(false);
    const buttonRef = React.useRef<HTMLDivElement>(null);

    const handleStart = (clientX: number) => {
      if (!isConfirmed) {
        setIsDragging(true);
        setStartX(clientX - offsetX);
      }
    };

    const handleMove = (clientX: number) => {
      if (isDragging && buttonRef.current && !isConfirmed) {
        const newOffset = clientX - startX;
        const maxOffset = buttonRef.current.offsetWidth - buttonRef.current.offsetHeight;
        setOffsetX(Math.max(0, Math.min(newOffset, maxOffset)));

        if (direction === 'right' && offsetX >= maxOffset * threshold) {
          setIsConfirmed(true);
          setIsDragging(false);
          onChange?.(true);
          setTimeout(() => {
            setIsConfirmed(false);
            setOffsetX(0);
            onChange?.(false);
          }, resetDelay);
        } else if (direction === 'left' && offsetX <= maxOffset * (1 - threshold)) {
          setIsConfirmed(true);
          setIsDragging(false);
          onChange?.(true);
          setTimeout(() => {
            setIsConfirmed(false);
            setOffsetX(0);
            onChange?.(false);
          }, resetDelay);
        }
      }
    };

    const handleEnd = () => {
      if (!isConfirmed) {
        setIsDragging(false);
        setOffsetX(0);
      }
    };

    const customStyle = {
      ...style,
      '--track-color': trackColor,
      '--thumb-color': thumbColor,
      '--success-color': successColor,
      '--transition-duration': transitionDuration,
      '--offset-x': `${offsetX}px`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(swipeButtonVariants({ variant, size, direction }), className)}
        style={customStyle}
        onMouseDown={(e) => { handleStart(e.clientX); }}
        onMouseMove={(e) => { handleMove(e.clientX); }}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={(e) => { handleStart(e.touches[0].clientX); }}
        onTouchMove={(e) => { handleMove(e.touches[0].clientX); }}
        onTouchEnd={handleEnd}
        {...props}
      >
        <div ref={buttonRef} className="relative h-full w-full overflow-hidden rounded-[inherit]">
          <div
            className={cn(
              'absolute inset-0 grid place-items-center transition-colors',
              isConfirmed && 'bg-[var(--success-color,#22c55e)]'
            )}
          >
            <span className="text-current">{isConfirmed ? confirmText : swipeText}</span>
          </div>
          <div
            className={cn(
              'absolute grid h-full aspect-square place-items-center rounded-[inherit] bg-current transition-transform',
              isDragging ? 'scale-95' : 'scale-100'
            )}
            style={{
              transform: `translateX(var(--offset-x))`,
            }}
          >
            {children || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                className="h-5 w-5"
              >
                {direction === 'right' ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 15l-7-7 7-7"
                  />
                )}
              </svg>
            )}
          </div>
        </div>
      </div>
    );
  }
);

SwipeButton.displayName = 'SwipeButton';

export { SwipeButton };
