import { AdvancedNavbar } from "./pages/layout/AdvancedNavbar";
import { AdvancedSidebar, SidebarSection } from "./pages/layout/AdvancedSidebar";
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
