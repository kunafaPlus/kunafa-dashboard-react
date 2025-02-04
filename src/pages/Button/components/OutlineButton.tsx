import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const outlineButtonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        destructive:
          'border-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground',
        secondary:
          'border-2 border-secondary text-secondary-foreground hover:bg-secondary hover:text-secondary-foreground',
        ghost: 'border-2 border-transparent hover:border-accent hover:text-accent-foreground',
        rainbow:
          'border-2 border-transparent bg-gradient-to-r from-[#ff0000] via-[#00ff00] to-[#0000ff] bg-clip-text text-transparent [border-image:linear-gradient(to_right,#ff0000,#00ff00,#0000ff)_1] hover:animate-gradient',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        border:
          "before:absolute before:inset-0 before:rounded-[inherit] before:border-2 before:border-inherit before:content-[''] hover:before:animate-border",
        glow: 'after:absolute after:inset-0 after:rounded-[inherit] after:shadow-[0_0_10px_currentColor] after:opacity-0 hover:after:opacity-100 after:transition-opacity',
        draw: '[border-image:linear-gradient(to_right,currentColor_50%,transparent_50%)_1] hover:[border-image:linear-gradient(to_right,currentColor_100%,transparent_0%)_1] [border-image-width:2px] [transition:border-image_0.3s_ease]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      animation: 'none',
    },
  }
);

interface OutlineButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof outlineButtonVariants> {
  borderWidth?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  borderColor?: string;
  hoverBorderColor?: string;
  glowColor?: string;
  glowAmount?: string;
  animationDuration?: string;
}

const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>(
  (
    {
      className,
      variant,
      size,
      animation,
      borderWidth = '2px',
      borderStyle = 'solid',
      borderColor,
      hoverBorderColor,
      glowColor,
      glowAmount = '10px',
      animationDuration = '0.3s',
      children,
      style,
      ...props
    },
    ref
  ) => {
    const customStyle = {
      ...style,
      '--border-width': borderWidth,
      '--border-style': borderStyle,
      '--border-color': borderColor,
      '--hover-border-color': hoverBorderColor,
      '--glow-color': glowColor,
      '--glow-amount': glowAmount,
      '--animation-duration': animationDuration,
    } as React.CSSProperties;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(outlineButtonVariants({ variant, size, animation }), className)}
        style={customStyle}
        {...props}
      >
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

OutlineButton.displayName = 'OutlineButton';

export { OutlineButton };
