import * as React from "react";
import { cn } from "../../../utils/cn";

interface DataScrollerProps<T> {
  data: T[];
  rows?: number;
  buffer?: number;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  emptyMessage?: React.ReactNode;
  inline?: boolean;
  scrollHeight?: string;
  loader?: boolean;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  onLazyLoad?: (event: { first: number; rows: number }) => void;
  itemTemplate: (item: T) => React.ReactNode;
}

function DataScroller<T>({
  data,
  rows = 0,
  buffer = 0.9,
  header,
  footer,
  emptyMessage = "No records found.",
  inline = false,
  scrollHeight,
  loader = false,
  loading = false,
  loadingIcon,
  className,
  contentClassName,
  itemClassName,
  onLazyLoad,
  itemTemplate,
}: DataScrollerProps<T>) {
  const [first, setFirst] = React.useState(0);
  const [last, setLast] = React.useState(rows);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const scrollTimeout = React.useRef<number>();

  React.useEffect(() => {
    if (contentRef.current) {
      bindScrollListener();
    }

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      unbindScrollListener();
    };
  }, [first, last, data]);

  const bindScrollListener = () => {
    if (inline) {
      contentRef.current?.addEventListener("scroll", onScroll);
    } else {
      window.addEventListener("scroll", onScroll);
    }
  };

  const unbindScrollListener = () => {
    if (inline) {
      contentRef.current?.removeEventListener("scroll", onScroll);
    } else {
      window.removeEventListener("scroll", onScroll);
    }
  };

  const onScroll = () => {
    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      if (shouldLoad()) {
        load();
      }
    }, 200);
  };

  const shouldLoad = () => {
    if (loading) {
      return false;
    }

    const scrollElement = inline ? contentRef.current : window;
    const scrollTop = inline
      ? contentRef.current?.scrollTop || 0
      : document.documentElement.scrollTop;
    const scrollHeight = inline
      ? contentRef.current?.scrollHeight || 0
      : document.documentElement.scrollHeight;
    const clientHeight = inline
      ? contentRef.current?.clientHeight || 0
      : document.documentElement.clientHeight;

      
    return (
      scrollTop >=
      (scrollHeight * buffer - clientHeight)
    );
  };

  const load = () => {
    if (rows) {
      const newLast = last + rows;
      setFirst(last);
      setLast(newLast);
      onLazyLoad?.({ first: last, rows });
    }
  };

  const renderHeader = () => {
    if (!header) {
      return null;
    }

    return <div className="mb-4">{header}</div>;
  };

  const renderFooter = () => {
    if (!footer) {
      return null;
    }

    return <div className="mt-4">{footer}</div>;
  };

  const renderContent = () => {
    const items = rows > 0 ? data.slice(0, last) : data;

    if (!items || items.length === 0) {
      return <div className="p-4 text-center text-gray-500">{emptyMessage}</div>;
    }

    return (
      <div className={cn("space-y-4", contentClassName)}>
        {items.map((item, index) => (
          <div key={index} className={cn("", itemClassName)}>
            {itemTemplate(item)}
          </div>
        ))}
        {loader && loading && (
          <div className="flex justify-center p-4">
            {loadingIcon || (
              <svg
                className="h-8 w-8 animate-spin text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </div>
        )}
      </div>
    );
  };

  const style: React.CSSProperties = {
    maxHeight: scrollHeight,
    overflow: "auto",
  };

  return (
    <div className={cn("", className)}>
      {renderHeader()}
      <div ref={contentRef} style={inline ? style : undefined}>
        {renderContent()}
      </div>
      {renderFooter()}
    </div>
  );
}

DataScroller.displayName = "DataScroller";

export { DataScroller };
