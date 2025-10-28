import React, { useEffect, useState } from 'react';
import { ArrowLeft, Plane, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import TripCard from '@/components/TripCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface Trip {
  id: string;
  titulo: string;
  localizacao: string;
  descricao: string;
  data_viagem: string;
  fotos_url: string[] | null;
}

const Viagens = () => {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        setIsUserLoggedIn(false);
        return;
      }
      
      setIsUserLoggedIn(true);

      const { data, error } = await supabase
        .from('viagens')
        .select('id, titulo, localizacao, descricao, data_viagem, fotos_url') // Incluindo fotos_url
        .eq('user_id', user.id)
        .order('data_viagem', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar viagens",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setTrips(data || []);
      }
      setLoading(false);
    };

    fetchTrips();
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
            Minhas Viagens
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-32 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Plane className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma viagem cadastrada ainda.</p>
            <p className="text-sm mt-2">Acesse o painel de administração para adicionar.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <TripCard 
                key={trip.id}
                title={trip.titulo}
                location={trip.localizacao}
                description={trip.descricao}
                date={new Date(trip.data_viagem).toLocaleDateString('pt-BR')}
                imageUrls={trip.fotos_url} // Passando as URLs das fotos
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) - Adicionar Viagem */}
      {isUserLoggedIn && (
        <Link 
          to="/admin/viagens" 
          state={{ openNew: true }} // Adiciona o estado para abrir o modal
          className="fixed bottom-24 left-6 z-40"
        >
          <Button 
            className="w-14 h-14 rounded-full bg-[#3A00FF] hover:bg-indigo-700 shadow-lg p-0"
            aria-label="Adicionar nova viagem"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </Link>
      )}

      <MobileNavbar />
    </div>
  );
};

export default Viagens;