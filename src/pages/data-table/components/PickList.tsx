import * as React from "react";
import { cn } from "../../../utils/cn";

interface PickListProps<T> {
  source: T[];
  target: T[];
  sourceHeader?: React.ReactNode;
  targetHeader?: React.ReactNode;
  showSourceControls?: boolean;
  showTargetControls?: boolean;
  itemTemplate?: (item: T) => React.ReactNode;
  className?: string;
  sourceClassName?: string;
  targetClassName?: string;
  itemClassName?: string;
  onChange?: (e: { source: T[]; target: T[] }) => void;
  filterBy?: keyof T;
  sourceFilterPlaceholder?: string;
  targetFilterPlaceholder?: string;
  dragdrop?: boolean;
}

function PickList<T>({
  source,
  target,
  sourceHeader = "Source",
  targetHeader = "Target",
  showSourceControls = true,
  showTargetControls = true,
  itemTemplate,
  className,
  sourceClassName,
  targetClassName,
  itemClassName,
  onChange,
  filterBy,
  sourceFilterPlaceholder = "Search...",
  targetFilterPlaceholder = "Search...",
  dragdrop = true,
}: PickListProps<T>) {
  const [sourceSelection, setSourceSelection] = React.useState<T[]>([]);
  const [targetSelection, setTargetSelection] = React.useState<T[]>([]);
  const [draggedItem, setDraggedItem] = React.useState<T | null>(null);
  const [sourceFilter, setSourceFilter] = React.useState("");
  const [targetFilter, setTargetFilter] = React.useState("");

  const moveToTarget = () => {
    if (sourceSelection.length === 0) return;

    const newSource = source.filter((item) => !sourceSelection.includes(item));
    const newTarget = [...target, ...sourceSelection];

    onChange?.({ source: newSource, target: newTarget });
    setSourceSelection([]);
  };

  const moveToSource = () => {
    if (targetSelection.length === 0) return;

    const newTarget = target.filter((item) => !targetSelection.includes(item));
    const newSource = [...source, ...targetSelection];

    onChange?.({ source: newSource, target: newTarget });
    setTargetSelection([]);
  };

  const moveAllToTarget = () => {
    if (source.length === 0) return;

    const newTarget = [...target, ...source];
    onChange?.({ source: [], target: newTarget });
    setSourceSelection([]);
  };

  const moveAllToSource = () => {
    if (target.length === 0) return;

    const newSource = [...source, ...target];
    onChange?.({ source: newSource, target: [] });
    setTargetSelection([]);
  };

  const onSourceItemClick = (item: T) => {
    const selection = [...sourceSelection];
    const index = selection.indexOf(item);

    if (index >= 0) {
      selection.splice(index, 1);
    } else {
      selection.push(item);
    }

    setSourceSelection(selection);
  };

  const onTargetItemClick = (item: T) => {
    const selection = [...targetSelection];
    const index = selection.indexOf(item);

    if (index >= 0) {
      selection.splice(index, 1);
    } else {
      selection.push(item);
    }

    setTargetSelection(selection);
  };

  const onDragStart = (event: React.DragEvent, item: T, source: boolean) => {
    if (!dragdrop) return;
    setDraggedItem(item);
    event.dataTransfer.setData("text", source ? "source" : "target");
  };

  const onDragOver = (event: React.DragEvent) => {
    if (!dragdrop) return;
    event.preventDefault();
  };

  const onDrop = (event: React.DragEvent, dropTarget: "source" | "target") => {
    if (!dragdrop || !draggedItem) return;

    const dragSource = event.dataTransfer.getData("text") as "source" | "target";
    if (dragSource === dropTarget) return;

    const newSource = [...source];
    const newTarget = [...target];

    if (dragSource === "source") {
      newSource.splice(source.indexOf(draggedItem), 1);
      newTarget.push(draggedItem);
    } else {
      newTarget.splice(target.indexOf(draggedItem), 1);
      newSource.push(draggedItem);
    }

    onChange?.({ source: newSource, target: newTarget });
    setDraggedItem(null);
    event.preventDefault();
  };

  const filterItem = (item: T, filterValue: string) => {
    if (!filterBy || !filterValue) return true;
    const value = String(item[filterBy]).toLowerCase();
    return value.includes(filterValue.toLowerCase());
  };

  const renderItem = (item: T, selected: boolean, onClick: (item: T) => void, source: boolean) => {
    const content = itemTemplate ? (
      itemTemplate(item)
    ) : (
      <div className="p-4">{String(item)}</div>
    );

    return (
      <div
        key={String(item)}
        className={cn(
          "cursor-pointer border-b border-gray-200 last:border-b-0",
          selected && "bg-primary/10",
          itemClassName
        )}
        onClick={() => onClick(item)}
        draggable={dragdrop}
        onDragStart={(e) => onDragStart(e, item, source)}
      >
        {content}
      </div>
    );
  };

  const renderControls = (moveSelected: () => void, moveAll: () => void) => {
    return (
      <div className="flex flex-col space-y-2 p-4">
        <button
          type="button"
          onClick={moveSelected}
          className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={moveAll}
          className="rounded bg-primary px-4 py-2 text-white hover:bg-primary/90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10.293 15.707a1 1 0 010-1.414L14.586 10H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 111.414-1.414l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className={cn("flex items-start space-x-4", className)}>
      <div
        className={cn(
          "flex-1 rounded-lg border border-gray-200",
          sourceClassName
        )}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "source")}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="font-medium">{sourceHeader}</div>
          {filterBy && (
            <input
              type="text"
              placeholder={sourceFilterPlaceholder}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            />
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {source
            .filter((item) => filterItem(item, sourceFilter))
            .map((item) =>
              renderItem(
                item,
                sourceSelection.includes(item),
                onSourceItemClick,
                true
              )
            )}
        </div>
      </div>

      {showSourceControls && showTargetControls && (
        <div className="flex flex-col justify-center space-y-4">
          {renderControls(moveToTarget, moveAllToTarget)}
          {renderControls(moveToSource, moveAllToSource)}
        </div>
      )}

      <div
        className={cn(
          "flex-1 rounded-lg border border-gray-200",
          targetClassName
        )}
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, "target")}
      >
        <div className="border-b border-gray-200 p-4">
          <div className="font-medium">{targetHeader}</div>
          {filterBy && (
            <input
              type="text"
              placeholder={targetFilterPlaceholder}
              className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2"
              value={targetFilter}
              onChange={(e) => setTargetFilter(e.target.value)}
            />
          )}
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {target
            .filter((item) => filterItem(item, targetFilter))
            .map((item) =>
              renderItem(
                item,
                targetSelection.includes(item),
                onTargetItemClick,
                false
              )
            )}
        </div>
      </div>
    </div>
  );
}

PickList.displayName = "PickList";

export { PickList };
