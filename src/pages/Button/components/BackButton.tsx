import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const backButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
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
      variant: 'ghost',
      size: 'default',
    },
  }
);

interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof backButtonVariants> {
  fallbackUrl?: string;
  showIcon?: boolean;
  onBack?: () => void;
  confirmMessage?: string;
  confirmBeforeNavigate?: boolean;
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    {
      className,
      variant,
      size,
      fallbackUrl = '/',
      showIcon = true,
      onBack,
      confirmMessage = 'Are you sure you want to go back?',
      confirmBeforeNavigate = false,
      children,
      ...props
    },
    ref
  ) => {
    const handleBack = () => {
      const navigate = () => {
        if (onBack) {
          onBack();
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.href = fallbackUrl;
        }
      };

      if (confirmBeforeNavigate) {
        if (window.confirm(confirmMessage)) {
          navigate();
        }
      } else {
        navigate();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(backButtonVariants({ variant, size }), className)}
        onClick={handleBack}
        {...props}
      >
        {showIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
            className="mr-2 h-4 w-4"
            fill="currentColor"
          >
            <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
          </svg>
        )}
        {children || 'Back'}
      </button>
    );
  }
);

BackButton.displayName = 'BackButton';

export { BackButton };
