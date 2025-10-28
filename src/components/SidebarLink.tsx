import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLinkProps {
  icon: LucideIcon;
  title: string;
  to: string;
  isActive?: boolean;
  isGeneral?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon: Icon, title, to, isActive = false, isGeneral = false }) => {
  const baseClasses = "flex items-center p-3 rounded-xl transition-colors space-x-3 text-lg font-semibold";
  
  const activeClasses = isActive 
    ? "bg-sidebar-accent text-sidebar-primary" 
    : "text-sidebar-foreground hover:bg-sidebar-accent/50";

  return (
    <Link 
      to={to} 
      className={cn(baseClasses, activeClasses, isGeneral ? "text-base font-medium" : "")}
    >
      <Icon className="h-6 w-6" />
      <span>{title}</span>
    </Link>
  );
};

export default SidebarLink;