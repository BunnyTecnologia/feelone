import React from 'react';

const SponsorsSection = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
          Patrocinadores
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          A FeelOne acredita na segurança acessível. Por isso, todas as pulseiras são um presente dos nossos patrocinadores. Em troca, garantimos que eles tenham visualizações e interações com nossa comunidade, estabelecendo um ciclo de patrocínio responsável e mutuamente vantajoso.
        </p>
        
        {/* Logo Patrocinador Placeholder */}
        <div className="flex justify-center">
          <div className="w-64 h-20 flex items-center justify-center text-3xl font-extrabold text-blue-900 border-2 border-blue-900 rounded-lg p-4">
            Esportes da Sorte Logo
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;