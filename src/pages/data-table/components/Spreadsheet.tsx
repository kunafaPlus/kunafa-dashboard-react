import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const spreadsheetVariants = cva(
  "w-full overflow-auto border rounded-lg bg-background",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "bg-muted/50 border-none",
      },
      size: {
        sm: "max-h-[300px]",
        md: "max-h-[500px]",
        lg: "max-h-[700px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface CellData {
  value: string;
  formula?: string;
  type?: "text" | "number" | "date" | "boolean";
  format?: string;
  readonly?: boolean;
}

type SpreadsheetData = Record<string, Record<string, CellData>>;

interface SpreadsheetProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spreadsheetVariants> {
  data: SpreadsheetData;
  onChange?: (data: SpreadsheetData) => void;
  columns?: number;
  rows?: number;
  columnWidths?: Record<string, number>;
  rowHeights?: Record<string, number>;
  onCellClick?: (row: string, col: string, data: CellData) => void;
  readonly?: boolean;
  showToolbar?: boolean;
  showLineNumbers?: boolean;
}

const Spreadsheet = React.forwardRef<HTMLDivElement, SpreadsheetProps>(
  (
    {
      className,
      variant,
      size,
      data,
      onChange,
      columns = 26,
      rows = 100,
      columnWidths = {},
      rowHeights = {},
      onCellClick,
      readonly = false,
      showToolbar = true,
      showLineNumbers = true,
      ...props
    },
    ref
  ) => {
    const [selectedCell, setSelectedCell] = React.useState<{
      row: string;
      col: string;
    } | null>(null);
    const [editValue, setEditValue] = React.useState("");
    const [isEditing, setIsEditing] = React.useState(false);

    const getColumnLabel = (index: number) => {
      let label = "";
      while (index >= 0) {
        label = String.fromCharCode(65 + (index % 26)) + label;
        index = Math.floor(index / 26) - 1;
      }
      return label;
    };

    const getRowLabel = (index: number) => {
      return (index + 1).toString();
    };

    const handleCellClick = (row: string, col: string) => {
      const cellData = data[row]?.[col] || { value: "" };
      setSelectedCell({ row, col });
      setEditValue(cellData.formula || cellData.value);
      onCellClick?.(row, col, cellData);
    };

    const handleCellDoubleClick = () => {
      if (!readonly) {
        setIsEditing(true);
      }
    };

    const handleCellChange = (
      row: string,
      col: string,
      newValue: string,
      isFormula = false
    ) => {
      if (readonly) return;

      const newData = { ...data };
      if (!newData[row]) newData[row] = {};

      newData[row][col] = {
        ...newData[row][col],
        value: isFormula ? evaluateFormula(newValue) : newValue,
        formula: isFormula ? newValue : undefined,
      };

      onChange?.(newData);
    };

    const evaluateFormula = (formula: string): string => {
      if (!formula.startsWith("=")) return formula;

      try {
        // Simple formula evaluation - can be expanded for more complex formulas
        const expression = formula
          .substring(1)
          .replace(/[A-Z]+[0-9]+/g, (match) => {
            const col = match.replace(/[0-9]/g, "");
            const row = match.replace(/[A-Z]/g, "");
            return data[row]?.[col]?.value || "0";
          });
        return eval(expression).toString();
      } catch (error) {
        return "#ERROR!";
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!selectedCell) return;

      const { row, col } = selectedCell;
      const rowIndex = parseInt(row) - 1;
      const colIndex = getColumnLabel(0)
        .split("")
        .reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;

      switch (e.key) {
        case "Enter":
          if (isEditing) {
            handleCellChange(
              row,
              col,
              editValue,
              editValue.startsWith("=")
            );
            setIsEditing(false);
          } else {
            setIsEditing(true);
          }
          e.preventDefault();
          break;

        case "Escape":
          if (isEditing) {
            setIsEditing(false);
            setEditValue(data[row]?.[col]?.value || "");
          }
          break;

        case "ArrowUp":
          if (rowIndex > 0) {
            handleCellClick(getRowLabel(rowIndex - 1), col);
          }
          e.preventDefault();
          break;

        case "ArrowDown":
          if (rowIndex < rows - 1) {
            handleCellClick(getRowLabel(rowIndex + 1), col);
          }
          e.preventDefault();
          break;

        case "ArrowLeft":
          if (colIndex > 0) {
            handleCellClick(row, getColumnLabel(colIndex - 1));
          }
          e.preventDefault();
          break;

        case "ArrowRight":
          if (colIndex < columns - 1) {
            handleCellClick(row, getColumnLabel(colIndex + 1));
          }
          e.preventDefault();
          break;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(spreadsheetVariants({ variant, size }), className)}
        {...props}
      >
        {showToolbar && (
          <div className="sticky top-0 z-10 flex items-center gap-2 p-2 border-b bg-background">
            {selectedCell && (
              <>
                <div className="px-2 py-1 bg-muted rounded text-sm">
                  {selectedCell.col}
                  {selectedCell.row}
                </div>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 px-2 py-1 bg-transparent border rounded"
                  placeholder="Enter value or formula (start with =)"
                />
              </>
            )}
          </div>
        )}

        <div className="relative">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-background">
              <tr>
                {showLineNumbers && (
                  <th className="border bg-muted w-12" />
                )}
                {Array.from({ length: columns }).map((_, i) => (
                  <th
                    key={i}
                    className="border bg-muted p-1 text-sm font-medium"
                    style={{ width: columnWidths[getColumnLabel(i)] }}
                  >
                    {getColumnLabel(i)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rows }).map((_, rowIndex) => {
                const rowLabel = getRowLabel(rowIndex);
                return (
                  <tr key={rowIndex}>
                    {showLineNumbers && (
                      <td className="border bg-muted p-1 text-sm text-center">
                        {rowLabel}
                      </td>
                    )}
                    {Array.from({ length: columns }).map((_, colIndex) => {
                      const colLabel = getColumnLabel(colIndex);
                      const cellData = data[rowLabel]?.[colLabel] || {
                        value: "",
                      };
                      const isSelected =
                        selectedCell?.row === rowLabel &&
                        selectedCell?.col === colLabel;

                      return (
                        <td
                          key={colIndex}
                          className={cn(
                            "border p-1 min-w-[100px]",
                            isSelected && "bg-accent",
                            cellData.readonly && "bg-muted/50"
                          )}
                          style={{
                            height: rowHeights[rowLabel],
                          }}
                          onClick={() =>
                            handleCellClick(rowLabel, colLabel)
                          }
                          onDoubleClick={handleCellDoubleClick}
                        >
                          {isSelected && isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) =>
                                setEditValue(e.target.value)
                              }
                              onKeyDown={handleKeyDown}
                              className="w-full bg-transparent outline-none"
                              autoFocus
                            />
                          ) : (
                            cellData.value
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

Spreadsheet.displayName = "Spreadsheet";

export { Spreadsheet, type SpreadsheetData, type CellData };
