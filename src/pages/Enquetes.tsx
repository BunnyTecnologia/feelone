import React, { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, HelpCircle, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import PollCard from '@/components/PollCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface Option {
  id: string;
  texto_opcao: string;
  votes: number;
}

interface PollData {
  id: string;
  pergunta: string;
  options: Option[];
  totalVotes: number;
  userVotedOptionId: string | null;
}

const Enquetes = () => {
  const { toast } = useToast();
  const [pollsData, setPollsData] = useState<PollData[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
      setIsUserLoggedIn(!!user);
    };
    getUserId();
  }, []);

  const fetchPolls = useCallback(async () => {
    if (!userId) return;
    setLoading(true);

    // 1. Buscar todas as enquetes ativas e suas opções
    const { data: polls, error: pollsError } = await supabase
      .from('enquetes')
      .select('id, pergunta, opcoes_enquete(id, texto_opcao)')
      .eq('ativa', true)
      .order('created_at', { ascending: false });

    if (pollsError) {
      toast({ title: "Erro", description: pollsError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    const pollIds = polls?.map(p => p.id) || [];

    // 2. Buscar todos os votos para essas enquetes
    const { data: votes, error: votesError } = await supabase
      .from('votos_enquete')
      .select('enquete_id, opcao_id, user_id');

    if (votesError) {
      toast({ title: "Erro", description: "Falha ao carregar votos.", variant: "destructive" });
      setLoading(false);
      return;
    }

    const processedPolls: PollData[] = polls.map(poll => {
      const pollVotes = votes?.filter(v => v.enquete_id === poll.id) || [];
      const totalVotes = pollVotes.length;
      const userVote = pollVotes.find(v => v.user_id === userId);
      
      const optionsWithVotes: Option[] = (poll.opcoes_enquete as Option[]).map(option => ({
        ...option,
        votes: pollVotes.filter(v => v.opcao_id === option.id).length,
      }));

      return {
        id: poll.id,
        pergunta: poll.pergunta,
        options: optionsWithVotes,
        totalVotes,
        userVotedOptionId: userVote?.opcao_id || null,
      };
    });

    setPollsData(processedPolls);
    setLoading(false);
  }, [userId, toast]);

  useEffect(() => {
    if (userId) {
      fetchPolls();
    }
  }, [userId, fetchPolls]);

  const handleVote = async (pollId: string, optionId: string) => {
    if (!userId) {
      toast({ title: "Erro", description: "Você precisa estar logado para votar.", variant: "destructive" });
      return;
    }

    // 1. Registrar o voto
    const { error } = await supabase
      .from('votos_enquete')
      .insert({ enquete_id: pollId, user_id: userId, opcao_id: optionId });

    if (error) {
      if (error.code === '23505') { // Unique violation (usuário já votou)
        toast({ title: "Atenção", description: "Você já votou nesta enquete.", variant: "destructive" });
      } else {
        toast({ title: "Erro ao votar", description: error.message, variant: "destructive" });
      }
    } else {
      toast({ title: "Voto Registrado!", description: "Seu voto foi contabilizado.", });
      // 2. Recarregar os dados para mostrar o resultado parcial
      fetchPolls();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/perfil">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Enquetes
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : pollsData.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <HelpCircle className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma enquete ativa no momento.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {pollsData.map((poll) => (
              <PollCard 
                key={poll.id}
                pollId={poll.id}
                question={poll.pergunta}
                options={poll.options}
                totalVotes={poll.totalVotes}
                userVotedOptionId={poll.userVotedOptionId}
                onVote={handleVote}
                showResults={poll.userVotedOptionId !== null} // Mostra resultados se o usuário já votou
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) - Adicionar Enquete */}
      {isUserLoggedIn && (
        <Link 
          to="/admin/enquetes" 
          state={{ openNew: true }} // Adiciona o estado para abrir o modal
          className="fixed bottom-24 left-6 z-40"
        >
          <Button 
            className="w-14 h-14 rounded-full bg-[#3A00FF] hover:bg-indigo-700 shadow-lg p-0"
            aria-label="Adicionar nova enquete"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </Link>
      )}

      <MobileNavbar />
    </div>
  );
};

export default Enquetes;