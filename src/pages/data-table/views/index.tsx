import * as React from "react";
import { Link } from "react-router-dom";

const DataGridExamples: React.FC = () => {
  const examples = [
    { path: "basic", name: "Basic Data Grid" },
    { path: "editable", name: "Editable Data Grid" },
    { path: "virtual", name: "Virtual Data Grid" },
    { path: "tree-table", name: "Tree Table" },
    { path: "org-chart", name: "Organization Chart" },
    { path: "kanban", name: "Kanban Board" },
    { path: "scheduler", name: "Scheduler" },
    { path: "picklist", name: "Pick List" },
    { path: "spreadsheet", name: "Spreadsheet Grid" },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Data Grid Examples</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {examples.map((example) => (
          <Link
            key={example.path}
            to={example.path}
            className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 hover:border-gray-300"
          >
            <h2 className="text-lg font-semibold text-gray-800">{example.name}</h2>
            <p className="mt-2 text-sm text-gray-600">
              Click to view the {example.name.toLowerCase()} example
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DataGridExamples;
