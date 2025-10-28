import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Utensils, Calendar } from 'lucide-react';

interface DietCardProps {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

const DietCard: React.FC<DietCardProps> = ({ title, description, startDate, endDate }) => {
  return (
    <Card className="shadow-lg border-2 border-[#3A00FF] rounded-xl bg-white dark:bg-gray-800 transition-shadow hover:shadow-xl">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-bold text-[#3A00FF]">{title}</CardTitle>
        <Utensils className="h-6 w-6 text-gray-500" />
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {description}
        </p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 pt-2">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Início: {startDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Fim: {endDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DietCard;