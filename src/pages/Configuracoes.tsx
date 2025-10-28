import React from 'react';
import { X, Shield, Mail, LogOut, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import SettingsProfileCard from '@/components/SettingsProfileCard';
import SettingsMenuItem from '@/components/SettingsMenuItem';
import MobileNavbar from '@/components/MobileNavbar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const Configuracoes = () => {
  const [openPersonalizacao, setOpenPersonalizacao] = React.useState(false);

  const handlePersonalizacaoClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    e.preventDefault();
    setOpenPersonalizacao(true);
  };

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
            to="#" 
            onClick={handlePersonalizacaoClick}
          />
          <SettingsMenuItem 
            icon={FileText} 
            title="Política de Privacidade" 
            to="/politica-privacidade" 
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

      {/* Dialog de Personalização - Em breve */}
      <Dialog open={openPersonalizacao} onOpenChange={setOpenPersonalizacao}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader className="items-center">
            <img
              src="/logo-feel-one.png"
              alt="Feel One"
              className="h-12 mb-2"
            />
            <DialogTitle className="text-[#3A00FF] text-center">Em breve</DialogTitle>
            <DialogDescription className="text-center">
              Esta função será entregue na versão definitiva do aplicativo Feel One.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <DialogClose asChild>
              <Button className="bg-[#3A00FF] hover:bg-indigo-700 text-white">
                Entendi
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Navbar Móvel */}
      <MobileNavbar />
    </div>
  );
};

export default Configuracoes;