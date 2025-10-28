import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, User, Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface NewsCardProps {
  id: string; // Adicionando ID para navegação
  title: string;
  summary: string;
  author: string;
  date: string;
  imageUrl?: string | null;
}

const NewsCard: React.FC<NewsCardProps> = ({ id, title, summary, author, date, imageUrl }) => {
  return (
    <Link to={`/noticias/${id}`} className="block">
      <Card className="shadow-lg border-2 border-[#3A00FF] rounded-xl bg-white dark:bg-gray-800 transition-shadow hover:shadow-xl cursor-pointer">
        {imageUrl && (
          <div className="w-full h-40 overflow-hidden rounded-t-xl">
            <img 
              src={imageUrl} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        )}
        <CardHeader className={cn("p-4 pb-2", !imageUrl && "pt-4")}>
          <CardTitle className="text-xl font-bold text-[#3A00FF] line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
            {summary}
          </p>
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 pt-2">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default NewsCard;