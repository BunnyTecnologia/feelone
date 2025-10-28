import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface HealthToggleProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
}

const HealthToggle: React.FC<HealthToggleProps> = ({ label, value, onChange }) => {
  const baseButtonStyle = "h-14 text-lg font-semibold rounded-xl border-2 transition-colors w-full";
  const activeClass = "bg-[#3A00FF] border-[#3A00FF] text-white hover:bg-indigo-700";
  const inactiveClass = "bg-white border-[#3A00FF] text-[#3A00FF] hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800";

  return (
    <div className="space-y-2">
      <p className="text-lg font-bold text-gray-900 dark:text-white">{label}</p>
      <div className="grid grid-cols-2 gap-4">
        <Button 
          type="button"
          onClick={() => onChange(true)}
          className={cn(baseButtonStyle, value === true ? activeClass : inactiveClass)}
        >
          Sim
        </Button>
        <Button 
          type="button"
          onClick={() => onChange(false)}
          className={cn(baseButtonStyle, value === false ? activeClass : inactiveClass)}
        >
          Não
        </Button>
      </div>
    </div>
  );
};

export default HealthToggle;