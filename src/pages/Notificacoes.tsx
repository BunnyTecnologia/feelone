import React from 'react';
import { ArrowLeft, Bell, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';

const Notificacoes = () => {
  // Dados de exemplo de notificações
  const notifications = [
    { id: 1, message: "Seu agendamento com Phelipe foi confirmado.", time: "2h atrás", read: false },
    { id: 2, message: "Nova mensagem no grupo 'Geral'.", time: "Ontem", read: true },
    { id: 3, message: "Sua dieta 'Cutting' começou hoje!", time: "2 dias atrás", read: true },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/configuracoes">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Notificações
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma notificação nova.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-4 rounded-xl shadow-md flex items-start space-x-3 transition-colors ${
                  notif.read 
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400' 
                    : 'bg-[#D9D0FF] text-gray-900 dark:text-white border border-[#3A00FF]'
                }`}
              >
                <Info className={`h-5 w-5 mt-1 ${notif.read ? 'text-gray-500' : 'text-[#3A00FF]'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{notif.message}</p>
                  <span className="text-xs mt-1 block">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <MobileNavbar />
    </div>
  );
};

export default Notificacoes;