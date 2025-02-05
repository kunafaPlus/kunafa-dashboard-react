import { AdvancedNavbar } from "./pages/layout/AdvancedNavbar";
import {
  AdvancedSidebar,
  SidebarSection,
} from "./pages/layout/AdvancedSidebar";
import PerfectScrollbar from "react-perfect-scrollbar";

import { MdInput } from "react-icons/md";
import { AppRouter } from "./router";

function App() {
  const sidebarSections: SidebarSection[] = [
    {
      id: "section-1",
      title: "Form",
      items: [
        {
          id: "item-basic",
          icon: <MdInput />,
          label: "Basic Form",
          href: "/form",
        },
        {
          id: "item-additional-form",
          icon: <MdInput />,
          label: "Additional Form",
          href: "/form/additional-form",
        },
        {
          id: "item-advance-form",
          icon: <MdInput />,
          label: "Advance Form",
          href: "/form/advance-form",
        },
      ],
    },
    {
      id: "section-2",
      title: "Button",
      items: [
        {
          id: "button",
          icon: <MdInput />,
          label: "button ",
          href: "/button",
        },
      ],
    },
    {
      id: "section-3",
      title: "Dialog",
      items: [
        {
          id: "dialog",
          icon: <MdInput />,
          label: "dialog ",
          href: "/dialog",
        },
      ],
    },
    {
      id: "section-4",
      title: "panel",
      items: [
        {
          id: "panel",
          icon: <MdInput />,
          label: "panel ",
          href: "/panel",
        },
      ],
    },
    {
      id: "section-5",
      title: "misc",
      items: [
        {
          id: "misc",
          icon: <MdInput />,
          label: "misc ",
          href: "/misc",
        },
        {
          id: "navigation",
          icon: <MdInput />,
          label: "navigation ",
          href: "/navigation",
        },
        {
          id: "layout",
          icon: <MdInput />,
          label: "layout ",
          href: "/layout",
        },
      ],
    },
    {
      id: "section-6",
      title: "data table",
      items: [
        {
          href: "/data-table/basic",
          label: "Basic Data Grid",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/editable",
          label: "Editable Data Grid",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/virtual",
          label: "Virtual Data Grid",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/tree-table",
          label: "Tree Table",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/org-chart",
          label: "Organization Chart",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/kanban",
          label: "Kanban Board",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/scheduler",
          label: "Scheduler",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/picklist",
          label: "Pick List",
          id: "layout",
          icon: <MdInput />,
        },
        {
          href: "/data-table/spreadsheet",
          label: "Spreadsheet Grid",
          id: "layout",
          icon: <MdInput />,
        },
      ],
    },
    {
      id: "section-7",
      title: "carousel",
      items: [
        {
          id: "carousel",
          icon: <MdInput />,
          label: "carousel ",
          href: "/carousel",
        },
      ],
    },
    {
      id: "section-8",
      title: "navigation",
      items: [],
    },
  ];
  return (
    <div className="flex overflow-hidden max-h-screen  ">
      <AdvancedSidebar
        sections={sidebarSections}
        header={<div>My App</div>}
        footer={<div>Footer Content</div>}
        collapsible
        defaultCollapsed={false}
        showCollapseButton
        sidebarHeight="100vh"
        showSearch
        searchPlaceholder="Search..."
        onCollapsedChange={(collapsed) => {
          console.log("Sidebar collapsed:", collapsed);
        }}
      />

      <div className="overflow-scroll overflow-x-hidden w-[100vw] bg-gray-50">
        <AdvancedNavbar />
        <main className="w-full p-4">
          <PerfectScrollbar
            options={{
              wheelSpeed: 1,
              wheelPropagation: true,
              minScrollbarLength: 20,
            }}
          >
            <AppRouter />
          </PerfectScrollbar>
        </main>
      </div>
    </div>
  );
}

export default App;
