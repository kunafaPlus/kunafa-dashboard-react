import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const hoverButtonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      effect: {
        none: '',
        fade: 'hover:opacity-80',
        scale: 'hover:scale-105',
        rotate: 'hover:rotate-3',
        skew: 'hover:skew-x-6',
        lift: 'hover:-translate-y-1',
        glow: 'hover:shadow-[0_0_10px_currentColor]',
        ripple:
          'after:absolute after:inset-0 after:bg-white/20 after:scale-0 after:opacity-0 hover:after:scale-150 hover:after:opacity-100 after:origin-center after:rounded-full after:transition-all after:duration-500',
        shine:
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/25 after:to-transparent after:-translate-x-full hover:after:translate-x-full after:transition-transform after:duration-1000',
        pulse: 'hover:animate-pulse',
        bounce: 'hover:animate-bounce',
        shake: 'hover:animate-shake',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      effect: 'none',
    },
  }
);

interface HoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof hoverButtonVariants> {
  hoverColor?: string;
  hoverScale?: number;
  hoverRotate?: number;
  hoverSkew?: number;
  hoverTranslate?: string;
  glowColor?: string;
  glowAmount?: string;
  transitionDuration?: string;
  transitionTiming?: string;
}

const HoverButton = React.forwardRef<HTMLButtonElement, HoverButtonProps>(
  (
    {
      className,
      variant,
      size,
      effect,
      hoverColor,
      hoverScale = 1.05,
      hoverRotate = 3,
      hoverSkew = 6,
      hoverTranslate = '-0.25rem',
      glowColor,
      glowAmount = '10px',
      transitionDuration = '0.3s',
      transitionTiming = 'ease',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      '--hover-color': hoverColor,
      '--hover-scale': hoverScale,
      '--hover-rotate': `${hoverRotate}deg`,
      '--hover-skew': `${hoverSkew}deg`,
      '--hover-translate': hoverTranslate,
      '--glow-color': glowColor,
      '--glow-amount': glowAmount,
      '--transition-duration': transitionDuration,
      '--transition-timing': transitionTiming,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(hoverButtonVariants({ variant, size, effect }), className)}
        style={customStyle}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

HoverButton.displayName = 'HoverButton';

export { HoverButton };
