import React, { useEffect, useState } from 'react';
import { ArrowLeft, Dumbbell, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import WorkoutCard from '@/components/WorkoutCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface Workout {
  id: string;
  titulo: string;
  descricao: string;
  foco: string;
  duracao_dias: number;
}

const Academia = () => {
  const { toast } = useToast();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        setIsUserLoggedIn(false);
        return;
      }
      
      setIsUserLoggedIn(true);

      const { data, error } = await supabase
        .from('series_exercicios')
        .select('id, titulo, descricao, foco, duracao_dias')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar séries",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setWorkouts(data || []);
      }
      setLoading(false);
    };

    fetchWorkouts();
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
            Minhas Séries
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : workouts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Dumbbell className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma série de exercícios cadastrada ainda.</p>
            <p className="text-sm mt-2">Acesse o painel de administração para adicionar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map((workout) => (
              <WorkoutCard 
                key={workout.id}
                title={workout.titulo}
                description={workout.descricao}
                focus={workout.foco}
                durationDays={workout.duracao_dias}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) - Adicionar Série */}
      {isUserLoggedIn && (
        <Link 
          to="/admin/academia" 
          state={{ openNew: true }} // Adiciona o estado para abrir o modal
          className="fixed bottom-24 left-6 z-40"
        >
          <Button 
            className="w-14 h-14 rounded-full bg-[#3A00FF] hover:bg-indigo-700 shadow-lg p-0"
            aria-label="Adicionar nova série"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </Link>
      )}

      <MobileNavbar />
    </div>
  );
};

export default Academia;