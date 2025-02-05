import * as React from "react";
import { cn } from "../../../utils/cn";

interface Column<T> {
  field: keyof T | string;
  header: React.ReactNode;
  width?: number;
  sortable?: boolean;
  exportable?: boolean;
  cell?: (item: T) => React.ReactNode;
  exportValue?: (item: T) => any;
  className?: string;
  headerClassName?: string;
}

interface ExportableDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  toolbarClassName?: string;
  filename?: string;
  onSort?: (field: keyof T | string, direction: "asc" | "desc") => void;
  onExport?: (format: "csv" | "excel" | "pdf", data: any[][]) => void;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
}

function ExportableDataGrid<T>({
  data,
  columns,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  toolbarClassName,
  filename = "export",
  onSort,
  onExport,
  loading = false,
  loadingTemplate,
}: ExportableDataGridProps<T>) {
  const [sortField, setSortField] = React.useState<keyof T | string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  // Handle sort
  const handleSort = (field: keyof T | string) => {
    if (!onSort) return;

    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  // Export to CSV
  const exportToCSV = () => {
    const exportableColumns = columns.filter((col) => col.exportable !== false);
    const headers = exportableColumns.map((col) => String(col.header));
    
    const rows = data.map((item) =>
      exportableColumns.map((col) =>
        col.exportValue
          ? col.exportValue(item)
          : String(item[col.field as keyof T] ?? "")
      )
    );

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    if (onExport) {
      onExport("csv", [headers, ...rows]);
    } else {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.csv`;
      link.click();
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const exportableColumns = columns.filter((col) => col.exportable !== false);
    const headers = exportableColumns.map((col) => String(col.header));
    
    const rows = data.map((item) =>
      exportableColumns.map((col) =>
        col.exportValue
          ? col.exportValue(item)
          : String(item[col.field as keyof T] ?? "")
      )
    );

    if (onExport) {
      onExport("excel", [headers, ...rows]);
    } else {
      // Basic Excel export (you might want to use a library like xlsx for better Excel support)
      const content = [headers, ...rows]
        .map((row) => row.join("\t"))
        .join("\n");
      
      const blob = new Blob([content], {
        type: "application/vnd.ms-excel;charset=utf-8;",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}.xls`;
      link.click();
    }
  };

  // Export to PDF
  const exportToPDF = () => {
    const exportableColumns = columns.filter((col) => col.exportable !== false);
    const headers = exportableColumns.map((col) => String(col.header));
    
    const rows = data.map((item) =>
      exportableColumns.map((col) =>
        col.exportValue
          ? col.exportValue(item)
          : String(item[col.field as keyof T] ?? "")
      )
    );

    if (onExport) {
      onExport("pdf", [headers, ...rows]);
    }
    // Note: For PDF export, you'll typically want to use a library like jsPDF
  };

  // Render export toolbar
  const renderToolbar = () => {
    return (
      <div
        className={cn(
          "mb-4 flex items-center justify-end space-x-2",
          toolbarClassName
        )}
      >
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          onClick={exportToCSV}
        >
          Export CSV
        </button>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          onClick={exportToExcel}
        >
          Export Excel
        </button>
        <button
          type="button"
          className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
          onClick={exportToPDF}
        >
          Export PDF
        </button>
      </div>
    );
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
    <div className={className}>
      {renderToolbar()}
      <div className="overflow-auto">
        <table
          className={cn("min-w-full divide-y divide-gray-200", tableClassName)}
        >
          <thead>
            <tr>
              {columns.map((column, index) => renderHeaderCell(column, index))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {data.map((item, rowIndex) => (
              <tr
                key={rowIndex}
                className={cn("transition-colors hover:bg-gray-50", rowClassName)}
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
      </div>
    </div>
  );
}

ExportableDataGrid.displayName = "ExportableDataGrid";

export { ExportableDataGrid, type Column };
