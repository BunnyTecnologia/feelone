import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/CustomInput';

const CadastroEndereco = () => {
  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          {/* Link para a página anterior (Redes Sociais) */}
          <Link to="/cadastro/redes-sociais">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Endereço
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Form */}
        <form className="w-full space-y-4">
          
          <CustomInput placeholder="Cep" />
          <CustomInput placeholder="Endereço" />
          <CustomInput placeholder="Número" />
          <CustomInput placeholder="Cidade" />
          <CustomInput placeholder="Complemento" />

          {/* Botão Salvar */}
          <div className="pt-8 pb-8">
            <Button type="submit" className={`w-full ${saveButtonStyle}`}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroEndereco;