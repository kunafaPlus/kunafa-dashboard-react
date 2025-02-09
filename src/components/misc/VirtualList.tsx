import * as React from "react";
import { cn } from "../../utils/cn";
import { VirtualListProps } from "./types";
import { virtualListVariants } from "./variants";





function VirtualList<T>(
  {
    className,
    variant,
    size,
    items,
    itemHeight,
    renderItem,
    overscan = 3,
    onEndReached,
    endReachedThreshold = 0.8,
    loading = false,
    loadingIndicator = "Loading...",
    emptyComponent = "No items",
    scrollToIndex,
    ...props
  }: VirtualListProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [containerHeight, setContainerHeight] = React.useState(0);

  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === containerRef.current) {
          setContainerHeight(entry.contentRect.height);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  React.useEffect(() => {
    if (
      scrollToIndex !== undefined &&
      containerRef.current &&
      scrollToIndex >= 0 &&
      scrollToIndex < items.length
    ) {
      containerRef.current.scrollTop = scrollToIndex * itemHeight;
    }
  }, [scrollToIndex, itemHeight, items.length]);

  const handleScroll = React.useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      setScrollTop(scrollTop);

      if (
        onEndReached &&
        !loading &&
        scrollTop + clientHeight >= scrollHeight * endReachedThreshold
      ) {
        onEndReached();
      }
    },
    [onEndReached, loading, endReachedThreshold]
  );

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(
    0,
    Math.floor(scrollTop / itemHeight) - overscan
  );
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = items.slice(startIndex, endIndex + 1).map((item, index) => ({
    item,
    index: startIndex + index,
    style: {
      position: "absolute",
      top: 0,
      transform: `translateY(${(startIndex + index) * itemHeight}px)`,
      width: "100%",
      height: itemHeight,
    } as React.CSSProperties,
  }));

  if (items.length === 0 && !loading) {
    return (
      <div
        className={cn(
          virtualListVariants({ variant, size }),
          "flex items-center justify-center",
          className
        )}
      >
        {emptyComponent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(virtualListVariants({ variant, size }), className)}
      {...props}
    >
      <div
        style={{ height: totalHeight, position: "relative" }}
        className="w-full"
      >
        {visibleItems.map(({ item, index, style }) => (
          <div key={index} style={style}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {loading && (
        <div className="sticky bottom-0 p-2 text-center bg-background/80 backdrop-blur">
          {loadingIndicator}
        </div>
      )}
    </div>
  );
}

const ForwardedVirtualList = React.forwardRef(VirtualList) as <T>(
  props: VirtualListProps<T> & { ref?: React.ForwardedRef<HTMLDivElement> }
) => React.ReactElement;

export { ForwardedVirtualList as VirtualList, type VirtualListProps };
