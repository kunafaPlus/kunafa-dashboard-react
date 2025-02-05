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

interface MasterDetailGridProps<T> {
  data: T[];
  columns: Column<T>[];
  detailTemplate: (item: T) => React.ReactNode;
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  detailClassName?: string;
  expandedRows?: T[];
  onRowExpand?: (item: T) => void;
  onRowCollapse?: (item: T) => void;
  onSort?: (field: keyof T | string, direction: "asc" | "desc") => void;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
}

function MasterDetailGrid<T extends { id: string | number }>({
  data,
  columns,
  detailTemplate,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  detailClassName,
  expandedRows = [],
  onRowExpand,
  onRowCollapse,
  onSort,
  loading = false,
  loadingTemplate,
}: MasterDetailGridProps<T>) {
  const [sortField, setSortField] = React.useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [expanded, setExpanded] = React.useState<Set<string | number>>(
    new Set(expandedRows.map((row) => row.id))
  );

  // Handle sort
  const handleSort = (field: keyof T | string) => {
    if (!onSort) return;

    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  // Handle row toggle
  const toggleRow = (item: T) => {
    const newExpanded = new Set(expanded);
    if (expanded.has(item.id)) {
      newExpanded.delete(item.id);
      onRowCollapse?.(item);
    } else {
      newExpanded.add(item.id);
      onRowExpand?.(item);
    }
    setExpanded(newExpanded);
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
          {index === 0 && <div className="w-8"></div>}
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

  // Render expand/collapse button
  const renderToggleButton = (item: T) => {
    const isExpanded = expanded.has(item.id);

    return (
      <button
        type="button"
        className="mr-2 flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
        onClick={(e) => {
          e.stopPropagation();
          toggleRow(item);
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-90")}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        {loadingTemplate || (
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
            <span>Loading...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-auto", className)}>
      <table className={cn("min-w-full divide-y divide-gray-200", tableClassName)}>
        <thead>
          <tr>
            {columns.map((column, index) => renderHeaderCell(column, index))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => (
            <React.Fragment key={item.id}>
              <tr
                className={cn(
                  "cursor-pointer transition-colors hover:bg-gray-50",
                  rowClassName
                )}
                onClick={() => toggleRow(item)}
              >
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className={cn("p-4", column.className, cellClassName)}
                    style={{ width: column.width }}
                  >
                    <div className="flex items-center">
                      {index === 0 && renderToggleButton(item)}
                      {column.cell
                        ? column.cell(item)
                        : String(item[column.field as keyof T] ?? "")}
                    </div>
                  </td>
                ))}
              </tr>
              {expanded.has(item.id) && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className={cn("bg-gray-50 p-4", detailClassName)}
                  >
                    {detailTemplate(item)}
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

MasterDetailGrid.displayName = "MasterDetailGrid";

export { MasterDetailGrid, type Column };
