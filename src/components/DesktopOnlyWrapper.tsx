import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Monitor } from 'lucide-react';

interface DesktopOnlyWrapperProps {
  children: React.ReactNode;
}

const DesktopOnlyWrapper: React.FC<DesktopOnlyWrapperProps> = ({ children }) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gray-50 dark:bg-gray-900">
        <Monitor className="h-16 w-16 text-[#3A00FF] mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acesso Restrito</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Esta página está disponível apenas na versão desktop.
        </p>
        <p className="text-sm mt-4">
          Use um dispositivo com tela maior para acessar o Dashboard ou a Landing Page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DesktopOnlyWrapper;