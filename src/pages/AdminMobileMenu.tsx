import React from 'react';
import { ArrowLeft, Utensils, Dumbbell, HelpCircle, Plane, CalendarCheck, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MobileNavbar from '@/components/MobileNavbar';

const adminMenuItems = [
  { title: "Admin Dieta", path: "/admin/dieta", icon: Utensils },
  { title: "Admin Academia", path: "/admin/academia", icon: Dumbbell },
  { title: "Admin Enquetes", path: "/admin/enquetes", icon: HelpCircle },
  { title: "Admin Viagens", path: "/admin/viagens", icon: Plane },
  { title: "Admin Agenda", path: "/admin/agenda", icon: CalendarCheck },
];

const AdminMobileMenu = () => {
  // Estilo para os botões de navegação
  const navButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-16 text-xl font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-[1.01] flex justify-start items-center space-x-4 px-6";

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/perfil">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Painel Admin
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8 text-base">
          Gerencie o conteúdo que aparece no seu perfil.
        </p>
        
        <div className="w-full space-y-6">
          {adminMenuItems.map((item) => (
            <Link key={item.path} to={item.path} className="block">
              <Button className={`w-full ${navButtonStyle}`}>
                <item.icon className="h-6 w-6" />
                <span>{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </main>

      <MobileNavbar />
    </div>
  );
};

export default AdminMobileMenu;