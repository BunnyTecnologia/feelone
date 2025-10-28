import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  DollarSign, 
  Heart, 
  Megaphone, 
  Package, 
  Calendar, 
  Ticket, 
  Building, 
  Settings, 
  LogOut,
  Menu
} from 'lucide-react';
import SidebarLink from './SidebarLink';
import { Separator } from '@/components/ui/separator';
import { Link } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, title: "Dashboard", path: "/dashboard" },
  { icon: Users, title: "Cadastros", path: "#" },
  { icon: BarChart3, title: "Analytics", path: "#" },
  { icon: DollarSign, title: "Pagamentos", path: "#" },
  { icon: Heart, title: "Saúde", path: "/dados-saude" },
  { icon: Users, title: "Torcedores", path: "#" },
  { icon: Megaphone, title: "Campanhas", path: "#" },
  { icon: Package, title: "Produtos", path: "#" },
  { icon: Calendar, title: "Eventos", path: "#" },
  { icon: Ticket, title: "Ingressos", path: "#" },
  { icon: Building, title: "Sub-Sede", path: "#" },
];

const generalItems = [
  { icon: Settings, title: "Config", path: "/configuracoes" },
  { icon: LogOut, title: "Sair", path: "/login" },
];

const Sidebar = () => {
  // Simulação de rota ativa
  const currentPath = "/dashboard"; 

  return (
    <div className="flex flex-col h-screen w-64 bg-sidebar shadow-2xl p-4 rounded-r-[30px] fixed left-0 top-0 bottom-0">
      
      {/* Header/Menu */}
      <div className="flex items-center space-x-3 mb-8">
        <Menu className="h-6 w-6 text-sidebar-foreground" />
        <span className="text-sm font-bold text-sidebar-foreground uppercase">Menu</span>
      </div>

      {/* Navegação Principal */}
      <nav className="flex flex-col space-y-2 flex-grow">
        {navItems.map((item) => (
          <SidebarLink
            key={item.title}
            icon={item.icon}
            title={item.title}
            to={item.path}
            isActive={item.path === currentPath}
          />
        ))}
      </nav>

      {/* Seção Geral */}
      <div className="mt-auto space-y-4">
        <Separator className="bg-sidebar-border" />
        <span className="text-sm font-bold text-sidebar-foreground uppercase ml-3">Geral</span>
        <div className="space-y-2">
          {generalItems.map((item) => (
            <SidebarLink
              key={item.title}
              icon={item.icon}
              title={item.title}
              to={item.path}
              isGeneral
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;