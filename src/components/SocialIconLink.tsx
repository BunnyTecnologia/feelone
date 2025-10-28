import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface SocialIconLinkProps {
  icon: LucideIcon;
  to: string;
  colorClass: string;
}

const SocialIconLink: React.FC<SocialIconLinkProps> = ({ icon: Icon, to, colorClass }) => {
  return (
    <Link 
      to={to} 
      target="_blank"
      rel="noopener noreferrer"
      className={`p-2 rounded-full transition-transform hover:scale-110 ${colorClass}`}
    >
      <Icon className="h-8 w-8" />
    </Link>
  );
};

export default SocialIconLink;