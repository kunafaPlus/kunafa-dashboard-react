import * as React from "react";
import { cn } from "../../../utils/cn";

interface Column<T> {
  field: keyof T | string;
  header: React.ReactNode;
  width?: number;
  sortable?: boolean;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface InfiniteDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  loadingTemplate?: React.ReactNode;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  onSort?: (field: keyof T | string, direction: "asc" | "desc") => void;
  onRowClick?: (item: T) => void;
}

function InfiniteDataGrid<T>({
  data,
  columns,
  loading = false,
  hasMore = false,
  onLoadMore,
  loadingTemplate,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  onSort,
  onRowClick,
}: InfiniteDataGridProps<T>) {
  const [sortField, setSortField] = React.useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const loadMoreRef = React.useRef<HTMLDivElement>(null);

  // Set up intersection observer for infinite loading
  // useIntersectionObserver({
  //   target: loadMoreRef,
  //   onIntersect: () => {
  //     if (!loading && hasMore && onLoadMore) {
  //       onLoadMore();
  //     }
  //   },
  // });

  // Handle sort
  const handleSort = (field: keyof T | string) => {
    if (!onSort) return;

    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  // Render header cell
  const renderHeaderCell = (column: Column<T>, index: number) => {
    const isSorted = sortField === column.field;

    return (
      <th
        key={index}
        className={cn(
          "border-b border-gray-200 bg-gray-50 p-4 text-left",
          column.sortable && "cursor-pointer hover:bg-gray-100",
          column.headerClassName,
          headerClassName
        )}
        style={{ width: column.width }}
        onClick={() => column.sortable && handleSort(column.field)}
      >
        <div className="flex items-center">
          <span className="flex-1">{column.header}</span>
          {column.sortable && isSorted && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "ml-2 h-4 w-4",
                sortDirection === "desc" && "rotate-180"
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </th>
    );
  };

  // Render loading state
  const renderLoading = () => {
    return (
      loadingTemplate || (
        <div className="flex items-center justify-center p-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span>Loading...</span>
          </div>
        </div>
      )
    );
  };

  return (
    <div className={cn("overflow-auto", className)}>
      <table className={cn("min-w-full divide-y divide-gray-200", tableClassName)}>
        <thead>
          <tr>
            {columns.map((column, index) => renderHeaderCell(column, index))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item, rowIndex) => (
            <tr
              key={rowIndex}
              className={cn(
                "cursor-pointer transition-colors hover:bg-gray-50",
                rowClassName
              )}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={cn("p-4", column.className, cellClassName)}
                  style={{ width: column.width }}
                >
                  {column.cell
                    ? column.cell(item)
                    : String(item[column.field as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Loading indicator and infinite scroll trigger */}
      <div ref={loadMoreRef} className="p-4">
        {loading && renderLoading()}
        {!loading && !hasMore && data.length > 0 && (
          <div className="text-center text-sm text-gray-500">
            No more items to load
          </div>
        )}
      </div>
    </div>
  );
}

InfiniteDataGrid.displayName = "InfiniteDataGrid";

export { InfiniteDataGrid, type Column };
