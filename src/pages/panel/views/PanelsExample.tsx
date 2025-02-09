import React, { useState } from "react";
import CustomCard from "../../../components/panel/CustomCard";
import { Accordion } from "../../../components/panel/Accordion";
import { CardPanel } from "../../../components/panel/CardPanel";
import { CollapsiblePanel } from "../../../components/panel/CollapsiblePanel";
import { CustomTab } from "../../../components/panel/CustomTab";
import { DockPanel } from "../../../components/panel/DockPanel";
import { Drawer } from "../../../components/panel/Drawer";
import { ExpansionPanel } from "../../../components/panel/ExpansionPanel";
import { FloatingPanel } from "../../../components/panel/FloatingPanel";
import { GridPanel } from "../../../components/panel/GridPanel";
import { ResizablePanel } from "../../../components/panel/ResizablePanel";
import { ScrollArea } from "../../../components/panel/ScrollArea";
import { SidePanel } from "../../../components/panel/SidePanel";
import { Stepper } from "../../../components/panel/Stepper";
import {
  Tab,
  Tabs,
  
} from "../../../components/panel/Tabs";
import { Timeline } from "../../../components/panel/Timeline";
import { TreeView } from "../../../components/panel/TreeView";
import {
  FiSettings,
  FiUser,
  FiMail,
  FiBox,
  FiGrid,
  FiLayout,
  FiAlertCircle,
} from "react-icons/fi";
import { BiCheckCircle } from "react-icons/bi";
import { BsInfo } from "react-icons/bs";
import { CgLock } from "react-icons/cg";

