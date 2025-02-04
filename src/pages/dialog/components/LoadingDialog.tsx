import * as React from 'react';
import { BiX } from 'react-icons/bi';
import { TbLoader2 } from 'react-icons/tb';

import { cn } from '../../../utils/cn';


interface LoadingDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  status?: React.ReactNode;
  progress?: number;
  showProgress?: boolean;
  cancelable?: boolean;
  onCancel?: () => void;
  variant?: 'default' | 'blur' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  spinnerSize?: number;
  spinnerColor?: string;
  spinnerClassName?: string;
  className?: string;
}

const LoadingDialog = React.forwardRef<HTMLDivElement, LoadingDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      title = 'Loading',
      description,
      status,
      progress,
      showProgress = false,
      cancelable = false,
      onCancel,
      variant = 'default',
      size = 'md',
      spinnerSize = 24,
      spinnerColor,
      spinnerClassName,
      className,
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    const getSize = () => {
      switch (size) {
        case 'sm':
          return 'max-w-sm';
        case 'lg':
          return 'max-w-lg';
        default:
          return 'max-w-md';
      }
    };

    const getVariant = () => {
      switch (variant) {
        case 'blur':
          return 'bg-background/80 backdrop-blur-sm';
        case 'minimal':
          return 'bg-transparent';
        default:
          return 'bg-background/80';
      }
    };

    const renderSpinner = () => (
      <div
        className={cn('animate-spin', spinnerClassName)}
        style={{
          width: spinnerSize,
          height: spinnerSize,
          color: spinnerColor,
        }}
      >
        <TbLoader2 className="h-full w-full" />
      </div>
    );

    const renderProgress = () => {
      if (!showProgress) return null;

      return (
        <div className="mt-4 w-full space-y-2">
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progress ?? 0}%` }}
            />
          </div>
          {typeof progress === 'number' && (
            <div className="text-center text-sm text-muted-foreground">{Math.round(progress)}%</div>
          )}
        </div>
      );
    };

    return (
      <div className={cn('fixed inset-0 z-50', getVariant(), className)} ref={ref} {...props}>
        <div
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 p-6',
            variant === 'default' && 'border border-gray-200 bg-background shadow-lg sm:rounded-lg',
            getSize()
          )}
        >
          <div className="flex flex-col items-center justify-center text-center">
            {/* Spinner */}
            {renderSpinner()}

            {/* Content */}
            <div className="mt-4 space-y-2">
              {title && <h2 className="text-lg font-semibold">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
              {status && <p className="text-sm font-medium">{status}</p>}
            </div>

            {/* Progress */}
            {renderProgress()}

            {/* Cancel Button */}
            {cancelable && (
              <button
                type="button"
                onClick={() => {
                  onCancel?.();
                  onOpenChange?.(false);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <BiX className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

LoadingDialog.displayName = 'LoadingDialog';

export { LoadingDialog, type LoadingDialogProps };
