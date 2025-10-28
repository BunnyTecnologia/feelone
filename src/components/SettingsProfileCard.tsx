import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';

interface SettingsProfileCardProps {
  name: string;
  avatarUrl?: string;
  to: string;
}

const getFirstAndLast = (fullName: string) => {
  const parts = (fullName || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1]}`;
};

const SettingsProfileCard: React.FC<SettingsProfileCardProps> = ({ name, avatarUrl, to }) => {
  const displayName = getFirstAndLast(name);

  return (
    <Link 
      to={to} 
      className="bg-[#3A00FF] p-4 rounded-xl shadow-lg flex items-center space-x-4 hover:bg-indigo-700 transition-colors"
    >
      <Avatar className="h-16 w-16 border-2 border-white">
        <AvatarImage src={avatarUrl} alt={name} />
        <AvatarFallback className="bg-white text-[#3A00FF] font-bold text-xl">
          {name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="text-xl font-bold text-white truncate">{displayName}</span>
    </Link>
  );
};

export default SettingsProfileCard;