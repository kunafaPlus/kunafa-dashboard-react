import * as React from "react";
import { PickList } from "../components/PickList";

interface Item {
  id: number;
  name: string;
  description: string;
}

const PickListExample: React.FC = () => {
  const initialSourceItems: Item[] = [
    { id: 1, name: "Item 1", description: "Description for Item 1" },
    { id: 2, name: "Item 2", description: "Description for Item 2" },
    { id: 3, name: "Item 3", description: "Description for Item 3" },
    { id: 4, name: "Item 4", description: "Description for Item 4" },
    { id: 5, name: "Item 5", description: "Description for Item 5" },
  ];
  
  const initialTargetItems: Item[] = [
    { id: 6, name: "Item 6", description: "Description for Item 6" },
    { id: 7, name: "Item 7", description: "Description for Item 7" },
  ];

  const [source, setSource] = React.useState<Item[]>(initialSourceItems);
  const [target, setTarget] = React.useState<Item[]>(initialTargetItems);

  const handleChange = (e: { source: Item[]; target: Item[] }) => {
    setSource(e.source);
    setTarget(e.target);
  };

  const handleSourceItemClick = (item: Item) => {
    console.log("Source Item Clicked:", item);
  };

  const handleTargetItemClick = (item: Item) => {
    console.log("Target Item Clicked:", item);
  };

  const itemTemplate = (item: Item) => (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-col">
        <span className="font-medium">{item.name}</span>
        <span className="text-sm text-gray-500">{item.description}</span>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Pick List</h1>
      <PickList
        source={source}
        target={target}
        onChange={handleChange}
        onSourceItemClick={handleSourceItemClick}
        onTargetItemClick={handleTargetItemClick}
        itemTemplate={itemTemplate}
        className="custom-picklist"
        sourceClassName="custom-source"
        targetClassName="custom-target"
        itemClassName="custom-item"
        filter
        filterPlaceholder="Search..."
      />
    </div>
  );
};

export default PickListExample;
