import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Cadastro = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redireciona imediatamente para a primeira etapa do cadastro
    navigate('/cadastro/dados-pessoais', { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[#3A00FF]" />
      <p className="ml-2 text-gray-600">Redirecionando para o cadastro...</p>
    </div>
  );
};

export default Cadastro;