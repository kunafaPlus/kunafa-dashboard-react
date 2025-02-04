import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '../../../utils/cn';
import { MatrixInputProps } from '../utils/type';

export const matrixInputVariants = cva(
  'w-full',

  {
    variants: {
      variant: {
        default: '[&_input]:border [&_input]:rounded-md',
        filled: '[&_input]:bg-muted [&_input]:border-b',
        ghost: '[&_input]:bg-transparent [&_input]:border-b',
      },
      size: {
        sm: '[&_input]:text-sm [&_input]:p-1',
        md: '[&_input]:text-base [&_input]:p-2',
        lg: '[&_input]:text-lg [&_input]:p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

type Matrix = number[][];

const MatrixInput = React.forwardRef<HTMLDivElement, MatrixInputProps>(
  (
    {
      className,
      variant,
      size,
      value = [[0]],
      onChange,
      rows = 3,
      columns = 3,
      minValue = -Infinity,
      maxValue = Infinity,
      step = 1,
      precision = 0,
      disabled = false,
      error,
      hint,
      showRowNumbers = true,
      showColumnNumbers = true,
      validateMatrix = () => true,
      onInvalidMatrix,
      formatValue = (v: any) => v.toFixed(precision),
      parseValue = (v: any) => parseFloat(v),
      label,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const [focusedCell, setFocusedCell] = React.useState<{
      row: number;
      col: number;
    } | null>(null);

    React.useImperativeHandle(ref, () => containerRef.current!);

    // Ensure matrix has correct dimensions
    React.useEffect(() => {
      const newMatrix = [...value];
      let changed = false;

      // Adjust rows
      while (newMatrix.length < rows) {
        newMatrix.push(new Array(columns).fill(0));
        changed = true;
      }
      while (newMatrix.length > rows) {
        newMatrix.pop();
        changed = true;
      }

      // Adjust columns
      for (let i = 0; i < newMatrix.length; i++) {
        while (newMatrix[i].length < columns) {
          newMatrix[i].push(0);
          changed = true;
        }
        while (newMatrix[i].length > columns) {
          newMatrix[i].pop();
          changed = true;
        }
      }

      if (changed) {
        onChange?.(newMatrix);
      }
    }, [rows, columns]);

    const handleCellChange = (rowIndex: number, colIndex: number, inputValue: string) => {
      if (disabled) return;

      let newValue = parseValue(inputValue);

      // Handle invalid input
      if (isNaN(newValue)) return;

      // Clamp value to min/max
      newValue = Math.min(Math.max(newValue, minValue), maxValue);

      const newMatrix = value.map((row: any, r: number) =>
        row.map((cell: number, c: number) => (r === rowIndex && c === colIndex ? newValue : cell))
      );

      if (validateMatrix(newMatrix)) {
        onChange?.(newMatrix);
      } else {
        onInvalidMatrix?.(newMatrix);
      }
    };

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      rowIndex: number,
      colIndex: number
    ) => {
      if (disabled) return;

      let nextRow = rowIndex;
      let nextCol = colIndex;

      switch (e.key) {
        case 'ArrowUp':
          nextRow = Math.max(0, rowIndex - 1);
          break;
        case 'ArrowDown':
          nextRow = Math.min(rows - 1, rowIndex + 1);
          break;
        case 'ArrowLeft':
          if (e.currentTarget.selectionStart === 0) {
            nextCol = Math.max(0, colIndex - 1);
          }
          break;
        case 'ArrowRight':
          if (e.currentTarget.selectionStart === e.currentTarget.value.length) {
            nextCol = Math.min(columns - 1, colIndex + 1);
          }
          break;
        case 'Enter':
          nextRow = (rowIndex + 1) % rows;
          nextCol = nextRow === 0 ? (colIndex + 1) % columns : colIndex;
          break;
        case 'Tab':
          if (e.shiftKey) {
            nextCol = colIndex - 1;
            if (nextCol < 0) {
              nextCol = columns - 1;
              nextRow = Math.max(0, rowIndex - 1);
            }
          } else {
            nextCol = colIndex + 1;
            if (nextCol >= columns) {
              nextCol = 0;
              nextRow = Math.min(rows - 1, rowIndex + 1);
            }
          }
          break;
        default:
          return;
      }

      if (nextRow !== rowIndex || nextCol !== colIndex) {
        e.preventDefault();
        const nextInput = document.querySelector(
          `[data-row="${nextRow}"][data-col="${nextCol}"]`
        ) as HTMLInputElement;
        nextInput.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      e.preventDefault();
      const text = e.clipboardData.getData('text') || ''; // Use clipboardData instead of clipboardText
      const pastedRows = text
        .trim()
        .split('\n')
        .map((row: string) =>
          row
            .trim()
            .split(/[\s,\t]+/)
            .map((cell) => {
              const value = parseValue(cell);
              return isNaN(value) ? 0 : Math.min(Math.max(value, minValue), maxValue);
            })
        );

      if (!focusedCell) return;

      const newMatrix = [...value];
      for (let i = 0; i < Math.min(rows - focusedCell.row, pastedRows.length); i++) {
        for (let j = 0; j < Math.min(columns - focusedCell.col, pastedRows[i].length); j++) {
          newMatrix[focusedCell.row + i][focusedCell.col + j] = pastedRows[i][j];
        }
      }

      if (validateMatrix(newMatrix)) {
        onChange?.(newMatrix);
      } else {
        onInvalidMatrix?.(newMatrix);
      }
    };
    // إنشاء مصفوفة افتراضية
    const defaultMatrix = React.useMemo(
      () =>
        Array(rows)
          .fill(0)
          .map(() => Array(columns).fill(0)),
      [rows, columns]
    );

    // استخدام المصفوفة الافتراضية إذا لم يتم توفير قيمة
    const matrix = value || defaultMatrix;

    return (
      <div
        ref={containerRef}
        className={cn(matrixInputVariants({ variant, size } as {}), className)}
      >
        {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
        <div className="inline-block">
          <div className="flex">
            {/* Column numbers */}
            {showColumnNumbers && (
              <div className="w-8" /> // Space for row numbers
            )}
            {showColumnNumbers &&
              Array.from({ length: columns }, (_, i) => (
                <div key={i} className="flex-1 text-center text-sm text-muted-foreground">
                  {i + 1}
                </div>
              ))}
          </div>

          {matrix.map((row: any, rowIndex: number) => (
            <div key={rowIndex} className="flex items-center">
              {/* Row numbers */}
              {showRowNumbers && (
                <div className="w-8 text-sm text-muted-foreground text-right pr-2">
                  {rowIndex + 1}
                </div>
              )}

              {row.map((cell: any, colIndex: number) => (
                <div key={colIndex} className="p-0.5">
                  <input
                    type="number"
                    value={formatValue(cell)}
                    onChange={(e) => { handleCellChange(rowIndex, colIndex, e.target.value); }}
                    onKeyDown={(e) => { handleKeyDown(e, rowIndex, colIndex); }}
                    onFocus={() => { setFocusedCell({ row: rowIndex, col: colIndex }); }}
                    onBlur={() => { setFocusedCell(null); }}
                    onPaste={handlePaste}
                    step={step}
                    disabled={disabled}
                    className={cn(
                      'w-16 text-center bg-transparent transition-colors outline-input-focus border-input-border disabled:opacity-50 disabled:cursor-not-allowed',
                      error && 'border-destructive focus:ring-destructive'
                    )}
                    data-row={rowIndex}
                    data-col={colIndex}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {(error || hint) && (
          <div className={cn('mt-1 text-sm', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || hint}
          </div>
        )}
      </div>
    );
  }
);

MatrixInput.displayName = 'MatrixInput';

export { MatrixInput, type Matrix };
