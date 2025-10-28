import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import CustomInput from '@/components/CustomInput';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfileData } from '@/hooks/useProfileData';

const ContatoDeEmergencia = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: loadingProfile, userId } = useProfileData();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [parentesco, setParentesco] = useState('');
  const [email, setEmail] = useState('');

  // Carregar dados do perfil
  useEffect(() => {
    if (profile) {
      setNome(profile.emergencia_nome || '');
      setTelefone(profile.emergencia_telefone || '');
      setParentesco(profile.emergencia_parentesco || '');
      setEmail(profile.emergencia_email || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      toast({
        title: "Erro de Autenticação",
        description: "Usuário não logado. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    const profileData = {
      id: userId,
      emergencia_nome: nome,
      emergencia_telefone: telefone,
      emergencia_parentesco: parentesco,
      emergencia_email: email,
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (dbError) {
      toast({
        title: "Erro ao Salvar Contato de Emergência",
        description: `Falha ao salvar dados: ${dbError.message}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Contato de emergência salvo.",
    });

    // Redirecionar para Minhas Informações
    navigate('/minhas-informacoes');
  };

  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#3A00FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center space-x-4">
          {/* Link para a página anterior (Minhas Informações) */}
          <Link to="/minhas-informacoes">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Contato Emergência
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          <CustomInput 
            placeholder="Nome" 
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <CustomInput 
            placeholder="Telefone com whatsapp" 
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            required
          />
          <CustomInput 
            placeholder="Grau parentesco" 
            value={parentesco}
            onChange={(e) => setParentesco(e.target.value)}
            required
          />
          <CustomInput 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

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

export default ContatoDeEmergencia;