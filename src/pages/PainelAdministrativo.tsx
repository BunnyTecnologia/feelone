import React from 'react';
import { ArrowLeft, Utensils, Dumbbell, BarChart, Plane, MessageSquare, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const PainelAdministrativo = () => {
  
  const navButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-20 text-xl font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-[1.01] flex items-center justify-start px-6 space-x-4";
  
  const menuItems = [
    { title: "Dieta", path: "/gerenciar/dieta", icon: <Utensils className="h-6 w-6" /> },
    { title: "Academia (Séries)", path: "/gerenciar/series", icon: <Dumbbell className="h-6 w-6" /> },
    { title: "Enquetes", path: "/gerenciar/enquetes", icon: <BarChart className="h-6 w-6" /> },
    { title: "Viagens", path: "/gerenciar/viagens", icon: <Plane className="h-6 w-6" /> },
    { title: "Grupos de Chat", path: "/gerenciar/grupos-chat", icon: <MessageSquare className="h-6 w-6" /> },
    { title: "Agenda (Disponibilidade)", path: "/gerenciar/agenda", icon: <Calendar className="h-6 w-6" /> },
    { title: "Meu Perfil Público", path: "/perfil", icon: <User className="h-6 w-6" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Painel Administrativo
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Menu de Navegação */}
        <div className="w-full space-y-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="block">
              <Button className={`w-full ${navButtonStyle}`}>
                {item.icon}
                <span>{item.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PainelAdministrativo;