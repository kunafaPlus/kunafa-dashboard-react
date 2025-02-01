import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiX } from "react-icons/bi";

interface FormDialogProps  {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  submitLabel?: string;
  cancelLabel?: string;
  onSubmit?: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string;
  success?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  preventClose?: boolean;
  showDividers?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const FormDialog = React.forwardRef<HTMLDivElement, FormDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      title,
      description,
      submitLabel = "Submit",
      cancelLabel = "Cancel",
      onSubmit,
      onCancel,
      loading = false,
      error,
      success,
      size = "md",
      preventClose = false,
      showDividers = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const [isClosing, setIsClosing] = React.useState(false);
    const formRef = React.useRef<HTMLFormElement>(null);

    if (!open) return null;

    const getMaxWidth = () => {
      switch (size) {
        case "sm":
          return "max-w-sm";
        case "md":
          return "max-w-md";
        case "lg":
          return "max-w-lg";
        case "xl":
          return "max-w-xl";
        case "full":
          return "max-w-[calc(100%-2rem)]";
        default:
          return "max-w-md";
      }
    };

    // const handleClose = () => {
    //   if (preventClose && !isClosing) return;
    //   onOpenChange?.(false); // إغلاق الـ Dialog
    //   onCancel?.(); // استدعاء دالة onCancel
    // };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (loading) return;

      try {
        const formData = new FormData(formRef.current!);
        const data = Object.fromEntries(formData.entries());
        await onSubmit?.(data);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    };
    const handleClose = async (e: React.FormEvent) => {
      e.preventDefault();

      onCancel?.();
      
    };

    return (
      <div className="fixed inset-0 z-50 bg-black/80 " {...props}>
        <div
          className={cn(
            "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background shadow-lg duration-200 sm:rounded-lg",
            getMaxWidth(),
            className
          )}
          ref={ref}
        >
          {/* Header */}
          <div className={cn("flex items-center gap-2 p-6", showDividers && "border-b")}>
            <div className="flex-1 space-y-1">
              {title && <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>}
              {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
            {!preventClose && (
              <button
                type="button"
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                onClick={handleClose}
                disabled={loading}
              >
                <BiX className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </button>
            )}
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="space-y-4 p-6 pt-0">{children}</div>

            {/* Status Messages */}
            {(error || success) && (
              <div className="px-6">
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                {success && (
                  <p className="text-sm text-success">{success}</p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className={cn("flex items-center justify-end gap-4 p-6", showDividers && "border-t")}>
              {!preventClose && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
                  onClick={handleClose}
                  disabled={loading}
                >
                  {cancelLabel}
                </button>
              )}
              <button
                type="submit"
                className={cn(
                  "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
                  loading && "cursor-not-allowed opacity-50"
                )}
                disabled={loading}
              >
                {loading ? (
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : null}
                {submitLabel}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

FormDialog.displayName = "FormDialog";

export { FormDialog, type FormDialogProps };
