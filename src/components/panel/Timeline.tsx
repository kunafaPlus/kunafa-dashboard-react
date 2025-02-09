import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../utils/cn';
import { TimelineProps ,TimelineItem} from "./types";
import { timelineItemVariants, timelineVariants, } from "./variants";





const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      variant,
      orientation,
      items,
      lineColor = "bg-border",
      dotSize = "md",
      lineStyle,
      ...props
    },
    ref
  ) => {
    const dotSizeClass = {
      sm: "w-2 h-2",
      md: "w-3 h-3",
      lg: "w-4 h-4",
    }[dotSize];

    return (
      <div
        ref={ref}
        className={cn(timelineVariants({ variant, orientation, lineStyle }), className)}
        {...props}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              timelineItemVariants({ variant: item.variant, orientation })
            )}
          >
            {/* Line */}
            <div
              data-line
              className={cn(
                "absolute",
                orientation === "vertical"
                  ? "left-2.5 top-2 h-full w-px -translate-x-1/2"
                  : "left-2 top-2.5 w-full h-px -translate-y-1/2",
                index === items.length - 1 ? "h-2" : "",
                lineColor
              )}
            />

            {/* Dot */}
            <div
              data-dot
              className={cn(
                "absolute rounded-full border-2 border-background flex items-center justify-center",
                orientation === "vertical"
                  ? "left-2 top-2 -translate-x-1/2"
                  : "left-2 top-2 -translate-y-1/2",
                dotSizeClass,
                item.variant === "default" ? "bg-primary" : "",
                item.dotClassName
              )}
            >
              {item.icon && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  {item.icon}
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="font-medium">{item.title}</div>
                {item.date && (
                  <div className="text-sm text-muted-foreground">
                    {item.date}
                  </div>
                )}
              </div>
              {item.description && (
                <div className="text-sm text-muted-foreground">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";

export { Timeline, type TimelineItem };