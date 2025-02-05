import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../../utils/cn'

const scrollAreaVariants = cva("relative overflow-hidden", {
  variants: {
    orientation: {
      vertical: "h-full",
      horizontal: "w-full",
      both: "h-full w-full",
    },
    size: {
      sm: "max-h-[200px]",
      md: "max-h-[400px]",
      lg: "max-h-[600px]",
      xl: "max-h-[800px]",
      custom: "",
    },
  },
  defaultVariants: {
    orientation: "vertical",
    size: "md",
  },
});

const scrollbarVariants = cva(
  "flex touch-none select-none transition-colors",
  {
    variants: {
      orientation: {
        vertical: "h-full w-2.5 border-l border-l-transparent p-[1px]",
        horizontal: "h-2.5 border-t border-t-transparent p-[1px]",
      },
      variant: {
        default: "",
        thin: "w-1.5",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      variant: "default",
    },
  }
);

const thumbVariants = cva(
  "relative flex-1 rounded-full bg-border hover:bg-accent",
  {
    variants: {
      variant: {
        default: "",
        thin: "w-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface ScrollAreaProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scrollAreaVariants> {
  viewportRef?: React.RefObject<HTMLDivElement>;
  scrollbarSize?: number;
  hideScrollbar?: boolean;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      children,
      orientation,
      size,
      viewportRef,
      scrollbarSize = 8,
      hideScrollbar = false,
      ...props
    },
    ref
  ) => {
    const [scrollbarVisible, setScrollbarVisible] = React.useState(false);
    const [scrollbarTop, setScrollbarTop] = React.useState(0);
    const [scrollbarLeft, setScrollbarLeft] = React.useState(0);
    const [isDragging, setIsDragging] = React.useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const scrollbarRef = React.useRef<HTMLDivElement>(null);
    const thumbRef = React.useRef<HTMLDivElement>(null);
    const observer = React.useRef<ResizeObserver>();

    const updateScrollbar = React.useCallback(() => {
      if (!contentRef.current) return;

      const { scrollHeight, scrollWidth, clientHeight, clientWidth, scrollTop, scrollLeft } =
        contentRef.current;

      const isVerticalScrollable = scrollHeight > clientHeight;
      const isHorizontalScrollable = scrollWidth > clientWidth;

      setScrollbarVisible(
        orientation === "both"
          ? isVerticalScrollable || isHorizontalScrollable
          : orientation === "vertical"
          ? isVerticalScrollable
          : isHorizontalScrollable
      );

      if (isVerticalScrollable) {
        const scrollbarHeight = (clientHeight / scrollHeight) * 100;
        const newTop = (scrollTop / (scrollHeight - clientHeight)) * (100 - scrollbarHeight);
        setScrollbarTop(newTop);
      }

      if (isHorizontalScrollable) {
        const scrollbarWidth = (clientWidth / scrollWidth) * 100;
        const newLeft = (scrollLeft / (scrollWidth - clientWidth)) * (100 - scrollbarWidth);
        setScrollbarLeft(newLeft);
      }
    }, [orientation]);

    React.useEffect(() => {
      if (!contentRef.current) return;

      observer.current = new ResizeObserver(() => {
        updateScrollbar();
      });

      observer.current.observe(contentRef.current);

      return () => {
        if (observer.current) {
          observer.current.disconnect();
        }
      };
    }, [updateScrollbar]);

    const handleScroll = () => {
      updateScrollbar();
    };

    return (
      <div
        ref={ref}
        className={cn(scrollAreaVariants({ orientation, size }), className)}
        {...props}
      >
        <div
          ref={contentRef}
          className="h-full w-full overflow-auto scrollbar-hide"
          onScroll={handleScroll}
        >
          {children}
        </div>
        {!hideScrollbar && scrollbarVisible && (
          <div
            ref={scrollbarRef}
            className={cn(
              scrollbarVariants({ orientation }),
              "absolute right-0 bottom-0"
            )}
          >
            <div
              ref={thumbRef}
              className={cn(thumbVariants())}
              style={{
                transform: orientation === "vertical"
                  ? `translateY(${scrollbarTop}%)`
                  : `translateX(${scrollbarLeft}%)`,
              }}
            />
          </div>
        )}
      </div>
    );
  }
);

ScrollArea.displayName = "ScrollArea";

export { ScrollArea, scrollAreaVariants };
