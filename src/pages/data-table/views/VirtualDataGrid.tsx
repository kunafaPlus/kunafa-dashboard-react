import * as React from "react";
import { VirtualDataGrid } from "../components/VirtualDataGrid";
import {
  Item,
  Column,
  VirtualDataGridProps,
  SortDirection
} from "../../../types/grid.types";
import {
  DEFAULTS,
  CLASS_NAMES,
  
  SORT_DIRECTIONS
} from "../../../constants/grid.constants";
export const LOADING_STATES = {
  TEMPLATE: (
    <div className="flex items-center justify-center p-4">
      <div className="flex items-center space-x-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <span>Loading...</span>
      </div>
    </div>
  ),
  EMPTY_TEMPLATE: <span>No data available</span>,
};
const VirtualDataGridExample: React.FC = () => {
  const columns: Column<Item>[] = [
    {
      field: "name",
      header: "Name",
      width: 200,
      sortable: true,
    },
    {
      field: "age",
      header: "Age",
      width: 100,
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      width: 250,
      sortable: true,
    },
  ];

  const initialData: Item[] = Array.from({ length: 1000 }, (_, index) => ({
    id: index + 1,
    name: `User ${index + 1}`,
    age: 20 + (index % 50),
    email: `user${index + 1}@example.com`,
  }));

  const [data, setData] = React.useState<Item[]>(initialData);

  const handleSort = (field: keyof Item | string, direction: SortDirection) => {
    const sortedData = [...data].sort((a, b) => {
      if (typeof a[field as keyof Item] === "string" && typeof b[field as keyof Item] === "string") {
        return direction === SORT_DIRECTIONS.ASC
          ? (a[field as keyof Item] as string).localeCompare(b[field as keyof Item] as string)
          : (b[field as keyof Item] as string).localeCompare(a[field as keyof Item] as string);
      }
      return direction === SORT_DIRECTIONS.ASC
        ? (a[field as keyof Item] as number) - (b[field as keyof Item] as number)
        : (b[field as keyof Item] as number) - (a[field as keyof Item] as number);
    });
    setData(sortedData);
  };

  const handleRowClick = (item: Item) => {
    console.log("Row clicked:", item);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Virtual Data Grid</h1>
      <VirtualDataGrid
        data={data}
        columns={columns}
        rowHeight={DEFAULTS.ROW_HEIGHT}
        headerHeight={DEFAULTS.HEADER_HEIGHT}
        className={CLASS_NAMES.CUSTOM_VIRTUAL_GRID}
        tableClassName={CLASS_NAMES.CUSTOM_TABLE}
        headerClassName={CLASS_NAMES.CUSTOM_HEADER}
        rowClassName={CLASS_NAMES.CUSTOM_ROW}
        cellClassName={CLASS_NAMES.CUSTOM_CELL}
        overscan={DEFAULTS.OVERSCAN}
        onSort={handleSort}
        onRowClick={handleRowClick}
        loading={false}
        loadingTemplate={LOADING_STATES.TEMPLATE}
        emptyTemplate={LOADING_STATES.EMPTY_TEMPLATE}
      />
    </div>
  );
};

export default VirtualDataGridExample;
