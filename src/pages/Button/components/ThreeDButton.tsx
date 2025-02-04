import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const threeDButtonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 transform-gpu',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/20 before:transition-transform hover:-translate-y-0.5 hover:before:translate-y-1 active:translate-y-0.5 active:before:translate-y-0',
        destructive:
          'bg-destructive text-destructive-foreground before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/20 before:transition-transform hover:-translate-y-0.5 hover:before:translate-y-1 active:translate-y-0.5 active:before:translate-y-0',
        secondary:
          'bg-secondary text-secondary-foreground before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/20 before:transition-transform hover:-translate-y-0.5 hover:before:translate-y-1 active:translate-y-0.5 active:before:translate-y-0',
        outline:
          'border-2 border-input bg-background text-foreground before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/10 before:transition-transform hover:-translate-y-0.5 hover:before:translate-y-1 active:translate-y-0.5 active:before:translate-y-0',
        ghost:
          'text-foreground hover:bg-accent hover:text-accent-foreground before:absolute before:inset-0 before:rounded-[inherit] before:bg-black/10 before:opacity-0 before:transition-transform hover:before:opacity-100 hover:-translate-y-0.5 hover:before:translate-y-1 active:translate-y-0.5 active:before:translate-y-0',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      depth: {
        shallow: '[--depth:2px]',
        default: '[--depth:4px]',
        deep: '[--depth:6px]',
      },
      rounded: {
        default: 'rounded-md',
        full: 'rounded-full',
        none: 'rounded-none',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      depth: 'default',
      rounded: 'default',
    },
  }
);

interface ThreeDButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof threeDButtonVariants> {
  shadowColor?: string;
  pressedScale?: number;
  hoverLift?: string;
  transitionDuration?: string;
  lightSource?: 'top' | 'left' | 'right' | 'bottom';
}

const ThreeDButton = React.forwardRef<HTMLButtonElement, ThreeDButtonProps>(
  (
    {
      className,
      variant,
      size,
      depth,
      rounded,
      shadowColor = 'rgba(0, 0, 0, 0.2)',
      pressedScale = 0.95,
      hoverLift = '4px',
      transitionDuration = '0.2s',
      lightSource = 'top',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const getLightingGradient = () => {
      switch (lightSource) {
        case 'top':
          return 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)';
        case 'left':
          return 'linear-gradient(90deg, rgba(255,255,255,0.15) 0%, transparent 100%)';
        case 'right':
          return 'linear-gradient(270deg, rgba(255,255,255,0.15) 0%, transparent 100%)';
        case 'bottom':
          return 'linear-gradient(0deg, rgba(255,255,255,0.15) 0%, transparent 100%)';
        default:
          return 'none';
      }
    };

    const customStyle = {
      ...style,
      '--shadow-color': shadowColor,
      '--pressed-scale': pressedScale,
      '--hover-lift': hoverLift,
      '--transition-duration': transitionDuration,
      '--lighting-gradient': getLightingGradient(),
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          threeDButtonVariants({ variant, size, depth, rounded }),
          'before:bg-[var(--lighting-gradient)]',
          'transition-[transform,box-shadow] duration-[var(--transition-duration)]',
          'hover:-translate-y-[var(--hover-lift)] hover:shadow-[0_var(--depth)_0_0_var(--shadow-color)]',
          'active:translate-y-0 active:shadow-none active:scale-[var(--pressed-scale)]',
          className
        )}
        style={customStyle}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

ThreeDButton.displayName = 'ThreeDButton';

export { ThreeDButton };
