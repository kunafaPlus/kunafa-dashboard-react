'use client';

import React from 'react';
import { AdvancedNavbar } from './AdvancedNavbar';
import { AdvancedSidebar } from './AdvancedSidebar';
import { CommandNavbar } from './CommandNavbar';
import { Flex } from './Flex';
import { Grid } from './Grid';
import { SimpleNavbar } from './SimpleNavbar';
import { SimpleSidebar } from './SimpleSidebar';
import { FiHome, FiUser, FiSettings, FiMail, FiSearch, FiMenu, FiBell } from 'react-icons/fi';
import CustomCard from '../panel/components/CustomCard';

export default function LayoutExample() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isAdvancedSidebarOpen, setIsAdvancedSidebarOpen] = React.useState(false);

  // Sample navigation items
  const navItems = [
    { icon: <FiHome />, label: 'Home', href: '#' },
    { icon: <FiUser />, label: 'Profile', href: '#' },
    { icon: <FiMail />, label: 'Messages', href: '#' },
    { icon: <FiSettings />, label: 'Settings', href: '#' },
  ];

  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/images/avatar.jpg',
  };

  return (
    <div className="space-y-6">
      {/* Navigation Bars */}
      <CustomCard title="Navigation Bars" className="space-y-4">
        <div className="space-y-8">
          {/* Simple Navbar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Simple Navbar</h3>
            <div className="border rounded-lg overflow-hidden">
              <SimpleNavbar
                logo="/images/logo.svg"
              />
            </div>
          </div>

          {/* Advanced Navbar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Advanced Navbar</h3>
            <div className="border rounded-lg overflow-hidden">
              <AdvancedNavbar
                logo="/images/logo.svg"
                items={navItems}
                
              />
            </div>
          </div>

          {/* Command Navbar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Command Navbar</h3>
            <div className="border rounded-lg overflow-hidden">
              <CommandNavbar
                logo="/images/logo.svg"
                placeholder="Press ⌘K to search..."
                commands={[
                ]}
              />
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Sidebars */}
      <CustomCard title="Sidebars" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Simple Sidebar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Simple Sidebar</h3>
            <div className="border rounded-lg overflow-hidden h-[400px] relative">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="absolute top-4 left-4 z-10"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <SimpleSidebar
                sections={[]}
              />
              <div className="p-4 ml-16">Content area</div>
            </div>
          </div>

          {/* Advanced Sidebar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Advanced Sidebar</h3>
            <div className="border rounded-lg overflow-hidden h-[400px] relative">
              <button
                onClick={() => setIsAdvancedSidebarOpen(!isAdvancedSidebarOpen)}
                className="absolute top-4 left-4 z-10"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <AdvancedSidebar
                sections={[]}
                footer={[]}
              />
              <div className="p-4 ml-16">Content area</div>
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Flex Layout */}
      <CustomCard title="Flex Layout" className="space-y-4">
        <div className="space-y-4">
          {/* Row Layout */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Row Layout</h3>
            <Flex direction="row" gap={4} className="bg-gray-100 p-4 rounded">
              <div className="bg-white p-4 rounded shadow">Item 1</div>
              <div className="bg-white p-4 rounded shadow">Item 2</div>
              <div className="bg-white p-4 rounded shadow">Item 3</div>
            </Flex>
          </div>

          {/* Column Layout */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Column Layout</h3>
            <Flex  gap={4} className="bg-gray-100 p-4 rounded">
              <div className="bg-white p-4 rounded shadow">Item 1</div>
              <div className="bg-white p-4 rounded shadow">Item 2</div>
              <div className="bg-white p-4 rounded shadow">Item 3</div>
            </Flex>
          </div>

          {/* Complex Layout */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Complex Layout</h3>
            <Flex direction="row" gap={4} className="bg-gray-100 p-4 rounded">
              <Flex gap={4} className="flex-1">
                <div className="bg-white p-4 rounded shadow">Sidebar</div>
                <div className="bg-white p-4 rounded shadow">Navigation</div>
              </Flex>
              <Flex gap={4} className="flex-2">
                <div className="bg-white p-4 rounded shadow">Main Content</div>
                <Flex direction="row" gap={4}>
                  <div className="bg-white p-4 rounded shadow flex-1">Footer Left</div>
                  <div className="bg-white p-4 rounded shadow flex-1">Footer Right</div>
                </Flex>
              </Flex>
            </Flex>
          </div>
        </div>
      </CustomCard>

      {/* Grid Layout */}
      <CustomCard title="Grid Layout" className="space-y-4">
        <div className="space-y-4">
          {/* Basic Grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic Grid</h3>
            <Grid  gap={4} className="bg-gray-100 p-4 rounded">
              <div className="bg-white p-4 rounded shadow">Item 1</div>
              <div className="bg-white p-4 rounded shadow">Item 2</div>
              <div className="bg-white p-4 rounded shadow">Item 3</div>
              <div className="bg-white p-4 rounded shadow">Item 4</div>
              <div className="bg-white p-4 rounded shadow">Item 5</div>
              <div className="bg-white p-4 rounded shadow">Item 6</div>
            </Grid>
          </div>

          {/* Responsive Grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Responsive Grid</h3>
            <Grid
              
              gap={4}
              className="bg-gray-100 p-4 rounded"
            >
              <div className="bg-white p-4 rounded shadow">Item 1</div>
              <div className="bg-white p-4 rounded shadow">Item 2</div>
              <div className="bg-white p-4 rounded shadow">Item 3</div>
              <div className="bg-white p-4 rounded shadow">Item 4</div>
            </Grid>
          </div>

          {/* Complex Grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Complex Grid</h3>
            <Grid
              
              gap={4}
              className="bg-gray-100 p-4 rounded"
            >
              <div className="bg-white p-4 rounded shadow" style={{ gridArea: 'header' }}>
                Header
              </div>
              <div className="bg-white p-4 rounded shadow" style={{ gridArea: 'sidebar' }}>
                Sidebar
              </div>
              <div className="bg-white p-4 rounded shadow" style={{ gridArea: 'main' }}>
                Main Content
              </div>
              <div className="bg-white p-4 rounded shadow" style={{ gridArea: 'footer' }}>
                Footer
              </div>
            </Grid>
          </div>
        </div>
      </CustomCard>
    </div>
  );
}
