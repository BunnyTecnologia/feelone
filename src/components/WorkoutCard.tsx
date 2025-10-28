import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dumbbell, Clock } from 'lucide-react';

interface WorkoutCardProps {
  title: string;
  description: string;
  focus: string;
  durationDays: number;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ title, description, focus, durationDays }) => {
  return (
    <Card className="shadow-lg border-2 border-[#3A00FF] rounded-xl bg-white dark:bg-gray-800 transition-shadow hover:shadow-xl">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-bold text-[#3A00FF]">{title}</CardTitle>
        <Dumbbell className="h-6 w-6 text-gray-500" />
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {description}
        </p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4 pt-2">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Duração: {durationDays} dias</span>
          </div>
          <div className="text-sm font-semibold text-[#3A00FF] bg-[#D9D0FF] px-2 py-0.5 rounded-full">
            {focus}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;