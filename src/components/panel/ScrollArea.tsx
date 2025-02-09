import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../utils/cn'
import { ScrollAreaProps } from "./types";
import { scrollAreaVariants, scrollbarVariants, thumbVariants } from "./variants";




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
