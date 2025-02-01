import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const paginationButtonVariants = cva(
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

interface PaginationButtonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof paginationButtonVariants> {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  boundaryCount?: number;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showEllipsis?: boolean;
  disabled?: boolean;
  onChange?: (page: number) => void;
}

const PaginationButton = React.forwardRef<HTMLDivElement, PaginationButtonProps>(
  (
    {
      className,
      variant,
      size,
      currentPage,
      totalPages,
      siblingCount = 1,
      boundaryCount = 1,
      showFirstLast = true,
      showPrevNext = true,
      showPageNumbers = true,
      showEllipsis = true,
      disabled = false,
      onChange,
      ...props
    },
    ref
  ) => {
    const range = (start: number, end: number) => {
      const length = end - start + 1;
      return Array.from({ length }, (_, i) => start + i);
    };

    const startPages = range(1, Math.min(boundaryCount, totalPages));
    const endPages = range(
      Math.max(totalPages - boundaryCount + 1, boundaryCount + 1),
      totalPages
    );

    const siblingsStart = Math.max(
      Math.min(
        currentPage - siblingCount,
        totalPages - boundaryCount - siblingCount * 2 - 1
      ),
      boundaryCount + 2
    );

    const siblingsEnd = Math.min(
      Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
      endPages.length > 0 ? endPages[0] - 2 : totalPages - 1
    );

    const handlePageChange = (page: number) => {
      if (!disabled && page !== currentPage && page >= 1 && page <= totalPages) {
        onChange?.(page);
      }
    };

    const renderPageButton = (page: number | string, selected = false) => (
      <button
        key={page}
        type="button"
        className={cn(
          paginationButtonVariants({ variant, size }),
          "aspect-square p-0",
          selected && "selected",
          typeof page === "string" && "pointer-events-none"
        )}
        onClick={() => typeof page === "number" && handlePageChange(page)}
        disabled={disabled}
      >
        {page}
      </button>
    );

    const itemList = [
      ...(showFirstLast
        ? [
            <button
              key="first"
              type="button"
              className={cn(paginationButtonVariants({ variant, size }))}
              onClick={() => handlePageChange(1)}
              disabled={disabled || currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160zm160 160c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3l160 160z" />
              </svg>
            </button>,
          ]
        : []),
      ...(showPrevNext
        ? [
            <button
              key="prev"
              type="button"
              className={cn(paginationButtonVariants({ variant, size }))}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={disabled || currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>
            </button>,
          ]
        : []),
      ...(showPageNumbers
        ? [
            ...startPages,
            ...(showEllipsis && siblingsStart > boundaryCount + 2
              ? ["..."]
              : boundaryCount + 1 < siblingsStart - 1
              ? [boundaryCount + 1]
              : []),
            ...range(siblingsStart, siblingsEnd),
            ...(showEllipsis && siblingsEnd < totalPages - boundaryCount - 1
              ? ["..."]
              : siblingsEnd + 1 < totalPages - boundaryCount
              ? [totalPages - boundaryCount]
              : []),
            ...endPages,
          ].map((page) => renderPageButton(page, page === currentPage))
        : []),
      ...(showPrevNext
        ? [
            <button
              key="next"
              type="button"
              className={cn(paginationButtonVariants({ variant, size }))}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={disabled || currentPage === totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
              </svg>
            </button>,
          ]
        : []),
      ...(showFirstLast
        ? [
            <button
              key="last"
              type="button"
              className={cn(paginationButtonVariants({ variant, size }))}
              onClick={() => handlePageChange(totalPages)}
              disabled={disabled || currentPage === totalPages}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 512"
                className="h-4 w-4"
                fill="currentColor"
              >
                <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160zm-160-160c-12.5 12.5-32.8 12.5-45.3 0l-160-160c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L210.7 256 73.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3l-160-160z" />
              </svg>
            </button>,
          ]
        : []),
    ];

    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-1", className)}
        {...props}
      >
        {itemList}
      </div>
    );
  }
);

PaginationButton.displayName = "PaginationButton";

export { PaginationButton };
