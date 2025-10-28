import React from 'react';
import { ArrowLeft, ShoppingCart, User, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import HealthDataItem from '@/components/HealthDataItem';

const CarteirinhaDeEmergencia = () => {
  // Cores e estilos baseados na imagem
  const primaryColor = "#3A00FF";
  const secondaryColor = "#D9D0FF"; // Lilás claro para o fundo do card
  const titleColor = "#D93A3A"; // Vermelho para os títulos das seções

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md mx-auto pt-4 pb-8 px-4">
        <div className="flex justify-between items-center">
          <Link to="/">
            <ArrowLeft className="text-primaryColor h-6 w-6" style={{ color: primaryColor }} />
          </Link>
          <h1 className="text-xl font-bold" style={{ color: primaryColor }}>
            Carteirinha de Emergência
          </h1>
          <ShoppingCart className="text-primaryColor h-6 w-6" style={{ color: primaryColor }} />
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28 text-center">
        
        {/* Avatar e Nome */}
        <div className="mb-8">
          <div 
            className="w-28 h-28 rounded-full mx-auto flex items-center justify-center mb-3"
            style={{ backgroundColor: secondaryColor, border: `2px solid ${primaryColor}` }}
          >
            <User className="h-16 w-16" style={{ color: primaryColor }} />
          </div>
          <h2 className="text-3xl font-bold mb-1" style={{ color: primaryColor }}>
            Davi
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sub-Sede não informada
          </p>
        </div>

        {/* Card de Dados de Saúde e Contato */}
        <div 
          className="p-6 rounded-3xl text-left shadow-lg"
          style={{ backgroundColor: secondaryColor }}
        >
          
          {/* Dados de Saúde */}
          <h3 className="text-xl font-bold mb-4" style={{ color: titleColor }}>
            Dados de Saúde
          </h3>
          
          <HealthDataItem title="Tipo Sanguíneo" value="B-" isBoldValue />
          <HealthDataItem title="Alergias" value="a, ab, b" isBoldValue />
          <HealthDataItem title="Doenças Crônicas" value="Problemas Cardíacos" isBoldValue />
          <HealthDataItem title="Medicamentos em Uso" value="a, a, b," isBoldValue />

          {/* Separador visual (opcional, mas ajuda a quebrar o bloco) */}
          <div className="h-px bg-gray-300 my-6"></div>

          {/* Contato de Emergência */}
          <h3 className="text-xl font-bold mb-4" style={{ color: titleColor }}>
            Contato de Emergência
          </h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Nome</p>
              <p className="text-[#3A00FF] font-bold text-lg">Phelipe Coelho</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Telefone</p>
              <div className="flex items-center space-x-2 text-[#3A00FF] font-bold text-lg">
                <Phone className="h-5 w-5" />
                <span>11999999999</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Navbar Móvel */}
      <MobileNavbar />
    </div>
  );
};

export default CarteirinhaDeEmergencia;