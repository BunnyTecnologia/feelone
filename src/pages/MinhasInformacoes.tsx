import React from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useProfileData } from '@/hooks/useProfileData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MinhasInformacoes = () => {
  const { profile, loading } = useProfileData();
  
  // Estilo para os botões de navegação
  const navButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-16 text-xl font-semibold rounded-xl shadow-lg transition-transform transform hover:scale-[1.01]";
  
  const menuItems = [
    { title: "Redes Sociais", path: "/cadastro/redes-sociais" },
    { title: "Endereço", path: "/cadastro/endereco" },
    { title: "Dados de Saúde", path: "/dados-saude" }, // Rota corrigida
    { title: "Contatos de Emergência", path: "/contato-emergencia" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3A00FF]" />
      </div>
    );
  }

  const fullName = `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Usuário';
  const userEmail = profile?.id ? 'Carregando...' : 'Não logado'; // O email não está na tabela profiles, mas podemos simular ou buscar separadamente se necessário. Por enquanto, focamos nos dados disponíveis.
  const userGender = profile?.genero || 'Não informado';
  const userBio = profile?.biografia || 'Nenhuma biografia cadastrada.';

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
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
        
        {/* Card de Dados Pessoais */}
        <Card className="w-full shadow-lg border-2 border-[#3A00FF] rounded-xl mb-8">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xl font-bold text-[#3A00FF]">
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2 space-y-3 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Nome Completo:</span> {fullName}
            </p>
            <p>
              <span className="font-semibold text-gray-900 dark:text-white">Gênero:</span> {userGender}
            </p>
            <div className="pt-2">
              <p className="font-semibold text-gray-900 dark:text-white mb-1">Biografia:</p>
              <p className="text-sm italic">{userBio}</p>
            </div>
            {/* Link para editar dados pessoais (opcional, mas útil) */}
            <div className="pt-4 text-right">
              <Link to="/cadastro/dados-pessoais" className="text-sm text-[#3A00FF] hover:underline font-medium">
                Editar Dados Pessoais
              </Link>
            </div>
          </CardContent>
        </Card>

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