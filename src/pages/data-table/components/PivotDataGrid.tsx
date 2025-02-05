import * as React from "react";
import { cn } from "../../../utils/cn";

interface PivotField {
  field: string;
  header: string;
  aggregator?: "sum" | "avg" | "count" | "min" | "max" | "custom";
  customAggregator?: (values: any[]) => any;
  formatter?: (value: any) => string;
}

interface PivotDataGridProps {
  data: Record<string, any>[];
  rows: PivotField[];
  columns: PivotField[];
  values: PivotField[];
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  cellClassName?: string;
  loading?: boolean;
  loadingTemplate?: React.ReactNode;
}

function PivotDataGrid({
  data,
  rows,
  columns,
  values,
  className,
  tableClassName,
  headerClassName,
  cellClassName,
  loading = false,
  loadingTemplate,
}: PivotDataGridProps) {
  // Calculate unique values for each field
  const getUniqueValues = (field: string) => {
    const uniqueSet = new Set<any>();
    data.forEach((item) => uniqueSet.add(item[field]));
    return Array.from(uniqueSet).sort();
  };

  // Get row headers
  const rowHeaders = React.useMemo(() => {
    const generateCombinations = (
      fields: PivotField[],
      current: any[] = [],
      index = 0
    ): any[][] => {
      if (index === fields.length) {
        return [current];
      }

      const field = fields[index];
      const uniqueValues = getUniqueValues(field.field);
      return uniqueValues.flatMap((value) =>
        generateCombinations(fields, [...current, value], index + 1)
      );
    };

    return generateCombinations(rows);
  }, [data, rows]);

  // Get column headers
  const columnHeaders = React.useMemo(() => {
    const generateCombinations = (
      fields: PivotField[],
      current: any[] = [],
      index = 0
    ): any[][] => {
      if (index === fields.length) {
        return [current];
      }

      const field = fields[index];
      const uniqueValues = getUniqueValues(field.field);
      return uniqueValues.flatMap((value) =>
        generateCombinations(fields, [...current, value], index + 1)
      );
    };

    return generateCombinations(columns);
  }, [data, columns]);

  // Aggregate values
  const aggregate = (
    field: PivotField,
    values: any[]
  ): any => {
    if (!values || values.length === 0) return null;

    const numericValues = values.map(v => Number(v)).filter(v => !isNaN(v));
    
    switch (field.aggregator) {
      case "sum":
        return numericValues.length > 0 ? numericValues.reduce((a, b) => a + b, 0) : null;
      case "avg":
        return numericValues.length > 0 ? numericValues.reduce((a, b) => a + b, 0) / numericValues.length : null;
      case "count":
        return values.length;
      case "min":
        return numericValues.length > 0 ? Math.min(...numericValues) : null;
      case "max":
        return numericValues.length > 0 ? Math.max(...numericValues) : null;
      case "custom":
        return field.customAggregator?.(values) ?? null;
      default:
        return values[0] ?? null;
    }
  };

  // Get cell value
  const getCellValue = (rowValues: any[], colValues: any[], valueField: PivotField) => {
    const filteredData = data.filter((item) => {
      return (
        rows.every((row, index) => item[row.field] === rowValues[index]) &&
        columns.every((col, index) => item[col.field] === colValues[index])
      );
    });

    const values = filteredData.map((item) => item[valueField.field]);
    const aggregatedValue = aggregate(valueField, values);
    
    return valueField.formatter
      ? valueField.formatter(aggregatedValue)
      : String(aggregatedValue ?? "");
  };

  // Render column headers
  const renderColumnHeaders = () => {
    const headerRows: React.ReactNode[] = [];
    const depth = columns.length;

    for (let level = 0; level < depth; level++) {
      const headerCells: React.ReactNode[] = [];
      let currentGroup = "";
      let colspan = 1;
      let currentGroupStartIndex = 0;

      columnHeaders.forEach((header, index) => {
        const value = header[level];
        if (value === currentGroup) {
          colspan++;
        } else {
          if (currentGroup) {
            headerCells.push(
              <th
                key={`${level}-${currentGroupStartIndex}-${currentGroup}-${colspan}`}
                colSpan={colspan}
                className={cn(
                  "border-b border-gray-200 bg-gray-50 p-4 text-left",
                  headerClassName
                )}
              >
                {currentGroup}
              </th>
            );
          }
          currentGroup = value;
          colspan = 1;
          currentGroupStartIndex = index;
        }
      });

      if (currentGroup) {
        headerCells.push(
          <th
            key={`${level}-${currentGroupStartIndex}-${currentGroup}-${colspan}`}
            colSpan={colspan}
            className={cn(
              "border-b border-gray-200 bg-gray-50 p-4 text-left",
              headerClassName
            )}
          >
            {currentGroup}
          </th>
        );
      }

      headerRows.push(
        <tr key={`header-${level}`} className="group">
          {level === 0 && rows.length > 0 && (
            <th
              key="corner"
              rowSpan={depth}
              colSpan={rows.length}
              className={cn(
                "border-b border-gray-200 bg-gray-50 p-4 text-left",
                headerClassName
              )}
            />
          )}
          {headerCells}
        </tr>
      );
    }

    return headerRows;
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
      <table className={cn("min-w-full border-collapse", tableClassName)}>
        <thead>{renderColumnHeaders()}</thead>
        <tbody>
          {rowHeaders.map((rowHeader, rowIndex) => (
            <tr key={rowIndex}>
              {rowHeader.map((value, index) => (
                <th
                  key={index}
                  className={cn(
                    "border-b border-gray-200 bg-gray-50 p-4",
                    headerClassName
                  )}
                >
                  {value}
                </th>
              ))}
              {columnHeaders.map((colHeader, colIndex) => (
                <td
                  key={colIndex}
                  className={cn("border-b border-gray-200 p-4", cellClassName)}
                >
                  {values.map((valueField, valueIndex) => (
                    <div key={valueIndex}>
                      {getCellValue(rowHeader, colHeader, valueField)}
                    </div>
                  ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

PivotDataGrid.displayName = "PivotDataGrid";

export { PivotDataGrid, type PivotField };
