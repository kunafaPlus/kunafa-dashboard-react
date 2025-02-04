import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const holdButtonVariants = cva(
  'group relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden touch-none select-none',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white before:bg-primary-dark',
        destructive: 'bg-destructive text-destructive-foreground before:bg-destructive-dark',
        outline: 'border border-input bg-background before:bg-accent',
        secondary: 'bg-secondary text-secondary-foreground before:bg-secondary-dark',
        ghost: 'before:bg-accent',
        success: 'bg-green-500 text-white before:bg-green-600',
      },
      size: {
        default: 'h-12 px-8 py-3',
        sm: 'h-10 rounded-md px-6 text-xs',
        lg: 'h-14 rounded-md px-10',
        icon: 'h-12 w-12',
      },
      progressStyle: {
        fill: 'before:absolute before:inset-0 before:origin-left before:scale-x-0 before:transition-transform',
        circular:
          'after:absolute after:inset-[3px] after:rounded-full after:border-2 after:border-current after:border-r-transparent after:opacity-0 after:transition-opacity group-data-[loading=true]:after:animate-spin',
        dots: 'after:absolute after:inset-0 after:bg-[radial-gradient(circle,currentColor_2px,transparent_3px)] after:bg-[length:8px_8px] after:opacity-0 after:transition-opacity',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      progressStyle: 'fill',
    },
  }
);

interface HoldButtonProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof holdButtonVariants> {
  holdTime?: number;
  resetDelay?: number;
  holdText?: string;
  confirmText?: string;
  onChange?: (confirmed: boolean) => void;
  progressColor?: string;
  successColor?: string;
  transitionDuration?: string;
  showProgress?: boolean;
}

const HoldButton = React.forwardRef<HTMLDivElement, HoldButtonProps>(
  (
    {
      className,
      variant,
      size,
      progressStyle,
      holdTime = 1000,
      resetDelay = 1000,
      holdText = 'Hold to confirm',
      confirmText = 'Confirmed!',
      onChange,
      progressColor,
      successColor = '#22c55e',
      transitionDuration = '0.3s',
      showProgress = true,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const [isHolding, setIsHolding] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const [isConfirmed, setIsConfirmed] = React.useState(false);
    const progressInterval = React.useRef<number>();
    const startTime = React.useRef<number>();

    const startHolding = () => {
      if (!isConfirmed) {
        setIsHolding(true);
        startTime.current = Date.now();
        progressInterval.current = window.setInterval(() => {
          const elapsed = Date.now() - (startTime.current || 0);
          const newProgress = Math.min((elapsed / holdTime) * 100, 100);
          setProgress(newProgress);

          if (newProgress >= 100) {
            stopHolding(true);
          }
        }, 10);
      }
    };

    const stopHolding = (completed = false) => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
      setIsHolding(false);
      if (completed && !isConfirmed) {
        setIsConfirmed(true);
        onChange?.(true);
        setTimeout(() => {
          setIsConfirmed(false);
          setProgress(0);
          onChange?.(false);
        }, resetDelay);
      } else {
        setProgress(0);
      }
    };

    const customStyle = {
      ...style,
      '--progress-color': progressColor,
      '--success-color': successColor,
      '--transition-duration': transitionDuration,
      '--progress': `${progress}%`,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          holdButtonVariants({ variant, size, progressStyle }),
          showProgress &&
            'before:transition-transform before:duration-[var(--transition-duration)]',
          isConfirmed && '!bg-[var(--success-color,#22c55e)]',
          className
        )}
        style={customStyle}
        data-loading={isHolding}
        onMouseDown={startHolding}
        onMouseUp={() => { stopHolding(); }}
        onMouseLeave={() => { stopHolding(); }}
        onTouchStart={startHolding}
        onTouchEnd={() => { stopHolding(); }}
        {...props}
      >
        {showProgress && (
          <div
            className="absolute inset-0 overflow-hidden rounded-[inherit]"
            style={{
              transform: `scaleX(${progress / 100})`,
              transformOrigin: 'left',
              backgroundColor: 'var(--progress-color, currentColor)',
              opacity: 0.2,
              transition: isHolding ? 'none' : `transform ${transitionDuration} ease-out`,
            }}
          />
        )}
        <span className="relative z-10">{isConfirmed ? confirmText : holdText}</span>
        {children && <div className="relative z-10">{children}</div>}
      </div>
    );
  }
);

HoldButton.displayName = 'HoldButton';

export { HoldButton };
