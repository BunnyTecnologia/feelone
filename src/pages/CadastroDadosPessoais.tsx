import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useStorageUpload } from '@/hooks/useStorageUpload';

const CadastroDadosPessoais = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados do formulário
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [slug, setSlug] = useState('');
  
  // Estados da imagem
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const { uploadFile, uploading } = useStorageUpload('avatars', 'public/');

  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [avatarFile]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast({
        title: "Erro de Autenticação",
        description: "Você precisa estar logado para salvar os dados.",
        variant: "destructive",
      });
      return;
    }
    
    const userId = user.data.user.id;
    let avatarUrl: string | null = null;

    // 1. Upload da Imagem (se houver)
    if (avatarFile) {
      const fileName = `${userId}/${Date.now()}_avatar.jpg`;
      const { url, error } = await uploadFile(avatarFile, fileName);
      
      if (error) {
        toast({
          title: "Erro no Upload",
          description: `Falha ao carregar a imagem: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      avatarUrl = url;
    }

    // 2. Salvar/Atualizar dados na tabela 'profiles'
    const profileData = {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      slug_perfil: slug,
      ...(avatarUrl && { avatar_url: avatarUrl }),
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (dbError) {
      toast({
        title: "Erro ao Salvar",
        description: `Falha ao salvar dados pessoais: ${dbError.message}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Dados pessoais e imagem de perfil salvos com sucesso.",
    });

    // Redirecionar para a próxima etapa do cadastro
    navigate('/cadastro/redes-sociais');
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      {/* Header */}
      <header className="w-full max-w-sm md:max-w-md pt-4 pb-12">
        <div className="flex items-center space-x-4">
          <Link to="/login">
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            Dados Pessoais
          </h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Seletor de Imagem de Perfil */}
        <div className="relative mb-8 cursor-pointer" onClick={handleImageClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={uploading}
          />
          <div className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${avatarPreviewUrl ? 'border-4 border-[#3A00FF]' : 'bg-gray-200'}`}>
            {avatarPreviewUrl ? (
              <img 
                src={avatarPreviewUrl} 
                alt="Avatar Preview" 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="h-16 w-16 text-gray-500" />
            )}
          </div>
          <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-300">
            <Camera className="h-5 w-5 text-[#3A00FF]" />
          </div>
        </div>

        {/* Campos do Formulário */}
        <div className="w-full space-y-6">
          <div>
            <Label htmlFor="firstName">Nome</Label>
            <Input 
              id="firstName" 
              type="text" 
              placeholder="Seu primeiro nome" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>
          
          <div>
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input 
              id="lastName" 
              type="text" 
              placeholder="Seu sobrenome" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-12 text-base"
            />
          </div>

          <div>
            <Label htmlFor="slug">Link do Perfil (Slug)</Label>
            <Input 
              id="slug" 
              type="text" 
              placeholder="ex: joao.silva" 
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              className="h-12 text-base"
            />
            <p className="text-sm text-gray-500 mt-1">
              Seu link público será: feelone.com/perfil/{slug}
            </p>
          </div>
        </div>

        {/* Botão de Ação */}
        <Button 
          type="submit" 
          className="w-full bg-[#3A00FF] hover:bg-indigo-700 text-white h-12 text-lg font-semibold rounded-xl shadow-lg mt-10"
          disabled={uploading}
        >
          {uploading ? 'Carregando Imagem...' : 'Próxima Etapa'}
        </Button>
      </form>
    </div>
  );
};

export default CadastroDadosPessoais;