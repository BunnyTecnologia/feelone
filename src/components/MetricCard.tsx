import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconBgClass?: string;
  valueClass?: string;
  isDark?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  iconBgClass = "bg-gray-200 text-gray-700", 
  valueClass = "text-3xl font-extrabold",
  isDark = false
}) => {
  
  const cardClasses = isDark 
    ? "bg-[#333333] text-white" 
    : "bg-white text-gray-900";

  const titleClasses = isDark 
    ? "text-gray-300" 
    : "text-gray-600";

  return (
    <Card className={cn("shadow-lg border-none rounded-xl p-4", cardClasses)}>
      <CardContent className="p-0 flex flex-col space-y-4">
        
        <div className="flex items-center justify-between">
          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", iconBgClass)}>
            <Icon className="h-6 w-6" />
          </div>
          {!isDark && (
            <span className={cn("text-sm font-semibold", titleClasses)}>{title}</span>
          )}
        </div>

        <div className="flex flex-col items-start">
          <p className={cn("text-sm font-semibold", titleClasses)}>{title}</p>
          <p className={cn(valueClass, isDark ? "text-white" : "text-gray-900")}>
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;