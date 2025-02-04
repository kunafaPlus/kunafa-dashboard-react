import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const floatingButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-lg hover:shadow-xl',
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
        default: 'h-14 w-14',
        sm: 'h-10 w-10',
        lg: 'h-16 w-16',
      },
      position: {
        'bottom-right': 'fixed bottom-4 right-4',
        'bottom-left': 'fixed bottom-4 left-4',
        'top-right': 'fixed top-4 right-4',
        'top-left': 'fixed top-4 left-4',
        'bottom-center': 'fixed bottom-4 left-1/2 -translate-x-1/2',
        'top-center': 'fixed top-4 left-1/2 -translate-x-1/2',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'bottom-right',
    },
  }
);

interface FloatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof floatingButtonVariants> {
  showOnScroll?: boolean;
  scrollThreshold?: number;
  hideOnInactive?: boolean;
  inactiveTimeout?: number;
  animate?: boolean;
}

const FloatingButton = React.forwardRef<HTMLButtonElement, FloatingButtonProps>(
  (
    {
      className,
      variant,
      size,
      position,
      showOnScroll = false,
      scrollThreshold = 100,
      hideOnInactive = false,
      inactiveTimeout = 3000,
      animate = true,
      children,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = React.useState(!showOnScroll);
    const [inactive, setInactive] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    React.useEffect(() => {
      if (showOnScroll) {
        const handleScroll = () => {
          setVisible(window.scrollY > scrollThreshold);
        };
        window.addEventListener('scroll', handleScroll);
        return () => { window.removeEventListener('scroll', handleScroll); };
      }
    }, [showOnScroll, scrollThreshold]);

    React.useEffect(() => {
      if (hideOnInactive) {
        const handleActivity = () => {
          setInactive(false);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          timeoutRef.current = setTimeout(() => {
            setInactive(true);
          }, inactiveTimeout);
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keydown', handleActivity);
        window.addEventListener('scroll', handleActivity);

        handleActivity();

        return () => {
          window.removeEventListener('mousemove', handleActivity);
          window.removeEventListener('keydown', handleActivity);
          window.removeEventListener('scroll', handleActivity);
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        };
      }
    }, [hideOnInactive, inactiveTimeout]);

    if (!visible || inactive) {
      return null;
    }

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          floatingButtonVariants({ variant, size, position }),
          animate && 'animate-float',
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FloatingButton.displayName = 'FloatingButton';

export { FloatingButton };
