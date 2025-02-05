import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from '../../../utils/cn'

const treeViewVariants = cva(
  "w-full overflow-auto",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border rounded-md p-2",
        ghost: "bg-background/50",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface TreeNode {
  id: string;
  label: React.ReactNode;
  children?: TreeNode[];
  icon?: React.ReactNode;
}

interface TreeViewProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof treeViewVariants> {
  data: TreeNode[];
  defaultExpanded?: string[];
  onNodeSelect?: (nodeId: string) => void;
  selectedNode?: string;
  expandOnSelect?: boolean;
}

const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  ({
    className,
    variant,
    size,
    data,
    defaultExpanded = [],
    onNodeSelect,
    selectedNode,
    expandOnSelect = false,
    ...props
  }, ref) => {
    const [expandedNodes, setExpandedNodes] = React.useState<Set<string>>(
      new Set(defaultExpanded)
    );

    const toggleNode = (nodeId: string) => {
      const newExpanded = new Set(expandedNodes);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      setExpandedNodes(newExpanded);
    };

    const handleNodeClick = (nodeId: string, hasChildren: boolean) => {
      onNodeSelect?.(nodeId);
      if (expandOnSelect && hasChildren) {
        toggleNode(nodeId);
      }
    };

    const renderNode = (node: TreeNode, level: number = 0) => {
      const hasChildren = node.children && node.children.length > 0;
      const isExpanded = expandedNodes.has(node.id);
      const isSelected = selectedNode === node.id;

      return (
        <div key={node.id} className="relative">
          <div
            className={cn(
              "flex items-center py-1 px-2 rounded-sm cursor-pointer hover:bg-accent/50",
              isSelected && "bg-accent text-accent-foreground",
              level > 0 && "ml-6"
            )}
            onClick={() => handleNodeClick(node.id, hasChildren)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(node.id);
                }}
                className="mr-1 w-4 h-4 flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                {isExpanded ? "▼" : "▶"}
              </button>
            )}
            {node.icon && <span className="mr-2">{node.icon}</span>}
            <span className="truncate">{node.label}</span>
          </div>
          {hasChildren && isExpanded && (
            <div className="ml-2">
              {node.children!.map((child) => renderNode(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(treeViewVariants({ variant, size }), className)}
        role="tree"
        {...props}
      >
        {data.map((node) => renderNode(node))}
      </div>
    );
  }
);

TreeView.displayName = "TreeView";

export { TreeView, type TreeNode };
