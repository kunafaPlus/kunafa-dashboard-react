import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?:string
}

const Card: React.FC<CardProps> = ({ title,children }) => {
  return <div className="max-w-full border border-gray-200 rounded-xl space-y-4 p-8 shadow-xl ">{children}</div>;
};

export default Card;