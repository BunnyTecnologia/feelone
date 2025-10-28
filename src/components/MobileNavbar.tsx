import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, FileText, User, Bell, HeartPulse } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ReactNode;
  to: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, to, isActive }) => (
  <Link 
    to={to} 
    className={cn(
      "flex flex-col items-center justify-center w-full h-full transition-colors z-10 relative",
      isActive ? "text-white" : "text-white/70 hover:text-white"
    )}
  >
    {icon}
  </Link>
);

const MobileNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname; 

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="relative h-20 bg-[#3A00FF] rounded-t-[30px] shadow-2xl">
        
        {/* Onda de fundo (simulada com classes de borda e padding) */}
        <div className="absolute inset-0 overflow-hidden">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            {/* Esta é uma simulação visual da forma da navbar, o design original é mais complexo, 
            mas vamos focar na estrutura e cores. */}
          </svg>
        </div>

        {/* Botão Central de Destaque (HeartPulse) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -top-8 z-20">
          <Link to="/carteirinha-emergencia" className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
            <HeartPulse className="h-8 w-8 text-white fill-white" />
          </Link>
        </div>

        {/* Itens de Navegação */}
        <div className="flex justify-between h-full px-4 pt-4 relative z-10">
          {/* Lado Esquerdo */}
          <div className="flex w-2/5 justify-around">
            <NavItem to="/" isActive={currentPath === "/"} icon={<Home className="h-6 w-6" />} />
            <NavItem to="/noticias" isActive={currentPath === "/noticias"} icon={<FileText className="h-6 w-6" />} />
          </div>

          {/* Espaço para o botão central */}
          <div className="w-1/5"></div> 

          {/* Lado Direito */}
          <div className="flex w-2/5 justify-around">
            {/* Alterado para direcionar ao admin/menu */}
            <NavItem to="/admin/menu" isActive={currentPath === "/admin/menu"} icon={<User className="h-6 w-6" />} />
            <NavItem 
              to="/configuracoes" 
              isActive={currentPath === "/configuracoes"} 
              icon={<Bell className="h-6 w-6" />} 
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MobileNavbar;