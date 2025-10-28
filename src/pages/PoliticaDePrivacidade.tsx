import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PoliticaDePrivacidade = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          <Link to="/configuracoes">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Política de Privacidade
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center text-gray-800 dark:text-gray-200">
        
        <div className="space-y-6 text-base leading-relaxed">
          <p>
            A sua privacidade é importante para nós. É política do [Nome do App] respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no aplicativo.
          </p>
          
          <h2 className="text-xl font-bold text-[#3A00FF] pt-4">1. Coleta de Informações</h2>
          <p>
            Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento.
          </p>
          
          <h2 className="text-xl font-bold text-[#3A00FF] pt-4">2. Uso dos Dados</h2>
          <p>
            As informações coletadas são usadas exclusivamente para fornecer e melhorar os serviços oferecidos, como personalização de rotas, dados de saúde em emergências e comunicação entre usuários.
          </p>
          
          <h2 className="text-xl font-bold text-[#3A00FF] pt-4">3. Segurança</h2>
          <p>
            Protegemos as informações armazenadas dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
          </p>
          
          <h2 className="text-xl font-bold text-[#3A00FF] pt-4">4. Compartilhamento</h2>
          <p>
            Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei ou para proteger seus dados em situações de emergência (como contatos de emergência e dados de saúde).
          </p>
          
          <p className="pt-4 italic text-sm text-gray-500 dark:text-gray-400">
            Última atualização: 25 de Julho de 2024.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PoliticaDePrivacidade;