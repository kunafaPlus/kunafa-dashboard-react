import * as React from "react";
import { Kanban } from "../components/Kanban";
import { KanbanColumn } from "../../data-table/types";

const KanbanBoardExample: React.FC = () => {
  const [columns, setColumns] = React.useState<KanbanColumn[]>([
    {
      id: "column-1",
      title: "To Do",
      color: "#4CAF50",
      items: [
        {
          id: "item-1",
          content: "Design UI",
          priority: "medium",
          tags: ["UI", "Design"],
        },
        {
          id: "item-2",
          content: "Setup Backend",
          priority: "high",
          tags: ["Backend", "Setup"],
        },
      ],
    },
    {
      id: "column-2",
      title: "In Progress",
      color: "#FF9800",
      items: [
        {
          id: "item-3",
          content: "Develop Frontend",
          priority: "medium",
          tags: ["Frontend", "Development"],
        },
      ],
    },
    {
      id: "column-3",
      title: "Done",
      color: "#2196F3",
      items: [
        {
          id: "item-4",
          content: "Write Tests",
          priority: "low",
          tags: ["Testing"],
        },
      ],
    },
  ]);

  const handleDragEnd = (result: {
    source: { columnId: string; index: number };
    destination: { columnId: string; index: number };
    itemId: string;
  }) => {
    const { source, destination, itemId } = result;

    if (
      source.columnId === destination.columnId &&
      source.index === destination.index
    ) {
      return;
    }

    const newColumns = columns.map((column) => {
      if (column.id === source.columnId) {
        return {
          ...column,
          items: column.items.filter((item) => item.id !== itemId),
        };
      }
      if (column.id === destination.columnId) {
        const newItems = [...column.items];
        newItems.splice(
          destination.index,
          0,
          columns.find((c) => c.id === source.columnId)?.items[source.index]!
        );
        return {
          ...column,
          items: newItems,
        };
      }
      return column;
    });

    setColumns(newColumns);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <Kanban
        columns={columns}
        onDragEnd={handleDragEnd}
        className="custom-kanban"
        columnClassName="custom-column"
        itemClassName="custom-item"
      />
    </div>
  );
};

export default KanbanBoardExample;
