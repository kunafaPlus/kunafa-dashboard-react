import * as React from "react";
import { cn } from "../../../utils/cn";

interface Cell {
  value: string;
  formula?: string;
  format?: string;
  style?: React.CSSProperties;
}

interface SpreadsheetGridProps {
  data: Cell[][];
  columns?: number;
  rows?: number;
  className?: string;
  cellClassName?: string;
  headerClassName?: string;
  selectedCellClassName?: string;
  onChange?: (data: Cell[][]) => void;
  onCellChange?: (row: number, col: number, cell: Cell) => void;
}

function SpreadsheetGrid({
  data: initialData,
  columns = 26,
  rows = 100,
  className,
  cellClassName,
  headerClassName,
  selectedCellClassName,
  onChange,
  onCellChange,
}: SpreadsheetGridProps) {
  const [data, setData] = React.useState<Cell[][]>(() => {
    // Ensure initialData has proper dimensions
    const newData = [...(initialData || [])];
    while (newData.length < rows) {
      newData.push([]);
    }
    
    // Fill each row with empty cells if needed
    return newData.map(row => {
      const newRow = [...row];
      while (newRow.length < columns) {
        newRow.push({ value: '', style: {} });
      }
      return newRow;
    });
  });
  const [selectedCell, setSelectedCell] = React.useState<{
    row: number;
    col: number;
  } | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [clipboard, setClipboard] = React.useState<Cell[][]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Convert column index to letter (0 = A, 1 = B, etc.)
  const getColumnLabel = (index: number): string => {
    let label = "";
    while (index >= 0) {
      label = String.fromCharCode((index % 26) + 65) + label;
      index = Math.floor(index / 26) - 1;
    }
    return label;
  };

  // Evaluate formula
  const evaluateFormula = (formula: string, row: number, col: number): string => {
    try {
      // Remove the leading =
      const expression = formula.substring(1);

      // Replace cell references (e.g., A1) with their values
      const evaluatedExpression = expression.replace(
        /([A-Z]+)(\d+)/g,
        (match, colRef, rowRef) => {
          const refCol = colRef.split("").reduce(
            (acc, char) => acc * 26 + char.charCodeAt(0) - 65,
            0
          );
          const refRow = parseInt(rowRef) - 1;
          return data[refRow][refCol].value;
        }
      );

      // Evaluate the expression
      // Note: In a real implementation, you'd want to use a proper formula parser
      // that handles more Excel-like functions and ensures security
      return String(eval(evaluatedExpression));
    } catch (error) {
      return "#ERROR!";
    }
  };

  // Handle cell change
  const handleCellChange = (
    row: number,
    col: number,
    value: string,
    isFormula = false
  ) => {
    const newData = data.map((r) => [...r]);
    const cell: Cell = {
      value: isFormula ? evaluateFormula(value, row, col) : value,
      formula: isFormula ? value : undefined,
    };
    newData[row][col] = cell;
    setData(newData);
    onChange?.(newData);
    onCellChange?.(row, col, cell);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (!selectedCell) return;

    const { row, col } = selectedCell;

    switch (e.key) {
      case "Enter":
        if (editValue.startsWith("=")) {
          handleCellChange(row, col, editValue, true);
        } else {
          handleCellChange(row, col, editValue);
        }
        setEditValue("");
        setSelectedCell({ row: row + 1, col });
        break;

      case "Tab":
        e.preventDefault();
        if (editValue.startsWith("=")) {
          handleCellChange(row, col, editValue, true);
        } else {
          handleCellChange(row, col, editValue);
        }
        setEditValue("");
        setSelectedCell({ row, col: col + 1 });
        break;

      case "Escape":
        setEditValue("");
        setSelectedCell(null);
        break;

      case "ArrowUp":
        if (row > 0) setSelectedCell({ row: row - 1, col });
        break;

      case "ArrowDown":
        if (row < rows - 1) setSelectedCell({ row: row + 1, col });
        break;

      case "ArrowLeft":
        if (col > 0) setSelectedCell({ row, col: col - 1 });
        break;

      case "ArrowRight":
        if (col < columns - 1) setSelectedCell({ row, col: col + 1 });
        break;
    }
  };

  // Handle copy
  const handleCopy = (e: React.ClipboardEvent) => {
    if (!selectedCell) return;

    const cell = data[selectedCell.row][selectedCell.col];
    e.clipboardData.setData("text/plain", cell.formula || cell.value);
    setClipboard([[cell]]);
    e.preventDefault();
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    if (!selectedCell) return;

    const pasteData = e.clipboardData.getData("text/plain");
    const rows = pasteData.split("\n");
    const newData = data.map((r) => [...r]);

    rows.forEach((row, rowIndex) => {
      const cells = row.split("\t");
      cells.forEach((cell, colIndex) => {
        const targetRow = selectedCell.row + rowIndex;
        const targetCol = selectedCell.col + colIndex;

        if (targetRow < data.length && targetCol < data[0].length) {
          if (cell.startsWith("=")) {
            handleCellChange(targetRow, targetCol, cell, true);
          } else {
            handleCellChange(targetRow, targetCol, cell);
          }
        }
      });
    });

    e.preventDefault();
  };

  // Handle cut
  const handleCut = (e: React.ClipboardEvent) => {
    handleCopy(e);
    if (!selectedCell) return;

    const newData = data.map((r) => [...r]);
    newData[selectedCell.row][selectedCell.col] = { value: "" };
    setData(newData);
    onChange?.(newData);
  };

  // Render cell
  const renderCell = (row: number, col: number) => {
    // Ensure cell exists with default values
    const cell = data[row]?.[col] || { value: '', style: {} };
    const isSelected =
      selectedCell?.row === row && selectedCell?.col === col;

    return (
      <td
        key={`${row}-${col}`}
        className={cn(
          "min-w-[100px] border border-gray-200 p-2",
          isSelected && selectedCellClassName,
          cellClassName
        )}
        onClick={() => {
          setSelectedCell({ row, col });
          setEditValue(cell.formula || cell.value);
        }}
        style={cell.style || {}}
      >
        {isSelected ? (
          <input
            ref={inputRef}
            type="text"
            className="w-full border-none p-0 focus:outline-none focus:ring-0"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onCopy={handleCopy}
            onPaste={handlePaste}
            onCut={handleCut}
            autoFocus
          />
        ) : (
          cell.value
        )}
      </td>
    );
  };

  return (
    <div className={cn("overflow-auto", className)}>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className={cn("border border-gray-200 p-2", headerClassName)}>
              
            </th>
            {Array(columns)
              .fill(0)
              .map((_, index) => (
                <th
                  key={index}
                  className={cn("border border-gray-200 p-2", headerClassName)}
                >
                  {getColumnLabel(index)}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {Array(rows)
            .fill(0)
            .map((_, row) => (
              <tr key={row}>
                <td
                  className={cn("border border-gray-200 p-2", headerClassName)}
                >
                  {row + 1}
                </td>
                {Array(columns)
                  .fill(0)
                  .map((_, col) => renderCell(row, col))}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

SpreadsheetGrid.displayName = "SpreadsheetGrid";

export { SpreadsheetGrid, type Cell };
