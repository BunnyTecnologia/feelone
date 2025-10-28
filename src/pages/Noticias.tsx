import React, { useEffect, useState } from 'react';
import { ArrowLeft, Newspaper, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import NewsCard from '@/components/NewsCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface News {
  id: string;
  titulo: string;
  resumo: string;
  data_publicacao: string;
  autor: string;
  imagem_url: string | null;
}

const Noticias = () => {
  const { toast } = useToast();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsUserLoggedIn(!!user);
      
      // Busca todas as notícias (RLS permite leitura para autenticados)
      const { data, error } = await supabase
        .from('noticias')
        .select('id, titulo, resumo, data_publicacao, autor, imagem_url')
        .order('data_publicacao', { ascending: false });

      if (error) {
        toast({
          title: "Erro ao carregar notícias",
          description: error.message,
          variant: "destructive",
        });
      } else {
        setNews(data || []);
      }
      setLoading(false);
    };

    fetchNews();
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
            Notícias
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-40 w-full rounded-xl bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Newspaper className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma notícia publicada ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {news.map((item) => (
              <NewsCard 
                key={item.id}
                title={item.titulo}
                summary={item.resumo}
                author={item.autor || 'Administrador'}
                date={format(new Date(item.data_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
                imageUrl={item.imagem_url}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) - Adicionar Notícia (Apenas para administradores) */}
      {isUserLoggedIn && (
        <Link 
          to="/admin/noticias" 
          state={{ openNew: true }} 
          className="fixed bottom-24 left-6 z-40"
        >
          <Button 
            className="w-14 h-14 rounded-full bg-[#3A00FF] hover:bg-indigo-700 shadow-lg p-0"
            aria-label="Administrar Notícias"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        </Link>
      )}

      <MobileNavbar />
    </div>
  );
};

export default Noticias;