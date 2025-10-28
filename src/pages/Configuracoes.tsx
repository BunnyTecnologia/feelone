import React from 'react';
import { ArrowLeft, User, Lock, Shield, LogOut, Bell, Heart, Map, Calendar, Settings, MessageSquare, Newspaper, BarChart3, Utensils, Dumbbell } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import SettingsMenuItem from '@/components/SettingsMenuItem';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

const Configuracoes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      toast({
        title: "Erro ao Sair",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Desconectado",
        description: "Você saiu da sua conta.",
      });
      navigate('/login');
    }
  };

  const menuItems = [
    { icon: User, title: "Minhas Informações", to: "/minhas-informacoes" },
    { icon: Bell, title: "Notificações", to: "/notificacoes" },
    { icon: MessageSquare, title: "Chat", to: "/chat" },
    { icon: BarChart3, title: "Enquetes", to: "/enquetes" },
    { icon: Newspaper, title: "Notícias", to: "/noticias" },
    { icon: Utensils, title: "Dieta", to: "/dieta" },
    { icon: Dumbbell, title: "Treino", to: "/treino" },
    { icon: Map, title: "Viagens", to: "/viagens" },
    { icon: Calendar, title: "Agendamentos", to: "/agendamentos" },
    { icon: Shield, title: "Política de Privacidade", to: "/politica-de-privacidade" }, // Novo item
    { icon: Lock, title: "Segurança", to: "/seguranca" }, // Exemplo de item futuro
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
            Configurações
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Menu de Configurações */}
        <div className="w-full space-y-4">
          {menuItems.map((item) => (
            <SettingsMenuItem 
              key={item.title}
              icon={item.icon}
              title={item.title}
              to={item.to}
            />
          ))}
        </div>

        {/* Botão Sair */}
        <div className="w-full pt-10 pb-8">
          <Button 
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white h-14 text-lg font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-[1.01]"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes;