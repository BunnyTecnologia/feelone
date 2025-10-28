import React from 'react';

interface HealthDataItemProps {
  title: string;
  value: string;
  isBoldValue?: boolean;
}

const HealthDataItem: React.FC<HealthDataItemProps> = ({ title, value, isBoldValue = false }) => {
  const valueClasses = isBoldValue 
    ? "text-[#3A00FF] font-bold text-lg leading-tight" 
    : "text-[#3A00FF] text-base leading-tight";

  return (
    <div className="mb-4">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{title}</p>
      <p className={valueClasses}>{value}</p>
    </div>
  );
};

export default HealthDataItem;