import React from 'react';
import { X, Shield, Mail, LogOut, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SettingsProfileCard from '@/components/SettingsProfileCard';
import SettingsMenuItem from '@/components/SettingsMenuItem';
import MobileNavbar from '@/components/MobileNavbar';

const Configuracoes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      
      {/* Header Fixo */}
      <header className="w-full max-w-sm md:max-w-md mx-auto pt-4 pb-8 px-4 sticky top-0 bg-white dark:bg-gray-900 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Configurações
          </h1>
          <Link to="/">
            <X className="text-[#3A00FF] h-6 w-6" />
          </Link>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        
        {/* Card de Perfil */}
        <div className="mb-6">
          <SettingsProfileCard 
            name="Júlio Cesar dos Santos" 
            avatarUrl="https://i.pravatar.cc/150?img=68" // Placeholder de avatar
            to="/perfil"
          />
        </div>

        {/* Grupo de Itens de Configuração */}
        <div className="space-y-4 mb-8">
          <SettingsMenuItem 
            icon={Shield} 
            title="Minhas informações" 
            to="/minhas-informacoes" 
          />
          <SettingsMenuItem 
            icon={Mail} 
            title="Personalização" 
            to="#" // Rota temporária
          />
          <SettingsMenuItem 
            icon={FileText} 
            title="Política de Privacidade" 
            to="#" // Rota temporária
          />
        </div>

        {/* Botão Sair */}
        <SettingsMenuItem 
          icon={LogOut} 
          title="Sair" 
          to="/login" 
          isLogout 
        />
      </main>

      {/* Navbar Móvel */}
      <MobileNavbar />
    </div>
  );
};

export default Configuracoes;