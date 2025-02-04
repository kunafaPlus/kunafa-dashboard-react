import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const toggleButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white shadow hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    VariantProps<typeof toggleButtonVariants> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onChange?: (pressed: boolean) => void;
  activeVariant?: VariantProps<typeof toggleButtonVariants>['variant'];
  activeClassName?: string;
  pressedContent?: React.ReactNode;
  unpressedContent?: React.ReactNode;
  animation?: 'scale' | 'slide' | 'fade' | 'none';
}

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      className,
      variant = 'default',
      size,
      pressed: pressedProp,
      defaultPressed = false,
      onChange,
      activeVariant,
      activeClassName,
      children,
      pressedContent,
      unpressedContent,
      animation = 'scale',
      disabled,
      ...props
    },
    ref
  ) => {
    const [pressedState, setPressedState] = React.useState(defaultPressed);
    const isPressed = pressedProp !== undefined ? pressedProp : pressedState;

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        const newPressed = !isPressed;
        setPressedState(newPressed);
        onChange?.(newPressed);
      }
      props.onClick?.(event);
    };

    const animationStyles = React.useMemo(() => {
      switch (animation) {
        case 'scale':
          return 'transition-transform active:scale-95';
        case 'slide':
          return 'transition-transform active:translate-y-0.5';
        case 'fade':
          return 'transition-opacity active:opacity-80';
        default:
          return '';
      }
    }, [animation]);

    const content = React.useMemo(() => {
      if (isPressed && pressedContent) return pressedContent;
      if (!isPressed && unpressedContent) return unpressedContent;
      return children;
    }, [isPressed, pressedContent, unpressedContent, children]);

    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={isPressed}
        className={cn(
          toggleButtonVariants({
            variant: isPressed ? activeVariant || variant : variant,
            size,
          }),
          animationStyles,
          isPressed && activeClassName,
          className
        )}
        disabled={disabled}
        onClick={handleClick}
        {...props}
      >
        {content}
      </button>
    );
  }
);

ToggleButton.displayName = 'ToggleButton';

export { ToggleButton };
