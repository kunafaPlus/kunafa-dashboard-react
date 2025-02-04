import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const glassButtonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'bg-white/10 text-white backdrop-blur-md hover:bg-white/20 border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]',
        dark: 'bg-black/10 text-black backdrop-blur-md hover:bg-black/20 border border-black/20 shadow-[inset_0_1px_1px_rgba(0,0,0,0.2)]',
        colored:
          'bg-primary/10 text-primary backdrop-blur-md hover:bg-primary/20 border border-primary/20 shadow-[inset_0_1px_1px_rgba(var(--primary),0.2)]',
        destructive:
          'bg-destructive/10 text-destructive backdrop-blur-md hover:bg-destructive/20 border border-destructive/20 shadow-[inset_0_1px_1px_rgba(var(--destructive),0.2)]',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      glow: {
        none: '',
        light:
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/20 after:to-transparent after:blur-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity',
        strong:
          'after:absolute after:inset-0 after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:blur-xl after:opacity-0 hover:after:opacity-100 after:transition-opacity',
      },
      reflection: {
        none: '',
        light:
          'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50',
        strong:
          'before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/20 before:to-transparent before:opacity-50',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      glow: 'light',
      reflection: 'light',
    },
  }
);

interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof glassButtonVariants> {
  blurAmount?: string;
  borderOpacity?: number;
  glowColor?: string;
  glowIntensity?: number;
  reflectionOpacity?: number;
}

const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  (
    {
      className,
      variant,
      size,
      glow,
      reflection,
      blurAmount = '16px',
      borderOpacity = 0.2,
      glowColor = 'white',
      glowIntensity = 0.2,
      reflectionOpacity = 0.5,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      '--blur-amount': blurAmount,
      '--border-opacity': borderOpacity,
      '--glow-color': glowColor,
      '--glow-intensity': glowIntensity,
      '--reflection-opacity': reflectionOpacity,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(glassButtonVariants({ variant, size, glow, reflection }), className)}
        style={customStyle}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

GlassButton.displayName = 'GlassButton';

export { GlassButton };
