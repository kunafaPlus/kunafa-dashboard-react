'use client';

import React from 'react';

import { FiHome, FiFolder, FiFile, FiEdit, FiTrash2, FiCopy, FiShare2, FiSettings, FiUser } from 'react-icons/fi';
import { Menu } from '../../components/misc/Menu';
import CustomCard from '../../components/panel/CustomCard';
import { Breadcrumb } from '../../components/misc/Breadcrumb';
import { LabelWithIcon } from '../../components/misc/LabelWithIcon';
import TitleWithSubTitleBorder from '../../components/misc/TitleWithSubTitleBorder';
import { Pagination } from '../../components/misc/Pagination';

export default function NavigationExample() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState('home');

  // Sample data for navigation components
  const breadcrumbItems = [
    { label: 'Home', icon: <FiHome />, href: '#' },
    { label: 'Documents', icon: <FiFolder />, href: '#' },
    { label: 'Projects', icon: <FiFolder />, href: '#' },
    { label: 'Current Project', icon: <FiFile />, href: '#' },
  ];

  const menuItems = [
    { id: 'home', label: 'Home', icon: <FiHome />, href: '#' },
    { id: 'profile', label: 'Profile', icon: <FiUser />, href: '#' },
    { id: 'settings', label: 'Settings', icon: <FiSettings />, href: '#' },
  ];

  const totalItems = 100; // إجمالي العناصر
  const itemsPerPage = 10; // عدد العناصر في كل صفحة

  const handlePageChange = (page: number) => {
      setCurrentPage(page);
      // هنا يمكنك إضافة أي منطق آخر لتحميل البيانات بناءً على الصفحة الجديدة
  };
  return (
    <div className="space-y-6">
      {/* Basic Navigation */}
      <CustomCard title="Basic Navigation" className="space-y-4">
        <div className="space-y-6">
          {/* Breadcrumb */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Breadcrumb</h3>
            <Breadcrumb
              items={breadcrumbItems}
              separator="/"
              onClick={(item) => console.log('Clicked:', item)}
            />
          </div>

          {/* Menu */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Menu</h3>
            <Menu
              items={menuItems}
              trigger={<div className="w-full h-32 flex items-center justify-center border-2 border-dashed rounded">
                Right Click Area
              </div>}
            />
          </div>
        </div>
      </CustomCard>



      {/* Labels and Titles */}
      <CustomCard title="Labels and Titles" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Label with Icon */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Label with Icon</h3>
            <div className="space-y-2">
              <LabelWithIcon
                label="Settings"
                icon={<FiSettings className="w-5 h-5" />}
              />
             
            </div>
          </div>

          {/* Title with Subtitle and Border */}
          <div className="space-y-2 mx-4">
            <h3 className="text-sm font-medium">Title with Subtitle and Border</h3>
            <TitleWithSubTitleBorder
              title="Main Title"
              subTitle="This is a subtitle with a nice border"
            />
            <TitleWithSubTitleBorder
              title="Another Title"
              subTitle="Another descriptive subtitle"
            />
          </div>
        </div>
      </CustomCard>

      {/* Navigation Variants */}
      <CustomCard title="Navigation Variants" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Horizontal Menu */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Horizontal Menu</h3>
            <Menu
              items={menuItems}
              trigger={selectedMenuItem}
            />
          </div>

          {/* Alternative Breadcrumb */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Alternative Breadcrumb</h3>
            <Breadcrumb
              items={breadcrumbItems}
              separator=">"
              onClick={(item) => console.log('Clicked:', item)}
            />
          </div>
        </div>
      </CustomCard>

      {/* Pagination Variants */}
      <CustomCard title="Pagination Variants" className="space-y-4">
        <div className="space-y-4">

        <Pagination
                total={totalItems}
                perPage={itemsPerPage}
                currentPage={currentPage}
                onChange={handlePageChange}
                showFirstLast={true}
                showPrevNext={true}
                siblingCount={1}
                variant="default" // يمكنك تغييرها إلى "ghost" أو "pills"
                size="md" // يمكنك تغييرها إلى "sm" أو "lg"
            />
          
        </div>
      </CustomCard>
    </div>
  );
}
