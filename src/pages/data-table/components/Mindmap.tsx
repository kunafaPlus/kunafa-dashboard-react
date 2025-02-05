import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const mindmapVariants = cva(
  "w-full overflow-auto border rounded-lg bg-background",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border-2",
        ghost: "bg-muted/50 border-none",
      },
      size: {
        sm: "min-h-[300px]",
        md: "min-h-[500px]",
        lg: "min-h-[700px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface MindmapNode {
  id: string;
  content: React.ReactNode;
  children?: MindmapNode[];
  color?: string;
  collapsed?: boolean;
  icon?: React.ReactNode;
  notes?: string;
}

interface MindmapProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mindmapVariants> {
  root: MindmapNode;
  onNodeClick?: (node: MindmapNode) => void;
  onNodeCollapse?: (node: MindmapNode) => void;
  readonly?: boolean;
  centerOnLoad?: boolean;
  showToolbar?: boolean;
  layout?: "horizontal" | "vertical" | "radial";
}

const Mindmap = React.forwardRef<HTMLDivElement, MindmapProps>(
  (
    {
      className,
      variant,
      size,
      root,
      onNodeClick,
      onNodeCollapse,
      readonly = false,
      centerOnLoad = true,
      showToolbar = true,
      layout = "horizontal",
      ...props
    },
    ref
  ) => {
    const [zoom, setZoom] = React.useState(1);
    const [selectedNode, setSelectedNode] = React.useState<string | null>(
      null
    );
    const [pan, setPan] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

    React.useEffect(() => {
      if (centerOnLoad) {
        const container = document.getElementById("mindmap-container");
        if (container) {
          setPan({
            x: container.clientWidth / 2,
            y: container.clientHeight / 2,
          });
        }
      }
    }, [centerOnLoad]);

    const handleMouseDown = (e: React.MouseEvent) => {
      if (e.button === 1 || e.button === 2) {
        // Middle or right mouse button
        setIsDragging(true);
        setDragStart({
          x: e.clientX - pan.x,
          y: e.clientY - pan.y,
        });
      }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
        setPan({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setZoom((z) => Math.min(Math.max(0.1, z * delta), 3));
      }
    };

    const renderNode = (
      node: MindmapNode,
      level: number,
      index: number,
      parentX: number,
      parentY: number
    ): React.ReactNode => {
      const spacing = 120;
      let x: number, y: number;

      switch (layout) {
        case "vertical":
          x = parentX + (index - (node.children?.length || 0) / 2) * spacing;
          y = parentY + spacing;
          break;
        case "radial":
          const angle =
            ((index + 0.5) / (node.children?.length || 1)) * Math.PI * 2;
          x = parentX + Math.cos(angle) * level * spacing;
          y = parentY + Math.sin(angle) * level * spacing;
          break;
        default: // horizontal
          x = parentX + spacing;
          y = parentY + (index - (node.children?.length || 0) / 2) * spacing;
      }

      return (
        <React.Fragment key={node.id}>
          {level > 0 && (
            <line
              x1={parentX}
              y1={parentY}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.3}
              strokeWidth={2}
            />
          )}
          <g
            transform={`translate(${x},${y})`}
            onClick={() => {
              setSelectedNode(node.id);
              onNodeClick?.(node);
            }}
            style={{ cursor: "pointer" }}
          >
            <rect
              x="-50"
              y="-25"
              width="100"
              height="50"
              rx="25"
              fill={node.color || "var(--primary)"}
              fillOpacity={0.1}
              stroke={node.color || "var(--primary)"}
              strokeWidth={selectedNode === node.id ? 3 : 1}
              className="transition-all"
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={14}
              className="select-none pointer-events-none"
            >
              {node.icon && (
                <tspan x="0" dy="-0.5em">
                  {node.icon}
                </tspan>
              )}
              <tspan x="0" dy={node.icon ? "1.5em" : "0"}>
                {node.content}
              </tspan>
            </text>
            {!node.collapsed && node.children?.map((child, i) =>
              renderNode(child, level + 1, i, x, y)
            )}
          </g>
        </React.Fragment>
      );
    };

    return (
      <div
        ref={ref}
        className={cn(mindmapVariants({ variant, size }), className)}
        {...props}
      >
        {showToolbar && (
          <div className="sticky top-0 z-10 flex items-center gap-2 p-2 border-b bg-background">
            <button
              onClick={() => setZoom((z) => z * 1.1)}
              className="p-2 hover:bg-accent rounded"
            >
              +
            </button>
            <button
              onClick={() => setZoom((z) => z * 0.9)}
              className="p-2 hover:bg-accent rounded"
            >
              -
            </button>
            <button
              onClick={() => {
                setZoom(1);
                setPan({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
              }}
              className="p-2 hover:bg-accent rounded"
            >
              Reset
            </button>
            <select
              value={layout}
              onChange={(e) =>
                props.onChange?.({
                  target: { name: "layout", value: e.target.value },
                } as any)
              }
              className="p-2 bg-transparent border rounded"
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="radial">Radial</option>
            </select>
          </div>
        )}

        <div
          id="mindmap-container"
          className="relative w-full h-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <svg
            width="100%"
            height="100%"
            style={{
              cursor: isDragging ? "grabbing" : "grab",
            }}
          >
            <g
              transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}
            >
              {renderNode(root, 0, 0, 0, 0)}
            </g>
          </svg>
        </div>
      </div>
    );
  }
);

Mindmap.displayName = "Mindmap";

export { Mindmap, type MindmapNode };
