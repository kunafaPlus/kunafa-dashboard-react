import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";

const kanbanVariants = cva(
  "flex overflow-x-auto p-4 space-x-4",
  {
    variants: {
      variant: {
        default: "",
        bordered: "border rounded-lg",
        ghost: "bg-muted/50",
      },
      size: {
        sm: "min-h-[300px]",
        md: "min-h-[400px]",
        lg: "min-h-[500px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const columnVariants = cva(
  "flex flex-col rounded-lg bg-muted/50 min-w-[300px]",
  {
    variants: {
      variant: {
        default: "",
        solid: "bg-background border",
        ghost: "bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface KanbanItem {
  id: string;
  content: React.ReactNode;
  priority?: "low" | "medium" | "high";
  tags?: string[];
}

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color?: string;
}

interface KanbanProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kanbanVariants> {
  columns: KanbanColumn[];
  onDragEnd?: (result: {
    source: { columnId: string; index: number };
    destination: { columnId: string; index: number };
    itemId: string;
  }) => void;
}

const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  ({ className, variant, size, columns, onDragEnd, ...props }, ref) => {
    const [draggedItem, setDraggedItem] = React.useState<{
      columnId: string;
      itemId: string;
      index: number;
    } | null>(null);

    const [hoveredColumn, setHoveredColumn] = React.useState<string | null>(null);
    const [hoveredItemIndex, setHoveredItemIndex] = React.useState<number | null>(
      null
    );

    const handleDragStart = (
      columnId: string,
      itemId: string,
      index: number
    ) => {
      setDraggedItem({ columnId, itemId, index });
    };

    const handleDragEnd = () => {
      if (
        draggedItem &&
        hoveredColumn !== null &&
        hoveredItemIndex !== null &&
        onDragEnd
      ) {
        onDragEnd({
          source: {
            columnId: draggedItem.columnId,
            index: draggedItem.index,
          },
          destination: {
            columnId: hoveredColumn,
            index: hoveredItemIndex,
          },
          itemId: draggedItem.itemId,
        });
      }

      setDraggedItem(null);
      setHoveredColumn(null);
      setHoveredItemIndex(null);
    };

    const getPriorityColor = (priority?: "low" | "medium" | "high") => {
      switch (priority) {
        case "high":
          return "bg-red-500";
        case "medium":
          return "bg-yellow-500";
        case "low":
          return "bg-green-500";
        default:
          return "bg-gray-500";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(kanbanVariants({ variant, size }), className)}
        {...props}
      >
        {columns.map((column) => (
          <div
            key={column.id}
            className={cn(columnVariants())}
            onDragOver={(e) => {
              e.preventDefault();
              setHoveredColumn(column.id);
            }}
          >
            <div
              className="p-3 font-medium border-b"
              style={{ borderLeftColor: column.color }}
            >
              <div className="flex items-center justify-between">
                <span>{column.title}</span>
                <span className="text-sm text-muted-foreground">
                  {column.items.length}
                </span>
              </div>
            </div>

            <div className="flex-1 p-2 space-y-2">
              {column.items.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() =>
                    handleDragStart(column.id, item.id, index)
                  }
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setHoveredItemIndex(index);
                  }}
                  className={cn(
                    "p-3 rounded-md bg-background shadow-sm cursor-move",
                    draggedItem?.itemId === item.id && "opacity-50",
                    hoveredColumn === column.id &&
                      hoveredItemIndex === index &&
                      "border-2 border-primary"
                  )}
                >
                  <div className="space-y-2">
                    {item.priority && (
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          getPriorityColor(item.priority)
                        )}
                      />
                    )}
                    <div>{item.content}</div>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 text-xs rounded-full bg-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

Kanban.displayName = "Kanban";

export { Kanban, type KanbanItem, type KanbanColumn };
