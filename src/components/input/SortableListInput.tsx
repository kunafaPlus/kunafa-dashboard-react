import * as React from "react";
import { cn } from "../../utils/cn";
import { SortableListInputProps ,SortableItem} from "./types/type";





 const SortableListInput = React.forwardRef<HTMLDivElement, SortableListInputProps>(
  ({ className, items, value = [], onChange, label, error, ...props }, ref) => {
    const [sortedItems, setSortedItems] = React.useState(items);

    React.useEffect(() => {
      if (Array.isArray(value) && value.length > 0) {
        const newSortedItems = value
          .map(id => items.find(item => item.id === id))
          .filter((item): item is { id: string; content: string } => item !== undefined);
        setSortedItems(newSortedItems);
      } else {
        setSortedItems(items);
      }
    }, [value, items]);

    const handleDragEnd = (result: any) => {
      if (!result.destination) return;

      const reorderedItems = Array.from(sortedItems);
      const [removed] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, removed);

      setSortedItems(reorderedItems);

      if (onChange) {
        onChange({
          target: {
            value: reorderedItems.map(item => item.id)
          }
        });
      }
    };

    return (
      <div ref={ref} className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className={cn("border rounded-md p-2", className)} {...props}>
          {sortedItems.map((item, index) => (
            <div
              key={item.id}
              className="p-2 mb-2 bg-gray-50 rounded cursor-move"
              draggable
            >
              {item.content}
            </div>
          ))}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
);

SortableListInput.displayName = "SortableListInput";

export { SortableListInput, type SortableItem };
