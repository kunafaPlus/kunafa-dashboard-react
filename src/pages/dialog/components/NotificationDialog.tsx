import * as React from "react";
import { cn } from "../../../utils/cn";
import { BiCheckCircle, BiInfoCircle, BiX } from "react-icons/bi";
import { FiAlertCircle, FiAlertTriangle } from "react-icons/fi";


type NotificationType = "info" | "success" | "warning" | "error";

interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive";
}

interface NotificationDialogProps  {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  type?: NotificationType;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: NotificationAction[];
  autoClose?: number;
  showCloseButton?: boolean;
  position?: "top" | "bottom";
  animation?: "slide" | "fade";
  width?: "sm" | "md" | "lg" | "xl" | "full";
  onClose?: () => void;
  className?: string;
}

const NotificationDialog = React.forwardRef<HTMLDivElement, NotificationDialogProps>(
  (
    {
      open = false,
      onOpenChange,
      type = "info",
      title,
      description,
      icon,
      actions = [],
      autoClose,
      showCloseButton = true,
      position = "top",
      animation = "slide",
      width = "md",
      onClose,
      className,
      ...props
    },
    ref
  ) => {
    const [isClosing, setIsClosing] = React.useState(false);

    React.useEffect(() => {
      if (autoClose && open) {
        const timer = setTimeout(() => {
          handleClose();
        }, autoClose);

        return () => clearTimeout(timer);
      }
    }, [autoClose, open]);

    if (!open) return null;

    const getIcon = () => {
      if (icon) return icon;

      switch (type) {
        case "success":
          return <BiCheckCircle className="h-5 w-5 text-success" />;
        case "warning":
          return <FiAlertTriangle className="h-5 w-5 text-warning" />;
        case "error":
          return <FiAlertCircle className="h-5 w-5 text-destructive" />;
        case "info":
        default:
          return <BiInfoCircle className="h-5 w-5 text-primary" />;
      }
    };

    const getWidth = () => {
      switch (width) {
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

    const handleClose = () => {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
        onOpenChange?.(false);
        onClose?.();
      }, 150);
    };

    return (
      <div
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          position === "top" ? "items-start pt-4" : "items-end pb-4",
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "w-full rounded-lg border border-gray-200 bg-background p-4 shadow-lg",
            getWidth(),
            animation === "slide" &&
              (position === "top"
                ? isClosing
                  ? "animate-slide-out-to-top-sm"
                  : "animate-slide-in-from-top-sm"
                : isClosing
                ? "animate-slide-out-to-bottom-sm"
                : "animate-slide-in-from-bottom-sm"),
            animation === "fade" &&
              (isClosing ? "animate-fade-out" : "animate-fade-in")
          )}
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">{getIcon()}</div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              {title && (
                <h3 className="text-base font-semibold leading-none tracking-tight">
                  {title}
                </h3>
              )}
              {description && (
                <div className="text-sm text-muted-foreground">{description}</div>
              )}
              {actions.length > 0 && (
                <div className="flex items-center gap-2">
                  {actions.map((action, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={action.onClick}
                      className={cn(
                        "inline-flex items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                        action.variant === "destructive"
                          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          : "bg-primary text-white hover:bg-primary/90"
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <BiX className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
);

NotificationDialog.displayName = "NotificationDialog";

export {
  NotificationDialog,
  type NotificationDialogProps,
  type NotificationType,
  type NotificationAction,
};
