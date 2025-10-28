import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SocialInputBlock from '@/components/SocialInputBlock';

const CadastroRedesSociais = () => {
  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          <Link to="/cadastro/dados-pessoais">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Redes Sociais
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Form */}
        <form className="w-full space-y-6">
          
          <SocialInputBlock placeholder="Link Facebook" id="facebook" />
          <SocialInputBlock placeholder="Link Instagram" id="instagram" />
          <SocialInputBlock placeholder="Celular Whatsapp" id="whatsapp" />
          <SocialInputBlock placeholder="Site" id="site" />
          <SocialInputBlock placeholder="Chave Pix" id="pix" />

          {/* Botão Salvar */}
          <div className="pt-6 pb-8">
            <Button type="submit" className={`w-full ${saveButtonStyle}`}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroRedesSociais;