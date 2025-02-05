import * as React from "react";
import { cn } from '../../../utils/cn'
import { BiChevronDown } from "react-icons/bi";

interface CollapsiblePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  defaultExpanded?: boolean;
  direction?: "horizontal" | "vertical";
  headerClassName?: string;
  contentClassName?: string;
  chevronClassName?: string;
}

const CollapsiblePanel = React.forwardRef<HTMLDivElement, CollapsiblePanelProps>(
  (
    {
      title,
      children,
      defaultExpanded = false,
      direction = "vertical",
      className,
      headerClassName,
      contentClassName,
      chevronClassName,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden rounded-lg border border-border bg-background shadow-sm",
          className
        )}
        {...props}
      >
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "flex w-full items-center justify-between px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/50",
            headerClassName
          )}
        >
          {title}
          <BiChevronDown
            className={cn(
              "h-4 w-4 shrink-0 transition-transform duration-200",
              isExpanded && "rotate-180",
              chevronClassName
            )}
          />
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200 ease-in-out",
            direction === "vertical"
              ? isExpanded
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0"
              : isExpanded
              ? "max-w-[1000px] opacity-100"
              : "max-w-0 opacity-0",
            contentClassName
          )}
        >
          <div className="p-4">{children}</div>
        </div>
      </div>
    );
  }
);

CollapsiblePanel.displayName = "CollapsiblePanel";

export { CollapsiblePanel, type CollapsiblePanelProps };
