import React from 'react';
import { Instagram, Facebook, MessageCircle, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import SocialIconLink from '@/components/SocialIconLink';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/useProfileData';
import { Skeleton } from '@/components/ui/skeleton';

const Perfil = () => {
  const { profile, loading } = useProfileData();

  const displayName = profile
    ? [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Usuário'
    : 'Usuário';

  const bioText = profile?.biografia ?? '';

  const avatarSrc = profile?.avatar_url || '/placeholder.svg';

  // Itens do menu de funcionalidades
  const featureItems = [
    { name: "Dieta", path: "/dieta" }, 
    { name: "Academia", path: "/academia" }, 
    { name: "Enquete", path: "/enquetes" }, 
    { name: "Viagens", path: "/viagens" }, 
    { name: "Chat", path: "/chat" },
    { name: "Agenda", path: "/agenda" }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Botão de Admin/Configurações no topo */}
      <header className="w-full max-w-sm md:max-w-md pt-4 px-4 flex justify-end">
        <Link to="/admin/menu" className="text-[#3A00FF] hover:opacity-80 transition-opacity">
          <Settings className="h-6 w-6" />
        </Link>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pt-4 pb-28 text-center">
        
        {/* Avatar */}
        <div className="mb-6">
          {loading ? (
            <Skeleton className="w-32 h-32 rounded-full mx-auto" />
          ) : (
            <img
              src={avatarSrc}
              alt={displayName}
              className="w-32 h-32 rounded-full mx-auto object-cover shadow-xl border-4 border-white"
            />
          )}
        </div>

        {/* Informações do Usuário */}
        {loading ? (
          <div className="mb-8 space-y-3 px-4">
            <Skeleton className="h-6 w-40 mx-auto" />
            <Skeleton className="h-4 w-56 mx-auto" />
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-[#3A00FF] mb-2">
              {displayName}
            </h1>
            <p className="text-base text-[#3A00FF] font-medium mb-8 px-4">
              {bioText}
            </p>
          </>
        )}

        {/* Links de Redes Sociais */}
        <div className="flex justify-center space-x-6 mb-8">
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
            icon={MessageCircle}
            to="/chat"
            colorClass="text-[#3A00FF]" 
          />
        </div>

        {/* Grade de Acessos Rápidos */}
        <section aria-label="Acessos rápidos" className="mb-12">
          <div className="grid grid-cols-2 gap-3">
            {featureItems.map((item) => (
              <Button
                key={item.path}
                variant="outline"
                className="w-full h-12 rounded-xl border-[#3A00FF] text-[#3A00FF] hover:bg-[#3A00FF] hover:text-white transition-colors"
                asChild
              >
                <Link to={item.path}>
                  {item.name}
                </Link>
              </Button>
            ))}
          </div>
        </section>

        {/* Logo do Patrocinador */}
        <div className="w-full flex justify-center">
          <div className="text-center">
            <img
              src="/esportes-da-sorte-seeklogo.png"
              alt="Logo Esportes da Sorte"
              className="h-20 md:h-24 object-contain mx-auto"
            />
          </div>
        </div>
      </main>

      {/* Navbar Móvel */}
      <MobileNavbar />
    </div>
  );
};

export default Perfil;