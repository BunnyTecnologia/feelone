import React, { useEffect, useState } from 'react';
import { ArrowLeft, Utensils, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import DietCard from '@/components/DietCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button'; // Importando Button

interface Diet {
  id: string;
  titulo: string;
  descricao: string;
  data_inicio: string;
  data_fim: string;
}

const Dieta = () => {
  const { toast } = useToast();
  const [diets, setDiets] = useState<Diet[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Estado para controlar a visibilidade do FAB

  useEffect(() => {
    const fetchDiets = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        setIsUserLoggedIn(false);
        return;
      }
      
      setIsUserLoggedIn(true);

      const { data, error } = await supabase
        .from('dietas')
        .select('id, titulo, descricao, data_inicio, data_fim')
        .eq('user_id', user.id)
        .order('data_inicio', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar dietas",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setDiets(data || []);
      }
      setLoading(false);
    };

    fetchDiets();
  }, [toast]);

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/perfil">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Minhas Dietas
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : diets.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Utensils className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma dieta cadastrada ainda.</p>
            <p className="text-sm mt-2">Acesse o painel de administração para adicionar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {diets.map((diet) => (
              <DietCard 
                key={diet.id}
                title={diet.titulo}
                description={diet.descricao}
                startDate={new Date(diet.data_inicio).toLocaleDateString('pt-BR')}
                endDate={new Date(diet.data_fim).toLocaleDateString('pt-BR')}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) - Adicionar Dieta */}
      {isUserLoggedIn && (
        <Link to="/admin/dieta" className="fixed bottom-24 left-6 z-40">
          <Button 
            className="w-14 h-14 rounded-full bg-[#3A00FF] hover:bg-indigo-700 shadow-lg p-0"
            aria-label="Adicionar nova dieta"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </Link>
      )}

      <MobileNavbar />
    </div>
  );
};

export default Dieta;