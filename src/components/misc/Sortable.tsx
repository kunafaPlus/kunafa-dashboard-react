import * as React from "react";
import { cn } from "../../utils/cn";
import { sortableVariants } from "./variants";
import { SortableItem, SortableProps } from "./types";




const Sortable = React.forwardRef<HTMLDivElement, SortableProps>(
  (
    {
      className,
      variant,
      layout,
      items: initialItems,
      onChange,
      handle = false,
      animation = true,
      itemClassName,
      columns = 3,
      renderItem,
      ...props
    },
    ref
  ) => {
    const [items, setItems] = React.useState(initialItems);
    const [draggedItem, setDraggedItem] = React.useState<SortableItem | null>(
      null
    );
    const [draggedOverItem, setDraggedOverItem] = React.useState<string | null>(
      null
    );

    React.useEffect(() => {
      setItems(initialItems);
    }, [initialItems]);

    const handleDragStart = (
      e: React.DragEvent<HTMLDivElement>,
      item: SortableItem
    ) => {
      if (item.disabled) {
        e.preventDefault();
        return;
      }
      setDraggedItem(item);
      e.currentTarget.classList.add("opacity-50");
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
      e.currentTarget.classList.remove("opacity-50");
      setDraggedItem(null);
      setDraggedOverItem(null);
    };

    const handleDragOver = (
      e: React.DragEvent<HTMLDivElement>,
      itemId: string
    ) => {
      e.preventDefault();
      setDraggedOverItem(itemId);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, itemId: string) => {
      e.preventDefault();

      if (!draggedItem || draggedItem.id === itemId) return;

      const newItems = [...items];
      const draggedIndex = items.findIndex((item) => item.id === draggedItem.id);
      const dropIndex = items.findIndex((item) => item.id === itemId);

      newItems.splice(draggedIndex, 1);
      newItems.splice(dropIndex, 0, draggedItem);

      setItems(newItems);
      onChange?.(newItems);
    };

    const gridColumns = {
      1: "grid-cols-1",
      2: "grid-cols-1 sm:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
      4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      5: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    }[columns];

    return (
      <div
        ref={ref}
        className={cn(
          sortableVariants({ variant, layout }),
          layout === "grid" && gridColumns,
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <div
            key={item.id}
            draggable={!item.disabled}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, item.id)}
            onDrop={(e) => handleDrop(e, item.id)}
            className={cn(
              "relative",
              animation && "transition-transform duration-200",
              !item.disabled && "cursor-move",
              item.disabled && "opacity-50 cursor-not-allowed",
              draggedOverItem === item.id && "scale-105",
              itemClassName
            )}
          >
            {handle && !item.disabled && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move text-muted-foreground">
                ⋮⋮
              </div>
            )}
            {renderItem ? (
              renderItem(item)
            ) : (
              <div
                className={cn(
                  "rounded-lg border bg-background p-4",
                  handle && "pl-8"
                )}
              >
                {item.content}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
);

Sortable.displayName = "Sortable";

export { Sortable, type SortableItem };
