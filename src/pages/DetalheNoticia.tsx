import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, User, Newspaper, Loader2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MobileNavbar from '@/components/MobileNavbar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface News {
  id: string;
  titulo: string;
  conteudo: string;
  data_publicacao: string;
  autor: string;
  imagem_url: string | null;
}

const DetalheNoticia = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { newsId } = useParams<{ newsId: string }>();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!newsId) {
      navigate('/noticias');
      return;
    }

    const fetchNewsDetail = async () => {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('noticias')
        .select('id, titulo, conteudo, data_publicacao, autor, imagem_url')
        .eq('id', newsId)
        .single();

      if (error) {
        toast({
          title: "Erro",
          description: "Notícia não encontrada ou falha ao carregar.",
          variant: "destructive",
        });
        navigate('/noticias');
      } else {
        setNews(data as News);
      }
      setLoading(false);
    };

    fetchNewsDetail();
  }, [newsId, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
        <div className="w-full max-w-sm md:max-w-md pt-4 pb-8">
          <Link to="/noticias">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
        </div>
        <div className="w-full max-w-sm md:max-w-md mx-auto px-4 space-y-4">
          <Skeleton className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-40 w-full bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-full bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
        </div>
        <MobileNavbar />
      </div>
    );
  }

  if (!news) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Notícia não encontrada.</div>;
  }

  const formattedDate = format(new Date(news.data_publicacao), 'dd MMMM yyyy', { locale: ptBR });

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-4 px-4">
        <div className="flex items-center space-x-4">
          <Link to="/noticias">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold text-[#3A00FF] truncate">
            Detalhes da Notícia
          </h1>
        </div>
      </header>

      <main className="flex-grow w-full max-w-sm md:max-w-md mx-auto px-4 pb-28">
        
        {/* Imagem de Capa */}
        {news.imagem_url && (
          <div className="w-full h-56 overflow-hidden rounded-xl mb-6 shadow-lg">
            <img 
              src={news.imagem_url} 
              alt={news.titulo} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Título e Metadados */}
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
          {news.titulo}
        </h2>

        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-6 border-b pb-4">
          <div className="flex items-center space-x-1">
            <User className="h-4 w-4" />
            <span>{news.autor || 'Administrador'}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Conteúdo Completo */}
        <div className="text-gray-700 dark:text-gray-300 text-base leading-relaxed whitespace-pre-wrap">
          {news.conteudo}
        </div>

      </main>

      <MobileNavbar />
    </div>
  );
};

export default DetalheNoticia;