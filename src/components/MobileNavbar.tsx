import React from 'react';
import { Home, MessageSquare, User, Settings, Calendar, BarChart3 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  to: string;
  isActive: boolean;
  icon: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, isActive, icon }) => (
  <Link to={to} className="flex flex-col items-center justify-center p-2">
    <div className={`transition-colors ${isActive ? 'text-[#3A00FF]' : 'text-gray-500 hover:text-[#3A00FF]'}`}>
      {icon}
    </div>
  </Link>
);

const MobileNavbar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around h-16 max-w-md mx-auto">
        
        {/* Home */}
        <NavItem to="/" isActive={currentPath === "/"} icon={<Home className="h-6 w-6" />} />
        
        {/* Chat */}
        <NavItem to="/chat" isActive={currentPath.startsWith("/chat")} icon={<MessageSquare className="h-6 w-6" />} />
        
        {/* Central Button (Placeholder for main action) */}
        <div className="flex items-center justify-center -mt-6">
          <div className="w-14 h-14 bg-[#3A00FF] rounded-full flex items-center justify-center shadow-xl border-4 border-white">
            <BarChart3 className="h-7 w-7 text-white" />
          </div>
        </div>
        
        {/* Painel Administrativo */}
        <NavItem to="/painel-administrativo" isActive={currentPath === "/painel-administrativo"} icon={<User className="h-6 w-6" />} />
        
        {/* Configurações */}
        <NavItem 
          to="/configuracoes" 
          isActive={currentPath === "/configuracoes"} 
          icon={<Settings className="h-6 w-6" />} 
        />
      </div>
    </nav>
  );
};

export default MobileNavbar;