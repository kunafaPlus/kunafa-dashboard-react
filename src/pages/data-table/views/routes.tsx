import { RouteObject } from "react-router-dom";
import BasicDataGrid from "./BasicDataGrid";
import EditableDataGrid from "./EditableDataGrid";
import VirtualDataGrid from "./VirtualDataGrid";
import TreeTable from "./TreeTable";
import OrganizationChart from "./OrganizationChart";
import KanbanBoard from "./KanbanBoard";
import Scheduler from "./Scheduler";
import PickList from "./PickList";
import SpreadsheetGrid from "./SpreadsheetGrid";
import DataGridExamples from "./index";

export const dataGridRoutes: RouteObject[] = [
  {
    path: "data-grid-examples",
    children: [
      {
        index: true,
        element: <DataGridExamples />,
      },
      {
        path: "basic",
        element: <BasicDataGrid />,
      },
      {
        path: "editable",
        element: <EditableDataGrid />,
      },
      {
        path: "virtual",
        element: <VirtualDataGrid />,
      },
      {
        path: "tree-table",
        element: <TreeTable />,
      },
      {
        path: "org-chart",
        element: <OrganizationChart />,
      },
      {
        path: "kanban",
        element: <KanbanBoard />,
      },
      {
        path: "scheduler",
        element: <Scheduler />,
      },
      {
        path: "picklist",
        element: <PickList />,
      },
      {
        path: "spreadsheet",
        element: <SpreadsheetGrid />,
      },
    ],
  },
];
