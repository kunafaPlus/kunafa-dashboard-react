import * as React from "react";
import { cn } from "../../../utils/cn";
import "../../../styles/forced-colors.css";

interface Column<T> {
  field: keyof T | string;
  header: React.ReactNode;
  width?: number;
  sortable?: boolean;
  groupable?: boolean;
  cell?: (item: T) => React.ReactNode;
  aggregate?: (items: T[]) => React.ReactNode;
  className?: string;
  headerClassName?: string;
}

interface GroupDefinition<T> {
  field: keyof T;
  direction?: "asc" | "desc";
}

interface GroupDataGridProps<T> {
  data: T[];
  columns: Column<T>[];
  groupBy?: GroupDefinition<T>[];
  expandedGroups?: string[];
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  groupRowClassName?: string;
  onSort?: (field: keyof T, direction: "asc" | "desc") => void;
  onGroup?: (groups: GroupDefinition<T>[]) => void;
  onExpandGroup?: (groupKey: string, expanded: boolean) => void;
  onRowClick?: (item: T) => void;
}

function GroupDataGrid<T>({
  data,
  columns,
  groupBy = [],
  expandedGroups = [],
  className,
  tableClassName,
  headerClassName,
  rowClassName,
  cellClassName,
  groupRowClassName,
  onSort,
  onGroup,
  onExpandGroup,
  onRowClick,
}: GroupDataGridProps<T>) {
  const [sortField, setSortField] = React.useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");
  const [expanded, setExpanded] = React.useState<Set<string>>(
    new Set(expandedGroups)
  );

  // Group data based on groupBy fields
  const groupData = React.useMemo(() => {
    if (groupBy.length === 0) return { rows: data, groups: [] };

    const groups: {
      key: string;
      field: keyof T;
      value: any;
      items: T[];
      level: number;
    }[] = [];

    const processGroups = (
      items: T[],
      groupFields: GroupDefinition<T>[],
      level: number = 0,
      parentKey: string = ""
    ) => {
      if (groupFields.length === 0) return;

      const currentGroup = groupFields[0];
      const remainingGroups = groupFields.slice(1);
      const groupedItems = new Map<any, T[]>();

      // Group items by current field
      items.forEach((item) => {
        const value = item[currentGroup.field];
        if (!groupedItems.has(value)) {
          groupedItems.set(value, []);
        }
        groupedItems.get(value)!.push(item);
      });

      // Sort groups if direction is specified
      const sortedEntries = Array.from(groupedItems.entries()).sort(([a], [b]) => {
        if (currentGroup.direction === "desc") {
          return b < a ? -1 : b > a ? 1 : 0;
        }
        return a < b ? -1 : a > b ? 1 : 0;
      });

      // Create group objects and process subgroups
      sortedEntries.forEach(([value, groupItems], index) => {
        const groupKey = parentKey
          ? `${parentKey}_${String(value)}_${index}`
          : `${String(value)}_${index}`;

        groups.push({
          key: groupKey,
          field: currentGroup.field,
          value,
          items: groupItems,
          level,
        });

        if (remainingGroups.length > 0) {
          processGroups(groupItems, remainingGroups, level + 1, groupKey);
        }
      });
    };

    processGroups(data, groupBy);
    return { rows: data, groups };
  }, [data, groupBy]);

  // Handle sort
  const handleSort = (field: keyof T) => {
    if (!onSort) return;

    const newDirection =
      field === sortField && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    onSort(field, newDirection);
  };

  // Handle group expand/collapse
  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpanded(newExpanded);
    onExpandGroup?.(groupKey, !expanded.has(groupKey));
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
        onClick={() => column.sortable && handleSort(column.field as keyof T)}
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

  // Render group row
  const renderGroupRow = (group: {
    key: string;
    field: keyof T;
    value: any;
    items: T[];
    level: number;
  }) => {
    const isExpanded = expanded.has(group.key);

    return (
      <tr
        key={group.key}
        className={cn(
          "group cursor-pointer hover:bg-gray-50",
          groupRowClassName
        )}
        onClick={() => toggleGroup(group.key)}
      >
        <td
          colSpan={columns.length}
          className="border-b border-gray-200 p-4"
          style={{ paddingLeft: `${group.level * 2 + 1}rem` }}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={cn(
                "mr-2 h-4 w-4 transition-transform",
                isExpanded && "rotate-90"
              )}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">
              {String(group.field)}: {String(group.value)}
            </span>
            <span className="ml-2 text-gray-500">
              ({group.items.length} items)
            </span>
          </div>
        </td>
      </tr>
    );
  };

  // Render data row
  const renderDataRow = (item: T, index: number) => {
    return (
      <tr
        key={`${JSON.stringify(item)}_${index}`}
        className={cn(
          "cursor-pointer border-b border-gray-200 hover:bg-gray-50",
          rowClassName
        )}
        onClick={() => onRowClick?.(item)}
      >
        {columns.map((column, colIndex) => (
          <td
            key={`${index}_${colIndex}`}
            className={cn("p-4", column.className, cellClassName)}
            style={{ width: column.width }}
          >
            {column.cell ? column.cell(item) : String(item[column.field])}
          </td>
        ))}
      </tr>
    );
  };

  // Render rows recursively
  const renderRows = () => {
    const rows: React.ReactNode[] = [];

    if (groupData.groups.length === 0) {
      return data.map((item, index) => renderDataRow(item, index));
    }

    const renderGroupRows = (
      groups: typeof groupData.groups,
      parentKey: string = ""
    ) => {
      groups.forEach((group) => {
        if (!parentKey || expanded.has(parentKey)) {
          rows.push(renderGroupRow(group));

          if (expanded.has(group.key)) {
            if (groupBy.length === group.level + 1) {
              group.items.forEach((item, index) => {
                rows.push(renderDataRow(item, index));
              });
            } else {
              renderGroupRows(
                groupData.groups.filter(
                  (g) => g.level === group.level + 1 && g.key.startsWith(group.key)
                ),
                group.key
              );
            }
          }
        }
      });
    };

    renderGroupRows(groupData.groups.filter((g) => g.level === 0));
    return rows;
  };

  return (
    <div className={cn("overflow-auto", className)}>
      <table className={cn("min-w-full divide-y divide-gray-200", tableClassName)}>
        <thead>
          <tr>{columns.map((column, index) => renderHeaderCell(column, index))}</tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}

GroupDataGrid.displayName = "GroupDataGrid";

export { GroupDataGrid, type Column, type GroupDefinition };