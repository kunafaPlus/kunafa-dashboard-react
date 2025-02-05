import * as React from "react";
import { useState } from "react";
import { DataTable } from "../components/DataTable";
import { DataView } from "../components/DataView";
import { EditableDataGrid } from "../components/EditableDataGrid";

import { GroupDataGrid } from "../components/GroupDataGrid";
import { InfiniteDataGrid } from "../components/InfiniteDataGrid";
import { Kanban } from "../components/Kanban";
import { MasterDetailGrid } from "../components/MasterDetailGrid";

import { OrganizationChart, OrgChartNode } from "../components/OrganizationChart";
import { PickList } from "../components/PickList";

import { Resource, Scheduler, SchedulerEvent } from "../components/Scheduler";
import { SpreadsheetGrid } from "../components/SpreadsheetGrid";
import { Tree } from "../components/Tree";
import { TreeTable } from "../components/TreeTable";
import { VirtualDataGrid } from "../components/VirtualDataGrid";

interface Item {
  id: number;
  name: string;
  age: number;
  email: string;
}

const DataGridExample: React.FC = () => {

  const columns: any[] = [
    {
      key: "id",
      header: "ID",
      width: "100px",
      sortable: true,
    },
    {
      key: "name",
      header: "Name",
      sortable: true,
    },
    {
      key: "age",
      header: "Age",
      sortable: true,
    },
    {
      key: "email",
      header: "Email",
      render: (value) => <a href={`mailto:${value}`}>{value}</a>,
    },
  ];

  const handleSort = (key: keyof Item, direction: "asc" | "desc") => {
    console.log(`Sort by ${String(key)} in ${direction} order`);
    // يمكنك هنا تنفيذ أي منطق لفرز البيانات
  };

  const handleSelectionChange = (selectedItems: Item[]) => {
    console.log("Selected items:", selectedItems);
    // يمكنك هنا تنفيذ أي منطق عند تغيير العناصر المحددة
  };
  // const items: Item[] = [
  //   { id: 1, name: "John Doe", age: 28, email: "john.doe@example.com", },
  //   { id: 2, name: "Jane Smith", age: 34, email: "jane.smith@example.com" ,},
  //   { id: 3, name: "Alice Johnson", age: 24, email: "alice.johnson@example.com", },

  //   // يمكنك إضافة المزيد من العناصر هنا
  // ];
  const items: Item[] = Array.from({ length: 20 }, (_, index) => ({
    id: index + 1,
    name: `Item ${index + 1}`,
    description: `Description for item ${index + 1}`,
    age: 28,
    email: "john.doe@example.com",
  }));

  const handlePageChange = ({
    first,
    rows,
  }: {
    first: number;
    rows: number;
  }) => {
    console.log(`Loading items from ${first} to ${first + rows}`);
    // يمكنك هنا إضافة منطق لتحميل المزيد من البيانات من الخادم
  };

  const renderItem = (item: Item, layout: "grid" | "list") => {
    if (layout === "grid") {
      return (
        <div className="p-3 flex  border rounded-xl gap-4 items-center border-gray-200">
          <img src="/vite.svg" alt="" />
          <div>
            <h3>{item.name}</h3>
            <p>{item.email}</p>
          </div>
        </div>
      );
    }
    return (
      <div style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
        <h3>{item.name}</h3>
        <p>{item.email}</p>
      </div>
    );
  };
  const initialData: any = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      isActive: true,
      department: "Engineering",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 34,
      isActive: false,
      department: "Marketing",
    },
    {
      id: 3,
      name: "Samuel Green",
      age: 45,
      isActive: true,
      department: "Sales",
    },
  ];

  const departments = [
    { label: "Engineering", value: "Engineering" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "HR", value: "HR" },
  ];



  const [data, setData] = React.useState<Item[]>(initialData);

  const handleDataChange = (newData: Item[]) => {
    setData(newData);
  };

  const handleCellChange = (item: Item, field: keyof Item, value: any) => {
    console.log(`Cell changed: ${item.id}, Field: ${field}, Value: ${value}`);
  };

  const handleValidationError = (error: string) => {
    console.error("Validation Error:", error);
  };
  const columnsEdit: any = [
    {
      field: "name",
      header: "Name",
      editable: true,
      type: "text",
      exportable: true,

      validation: (value) => (!value ? "Name is required" : undefined),
    },
    {
      field: "age",
      header: "Age",
      editable: true,
      type: "number",
      exportable: true,

      validation: (value) => (value < 0 ? "Age must be positive" : undefined),
    },
    {
      field: "isActive",
      header: "Active",
      editable: true,
      type: "boolean",
      exportable: true,
    },
    {
      field: "department",
      header: "Department",
      editable: true,
      type: "select",
      options: departments,
      exportable: true,
    },
  ];

  const [hasMore, setHasMore] = useState<boolean>(true);

  const handleGroup = (groups: GroupDefinition<Item>[]) => {
    console.log("Grouped by:", groups);
  };

  const handleExpandGroup = (groupKey: string, expanded: boolean) => {
    console.log(`Group ${groupKey} ${expanded ? "expanded" : "collapsed"}`);
  };

  const handleRowClick = (item: Item) => {
    console.log("Row clicked:", item);
  };
  const [loading, setLoading] = useState<boolean>(false);
  // Simulate fetching data from an API
  const fetchData = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const [hasMore, setHasMore] = useState<boolean>(true);
      const [page, setPage] = React.useState<number>(1);

      // Fetch new data
      const newData: Item[] = Array.from({ length: 5 }, (_, index) => ({
        id: (page - 1) * 5 + index + 1,
        name: `User ${(page - 1) * 5 + index + 1}`,
        age: 20 + (page - 1) * 5 + index + 1,
        department: ["Engineering", "Marketing", "Sales"][index % 3],
      }));

      // Append new data to existing data
      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);

      // Check if there are more items to load
      if (newData.length < 5) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data
  React.useEffect(() => {
    fetchData();
  }, []);

  // Handle infinite scroll
  const handleLoadMore = () => {
    fetchData();
  };

  const [columnsK, setColumns] = useState<KanbanColumn[]>([
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
  const detailTemplate = (item: Item) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="font-medium">Email:</span>
        <span>{item.email}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium">email:</span>
        <span>{item.email}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-medium">Address:</span>
        <span>{item.age}</span>
      </div>
    </div>
  );
  const [expandedRows, setExpandedRows] = useState<Item[]>([]);

  const handleRowExpand = (item: Item) => {
    setExpandedRows((prevExpanded) => [...prevExpanded, item]);
  };

  const handleRowCollapse = (item: Item) => {
    setExpandedRows((prevExpanded) =>
      prevExpanded.filter((row) => row.id !== item.id)
    );
  };




  const [selection, setSelection] = useState<OrgChartNode[]>([]);

  const handleSelectionChange3 = (selectedNodes: OrgChartNode[]) => {
    setSelection(selectedNodes);
    console.log("Selected Nodes:", selectedNodes);
  };

  const handleNodeClick2 = (node: OrgChartNode) => {
    console.log("Node Clicked:", node);
  };

  const handleExpand = (node: OrgChartNode) => {
    console.log("Node Expanded:", node);
  };

  const handleCollapse = (node: OrgChartNode) => {
    console.log("Node Collapsed:", node);
  };

  const customNodeTemplate = (node: OrgChartNode) => {
    return (
      <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:border-gray-300">
        {node.type && (
          <span className="mb-1 text-xs font-medium text-gray-500">{node.type}</span>
        )}
        <span className="text-sm font-medium">{node.label}</span>
        {node.data && (
          <span className="mt-1 text-xs text-gray-500">{node.data}</span>
        )}
        {node.icon && (
          <div className="mt-2">
            {node.icon}
          </div>
        )}
      </div>
    );
  };
  const [orgChart, setOrgChart] = useState<OrgChartNode>({
    key: "root",
    label: "CEO",
    type: "Executive",
    expanded: true,
    children: [
      {
        key: "cfo",
        label: "CFO",
        type: "Finance",
        expanded: true,
        children: [
          {
            key: "accountant",
            label: "Accountant",
            type: "Finance",
          },
          {
            key: "auditor",
            label: "Auditor",
            type: "Finance",
          },
        ],
      },
      {
        key: "cto",
        label: "CTO",
        type: "Technology",
        expanded: true,
        children: [
          {
            key: "developer1",
            label: "Developer 1",
            type: "Development",
          },
          {
            key: "developer2",
            label: "Developer 2",
            type: "Development",
          },
          {
            key: "designer",
            label: "Designer",
            type: "Design",
          },
        ],
      },
      {
        key: "cmo",
        label: "CMO",
        type: "Marketing",
        expanded: true,
        children: [
          {
            key: "marketer1",
            label: "Marketer 1",
            type: "Marketing",
          },
          {
            key: "marketer2",
            label: "Marketer 2",
            type: "Marketing",
          },
        ],
      },
    ],
  });





  const initialSourceItems: any[] = [
    { id: 1, name: "Item 1", description: "Description for Item 1" },
    { id: 2, name: "Item 2", description: "Description for Item 2" },
    { id: 3, name: "Item 3", description: "Description for Item 3" },
    { id: 4, name: "Item 4", description: "Description for Item 4" },
    { id: 5, name: "Item 5", description: "Description for Item 5" },
  ];
  
  const initialTargetItems: any[] = [
    { id: 6, name: "Item 6", description: "Description for Item 6" },
    { id: 7, name: "Item 7", description: "Description for Item 7" },
  ]
  const [source, setSource] = useState<Item[]>(initialSourceItems);
  const [target, setTarget] = useState<Item[]>(initialTargetItems);

  const handleChange2 = (e: { source: Item[]; target: Item[] }) => {
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



  const events: SchedulerEvent[] = [
    {
      id: "1",
      title: "Meeting with John",
      start: new Date("2023-10-05T10:00:00"),
      end: new Date("2023-10-05T11:00:00"),
      resourceId: "1",
      color: "#FF9800",
      description: "Discuss project details",
      status: "confirmed",
    },
    {
      id: "2",
      title: "Team Lunch",
      start: new Date("2023-10-06T12:00:00"),
      end: new Date("2023-10-06T13:00:00"),
      resourceId: "2",
      color: "#4CAF50",
      description: "Casual lunch with the team",
      status: "tentative",
    },
    {
      id: "3",
      title: "Client Presentation",
      start: new Date("2023-10-07T14:00:00"),
      end: new Date("2023-10-07T15:00:00"),
      resourceId: "3",
      color: "#2196F3",
      description: "Present project to client",
      status: "confirmed",
    },
  ];

  const resources: Resource[] = [
    { id: "1", title: "Resource A" },
    { id: "2", title: "Resource B" },
    { id: "3", title: "Resource C" },
  ];

  const handleEventClick = (event: SchedulerEvent) => {
    console.log("Event Clicked:", event);
  };

  const handleEventChange = (event: SchedulerEvent, start: Date, end: Date) => {
    console.log("Event Changed:", event, start, end);
  };

  const handleDateChange = (date: Date) => {
    console.log("Date Changed:", date);
  };

  const handleViewChange = (view: "day" | "week" | "month" | "timeline") => {
    console.log("View Changed:", view);
  };



  const initialData2: Cell[][] = [
    [
      { value: "Hello", formula: "=A1+B1" },
      { value: "World", formula: "=A1-B1" },
    ],
    [
      { value: "10", formula: "=A1*2" },
      { value: "20", formula: "=B1/2" },
    ],
  ];
  const handleCellChange2 = (row: number, col: number, cell: Cell) => {
    console.log(`Cell changed at ${row},${col}:`, cell);
  };



  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

  const data4: TreeNode[] = [
    {
      key: "1",
      label: "Node 1",
      children: [
        {
          key: "1.1",
          label: "Child Node 1.1",
        },
        {
          key: "1.2",
          label: "Child Node 1.2",
        },
      ],
    },
    {
      key: "2",
      label: "Node 2",
      children: [
        {
          key: "2.1",
          label: "Child Node 2.1",
        },
        {
          key: "2.2",
          label: "Child Node 2.2",
        },
      ],
    },
  ];
  const handleSelectionChange4 = (e: { keys: string[] }) => {
    setSelectedKeys(e.keys);
  };

  const handleExpand4 = (e: { keys: string[] }) => {
    setExpandedKeys(e.keys);
  };


  const [selectedKeys5, setSelectedKeys5] = useState<string[]>([]);
  const [expandedKeys5, setExpandedKeys5] = useState<string[]>([]);

  const data5: TreeTableNode[] = [
    {
      key: "1",
      data: { name: "Parent Node 1", value: 10 },
      children: [
        {
          key: "1.1",
          data: { name: "Child Node 1.1", value: 5 },
        },
        {
          key: "1.2",
          data: { name: "Child Node 1.2", value: 7 },
        },
      ],
    },
    {
      key: "2",
      data: { name: "Parent Node 2", value: 15 },
      children: [
        {
          key: "2.1",
          data: { name: "Child Node 2.1", value: 8 },
        },
        {
          key: "2.2",
          data: { name: "Child Node 2.2", value: 12 },
        },
      ],
    },
  ];

  const columns5: TreeTableColumn[] = [
    {
      field: "name",
      header: "Name",
      sortable: true,
    },
    {
      field: "value",
      header: "Value",
      body: (node) => <span>{node.data.value}</span>,
      sortable: true,
    },
  ];

  const handleSelectionChange5 = (e: { keys: string[] }) => {
    setSelectedKeys5(e.keys);
  };

  const handleExpand5 = (e: { keys: string[] }) => {
    setExpandedKeys5(e.keys);
  };

  const columns6: Column<Item>[] = [
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



  const [data6, setData6] = useState<Item[]>(initialData);

  const handleSort6 = (field: keyof Item | string, direction: "asc" | "desc") => {
    const sortedData = [...data].sort((a, b) => {
      if (typeof a[field as keyof Item] === "string" && typeof b[field as keyof Item] === "string") {
        return direction === "asc"
          ? a[field as keyof Item].localeCompare(b[field as keyof Item])
          : b[field as keyof Item].localeCompare(a[field as keyof Item]);
      }
      return direction === "asc"
        ? (a[field as keyof Item] as number) - (b[field as keyof Item] as number)
        : (b[field as keyof Item] as number) - (a[field as keyof Item] as number);
    });
    setData6(sortedData);
  };
  const handleRowClick6 = (item: Item) => {
    console.log("Row clicked:", item);
  };

  return (
    <div className="p-4 space-y-4">
       <VirtualDataGrid
        data={data6}
        columns={columns6}
        rowHeight={48}
        headerHeight={48}
        className="custom-virtual-grid"
        tableClassName="custom-table"
        headerClassName="custom-header"
        rowClassName="custom-row"
        cellClassName="custom-cell"
        overscan={5}
        onSort={handleSort6}
        onRowClick={handleRowClick6}
        loading={false}
        loadingTemplate={
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Loading...</span>
            </div>
          </div>
        }
        emptyTemplate={<span>No data available</span>}
      />
      <TreeTable
        value={data5}
        columns={columns5}
        selectionMode="multiple"
        selectedKeys={selectedKeys5}
        expandedKeys={expandedKeys5}
        className="custom-tree-table"
        tableClassName="custom-table"
        headerClassName="custom-header"
        bodyClassName="custom-body"
        rowClassName="custom-row"
        cellClassName="custom-cell"
        onSelectionChange={handleSelectionChange5}
        onExpand={handleExpand5}
        onSort={(e) => console.log("Sorted by:", e.field, e.order)}
      />
      <Tree
        value={data4}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        className="custom-tree"
        nodeClassName="custom-node"
        contentClassName="custom-content"
        togglerClassName="custom-toggler"
        filter={true}
        filterPlaceholder="Search..."
        filterBy="label"
        onSelectionChange={handleSelectionChange4}
        onExpand={handleExpand4}
        nodeTemplate={(node) => (
          <div className="flex items-center">
            {node.icon && <div className="mr-2">{node.icon}</div>}
            <span>{node.label}</span>
            {node.data && <span>({node.data})</span>}
          </div>
        )}
      />
    
      <SpreadsheetGrid
        data={initialData2}
        columns={5}
        rows={10}
        className="custom-spreadsheet"
        cellClassName="custom-cell"
        headerClassName="custom-header"
        selectedCellClassName="custom-selected-cell"
        onChange={(newData) => console.log("Data changed:", newData)}
        onCellChange={handleCellChange2}
      />

      <Scheduler
        events={events}
        resources={resources}
        view="week"
        date={new Date()}
        minTime={8}
        maxTime={18}
        step={30}
        onEventClick={handleEventClick}
        onEventChange={handleEventChange}
        onDateChange={handleDateChange}
        onViewChange={handleViewChange}
        className="custom-scheduler"
        variant="bordered"
        size="lg"
      />

      <PickList
        source={source}
        target={target}
        sourceHeader={<h2>Available Items</h2>}
        targetHeader={<h2>Selected Items</h2>}
        showSourceControls={true}
        showTargetControls={true}
        itemTemplate={itemTemplate}
        className="custom-pick-list"
        sourceClassName="custom-source-list"
        targetClassName="custom-target-list"
        itemClassName="custom-item"
        onChange={handleChange2}
        filterBy="name"
        sourceFilterPlaceholder="Search Available Items..."
        targetFilterPlaceholder="Search Selected Items..."
        dragdrop={true}
        onSourceItemClick={handleSourceItemClick}
        onTargetItemClick={handleTargetItemClick}
      />
       <OrganizationChart
        value={orgChart}
        selectionMode="multiple"
        selection={selection}
        nodeTemplate={customNodeTemplate}
        onSelectionChange={handleSelectionChange3}
        onNodeClick={handleNodeClick2}
        onExpand={handleExpand}
        onCollapse={handleCollapse}
        className="custom-org-chart"
        nodeClassName="custom-node"
      />

      <MasterDetailGrid
        data={data}
        columns={columns}
        detailTemplate={detailTemplate}
        expandedRows={expandedRows}
        onRowExpand={handleRowExpand}
        onRowCollapse={handleRowCollapse}
        onSort={handleSort}
        loading={false}
        loadingTemplate={
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Loading...</span>
            </div>
          </div>
        }
        className="custom-master-detail-grid"
        tableClassName="custom-table"
        headerClassName="custom-header"
        rowClassName="custom-row"
        cellClassName="custom-cell"
        detailClassName="custom-detail"
      />
      <Kanban
        columns={columnsK}
        onDragEnd={handleDragEnd}
        variant="solid"
        size="lg"
        className="custom-kanban"
      />

      <InfiniteDataGrid
        data={data}
        columns={columns}
        loading={loading}
        hasMore={hasMore}
        onLoadMore={handleLoadMore}
        loadingTemplate={
          <div className="flex items-center justify-center p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span>Loading...</span>
            </div>
          </div>
        }
        className="custom-data-grid"
        tableClassName="custom-table"
        headerClassName="custom-header"
        rowClassName="custom-row"
        cellClassName="custom-cell"
        onSort={handleSort}
        onRowClick={handleRowClick}
      />


      <DataTable<Item>
        data={items}
        columns={columns}
        sortable={true}
        pagination={true}
        pageSize={2}
        selectable={true}
        onSort={handleSort}
        onSelectionChange={handleSelectionChange}
        variant="striped"
        size="md"
        className="border rounded-lg"
      />
      <DataView
        data={items}
        layout="grid" // أو "list" لتغيير التنسيق
        paginator={true}
        rows={10}
        first={0}
        totalRecords={items.length}
        pageLinks={5}
        rowsPerPageOptions={[10, 20, 50]}
        paginatorPosition="both"
        emptyMessage="No items available."
        onPage={handlePageChange}
        itemTemplate={renderItem}
        className="custom-data-view"
        gridClassName="custom-grid"
        listClassName="custom-list"
        itemClassName="custom-item"
      />

      <EditableDataGrid
        data={items}
        columns={columnsEdit}
        onChange={handleDataChange}
        onCellChange={handleCellChange}
        onValidationError={handleValidationError}
        className="custom-data-grid"
        tableClassName="custom-table"
        headerClassName="custom-header"
        rowClassName="custom-row"
        cellClassName="custom-cell"
        editCellClassName="custom-edit-cell"
      />



    
      <GroupDataGrid
        data={initialData}
        columns={columns}
        groupBy={[{ field: "department", direction: "asc" }]}
        onSort={handleSort}
        onGroup={handleGroup}
        onExpandGroup={handleExpandGroup}
        onRowClick={handleRowClick}
        className="custom-data-grid"
        tableClassName="custom-table"
        headerClassName="custom-header"
        rowClassName="custom-row"
        cellClassName="custom-cell"
        groupRowClassName="custom-group-row"
      />
    </div>
  );
};

export default DataGridExample;
