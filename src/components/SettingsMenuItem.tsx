import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsMenuItemProps {
  icon: LucideIcon;
  title: string;
  to: string;
  isLogout?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const SettingsMenuItem: React.FC<SettingsMenuItemProps> = ({ icon: Icon, title, to, isLogout = false, onClick }) => {
  const baseClasses = "flex items-center justify-between p-4 rounded-xl text-white font-semibold transition-colors";
  
  const itemClasses = isLogout 
    ? "bg-[#3A00FF] hover:bg-indigo-700" 
    : "bg-[#3A00FF] hover:bg-indigo-700";

  return (
    <Link to={to} onClick={onClick} className={cn(baseClasses, itemClasses)}>
      <div className="flex items-center space-x-4">
        <Icon className="h-6 w-6" />
        <span className="text-lg">{title}</span>
      </div>
      {!isLogout && (
        <ChevronRight className="h-6 w-6" />
      )}
    </Link>
  );
};

export default SettingsMenuItem;