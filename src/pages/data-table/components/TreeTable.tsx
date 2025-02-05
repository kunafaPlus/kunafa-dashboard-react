import * as React from "react";
import { cn } from "../../../utils/cn";

interface TreeTableNode {
  key: string;
  data: Record<string, any>;
  children?: TreeTableNode[];
  [key: string]: any;
}

interface TreeTableColumn {
  field: string;
  header: React.ReactNode;
  body?: (node: TreeTableNode) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
}

interface TreeTableProps {
  value: TreeTableNode[];
  columns: TreeTableColumn[];
  selectionMode?: "single" | "multiple" | "checkbox" | "none";
  selectedKeys?: string[];
  expandedKeys?: string[];
  className?: string;
  tableClassName?: string;
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  onToggle?: (e: { node: TreeTableNode; expanded: boolean }) => void;
  onSelect?: (e: { node: TreeTableNode; selected: boolean }) => void;
  onSelectionChange?: (e: { keys: string[] }) => void;
  onExpand?: (e: { keys: string[] }) => void;
  onSort?: (e: { field: string; order: "asc" | "desc" }) => void;
}

const TreeTable: React.FC<TreeTableProps> = ({
  value,
  columns,
  selectionMode = "none",
  selectedKeys = [],
  expandedKeys = [],
  className,
  tableClassName,
  headerClassName,
  bodyClassName,
  rowClassName,
  cellClassName,
  loading = false,
  loadingIcon,
  onToggle,
  onSelect,
  onSelectionChange,
  onExpand,
  onSort,
}) => {
  const [selected, setSelected] = React.useState<string[]>(selectedKeys);
  const [expanded, setExpanded] = React.useState<string[]>(expandedKeys);
  const [sortField, setSortField] = React.useState<string>("");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");

  const toggleNode = (node: TreeTableNode) => {
    const index = expanded.indexOf(node.key);
    let newExpanded = [...expanded];

    if (index >= 0) {
      newExpanded.splice(index, 1);
    } else {
      newExpanded.push(node.key);
    }

    setExpanded(newExpanded);
    onExpand?.({ keys: newExpanded });
    onToggle?.({ node, expanded: index < 0 });
  };

  const selectNode = (node: TreeTableNode, event: React.MouseEvent) => {
    if (selectionMode === "none") return;

    let newSelected = [...selected];
    const index = newSelected.indexOf(node.key);

    if (selectionMode === "single") {
      newSelected = index >= 0 ? [] : [node.key];
    } else if (selectionMode === "multiple" || selectionMode === "checkbox") {
      if (index >= 0) {
        newSelected.splice(index, 1);
      } else {
        newSelected.push(node.key);
      }
    }

    setSelected(newSelected);
    onSelectionChange?.({ keys: newSelected });
    onSelect?.({ node, selected: index < 0 });
  };

  const onColumnSort = (field: string) => {
    let order: "asc" | "desc" = "asc";
    if (field === sortField) {
      order = sortOrder === "asc" ? "desc" : "asc";
    }

    setSortField(field);
    setSortOrder(order);
    onSort?.({ field, order });
  };

  const renderToggler = (node: TreeTableNode, level: number) => {
    if (!node.children || node.children.length === 0) {
      return <span style={{ marginLeft: level * 1.5 + "rem" }}></span>;
    }

    const isExpanded = expanded.includes(node.key);

    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggleNode(node);
        }}
        className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100"
        style={{ marginLeft: level * 1.5 + "rem" }}
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

  const renderCheckbox = (node: TreeTableNode) => {
    if (selectionMode !== "checkbox") return null;

    const isSelected = selected.includes(node.key);

    return (
      <div className="mr-2 inline-flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => selectNode(node, {} as React.MouseEvent)}
          onClick={(e) => e.stopPropagation()}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
      </div>
    );
  };

  const renderSortIcon = (column: TreeTableColumn) => {
    if (!column.sortable) return null;

    const isSorted = sortField === column.field;
    const isAsc = sortOrder === "asc";

    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "ml-1 h-4 w-4",
          !isSorted && "text-gray-400",
          isSorted && isAsc && "text-primary",
          isSorted && !isAsc && "rotate-180 text-primary"
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
    );
  };

  const renderHeaderCell = (column: TreeTableColumn, index: number) => {
    return (
      <th
        key={index}
        className={cn(
          "border-b border-gray-200 bg-gray-50 p-4 text-left text-sm font-medium text-gray-900",
          column.sortable && "cursor-pointer hover:bg-gray-100",
          column.headerClassName,
          headerClassName
        )}
        style={column.headerStyle}
        onClick={() => column.sortable && onColumnSort(column.field)}
      >
        <div className="flex items-center">
          {column.header}
          {renderSortIcon(column)}
        </div>
      </th>
    );
  };

  const renderCell = (
    node: TreeTableNode,
    column: TreeTableColumn,
    index: number,
    level: number
  ) => {
    const content = column.body
      ? column.body(node)
      : node.data[column.field];

    return (
      <td
        key={index}
        className={cn("border-b border-gray-200 p-4", column.className, cellClassName)}
        style={column.style}
      >
        {index === 0 && (
          <>
            {renderToggler(node, level)}
            {renderCheckbox(node)}
          </>
        )}
        {content}
      </td>
    );
  };

  const renderRow = (node: TreeTableNode, level: number = 0) => {
    const isSelected = selected.includes(node.key);
    const isExpanded = expanded.includes(node.key);

    const rows = [
      <tr
        key={node.key}
        className={cn(
          "transition-colors hover:bg-gray-50",
          isSelected && "bg-primary/10",
          rowClassName
        )}
        onClick={(e) => selectNode(node, e)}
      >
        {columns.map((column, index) =>
          renderCell(node, column, index, level)
        )}
      </tr>,
    ];

    if (node.children && node.children.length > 0 && isExpanded) {
      node.children.forEach((child) => {
        rows.push(...renderRow(child, level + 1));
      });
    }

    return rows;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        {loadingIcon || (
          <svg
            className="h-8 w-8 animate-spin text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </div>
    );
  }

  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className={cn("min-w-full divide-y divide-gray-200", tableClassName)}>
        <thead>
          <tr>
            {columns.map((column, index) => renderHeaderCell(column, index))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {value.map((node) => renderRow(node))}
        </tbody>
      </table>
    </div>
  );
};

TreeTable.displayName = "TreeTable";

export { TreeTable, type TreeTableNode, type TreeTableColumn };
