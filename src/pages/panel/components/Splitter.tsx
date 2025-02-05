import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../../utils/cn'
8
const splitterVariants = cva("flex", {
  variants: {
    variant: {
      default: "",
      bordered: "[&>*]:border",
      ghost: "[&>*]:bg-muted/50",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col h-[500px]",
    },
  },
  defaultVariants: {
    variant: "default",
    orientation: "horizontal",
  },
});

const gutterVariants = cva(
  "flex items-center justify-center hover:bg-accent transition-colors",
  {
    variants: {
      orientation: {
        horizontal: "cursor-col-resize",
        vertical: "cursor-row-resize",
      },
      size: {
        sm: "[&.horizontal]:w-1 [&.vertical]:h-1",
        md: "[&.horizontal]:w-2 [&.vertical]:h-2",
        lg: "[&.horizontal]:w-3 [&.vertical]:h-3",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
      size: "md",
    },
  }
);

interface SplitterProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof splitterVariants> {
  defaultSizes?: number[];
  minSizes?: number[];
  maxSizes?: number[];
  gutterSize?: VariantProps<typeof gutterVariants>["size"];
  snapOffset?: number;
  dragInterval?: number;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onSizesChange?: (sizes: number[]) => void;
}

const Splitter = React.forwardRef<HTMLDivElement, SplitterProps>(
  (
    {
      className,
      variant,
      orientation,
      children,
      defaultSizes,
      minSizes,
      maxSizes,
      gutterSize = "md",
      snapOffset = 30,
      dragInterval = 1,
      onDragStart,
      onDragEnd,
      onSizesChange,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [sizes, setSizes] = React.useState<number[]>([]);
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragIndex, setDragIndex] = React.useState<number | null>(null);
    const [initialPos, setInitialPos] = React.useState<number | null>(null);
    const [initialSizes, setInitialSizes] = React.useState<number[]>([]);

    const childCount = React.Children.count(children);
    const gutterCount = childCount - 1;

    React.useEffect(() => {
      if (defaultSizes && defaultSizes.length === childCount) {
        setSizes(defaultSizes);
      } else {
        const equalSize = 100 / childCount;
        setSizes(Array(childCount).fill(equalSize));
      }
    }, [childCount, defaultSizes]);

    const handleDragStart = (
      e: React.MouseEvent | React.TouchEvent,
      index: number
    ) => {
      e.preventDefault();
      setIsDragging(true);
      setDragIndex(index);
      setInitialPos(
        orientation === "horizontal"
          ? getEventPosition(e, "horizontal")
          : getEventPosition(e, "vertical")
      );
      setInitialSizes([...sizes]);
      onDragStart?.();

      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("touchend", handleDragEnd);
    };

    const handleDrag = React.useCallback(
      (e: MouseEvent | TouchEvent) => {
        if (!isDragging || dragIndex === null || initialPos === null) return;

        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;

        const currentPos =
          orientation === "horizontal"
            ? getEventPosition(e, "horizontal")
            : getEventPosition(e, "vertical");
        const deltaPixels = currentPos - initialPos;

        const containerSize =
          orientation === "horizontal" ? containerRect.width : containerRect.height;
        const deltaPercentage = (deltaPixels / containerSize) * 100;

        const newSizes = [...initialSizes];
        const minSize = minSizes?.[dragIndex] ?? 0;
        const maxSize = maxSizes?.[dragIndex] ?? 100;
        const nextMinSize = minSizes?.[dragIndex + 1] ?? 0;
        const nextMaxSize = maxSizes?.[dragIndex + 1] ?? 100;

        let newSize = Math.round(newSizes[dragIndex] + deltaPercentage);
        let nextSize = Math.round(newSizes[dragIndex + 1] - deltaPercentage);

        // Apply constraints
        newSize = Math.max(minSize, Math.min(maxSize, newSize));
        nextSize = Math.max(nextMinSize, Math.min(nextMaxSize, nextSize));

        // Apply drag interval
        if (dragInterval > 1) {
          newSize = Math.round(newSize / dragInterval) * dragInterval;
          nextSize = Math.round(nextSize / dragInterval) * dragInterval;
        }

        // Apply snap offset
        const snapThreshold = (snapOffset / containerSize) * 100;
        if (Math.abs(newSize - minSize) < snapThreshold) newSize = minSize;
        if (Math.abs(newSize - maxSize) < snapThreshold) newSize = maxSize;
        if (Math.abs(nextSize - nextMinSize) < snapThreshold)
          nextSize = nextMinSize;
        if (Math.abs(nextSize - nextMaxSize) < snapThreshold)
          nextSize = nextMaxSize;

        newSizes[dragIndex] = newSize;
        newSizes[dragIndex + 1] = nextSize;

        setSizes(newSizes);
        onSizesChange?.(newSizes);
      },
      [
        isDragging,
        dragIndex,
        initialPos,
        initialSizes,
        orientation,
        minSizes,
        maxSizes,
        dragInterval,
        snapOffset,
        onSizesChange,
      ]
    );

    const handleDragEnd = React.useCallback(() => {
      setIsDragging(false);
      setDragIndex(null);
      setInitialPos(null);
      setInitialSizes([]);
      onDragEnd?.();

      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", handleDragEnd);
    }, [handleDrag, onDragEnd]);

    return (
      <div
        ref={containerRef}
        className={cn(splitterVariants({ variant, orientation }), className)}
        {...props}
      >
        {React.Children.map(children, (child, index) => (
          <React.Fragment key={index}>
            <div
              style={{
                flexBasis: `${sizes[index]}%`,
                flexGrow: 0,
                flexShrink: 0,
                overflow: "auto",
              }}
            >
              {child}
            </div>
            {index < gutterCount && (
              <div
                className={cn(
                  gutterVariants({ orientation, size: gutterSize }),
                  orientation === "horizontal" ? "horizontal" : "vertical"
                )}
                onMouseDown={(e) => handleDragStart(e, index)}
                onTouchStart={(e) => handleDragStart(e, index)}
              >
                <div
                  className={cn(
                    "rounded-full bg-muted-foreground/20",
                    orientation === "horizontal"
                      ? "h-8 w-1"
                      : "h-1 w-8"
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

Splitter.displayName = "Splitter";

function getEventPosition(
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  orientation: "horizontal" | "vertical"
) {
  if ("touches" in event) {
    return orientation === "horizontal"
      ? event.touches[0].clientX
      : event.touches[0].clientY;
  }
  return orientation === "horizontal" ? event.clientX : event.clientY;
}

export { Splitter, splitterVariants };