export default function PanelsExample() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [isSidePanelOpen, setIsSidePanelOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("tab1");
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTreeItems, setSelectedTreeItems] = React.useState<string[]>(
    []
  );
  const [activeTimelineItem, setActiveTimelineItem] = React.useState([0]);

  // Sample data for various components
  const accordionItems = [
    {
      title: "Section 1",
      content:
        "This is the content of section 1. It can contain any content you want.",
    },
    {
      title: "Section 2",
      content:
        "This is the content of section 2. You can put text, components, or anything else here.",
    },
    {
      title: "Section 3",
      content:
        "This is the content of section 3. Make it as long or short as needed.",
    },
  ];
  const items = [
    {
      id: "1",
      title: "Project Created",
      description: "Project was created by John",
      date: "2024-01-01",
      icon: <BiCheckCircle className="w-4 h-4 text-white" />,
      variant: "success",
    },
    {
      id: "2",
      title: "Design Phase",
      description: "Design phase started",
      date: "2024-01-15",
      icon: <FiAlertCircle className="w-4 h-4 text-white" />,
      variant: "warning",
    },
    {
      id: "3",
      title: "Development",
      description: "Development phase started",
      date: "2024-02-01",
      icon: <BsInfo className="w-4 h-4 text-white" />,
      variant: "info",
    },
    {
      id: "4",
      title: "Testing",
      description: "Testing phase started",
      date: "2024-02-15",
      icon: <CgLock className="w-4 h-4 text-white" />,
      variant: "default",
    },
  ];

  const tabItems = [
    {
      id: "tab1",
      label: "Profile",
      icon: <FiUser />,
      content: "Profile Content",
    },
    {
      id: "tab2",
      label: "Settings",
      icon: <FiSettings />,
      content: "Settings Content",
    },
    {
      id: "tab3",
      label: "Messages",
      icon: <FiMail />,
      content: "Messages Content",
    },
  ];
  const [selectedTab, setSelectedTab] = React.useState("tab1");

  const dockItems = [
    {
      id: "dock1",
      label: "Files",
      icon: <FiBox className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h4 className="font-medium mb-2">Files Panel</h4>
          <p>Files content goes here</p>
        </div>
      ),
    },
    {
      id: "dock2",
      label: "Layout",
      icon: <FiLayout className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h4 className="font-medium mb-2">Layout Panel</h4>
          <p>Layout content goes here</p>
        </div>
      ),
    },
    {
      id: "dock3",
      label: "Grid",
      icon: <FiGrid className="w-5 h-5" />,
      content: (
        <div className="p-4">
          <h4 className="font-medium mb-2">Grid Panel</h4>
          <p>Grid content goes here</p>
        </div>
      ),
    },
  ];

  const steps = [
    {
      title: "الخطوة الأولى",
      description: "هذه هي الخطوة الأولى",
      content: <div>محتوى الخطوة الأولى</div>,
    },
    {
      title: "الخطوة الثانية",
      description: "هذه هي الخطوة الثانية",
      content: <div>محتوى الخطوة الثانية</div>,
    },
    {
      title: "الخطوة الثالثة",
      description: "هذه هي الخطوة الثالثة",
      content: <div>محتوى الخطوة الثالثة</div>,
    },
  ];

  const treeItems = [
    {
      id: "1",
      label: "Documents",
      icon: <FiBox className="w-5 h-5" />,
      children: [
        {
          id: "1.1",
          label: "Work",
          icon: <FiLayout className="w-5 h-5" />,
          children: [
            {
              id: "1.1.1",
              label: "Presentations",
              icon: <FiGrid className="w-5 h-5" />,
            },
            {
              id: "1.1.2",
              label: "Reports",
              icon: <FiGrid className="w-5 h-5" />,
            },
          ],
        },
        {
          id: "1.2",
          label: "Personal",
          icon: <FiLayout className="w-5 h-5" />,
          children: [
            {
              id: "1.2.1",
              label: "Photos",
              icon: <FiGrid className="w-5 h-5" />,
            },
            {
              id: "1.2.2",
              label: "Documents",
              icon: <FiGrid className="w-5 h-5" />,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 p-6 bg-white mx-4 rounded-xl shadow-2xs">
      {/* Basic Panels Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Basic Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Card Panel</h3>
            <CardPanel title="Sample Card" className="p-4 shadow-sm">
              <p>This is a basic card panel with a title and content.</p>
            </CardPanel>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Collapsible Panel</h3>
            <CollapsiblePanel title="Click to Toggle">
              <p>This content can be shown or hidden by clicking the header.</p>
            </CollapsiblePanel>
          </div>
        </div>
      </section>

      {/* Interactive Panels Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Interactive Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Accordion</h3>
            <Accordion items={accordionItems} />
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tabs</h3>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
      {/* التبويبات */}
       <Tab value="tab1">محتوى التبويب 1</Tab>
            <Tab value="tab2" disabled>محتوى التبويب 2 (معطل)</Tab>
            <Tab value="tab3">محتوى التبويب 3</Tab>
     
    </Tabs>
          </div>
        </div>
      </section>

      {/* Navigation Panels Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Navigation Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Stepper</h3>
            {/* <Stepper activeStep={activeStep} steps={steps.map((step) => step.label)} onChange={setActiveStep} />4 */}
            <div className="p-6">
              <Stepper
                steps={steps}
                activeStep={activeStep}
                onChange={setActiveStep}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Timeline</h3>
            {/* <Timeline items={timelineItems} /> */}
            <Timeline
              items={items}
              variant="bordered"
              orientation="vertical"
              lineStyle="dashed"
              lineColor="bg-gray-300"
              dotSize="lg"
            />
          </div>
        </div>
      </section>

      {/* Layout Panels Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Layout Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Grid Panel</h3>
            <GridPanel className="gap-4 grid-cols-2">
              <div className="bg-white p-4 rounded shadow-sm">Item 1</div>
              <div className="bg-white p-4 rounded shadow-sm">Item 2</div>
              <div className="bg-white p-4 rounded shadow-sm">Item 3</div>
              <div className="bg-white p-4 rounded shadow-sm">Item 4</div>
            </GridPanel>
          </div>


        </div>
      </section>

      {/* Scrollable Content Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Scrollable Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Scroll Area</h3>
            <ScrollArea className="h-40">
              <div className="space-y-4 p-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <p key={i}>Scrollable content item {i + 1}</p>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Tree View</h3>
            <TreeView data={treeItems} />
          </div>
        </div>
      </section>

      {/* Overlay Panels Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Overlay Panels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Drawer</h3>
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Open Drawer
            </button>
            <Drawer
              open={isDrawerOpen}
              onClose={() => setIsDrawerOpen(false)}
              title="Drawer Example"
            >
              <div className="p-4">
                <p>This is the drawer content.</p>
              </div>
            </Drawer>
          </div>


        </div>
      </section>


    </div>
  );
}
