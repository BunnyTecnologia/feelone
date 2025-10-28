import React from 'react';
import { Instagram, Facebook, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import SocialIconLink from '@/components/SocialIconLink';

const Perfil = () => {
  // Dados de exemplo
  const userName = "Julio Cesar dos Santos";
  const userBio = "Empreenda e transforme o mundo ao seu redor!";
  const avatarUrl = "https://i.pravatar.cc/150?img=68"; // Placeholder

  // Itens do menu de funcionalidades
  const featureItems = [
    "Dieta", "Academia", "Enquete", 
    "Viagens", "Chat", "Agenda"
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Conteúdo Principal */}
      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pt-12 pb-28 text-center">
        
        {/* Avatar */}
        <div className="mb-6">
          <img 
            src={avatarUrl} 
            alt={userName} 
            className="w-32 h-32 rounded-full mx-auto object-cover shadow-xl border-4 border-white"
          />
        </div>

        {/* Informações do Usuário */}
        <h1 className="text-2xl font-bold text-[#3A00FF] mb-2">
          {userName}
        </h1>
        <p className="text-base text-[#3A00FF] font-medium mb-8 px-4">
          {userBio}
        </p>

        {/* Links de Redes Sociais */}
        <div className="flex justify-center space-x-6 mb-12">
          <SocialIconLink 
            icon={Instagram} 
            to="#" 
            colorClass="text-[#3A00FF]" 
          />
          <SocialIconLink 
            icon={Facebook} 
            to="#" 
            colorClass="text-[#3A00FF] fill-[#3A00FF]" 
          />
          <SocialIconLink 
            icon={MessageSquare} // Substituído por MessageSquare
            to="#" 
            colorClass="text-[#3A00FF]" 
          />
        </div>

        {/* Menu de Funcionalidades */}
        <div className="grid grid-cols-3 gap-y-8 mb-16">
          {featureItems.map((item) => (
            <Link key={item} to="#" className="text-lg font-bold text-[#3A00FF] hover:opacity-80 transition-opacity">
              {item}
            </Link>
          ))}
        </div>

        {/* Patrocinador Logo Placeholder */}
        <div className="w-full flex justify-center">
          <div className="text-center">
            {/* Placeholder para o logo 'Esportes da Sorte' */}
            <span className="text-7xl font-extrabold leading-none text-blue-900 dark:text-blue-400">
              <span className="text-green-500">E</span>sportes
              <br />
              da Sorte
            </span>
          </div>
        </div>
      </main>

      {/* Navbar Móvel (Reutilizando o componente) */}
      <MobileNavbar />
    </div>
  );
};

export default Perfil;