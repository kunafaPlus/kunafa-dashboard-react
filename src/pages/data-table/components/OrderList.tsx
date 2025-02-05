import * as React from "react";
import { cn } from "../../../utils/cn";

interface OrderListProps<T> {
  value: T[];
  header?: React.ReactNode;
  dragdrop?: boolean;
  selection?: boolean;
  multiple?: boolean;
  metaKeySelection?: boolean;
  itemTemplate?: (item: T, index: number) => React.ReactNode;
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  onChange?: (e: { value: T[] }) => void;
  onReorder?: (e: { value: T[]; dragIndex: number; dropIndex: number }) => void;
  onSelectionChange?: (e: { value: T[] }) => void;
}

function OrderList<T>({
  value,
  header,
  dragdrop = false,
  selection = false,
  multiple = true,
  metaKeySelection = true,
  itemTemplate,
  className,
  listClassName,
  itemClassName,
  onChange,
  onReorder,
  onSelectionChange,
}: OrderListProps<T>) {
  const [selectedItems, setSelectedItems] = React.useState<T[]>([]);
  const [draggedItem, setDraggedItem] = React.useState<T | null>(null);
  const [draggedItemIndex, setDraggedItemIndex] = React.useState<number>(-1);
  const listRef = React.useRef<HTMLUListElement>(null);

  const onItemClick = (event: React.MouseEvent, item: T, index: number) => {
    if (!selection) {
      return;
    }

    let selected = [...selectedItems];
    const metaKey = event.metaKey || event.ctrlKey;

    if (multiple) {
      if (metaKeySelection) {
        if (metaKey) {
          if (isSelected(item)) {
            selected = selected.filter((selectedItem) => selectedItem !== item);
          } else {
            selected = [...selected, item];
          }
        } else {
          selected = [item];
        }
      } else {
        if (isSelected(item)) {
          selected = selected.filter((selectedItem) => selectedItem !== item);
        } else {
          selected = [...selected, item];
        }
      }
    } else {
      if (isSelected(item)) {
        selected = [];
      } else {
        selected = [item];
      }
    }

    setSelectedItems(selected);
    onSelectionChange?.({ value: selected });
  };

  const onDragStart = (event: React.DragEvent, index: number) => {
    if (!dragdrop) {
      return;
    }

    event.dataTransfer.setData("text", "orderlist");
    setDraggedItemIndex(index);
    setDraggedItem(value[index]);
  };

  const onDragOver = (event: React.DragEvent, index: number) => {
    if (!dragdrop) {
      return;
    }

    if (draggedItemIndex !== index) {
      event.preventDefault();
    }
  };

  const onDrop = (event: React.DragEvent, index: number) => {
    if (!dragdrop) {
      return;
    }

    if (draggedItemIndex !== index) {
      const newValue = [...value];
      newValue.splice(draggedItemIndex, 1);
      newValue.splice(index, 0, draggedItem as T);

      onChange?.({ value: newValue });
      onReorder?.({
        value: newValue,
        dragIndex: draggedItemIndex,
        dropIndex: index,
      });
    }

    setDraggedItemIndex(-1);
    setDraggedItem(null);
  };

  const onDragEnd = () => {
    if (!dragdrop) {
      return;
    }

    setDraggedItemIndex(-1);
    setDraggedItem(null);
  };

  const isSelected = (item: T) => {
    return selectedItems.includes(item);
  };

  const moveUp = (event: React.MouseEvent, index: number) => {
    if (index === 0) {
      return;
    }

    const newValue = [...value];
    const movedItem = newValue[index];
    newValue[index] = newValue[index - 1];
    newValue[index - 1] = movedItem;

    onChange?.({ value: newValue });
    onReorder?.({
      value: newValue,
      dragIndex: index,
      dropIndex: index - 1,
    });
  };

  const moveDown = (event: React.MouseEvent, index: number) => {
    if (index === value.length - 1) {
      return;
    }

    const newValue = [...value];
    const movedItem = newValue[index];
    newValue[index] = newValue[index + 1];
    newValue[index + 1] = movedItem;

    onChange?.({ value: newValue });
    onReorder?.({
      value: newValue,
      dragIndex: index,
      dropIndex: index + 1,
    });
  };

  const moveTop = (event: React.MouseEvent, index: number) => {
    if (index === 0) {
      return;
    }

    const newValue = [...value];
    const movedItem = newValue.splice(index, 1)[0];
    newValue.unshift(movedItem);

    onChange?.({ value: newValue });
    onReorder?.({
      value: newValue,
      dragIndex: index,
      dropIndex: 0,
    });
  };

  const moveBottom = (event: React.MouseEvent, index: number) => {
    if (index === value.length - 1) {
      return;
    }

    const newValue = [...value];
    const movedItem = newValue.splice(index, 1)[0];
    newValue.push(movedItem);

    onChange?.({ value: newValue });
    onReorder?.({
      value: newValue,
      dragIndex: index,
      dropIndex: value.length - 1,
    });
  };

  const renderItem = (item: T, index: number) => {
    const content = itemTemplate ? (
      itemTemplate(item, index)
    ) : (
      <div className="flex items-center justify-between p-4">
        <span>{String(item)}</span>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={(e) => moveTop(e, index)}
            className="rounded p-1 hover:bg-gray-100"
            title="Move to Top"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4.293 15.707a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 0zm0-6a1 1 0 010-1.414l5-5a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 5.414 5.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => moveUp(e, index)}
            className="rounded p-1 hover:bg-gray-100"
            title="Move Up"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => moveDown(e, index)}
            className="rounded p-1 hover:bg-gray-100"
            title="Move Down"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={(e) => moveBottom(e, index)}
            className="rounded p-1 hover:bg-gray-100"
            title="Move to Bottom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0zm-6 0a1 1 0 010 1.414L5.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );

    return (
      <li
        key={index}
        draggable={dragdrop}
        onDragStart={(e) => onDragStart(e, index)}
        onDragOver={(e) => onDragOver(e, index)}
        onDrop={(e) => onDrop(e, index)}
        onDragEnd={onDragEnd}
        onClick={(e) => onItemClick(e, item, index)}
        className={cn(
          "cursor-pointer border-b border-gray-200 last:border-b-0",
          isSelected(item) && "bg-primary/10",
          draggedItemIndex === index && "opacity-50",
          itemClassName
        )}
      >
        {content}
      </li>
    );
  };

  return (
    <div className={cn("rounded-lg border border-gray-200", className)}>
      {header && <div className="border-b border-gray-200 p-4">{header}</div>}
      <ul ref={listRef} className={cn("list-none p-0", listClassName)}>
        {value.map((item, index) => renderItem(item, index))}
      </ul>
    </div>
  );
}

OrderList.displayName = "OrderList";

export { OrderList };
