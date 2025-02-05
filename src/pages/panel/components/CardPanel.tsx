import * as React from "react";
import { cn } from '../../../utils/cn'
import { FiMoreHorizontal } from "react-icons/fi";

interface CardPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerActions?: React.ReactNode;
  footer?: React.ReactNode;
  media?: {
    type: "image" | "video";
    src: string;
    alt?: string;
    aspectRatio?: "square" | "video" | "wide" | string;
  };
  hover?: boolean;
  loading?: boolean;
  variant?: "default" | "bordered";
  size?: "sm" | "md" | "lg";
}

const CardPanel = React.forwardRef<HTMLDivElement, CardPanelProps>(
  (
    {
      children,
      title,
      subtitle,
      headerActions,
      footer,
      media,
      hover = false,
      loading = false,
      variant = "default",
      size = "md",
      className,
      ...props
    },
    ref
  ) => {
    const getAspectRatio = () => {
      switch (media?.aspectRatio) {
        case "square":
          return "aspect-square";
        case "video":
          return "aspect-video";
        case "wide":
          return "aspect-[21/9]";
        default:
          return media?.aspectRatio;
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "sm":
          return "p-3 text-sm";
        case "lg":
          return "p-6 text-lg";
        default:
          return "p-4";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg bg-background transition-colors",
          variant === "bordered" && "border",
          hover && "hover:bg-muted/50",
          loading && "animate-pulse",
          getSizeClasses(),
          className
        )}
        {...props}
      >
        {/* Media */}
        {media && (
          <div className={cn("-mx-4 -mt-4 overflow-hidden", getAspectRatio())}>
            {media.type === "image" ? (
              <img
                src={media.src}
                alt={media.alt || ""}
                className="h-full w-full object-cover"
              />
            ) : (
              <video
                src={media.src}
                className="h-full w-full object-cover"
                controls
              />
            )}
          </div>
        )}

        {/* Header */}
        {(title || subtitle || headerActions) && (
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              {title && (
                <h3 className="font-semibold leading-none tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
            {headerActions ? (
              headerActions
            ) : (
              <button
                type="button"
                className="rounded-md p-1 hover:bg-muted"
                onClick={(e) => e.preventDefault()}
              >
                <FiMoreHorizontal className="h-4 w-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div>{children}</div>

        {/* Footer */}
        {footer && (
          <div className={cn("mt-4 flex items-center gap-4", size === "sm" ? "text-sm" : "")}>
            {footer}
          </div>
        )}
      </div>
    );
  }
);

CardPanel.displayName = "CardPanel";

export { CardPanel, type CardPanelProps };
