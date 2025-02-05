import * as React from "react";
import { cn } from "../../../utils/cn";

interface TreeNode {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: TreeNode[];
  data?: any;
  [key: string]: any;
}

interface TreeProps {
  value: TreeNode[];
  selectionMode?: "single" | "multiple" | "checkbox" | "none";
  selectedKeys?: string[];
  expandedKeys?: string[];
  className?: string;
  nodeClassName?: string;
  contentClassName?: string;
  togglerClassName?: string;
  filter?: boolean;
  filterPlaceholder?: string;
  filterBy?: string;
  loading?: boolean;
  loadingIcon?: React.ReactNode;
  dragdrop?: boolean;
  onToggle?: (e: { node: TreeNode; expanded: boolean }) => void;
  onSelect?: (e: { node: TreeNode; selected: boolean }) => void;
  onSelectionChange?: (e: { keys: string[] }) => void;
  onExpand?: (e: { keys: string[] }) => void;
  onDragDrop?: (e: {
    dragNode: TreeNode;
    dropNode: TreeNode;
    position: "before" | "after" | "inside";
  }) => void;
  nodeTemplate?: (node: TreeNode) => React.ReactNode;
}

const Tree: React.FC<TreeProps> = ({
  value,
  selectionMode = "none",
  selectedKeys = [],
  expandedKeys = [],
  className,
  nodeClassName,
  contentClassName,
  togglerClassName,
  filter = false,
  filterPlaceholder = "Search...",
  filterBy = "label",
  loading = false,
  loadingIcon,
  dragdrop = false,
  onToggle,
  onSelect,
  onSelectionChange,
  onExpand,
  onDragDrop,
  nodeTemplate,
}) => {
  const [selected, setSelected] = React.useState<string[]>(selectedKeys);
  const [expanded, setExpanded] = React.useState<string[]>(expandedKeys);
  const [filterValue, setFilterValue] = React.useState("");
  const [dragNode, setDragNode] = React.useState<TreeNode | null>(null);
  const [dropPosition, setDropPosition] = React.useState<"before" | "after" | "inside" | null>(null);
  const [dropNode, setDropNode] = React.useState<TreeNode | null>(null);

  const findNodeByKey = (nodes: TreeNode[], key: string): TreeNode | null => {
    for (let node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const childResult = findNodeByKey(node.children, key);
        if (childResult) return childResult;
      }
    }
    return null;
  };

  const filterNode = (node: TreeNode, searchValue: string): boolean => {
    if (!searchValue) return true;

    const nodeValue = String(node[filterBy]).toLowerCase();
    const matches = nodeValue.includes(searchValue.toLowerCase());

    if (matches) return true;

    if (node.children) {
      return node.children.some((child) => filterNode(child, searchValue));
    }

    return false;
  };

  const toggleNode = (node: TreeNode) => {
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

  const selectNode = (node: TreeNode, event: React.MouseEvent) => {
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

  const onDragStart = (event: React.DragEvent, node: TreeNode) => {
    if (!dragdrop) return;
    setDragNode(node);
    event.dataTransfer.setData("text", node.key);
  };

  const onDragOver = (event: React.DragEvent, node: TreeNode) => {
    if (!dragdrop || !dragNode || node.key === dragNode.key) return;

    event.preventDefault();
    const mouseY = event.clientY;
    const element = event.currentTarget as HTMLElement;
    const rect = element.getBoundingClientRect();
    const gapHeight = rect.height / 4;

    if (mouseY < rect.top + gapHeight) {
      setDropPosition("before");
    } else if (mouseY > rect.bottom - gapHeight) {
      setDropPosition("after");
    } else {
      setDropPosition("inside");
    }

    setDropNode(node);
  };

  const onDragLeave = () => {
    setDropPosition(null);
    setDropNode(null);
  };

  const onDrop = (event: React.DragEvent) => {
    if (!dragdrop || !dragNode || !dropNode || !dropPosition) return;

    event.preventDefault();
    onDragDrop?.({
      dragNode,
      dropNode,
      position: dropPosition,
    });

    setDragNode(null);
    setDropNode(null);
    setDropPosition(null);
  };

  const renderToggler = (node: TreeNode) => {
    if (!node.children || node.children.length === 0) return null;

    const isExpanded = expanded.includes(node.key);

    return (
      <button
        type="button"
        onClick={() => toggleNode(node)}
        className={cn(
          "mr-2 flex h-6 w-6 items-center justify-center rounded-full hover:bg-gray-100",
          togglerClassName
        )}
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

  const renderCheckbox = (node: TreeNode) => {
    if (selectionMode !== "checkbox") return null;

    const isSelected = selected.includes(node.key);

    return (
      <div className="mr-2 flex items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => selectNode(node, {} as React.MouseEvent)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
      </div>
    );
  };

  const renderNode = (node: TreeNode) => {
    if (filter && !filterNode(node, filterValue)) return null;

    const isSelected = selected.includes(node.key);
    const isExpanded = expanded.includes(node.key);
    const isDragging = dragNode?.key === node.key;
    const isDropTarget = dropNode?.key === node.key;

    const content = nodeTemplate ? (
      nodeTemplate(node)
    ) : (
      <div className="flex items-center">
        {node.icon && <div className="mr-2">{node.icon}</div>}
        <span>{node.label}</span>
      </div>
    );

    return (
      <li key={node.key} className={cn("list-none", nodeClassName)}>
        <div
          className={cn(
            "flex items-center rounded-lg p-2",
            isSelected && "bg-primary/10",
            isDragging && "opacity-50",
            isDropTarget && dropPosition === "before" && "border-t-2 border-primary",
            isDropTarget && dropPosition === "after" && "border-b-2 border-primary",
            isDropTarget && dropPosition === "inside" && "border-2 border-primary",
            contentClassName
          )}
          onClick={(e) => selectNode(node, e)}
          draggable={dragdrop}
          onDragStart={(e) => onDragStart(e, node)}
          onDragOver={(e) => onDragOver(e, node)}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {renderToggler(node)}
          {renderCheckbox(node)}
          {content}
        </div>
        {node.children && node.children.length > 0 && isExpanded && (
          <ul className="ml-6 mt-1">
            {node.children.map((child) => renderNode(child))}
          </ul>
        )}
      </li>
    );
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
    <div className={className}>
      {filter && (
        <div className="mb-4">
          <input
            type="text"
            placeholder={filterPlaceholder}
            className="w-full rounded-lg border border-gray-300 px-4 py-2"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
      )}
      <ul className="space-y-1">
        {value.map((node) => renderNode(node))}
      </ul>
    </div>
  );
};

Tree.displayName = "Tree";

export { Tree, type TreeNode };
