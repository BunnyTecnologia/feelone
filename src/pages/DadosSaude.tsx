import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CustomTextarea from '@/components/CustomTextarea';
import HealthToggle from '@/components/HealthToggle';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const DadosSaude = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Estados do formulário
  const [tipoSanguineo, setTipoSanguineo] = useState<string>('');
  const [temDiabetes, setTemDiabetes] = useState<boolean | null>(null);
  const [temProblemaCardiaco, setTemProblemaCardiaco] = useState<boolean | null>(null);
  const [temPressaoAlta, setTemPressaoAlta] = useState<boolean | null>(null);
  const [medicamentosUso, setMedicamentosUso] = useState('');
  const [alergiasMedicamentos, setAlergiasMedicamentos] = useState('');

  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast({
        title: "Erro de Autenticação",
        description: "Usuário não logado. Por favor, faça login novamente.",
        variant: "destructive",
      });
      return;
    }

    const profileData = {
      id: user.id,
      tipo_sanguineo: tipoSanguineo || null,
      tem_diabetes: temDiabetes,
      tem_problema_cardiaco: temProblemaCardiaco,
      tem_pressao_alta: temPressaoAlta,
      medicamentos_uso: medicamentosUso,
      alergias_medicamentos: alergiasMedicamentos,
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (dbError) {
      toast({
        title: "Erro ao Salvar Dados de Saúde",
        description: `Falha ao salvar dados: ${dbError.message}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Dados de saúde salvos com sucesso.",
    });

    // Redirecionar para a próxima etapa (Contato de Emergência)
    navigate('/contato-emergencia');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/minhas-informacoes">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Dados de Saúde
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center px-4 flex-grow">
        
        <p className="text-center text-gray-700 dark:text-gray-300 mb-8 text-base">
          Preencha seus dados de saúde. Essas informações são importantes em caso de emergência.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          
          {/* Tipo Sanguíneo */}
          <div className="space-y-2">
            <Label className="text-lg font-bold text-gray-900 dark:text-white">
              Tipo Sanguíneo
            </Label>
            <Select onValueChange={setTipoSanguineo} value={tipoSanguineo}>
              <SelectTrigger className="border-2 border-[#3A00FF] h-14 text-base placeholder:text-gray-500 rounded-xl focus:ring-0 focus:ring-offset-0">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {bloodTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Diabetes */}
          <HealthToggle 
            label="Diabetes?" 
            value={temDiabetes} 
            onChange={setTemDiabetes} 
          />

          {/* Problema Cardíaco */}
          <HealthToggle 
            label="Problema Cardíaco?" 
            value={temProblemaCardiaco} 
            onChange={setTemProblemaCardiaco} 
          />

          {/* Pressão Alta */}
          <HealthToggle 
            label="Pressão Alta?" 
            value={temPressaoAlta} 
            onChange={setTemPressaoAlta} 
          />

          {/* Remédios em Uso */}
          <div className="space-y-2 pt-4">
            <Label htmlFor="medicamentos" className="text-lg font-bold text-gray-900 dark:text-white">
              Quais remédios você usa? (separe por vírgula)
            </Label>
            <CustomTextarea 
              id="medicamentos"
              placeholder="Ex: Aspirina, Insulina" 
              value={medicamentosUso}
              onChange={(e) => setMedicamentosUso(e.target.value)}
            />
          </div>

          {/* Alergias a Medicamentos */}
          <div className="space-y-2">
            <Label htmlFor="alergias" className="text-lg font-bold text-gray-900 dark:text-white">
              Quais alergias a medicamentos? (separe por vírgula)
            </Label>
            <CustomTextarea 
              id="alergias"
              placeholder="Ex: Penicilina, Dipirona" 
              value={alergiasMedicamentos}
              onChange={(e) => setAlergiasMedicamentos(e.target.value)}
            />
          </div>

          {/* Botão Salvar (Mantendo o estilo da imagem, mas adicionando um botão de salvar no final) */}
          <div className="pt-8 pb-8">
            <Button type="submit" className={`w-full ${saveButtonStyle}`}>
              Salvar Dados de Saúde
            </Button>
          </div>
        </form>

        {/* Patrocinador Logo Placeholder (Baseado na imagem) */}
        <div className="mt-12 w-full flex justify-center pb-8"> {/* Reduzi o padding inferior aqui */}
          <div className="text-center">
            <span className="text-5xl font-extrabold leading-none text-blue-900 dark:text-blue-400">
              <span className="text-green-500">E</span>sportes
              <br />
              da Sorte
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DadosSaude;