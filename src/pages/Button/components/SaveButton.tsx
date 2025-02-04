import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';

const saveButtonVariants = cva(
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

interface SaveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof saveButtonVariants> {
  saved?: boolean;
  showIcon?: boolean;
  animate?: boolean;
  savedColor?: string;
  onSave?: (saved: boolean) => void;
  loadingText?: string;
  savedText?: string;
  unsavedText?: string;
  loading?: boolean;
}

const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  (
    {
      className,
      variant,
      size,
      saved = false,
      showIcon = true,
      animate = true,
      savedColor = '#3b82f6',
      onSave,
      loadingText = 'Saving...',
      savedText = 'Saved',
      unsavedText = 'Save',
      loading = false,
      children,
      ...props
    },
    ref
  ) => {
    const [isSaved, setIsSaved] = React.useState(saved);
    const [isAnimating, setIsAnimating] = React.useState(false);

    React.useEffect(() => {
      setIsSaved(saved);
    }, [saved]);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) return;

      event.preventDefault();

      if (animate) {
        setIsAnimating(true);
        setTimeout(() => { setIsAnimating(false); }, 1000);
      }

      const newSavedState = !isSaved;
      setIsSaved(newSavedState);
      onSave?.(newSavedState);
    };

    const buttonText = loading ? loadingText : isSaved ? savedText : unsavedText;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(saveButtonVariants({ variant, size }), 'group gap-2', className)}
        onClick={handleClick}
        disabled={loading}
        {...props}
      >
        {showIcon && (
          <span
            className={cn(
              'inline-flex transition-transform',
              animate && isAnimating && 'animate-bounce',
              isSaved && 'scale-110'
            )}
            style={{ color: isSaved ? savedColor : 'currentColor' }}
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : isSaved ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M0 96C0 60.7 28.7 32 64 32H196.1c19.1 0 37.4 7.6 50.9 21.1L289.9 96H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16H286.6c-10.6 0-20.8-4.2-28.3-11.7L213.1 87c-4.5-4.5-10.6-7-17-7H64z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M433.1 129.1l-83.9-83.9C337.2 33.3 321.7 25 305.5 25H64C28.7 25 0 53.7 0 89v334c0 35.3 28.7 64 64 64h384c35.3 0 64-28.7 64-64V169.5c0-16.2-8.3-31.7-20.1-43.5zM224 416c-35.3 0-64-28.7-64-64s28.7-64 64-64 64 28.7 64 64-28.7 64-64 64zm96-208H64V96h192v112z" />
              </svg>
            )}
          </span>
        )}
        {children || buttonText}
      </button>
    );
  }
);

SaveButton.displayName = 'SaveButton';

export { SaveButton };
