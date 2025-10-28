import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MapPin, Calendar } from 'lucide-react';

interface TripCardProps {
  title: string;
  location: string;
  description: string;
  date: string;
}

const TripCard: React.FC<TripCardProps> = ({ title, location, description, date }) => {
  return (
    <Card className="shadow-lg border-2 border-[#3A00FF] rounded-xl bg-white dark:bg-gray-800 transition-shadow hover:shadow-xl">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl font-bold text-[#3A00FF]">{title}</CardTitle>
        <Plane className="h-6 w-6 text-gray-500" />
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 space-x-1 mb-2">
          <MapPin className="h-4 w-4 text-red-500" />
          <span className="font-semibold">{location}</span>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
          {description}
        </p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-1 pt-2">
          <Calendar className="h-4 w-4" />
          <span>Data: {date}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;