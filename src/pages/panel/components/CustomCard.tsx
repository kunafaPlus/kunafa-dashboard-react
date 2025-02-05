import React from 'react';

interface CustomCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

function CustomCard({ children, className, title }: CustomCardProps) {
  return (
    <div className={`w-full rounded-2xl border-2 border-gray-200 shadow-2xs p-6 bg-white mt-4 ${className}`}>
      {title && (
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      )}
      {children}
    </div>
  );
}

export default CustomCard;