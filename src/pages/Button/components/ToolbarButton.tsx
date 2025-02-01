import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const toolbarButtonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary/90 [&>*]:hover:bg-primary/90 [&>*.selected]:bg-primary/80",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 [&>*]:hover:bg-destructive/90 [&>*.selected]:bg-destructive/80",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground [&>*]:hover:bg-accent [&>*]:hover:text-accent-foreground [&>*.selected]:bg-accent [&>*.selected]:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 [&>*]:hover:bg-secondary/80 [&>*.selected]:bg-secondary/70",
        ghost:
          "hover:bg-accent hover:text-accent-foreground [&>*]:hover:bg-accent [&>*]:hover:text-accent-foreground [&>*.selected]:bg-accent [&>*.selected]:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline [&>*]:hover:underline [&>*.selected]:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ToolbarItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  tooltip?: string;
  disabled?: boolean;
  selected?: boolean;
  onClick?: () => void;
  children?: ToolbarItem[];
}

interface ToolbarButtonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toolbarButtonVariants> {
  items: ToolbarItem[];
  orientation?: "horizontal" | "vertical";
  showLabels?: boolean;
  showTooltips?: boolean;
  gap?: number;
  maxHeight?: string;
  overflow?: "visible" | "hidden" | "scroll" | "auto";
}

const ToolbarButton = React.forwardRef<HTMLDivElement, ToolbarButtonProps>(
  (
    {
      className,
      variant,
      size,
      items,
      orientation = "horizontal",
      showLabels = true,
      showTooltips = true,
      gap = 1,
      maxHeight,
      overflow = "visible",
      ...props
    },
    ref
  ) => {
    const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);

    const renderItem = (item: ToolbarItem, isChild = false) => (
      <button
        key={item.id}
        type="button"
        className={cn(
          "relative inline-flex items-center justify-center gap-2 whitespace-nowrap",
          !isChild && toolbarButtonVariants({ variant, size }),
          item.selected && "selected",
          item.disabled && "pointer-events-none opacity-50"
        )}
        onClick={item.onClick}
        disabled={item.disabled}
        title={showTooltips ? item.tooltip : undefined}
        onMouseEnter={() => setHoveredItem(item.id)}
        onMouseLeave={() => setHoveredItem(null)}
      >
        {item.icon}
        {showLabels && item.label}
        {item.children && hoveredItem === item.id && (
          <div
            className={cn(
              "absolute z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
              orientation === "horizontal"
                ? "left-0 top-full mt-2"
                : "left-full top-0 ml-2"
            )}
          >
            <div className="space-y-1">
              {item.children.map((child) => renderItem(child, true))}
            </div>
          </div>
        )}
      </button>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex",
          orientation === "horizontal" ? "flex-row" : "flex-col",
          gap > 0 && `gap-${gap}`,
          maxHeight && `max-h-[${maxHeight}]`,
          overflow !== "visible" && `overflow-${overflow}`,
          className
        )}
        role="toolbar"
        {...props}
      >
        {items.map((item) => renderItem(item))}
      </div>
    );
  }
);

ToolbarButton.displayName = "ToolbarButton";

export { ToolbarButton };
