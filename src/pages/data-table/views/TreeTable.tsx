import * as React from "react";
import { TreeTable } from "../components/TreeTable";
import { TreeTableNode, TreeTableColumn } from "../../data-table/types";

const TreeTableExample: React.FC = () => {
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = React.useState<string[]>([]);

  const data: TreeTableNode[] = [
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

  const columns: TreeTableColumn[] = [
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

  const handleSelectionChange = (e: { keys: string[] }) => {
    setSelectedKeys(e.keys);
  };

  const handleExpand = (e: { keys: string[] }) => {
    setExpandedKeys(e.keys);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Tree Table</h1>
      <TreeTable
        value={data}
        columns={columns}
        selectionMode="multiple"
        selectedKeys={selectedKeys}
        expandedKeys={expandedKeys}
        className="custom-tree-table"
        tableClassName="custom-table"
        headerClassName="custom-header"
        bodyClassName="custom-body"
        rowClassName="custom-row"
        cellClassName="custom-cell"
        onSelectionChange={handleSelectionChange}
        onExpand={handleExpand}
        onSort={(e) => console.log("Sorted by:", e.field, e.order)}
      />
    </div>
  );
};

export default TreeTableExample;
