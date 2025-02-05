import * as React from "react";
import { cn } from "../../../utils/cn";

interface Column<T> {
  field: keyof T;
  header: React.ReactNode;
  width?: number;
  editable?: boolean;
  type?: "text" | "number" | "date" | "select" | "boolean";
  options?: { label: string; value: any }[];
  validation?: (value: any) => string | undefined;
  formatter?: (value: any) => string;
  parser?: (value: string) => any;
  className?: string;
  headerClassName?: string;
}

interface EditableDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  editCellClassName?: string;
  onChange?: (newData: T[]) => void;
  onCellChange?: (item: T, field: keyof T, value: any) => void;
  onValidationError?: (error: string) => void;
}

function EditableDataGrid<T extends { id: string | number }>({
  data,
  columns,
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  editCellClassName,
  onChange,
  onCellChange,
  onValidationError,
}: EditableDataGridProps<T>) {
  const [editCell, setEditCell] = React.useState<{
    rowId: string | number;
    field: keyof T;
  } | null>(null);
  const [editValue, setEditValue] = React.useState<string>("");
  const [error, setError] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Start editing
  const startEdit = (item: T, field: keyof T) => {
    const column = columns.find((col) => col.field === field);
    if (!column?.editable) return;

    const value = item[field];
    setEditCell({ rowId: item.id, field });
    setEditValue(column.formatter ? column.formatter(value) : String(value));
    setError("");
    
    // Focus input on next render
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, 0);
  };

  // Stop editing
  const stopEdit = () => {
    setEditCell(null);
    setEditValue("");
    setError("");
  };

  // Handle cell change
  const handleCellChange = (item: T, field: keyof T, value: any) => {
    const column = columns.find((col) => col.field === field);
    if (!column) return;

    // Validate value
    if (column.validation) {
      const validationError = column.validation(value);
      if (validationError) {
        setError(validationError);
        onValidationError?.(validationError);
        return;
      }
    }

    // Parse value if parser provided
    const parsedValue = column.parser ? column.parser(value) : value;

    // Update data
    const newData = data.map((d) =>
      d.id === item.id ? { ...d, [field]: parsedValue } : d
    );

    onChange?.(newData);
    onCellChange?.(item, field, parsedValue);
    stopEdit();
  };

  // Handle key press
  const handleKeyPress = (
    e: React.KeyboardEvent,
    item: T,
    field: keyof T
  ) => {
    if (e.key === "Enter") {
      handleCellChange(item, field, editValue);
    } else if (e.key === "Escape") {
      stopEdit();
    }
  };

  // Render editor based on column type
  const renderEditor = (item: T, column: Column<T>) => {
    switch (column.type) {
      case "select":
        return (
          <select
            className={cn(
              "w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
              editCellClassName
            )}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellChange(item, column.field, editValue)}
            onKeyDown={(e) => handleKeyPress(e, item, column.field)}
          >
            {column.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "boolean":
        return (
          <input
            type="checkbox"
            className={cn(
              "rounded border-gray-300 text-primary focus:ring-primary",
              editCellClassName
            )}
            checked={editValue === "true"}
            onChange={(e) => {
              handleCellChange(item, column.field, e.target.checked);
            }}
          />
        );

      case "number":
        return (
          <input
            ref={inputRef}
            type="number"
            className={cn(
              "w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
              error && "border-red-500",
              editCellClassName
            )}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellChange(item, column.field, editValue)}
            onKeyDown={(e) => handleKeyPress(e, item, column.field)}
          />
        );

      case "date":
        return (
          <input
            ref={inputRef}
            type="date"
            className={cn(
              "w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
              error && "border-red-500",
              editCellClassName
            )}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellChange(item, column.field, editValue)}
            onKeyDown={(e) => handleKeyPress(e, item, column.field)}
          />
        );

      default:
        return (
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm",
              error && "border-red-500",
              editCellClassName
            )}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => handleCellChange(item, column.field, editValue)}
            onKeyDown={(e) => handleKeyPress(e, item, column.field)}
          />
        );
    }
  };

  // Render cell content
  const renderCell = (item: T, column: Column<T>) => {
    const isEditing =
      editCell?.rowId === item.id && editCell?.field === column.field;

    if (isEditing) {
      return renderEditor(item, column);
    }

    const value = item[column.field];
    const displayValue = column.formatter ? column.formatter(value) : String(value);

    return (
      <div
        className={cn(
          "h-full w-full cursor-pointer px-2 py-1",
          column.editable && "hover:bg-gray-50"
        )}
        onClick={() => startEdit(item, column.field)}
      >
        {displayValue}
      </div>
    );
  };

  return (
    <div className={cn("overflow-auto", className)}>
      <table className={cn("min-w-full divide-y divide-gray-200", tableClassName)}>
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  "px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500",
                  column.headerClassName,
                  headerClassName
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((item) => (
            <tr
              key={item.id}
              className={cn("hover:bg-gray-50", rowClassName)}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={cn(
                    "whitespace-nowrap px-6 py-4",
                    column.className,
                    cellClassName
                  )}
                  style={{ width: column.width }}
                >
                  {renderCell(item, column)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {error && (
        <div className="mt-2 text-sm text-red-600" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

EditableDataGrid.displayName = "EditableDataGrid";

export { EditableDataGrid, type Column };
