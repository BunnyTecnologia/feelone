import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Trash2, Edit, Newspaper, Loader2, Image } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import CustomInput from '@/components/CustomInput';
import CustomTextarea from '@/components/CustomTextarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { useStorageUpload } from '@/hooks/useStorageUpload';

interface News {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  autor: string;
  imagem_url: string | null;
  data_publicacao: string;
}

const NoticiasAdmin = () => {
  const { toast } = useToast();
  const location = useLocation();
  const [newsList, setNewsList] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentNews, setCurrentNews] = useState<Partial<News> | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadFile } = useStorageUpload('news_images', 'public/');

  // Efeito para verificar o estado de navegação e abrir o modal
  useEffect(() => {
    if (location.state && (location.state as { openNew?: boolean }).openNew) {
      openNewDialog();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Efeito para gerenciar a pré-visualização da imagem
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (currentNews?.imagem_url) {
      setImagePreviewUrl(currentNews.imagem_url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [imageFile, currentNews?.imagem_url]);

  const fetchNews = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('noticias')
      .select('id, titulo, resumo, data_publicacao, autor, imagem_url')
      .eq('user_id', user.id)
      .order('data_publicacao', { ascending: false });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      setNewsList(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNews?.titulo || !currentNews?.resumo || !currentNews?.conteudo || !currentNews?.autor) {
      toast({ title: "Atenção", description: "Título, Resumo, Conteúdo e Autor são obrigatórios.", variant: "destructive" });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setIsUploading(true);
    let finalImageUrl: string | null = currentNews.imagem_url || null;

    // 1. Upload da nova imagem (se houver)
    if (imageFile) {
      const fileName = `${user.id}/news/${Date.now()}_${imageFile.name}`;
      const { url, error } = await uploadFile(imageFile, fileName);
      
      if (error) {
        toast({ title: "Aviso: Falha no Upload", description: `Falha ao carregar a imagem: ${error.message}.`, variant: "destructive" });
      } else {
        finalImageUrl = url;
      }
    }
    
    // 2. Salvar dados no DB
    const payload = {
      user_id: user.id,
      titulo: currentNews.titulo,
      resumo: currentNews.resumo,
      conteudo: currentNews.conteudo,
      autor: currentNews.autor,
      imagem_url: finalImageUrl,
      // Se for novo, a data_publicacao será NOW() por padrão do DB. Se for edição, mantemos a data original ou atualizamos.
    };

    let error = null;

    if (currentNews.id) {
      // Update
      const { error: updateError } = await supabase
        .from('noticias')
        .update(payload)
        .eq('id', currentNews.id);
      error = updateError;
    } else {
      // Insert
      const { error: insertError } = await supabase
        .from('noticias')
        .insert(payload);
      error = insertError;
    }

    setIsUploading(false);

    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Notícia salva com sucesso.", });
      setIsDialogOpen(false);
      setCurrentNews(null);
      setImageFile(null);
      fetchNews();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja deletar esta notícia?")) return;

    const { error } = await supabase
      .from('noticias')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Erro ao deletar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Sucesso", description: "Notícia deletada.", });
      fetchNews();
    }
  };

  const openEditDialog = (news: News) => {
    setCurrentNews(news);
    setImageFile(null); // Limpa o arquivo de upload pendente
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setCurrentNews({ titulo: '', resumo: '', conteudo: '', autor: '', imagem_url: null });
    setImageFile(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/noticias">
              <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
            </Link>
            <h1 className="text-3xl font-bold text-[#3A00FF]">
              Admin Notícias
            </h1>
          </div>
          <Button 
            onClick={openNewDialog}
            className="bg-[#3A00FF] hover:bg-indigo-700 text-white rounded-full p-2 h-10 w-10"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="w-full max-w-sm md:max-w-md flex flex-col items-center space-y-4 pb-8">
        {loading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : newsList.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Newspaper className="h-12 w-12 mx-auto mb-4" />
            <p>Nenhuma notícia cadastrada.</p>
          </div>
        ) : (
          newsList.map((news) => (
            <Card key={news.id} className="w-full shadow-md border border-gray-200 dark:border-gray-700">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl text-gray-900 dark:text-white truncate">{news.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Por: {news.autor} | Data: {new Date(news.data_publicacao).toLocaleDateString('pt-BR')}
                </p>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => openEditDialog(news)}
                    className="text-[#3A00FF] hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="h-5 w-5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleDelete(news.id)}
                    className="text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>

      {/* Dialog de CRUD */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#3A00FF]">
              {currentNews?.id ? 'Editar Notícia' : 'Nova Notícia'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4 py-4">
            
            {/* Upload de Imagem */}
            <div className="space-y-2">
              <Label className="text-lg font-bold text-gray-900 dark:text-white">
                Imagem de Capa
              </Label>
              <div 
                className="w-full h-32 border-2 border-dashed border-[#3A00FF] rounded-xl flex items-center justify-center cursor-pointer relative overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {imagePreviewUrl ? (
                  <img 
                    src={imagePreviewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-[#3A00FF]">
                    <Image className="h-6 w-6" />
                    <span className="text-sm mt-1">Adicionar Imagem</span>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  disabled={isUploading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <CustomInput
                id="titulo"
                value={currentNews?.titulo || ''}
                onChange={(e) => setCurrentNews({ ...currentNews, titulo: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="autor">Autor</Label>
              <CustomInput
                id="autor"
                value={currentNews?.autor || ''}
                onChange={(e) => setCurrentNews({ ...currentNews, autor: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumo">Resumo (Máx 200 caracteres)</Label>
              <CustomTextarea
                id="resumo"
                value={currentNews?.resumo || ''}
                onChange={(e) => setCurrentNews({ ...currentNews, resumo: e.target.value })}
                maxLength={200}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo Completo</Label>
              <CustomTextarea
                id="conteudo"
                value={currentNews?.conteudo || ''}
                onChange={(e) => setCurrentNews({ ...currentNews, conteudo: e.target.value })}
                required
              />
            </div>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={isUploading}>Cancelar</Button>
              </DialogClose>
              <Button type="submit" className="bg-[#3A00FF] hover:bg-indigo-700" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Salvar Notícia'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoticiasAdmin;