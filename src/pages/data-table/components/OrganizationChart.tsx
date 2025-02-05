import * as React from "react";
import { cn } from "../../../utils/cn";

interface OrgChartNode {
  key: string;
  label: string;
  type?: string;
  className?: string;
  style?: React.CSSProperties;
  expanded?: boolean;
  data?: any;
  children?: OrgChartNode[];
  [key: string]: any;
}

interface OrganizationChartProps {
  value: OrgChartNode;
  selectionMode?: "single" | "multiple";
  selection?: OrgChartNode[];
  className?: string;
  nodeClassName?: string;
  nodeTemplate?: (node: OrgChartNode) => React.ReactNode;
  onSelectionChange?: (selection: OrgChartNode[]) => void;
  onNodeClick?: (node: OrgChartNode) => void;
  onExpand?: (node: OrgChartNode) => void;
  onCollapse?: (node: OrgChartNode) => void;
}

const OrganizationChart: React.FC<OrganizationChartProps> = ({
  value,
  selectionMode,
  selection = [],
  className,
  nodeClassName,
  nodeTemplate,
  onSelectionChange,
  onNodeClick,
  onExpand,
  onCollapse,
}) => {
  const [selectedNodes, setSelectedNodes] = React.useState<OrgChartNode[]>(selection);
  const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(new Set());

  const isSelected = (node: OrgChartNode) => {
    return selectedNodes.some((n) => n.key === node.key);
  };

  const isExpanded = (node: OrgChartNode) => {
    return expandedNodes.has(node.key);
  };

  const onSelect = (node: OrgChartNode, event: React.MouseEvent) => {
    if (!selectionMode) return;

    let newSelection: OrgChartNode[];

    if (selectionMode === "single") {
      newSelection = isSelected(node) ? [] : [node];
    } else {
      newSelection = [...selectedNodes];
      const index = newSelection.findIndex((n) => n.key === node.key);

      if (index >= 0) {
        newSelection.splice(index, 1);
      } else {
        newSelection.push(node);
      }
    }

    setSelectedNodes(newSelection);
    onSelectionChange?.(newSelection);
  };

  const toggleExpand = (node: OrgChartNode, event: React.MouseEvent) => {
    event.stopPropagation();

    const newExpanded = new Set(expandedNodes);
    if (isExpanded(node)) {
      newExpanded.delete(node.key);
      onCollapse?.(node);
    } else {
      newExpanded.add(node.key);
      onExpand?.(node);
    }
    setExpandedNodes(newExpanded);
  };

  const renderToggler = (node: OrgChartNode) => {
    if (!node.children || node.children.length === 0) return null;

    return (
      <button
        type="button"
        onClick={(e) => toggleExpand(node, e)}
        className="absolute -bottom-3 left-1/2 z-10 flex h-6 w-6 -translate-x-1/2 transform items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={cn("h-4 w-4 transition-transform", isExpanded(node) && "rotate-180")}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  };

  const renderDefaultTemplate = (node: OrgChartNode) => {
    return (
      <div className="flex flex-col items-center p-4">
        {node.type && (
          <span className="mb-1 text-xs font-medium text-gray-500">{node.type}</span>
        )}
        <span className="text-sm font-medium">{node.label}</span>
      </div>
    );
  };

  const renderNode = (node: OrgChartNode) => {
    const hasChildren = node.children && node.children.length > 0;
    const expanded = isExpanded(node);
    const selected = isSelected(node);

    return (
      <div className="flex flex-col items-center">
        <div className="relative">
          <div
            className={cn(
              "relative min-w-[200px] rounded-lg border bg-white shadow-sm transition-colors",
              selected && "border-primary",
              !selected && "border-gray-200 hover:border-gray-300",
              node.className,
              nodeClassName
            )}
            style={node.style}
            onClick={(e) => {
              onSelect(node, e);
              onNodeClick?.(node);
            }}
          >
            {nodeTemplate ? nodeTemplate(node) : renderDefaultTemplate(node)}
            {hasChildren && renderToggler(node)}
          </div>
        </div>

        {hasChildren && expanded && (
          <div className="mt-8">
            <div
              className={cn(
                "relative flex justify-center gap-4",
                "before:absolute before:left-1/2 before:top-[-1rem] before:h-4 before:w-px before:bg-gray-300",
                "after:absolute after:left-[calc(25%-0.5px)] after:right-[calc(25%-0.5px)] after:top-[-1rem] after:h-px after:bg-gray-300"
              )}
            >
              {node.children.map((child) => (
                <div
                  key={child.key}
                  className="relative before:absolute before:left-1/2 before:top-[-1rem] before:h-4 before:w-px before:bg-gray-300"
                >
                  {renderNode(child)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn("flex justify-center overflow-auto p-4", className)}>
      {renderNode(value)}
    </div>
  );
};

OrganizationChart.displayName = "OrganizationChart";

export { OrganizationChart, type OrgChartNode };
