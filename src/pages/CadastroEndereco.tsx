import React, { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CustomInput from '@/components/CustomInput';
import { useProfileData } from '@/hooks/useProfileData';

// Tipagem para os dados de endereço retornados pelo ViaCEP
interface ViaCepData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string; // Cidade
  uf: string; // Estado
}

const CadastroEndereco = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { profile, loading: loadingProfile, userId } = useProfileData();

  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);

  // Carregar dados do perfil
  useEffect(() => {
    if (profile) {
      setCep(profile.cep || '');
      setEndereco(profile.endereco || '');
      setNumero(profile.numero || '');
      setComplemento(profile.complemento || '');
      setBairro(profile.bairro || '');
      setCidade(profile.cidade || '');
      setEstado(profile.estado || '');
    }
  }, [profile]);

  const fetchAddress = useCallback(async (inputCep: string) => {
    const cleanedCep = inputCep.replace(/\D/g, '');
    if (cleanedCep.length !== 8) return;

    setLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`);
      const data: ViaCepData | { erro: boolean } = await response.json();

      if ('erro' in data && data.erro) {
        toast({
          title: "Erro de CEP",
          description: "CEP não encontrado.",
          variant: "destructive",
        });
        return;
      }

      const cepData = data as ViaCepData;
      setEndereco(cepData.logradouro);
      setComplemento(cepData.complemento);
      setBairro(cepData.bairro);
      setCidade(cepData.localidade);
      setEstado(cepData.uf);
      
    } catch (error) {
      toast({
        title: "Erro de Conexão",
        description: "Falha ao buscar endereço. Verifique sua conexão.",
        variant: "destructive",
      });
    } finally {
      setLoadingCep(false);
    }
  }, [toast]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = e.target.value;
    setCep(newCep);
    if (newCep.replace(/\D/g, '').length === 8) {
      fetchAddress(newCep);
    }
  };

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
      cep,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      estado,
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (dbError) {
      toast({
        title: "Erro ao Salvar Endereço",
        description: `Falha ao salvar dados: ${dbError.message}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Endereço salvo com sucesso.",
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
            Endereço
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          <CustomInput 
            placeholder="Cep" 
            value={cep}
            onChange={handleCepChange}
            disabled={loadingCep}
            required
          />
          <CustomInput 
            placeholder="Endereço" 
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            disabled={loadingCep}
            required
          />
          
          {/* Número e Complemento (Reorganizado) */}
          <div className="grid grid-cols-2 gap-4">
            <CustomInput 
              placeholder="Número" 
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              required
            />
            <CustomInput 
              placeholder="Complemento" 
              value={complemento}
              onChange={(e) => setComplemento(e.target.value)}
            />
          </div>

          {/* Bairro */}
          <CustomInput 
            placeholder="Bairro" 
            value={bairro}
            onChange={(e) => setBairro(e.target.value)}
            disabled={loadingCep}
            required
          />

          {/* Cidade e Estado (Reorganizado) */}
          <div className="grid grid-cols-2 gap-4">
            <CustomInput 
              placeholder="Cidade" 
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              disabled={loadingCep}
              required
            />
            <CustomInput 
              placeholder="Estado (UF)" 
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              disabled={loadingCep}
              required
            />
          </div>

          {/* Botão Salvar */}
          <div className="pt-8 pb-8">
            <Button 
              type="submit" 
              className={`w-full ${saveButtonStyle}`}
              disabled={loadingCep}
            >
              {loadingCep ? 'Buscando CEP...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroEndereco;