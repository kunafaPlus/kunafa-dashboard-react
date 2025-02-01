import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../utils/cn";
import {
  DragEndEvent,
  DragStartEvent,

} from "@dnd-kit/core";
import {

  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const sortableListInputVariants = cva(
  "w-full",
  {
    variants: {
      variant: {
        default: "border rounded-lg",
        filled: "bg-muted border-transparent",
        ghost: "border-transparent",
      },
      size: {
        sm: "p-2 gap-2",
        md: "p-3 gap-3",
        lg: "p-4 gap-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface SortableItem {
  id: string | number;
  content: React.ReactNode;
  data?: any;
}

interface SortableListInputProps{
  items: Array<{ id: string; content: string }>;
  value?: string[];
  onChange?: (event: { target: { value: string[] } }) => void;
  label?: string;
  error?: string;
  hint?: string;
  disabled?: boolean;
  dragHandle?: boolean;
  renderItem?: (item: SortableItem) => React.ReactNode;
  onDragStart?: (event: DragStartEvent) => void;
  onDragEnd?: (event: DragEndEvent) => void;
  allowRemove?: boolean;
  onRemove?: (item: SortableItem) => void;
  className?: string;
}

interface SortableItemProps extends SortableItem {
  disabled?: boolean;
  dragHandle?: boolean;
  renderItem?: (item: SortableItem) => React.ReactNode;
  onRemove?: (item: SortableItem) => void;
}

const SortableItemComponent = ({
  id,
  content,
  data,
  disabled,
  dragHandle,
  renderItem,
  onRemove,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative flex items-center gap-2 p-2 bg-background rounded-md",
        isDragging && "shadow-lg",
        disabled && "opacity-50"
      )}
    >
      {dragHandle ? (
        <button
          type="button"
          className="p-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing disabled:cursor-not-allowed"
          {...attributes}
          {...listeners}
          disabled={disabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      ) : (
        <div
          className="flex-1 cursor-grab active:cursor-grabbing disabled:cursor-not-allowed"
          {...attributes}
          {...listeners}
        >
          {renderItem ? renderItem({ id, content, data }) : content}
        </div>
      )}

      {dragHandle && (
        <div className="flex-1">
          {renderItem ? renderItem({ id, content, data }) : content}
        </div>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={() => onRemove({ id, content, data })}
          className="p-1 text-muted-foreground hover:text-destructive disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      )}
    </div>
  );
};

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
