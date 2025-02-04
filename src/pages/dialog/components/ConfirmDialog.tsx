import * as React from 'react';
import { BiX } from 'react-icons/bi';
import { FiAlertCircle, FiAlertTriangle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi'; // Feather Icons
import { MdCheckCircle } from 'react-icons/md';
import { TbAlertTriangle } from 'react-icons/tb';

import { cn } from '../../../utils/cn';

type ConfirmType = 'info' | 'success' | 'warning' | 'error';

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: ConfirmType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  loading?: boolean;
  hideCancel?: boolean;
  className?: string;
}

const ConfirmDialog = React.forwardRef<HTMLDivElement, ConfirmDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      type = 'info',
      title = 'Confirm Action',
      description = 'Are you sure you want to continue?',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      onCancel,
      loading = false,
      hideCancel = false,
      className,
      ...props
    },
    ref
  ) => {
    if (!open) return null;

    const getIcon = () => {
      switch (type) {
        case 'success':
          return <MdCheckCircle className="h-6 w-6 text-success" />;
        case 'warning':
          return <TbAlertTriangle className="h-6 w-6 text-warning" />;
        case 'error':
          return <FiAlertCircle className="h-6 w-6 text-destructive" />;
        default:
          return <FiInfo className="h-6 w-6 text-primary" />;
      }
    };

    const handleConfirm = () => {
      if (loading) return;
      onConfirm?.();
    };

    const handleCancel = () => {
      if (loading) return;
      onCancel?.();
      onOpenChange?.(false);
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/70 shadow-xl" {...props}>
        <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
          <div className="flex items-center gap-4">
            {getIcon()}
            <div className="flex-1">
              <h2 className="text-lg font-semibold">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <button
              type="button"
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              onClick={handleCancel}
              disabled={loading}
            >
              <BiX className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          <div className="flex justify-end gap-4">
            {!hideCancel && (
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={handleCancel}
                disabled={loading}
              >
                {cancelLabel}
              </button>
            )}
            <button
              type="button"
              className={cn(
                'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none',
                type === 'success' && 'bg-success hover:bg-success/90',
                type === 'warning' && 'bg-warning hover:bg-warning/90',
                type === 'error' && 'bg-destructive hover:bg-destructive/90',
                type === 'info' && 'bg-primary hover:bg-primary/90',
                loading && 'cursor-not-allowed opacity-50'
              )}
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : null}
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmDialog.displayName = 'ConfirmDialog';

export { ConfirmDialog, type ConfirmDialogProps, type ConfirmType };
