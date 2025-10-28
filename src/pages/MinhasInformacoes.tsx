import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MinhasInformacoes = () => {
  // Estilo para os botões de navegação
  const navButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-16 text-xl font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-[1.01]";
  
  const menuItems = [
    { title: "Redes Sociais", path: "/cadastro/redes-sociais" },
    { title: "Endereço", path: "/cadastro/endereco" },
    { title: "Dados de Saúde", path: "/dados-saude" }, // Rota corrigida
    { title: "Contatos de Emergência", path: "/contato-emergencia" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-12">
        <div className="flex items-center space-x-4">
          <Link to="/configuracoes">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Minhas informações
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Menu de Navegação */}
        <div className="w-full space-y-6">
          {menuItems.map((item) => (
            <Link key={item.path} to={item.path} className="block">
              <Button className={`w-full ${navButtonStyle}`}>
                {item.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinhasInformacoes;