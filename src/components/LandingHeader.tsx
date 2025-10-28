import React from 'react';
import { Button } from '@/components/ui/button';

const LandingHeader = () => {
  return (
    <header className="w-full border-b border-dashed border-blue-500/50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo Placeholder */}
        <div className="flex items-center space-x-1">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z" fill="currentColor"/>
            <path d="M12 6a6 6 0 0 0-6 6h2a4 4 0 0 1 4-4V6z" fill="currentColor"/>
          </svg>
          <span className="text-2xl font-bold text-blue-600">FeelOne</span>
        </div>
        
        <Button className="bg-blue-900 hover:bg-blue-800 text-white text-sm px-4 py-2 rounded-full">
          Para empresas
        </Button>
      </div>
    </header>
  );
};

export default LandingHeader;