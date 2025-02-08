import { Route, Routes } from "react-router-dom";
import BasicForm from "./pages/input/view/BasicForm";
import AdditionalForms from "./pages/input/view/AdditionalForms";
import AdvancedForm from "./pages/input/view/AdvancedForm";
import Button from "./pages/Button/Button";
import Dialog from "./pages/dialog/view/Dialog";
import MiscExample from "./pages/misc/views/MiscExample";
import PanelsExample from "./pages/panel/views/PanelsExample";
import NavigationExample from "./pages/misc/views/NavigationExample";
import LayoutExample from "./pages/layout/LayoutExample";
import BasicDataGrid from "./pages/data-table/views/BasicDataGrid";
import VirtualDataGridExample from "./pages/data-table/views/VirtualDataGrid";
import EditableDataGridExample from "./pages/data-table/views/EditableDataGrid";
import TreeTableExample from "./pages/data-table/views/TreeTable";
import KanbanBoardExample from "./pages/data-table/views/KanbanBoard";
import OrganizationChartExample from "./pages/data-table/views/OrganizationChart";
import SchedulerExample from "./pages/data-table/views/Scheduler";
import PickListExample from "./pages/data-table/views/PickList";
import SpreadsheetGridExample from "./pages/data-table/views/SpreadsheetGrid";
import CarouselExample from "./pages/carousel/CarouselExample";


// تعريف المسارات
export const AppRouter = () => {
  return (
    <Routes>
      <Route path="/form">
        <Route index element={<BasicForm />} />
        <Route path="additional-form" element={<AdditionalForms />} />
        <Route path="advance-form" element={<AdvancedForm />} />
      </Route>
      <Route path="/button">
        <Route index element={<Button />} />
      </Route>
      <Route path="/dialog" element={<Dialog />} />
      <Route path="/carousel" element={<CarouselExample />} />
      <Route path="/data-table" >
        {/* استخدم Route فرعي هنا */}
        <Route path="basic" element={<BasicDataGrid />} />
        <Route path="editable" element={<EditableDataGridExample />} />
        <Route path="virtual" element={<VirtualDataGridExample />} />
        <Route path="tree-table" element={<TreeTableExample />} />
        <Route path="org-chart" element={<OrganizationChartExample />} />
        <Route path="kanban" element={<KanbanBoardExample />} />
        <Route path="scheduler" element={<SchedulerExample />} />
        <Route path="picklist" element={<PickListExample />} />
        <Route path="spreadsheet" element={<SpreadsheetGridExample />} />
      </Route>
      <Route path="/navigation" element={<MiscExample />} />
      <Route path="/misc" element={<NavigationExample />} />
      <Route path="/panel" element={<PanelsExample />} />
      <Route path="/layout" element={<LayoutExample />} />
    </Routes>
  );
};
