import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, MapPin, Calendar } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

interface TripCardProps {
  title: string;
  location: string;
  description: string;
  date: string;
  imageUrls?: string[] | null;
}

const TripCard: React.FC<TripCardProps> = ({ title, location, description, date, imageUrls }) => {
  const hasImages = imageUrls && imageUrls.length > 0;

  return (
    <Card className="shadow-lg border-2 border-[#3A00FF] rounded-xl bg-white dark:bg-gray-800 transition-shadow hover:shadow-xl overflow-hidden">
      
      {/* Galeria de Imagens (Carrossel) */}
      {hasImages && (
        <Carousel className="w-full">
          <CarouselContent>
            {imageUrls.map((url, index) => (
              <CarouselItem key={index} className="p-0">
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Viagem ${title} - Foto ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {imageUrls.length > 1 && (
            <>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </>
          )}
        </Carousel>
      )}

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