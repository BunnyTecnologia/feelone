import React from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/configuracoes">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Política de Privacidade
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        <div className="space-y-6 text-gray-700 dark:text-gray-300 text-base leading-relaxed">
          
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Última atualização: 25 de Julho de 2024
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">1. Introdução</h2>
          <p>
            A FeelOne ("nós", "nosso", "conosco") está comprometida em proteger a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nosso aplicativo móvel e serviços relacionados.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">2. Informações que Coletamos</h2>
          <p>
            Coletamos informações pessoais que você nos fornece diretamente, como nome, e-mail, dados de saúde (opcional), contatos de emergência e links de redes sociais. Também coletamos dados de uso e informações técnicas, como o ID da sua pulseira NFC.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">3. Uso das Informações</h2>
          <p>
            Utilizamos as informações coletadas para:
            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
              <li>Fornecer e manter nossos serviços.</li>
              <li>Personalizar sua experiência de perfil.</li>
              <li>Garantir que seus dados de emergência sejam acessíveis via NFC.</li>
              <li>Comunicar sobre atualizações e ofertas.</li>
            </ul>
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">4. Segurança</h2>
          <p>
            Empregamos medidas de segurança administrativas, técnicas e físicas para proteger suas informações pessoais. No entanto, lembre-se que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro.
          </p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-white pt-4">5. Contato</h2>
          <p>
            Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através do e-mail: suporte@feelone.com.br.
          </p>
        </div>
      </main>

      <MobileNavbar />
    </div>
  );
};

export default PoliticaDePrivacidade;