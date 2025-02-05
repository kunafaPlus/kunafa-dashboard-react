import * as React from "react";
import { OrganizationChart, OrgChartNode } from "../components/OrganizationChart";

const OrganizationChartExample: React.FC = () => {
  const [selection, setSelection] = React.useState<OrgChartNode[]>([]);

  const [orgChart] = React.useState<OrgChartNode>({
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

  const handleSelectionChange = (selectedNodes: OrgChartNode[]) => {
    setSelection(selectedNodes);
    console.log("Selected Nodes:", selectedNodes);
  };

  const handleNodeClick = (node: OrgChartNode) => {
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

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Organization Chart</h1>
      <OrganizationChart
        value={orgChart}
        selectionMode="multiple"
        selection={selection}
        onSelectionChange={handleSelectionChange}
        onNodeClick={handleNodeClick}
        onNodeExpand={handleExpand}
        onNodeCollapse={handleCollapse}
        nodeTemplate={customNodeTemplate}
      />
    </div>
  );
};

export default OrganizationChartExample;
