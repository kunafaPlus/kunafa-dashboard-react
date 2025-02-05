import * as React from "react";
import { cn } from "../../../utils/cn";
import { useVirtualizer } from "@tanstack/react-virtual";

interface Column<T> {
  field: keyof T | string;
  header: React.ReactNode;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  frozen?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface VirtualDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  headerHeight?: number;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  overscan?: number;
  onSort?: (field: keyof T | string, direction: "asc" | "desc") => void;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
  emptyTemplate?: React.ReactNode;
  scrollToIndex?: number;
}

function VirtualDataGrid<T>({
  data,
  columns,
  rowHeight = 48,
  headerHeight = 48,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  overscan = 5,
  onSort,
  onRowClick,
  loading = false,
  loadingTemplate,
  emptyTemplate,
  scrollToIndex,
}: VirtualDataGridProps<T>) {
  const parentRef = React.useRef<HTMLDivElement>(null);
  const [sortField, setSortField] = React.useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Calculate total width of all columns
  const totalWidth = React.useMemo(() => {
    return columns.reduce((acc, col) => acc + (col.width || 150), 0);
  }, [columns]);

  // Virtual rows
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
    scrollToIndex,
  });

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
      <div
        key={index}
        className={cn(
          "flex items-center px-4",
          column.sortable && "cursor-pointer select-none hover:bg-gray-50",
          column.headerClassName,
          headerClassName
        )}
        style={{
          width: column.width || 150,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          height: headerHeight,
        }}
        onClick={() => column.sortable && handleSort(column.field)}
      >
        <span className="flex-1">{column.header}</span>
        {column.sortable && isSorted && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn(
              "ml-2 h-4 w-4 transition-transform",
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
    );
  };

  // Render cell content
  const renderCell = (item: T, column: Column<T>, index: number) => {
    const content = column.cell
      ? column.cell(item)
      : item[column.field as keyof T];

    return (
      <div
        key={index}
        className={cn("px-4", column.className, cellClassName)}
        style={{
          width: column.width || 150,
          minWidth: column.minWidth,
          maxWidth: column.maxWidth,
          height: rowHeight,
          display: "flex",
          alignItems: "center",
        }}
      >
        {content}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        {loadingTemplate || (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        {emptyTemplate || <span>No data available</span>}
      </div>
    );
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        "relative h-full overflow-auto border border-gray-200",
        className
      )}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 flex bg-gray-50"
        style={{ width: totalWidth }}
      >
        {columns.map((column, index) => renderHeaderCell(column, index))}
      </div>

      {/* Virtual rows */}
      <div
        className={cn("relative", tableClassName)}
        style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: totalWidth }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const item = data[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              className={cn(
                "absolute flex border-b border-gray-200 bg-white hover:bg-gray-50",
                rowClassName
              )}
              style={{
                top: 0,
                transform: `translateY(${virtualRow.start}px)`,
                width: "100%",
                height: rowHeight,
              }}
              onClick={() => onRowClick?.(item)}
            >
              {columns.map((column, columnIndex) =>
                renderCell(item, column, columnIndex)
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

VirtualDataGrid.displayName = "VirtualDataGrid";

export { VirtualDataGrid, type Column };
