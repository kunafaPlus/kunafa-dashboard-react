'use client';

import React from 'react';
import { Badge } from '../components/Badge';
import { Command } from '../components/Command';
import { CustomAlert } from '../components/CustomAlert';
import { CustomRating } from '../components/CustomRating';
import { Popover } from '../components/Popover';
import { Skeleton } from '../components/Skeleton';
import { Sortable } from '../components/Sortable';
import { Tooltip } from '../components/Tooltip';
import { VirtualList } from '../components/VirtualList';
import { Visible } from '../components/Visible';
import { FiUser , FiAlertCircle, FiInfo, FiCheck, FiX, FiStar, FiTag } from 'react-icons/fi';
import Avatar from '../components/Avatar';
import CounterWithLabel from '../components/CounterWithLabel';
import { CustomTag } from '../components/CustomTage';
import CustomCard from '../../panel/components/CustomCard';

export default function MiscExample() {
  const [rating, setRating] = React.useState(3);
  const [sortableItems, setSortableItems] = React.useState([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' },
  ]);

  // Sample data for virtual list
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    content: `Item ${i + 1}`,
  }));

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      {/* User Interface Elements */}
      <CustomCard title="User  Interface Elements" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Avatar and Badge */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Avatar and Badge</h3>
            <div className="flex items-center gap-4">
              <Avatar title="User " subTitle="md" />
              <Badge content="New" />
              <Badge content="3" variant="warning" />
              <Badge content="Online" variant="success" />
            </div>
          </div>

          {/* Counter and Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Counter </h3>
            <div className="flex items-center gap-4">
              <CounterWithLabel title="Items" />
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Alerts and Notifications */}
      <CustomCard title="Alerts and Notifications" className="space-y-4">
        <div className="space-y-4">
          {/* Alert Types */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Alert Types</h3>
            <div className="space-y-2">
              <CustomAlert  variant="info" title="Info Alert" message="This is an informational message" type="info" icon={<FiInfo />} />
              <CustomAlert  variant="success" title="Success Alert" message="Operation completed successfully" type="success" icon={<FiCheck />} />
              <CustomAlert  variant="warning" title="Warning Alert" message="Please be cautious" type="warning" icon={<FiAlertCircle />} />
              <CustomAlert  variant="error" title="Error Alert" message="An error occurred" type="error" icon={<FiX />} />

             
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Interactive Components */}
      <CustomCard title="Interactive Components" className="space-y-4 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Command and Tags */}
            <div className="flex flex-wrap gap-2">
              <CustomTag label="React" icon={<FiTag />} variant="primary" />
              <CustomTag label="TypeScript" icon={<FiTag />} variant="secondary" />
              <CustomTag label="Tailwind" icon={<FiTag />} variant="success" />
          </div>

          {/* Tooltip and Popover */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Tooltip and Popover</h3>
            <div className="flex items-center gap-4">
              <Tooltip content="This is a tooltip">
                <button className="px-4 py-2 bg-primary text-white rounded transition duration-200 hover:bg-primary-dark">
                  Hover me
                </button>
              </Tooltip>
              <Popover
                trigger={
                  <button className="px-4 py-2 bg-primary text-white rounded transition duration-200 hover:bg-primary-dark">
                    Click me
                  </button>
                }
              />
            </div>
          </div>
        </div>
      </CustomCard>

      {/* Loading and Dynamic Content */}
      <CustomCard title="Loading and Dynamic Content" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Skeleton Loading */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Skeleton Loading</h3>
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility Control */}
          {/* Visibility Control */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Visibility Control</h3>
            <Visible when={true}>
              <div className="p-4 bg-gray-100 rounded shadow">
                This content is visible
              </div>
            </Visible>
            <Visible when={false}>
              <div className="p-4 bg-gray-100 rounded shadow">
                This content is hidden
              </div>
            </Visible>
          </div>
        </div>
      </CustomCard>

      {/* List Management */}
      <CustomCard title="List Management" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sortable List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sortable List</h3>
            <Sortable
              items={sortableItems}
              renderItem={(item) => (
                <div className="p-4 bg-white border rounded shadow cursor-move hover:bg-gray-50 transition duration-200">
                  {item.content}
                </div>
              )}
            />
          </div>

          {/* Virtual List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Virtual List</h3>
            <div className="h-[300px] border rounded shadow overflow-y-auto">
              <VirtualList
                items={items}
                itemHeight={40}
                renderItem={(item) => (
                  <div className="p-4 border-b hover:bg-gray-50 transition duration-200">
                    {item.content}
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </CustomCard>
    </div>
  );
}