import React from 'react';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/CustomInput';
import CustomTextarea from '@/components/CustomTextarea';

const CadastroDadosPessoais = () => {
  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";
  
  // Estilo para os botões de gênero
  const genderButtonStyle = "h-14 text-base font-semibold rounded-xl border-2 border-[#3A00FF] text-[#3A00FF] hover:bg-indigo-50/50";

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          <Link to="/">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Cadastro
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Profile Picture Placeholder */}
        <div className="relative mb-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center shadow-lg">
            <User className="h-16 w-16 text-gray-500" />
          </div>
          <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-300">
            <Camera className="h-5 w-5 text-gray-700" />
          </div>
        </div>

        {/* Form */}
        <form className="w-full space-y-4">
          
          {/* Nome e Sobrenome */}
          <div className="grid grid-cols-2 gap-3">
            <CustomInput placeholder="Nome" />
            <CustomInput placeholder="Sobrenome" />
          </div>

          {/* E-mail */}
          <CustomInput type="email" placeholder="E-mail" />

          {/* Senha */}
          <CustomInput type="password" placeholder="Senha" isPassword />
          
          {/* Confirma Senha */}
          <CustomInput type="password" placeholder="Confirma Senha" isPassword />

          {/* Biografia */}
          <div className="space-y-2 pt-2">
            <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Biografia</label>
            <CustomTextarea placeholder="Escreva um pouco sobre você..." />
          </div>

          {/* Gênero */}
          <div className="space-y-2 pt-2">
            <label className="text-lg font-semibold text-gray-800 dark:text-gray-200">Gênero</label>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className={genderButtonStyle}>
                Homem
              </Button>
              <Button variant="outline" className={genderButtonStyle}>
                Mulher
              </Button>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="pt-6">
            <Button type="submit" className={`w-full ${saveButtonStyle}`}>
              Salvar
            </Button>
          </div>
        </form>

        {/* Link de Login */}
        <div className="flex justify-between items-center mt-6 w-full text-base pb-8">
          <span className="text-gray-700 dark:text-gray-300">Já tem uma conta?</span>
          <Link to="/login" className="text-[#3A00FF] font-bold hover:underline text-lg">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CadastroDadosPessoais;