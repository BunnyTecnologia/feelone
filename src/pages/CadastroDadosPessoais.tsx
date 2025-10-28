import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, User, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import CustomInput from '@/components/CustomInput';
import CustomPasswordInput from '@/components/CustomPasswordInput';
import CustomTextarea from '@/components/CustomTextarea';
import { useProfileData, ProfileData } from '@/hooks/useProfileData';

const CadastroDadosPessoais = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { profile, loading: loadingProfile, userId, refetch } = useProfileData();
  
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [biography, setBiography] = useState('');
  const [gender, setGender] = useState<'Homem' | 'Mulher' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados da imagem
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);

  const { uploadFile, uploading } = useStorageUpload('avatars', 'public/');

  // Carregar dados do perfil e do usuário logado
  useEffect(() => {
    const loadUserData = async () => {
      if (profile && userId) {
        // Carregar dados da tabela profiles
        setFirstName(profile.first_name || '');
        setLastName(profile.last_name || '');
        setBiography(profile.biografia || '');
        setGender(profile.genero || null);
        setAvatarPreviewUrl(profile.avatar_url || null);

        // Carregar email do Auth (não está na tabela profiles)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setEmail(user.email || '');
        }
      }
    };
    loadUserData();
  }, [profile, userId]);

  // Gerenciar preview de nova imagem
  useEffect(() => {
    if (avatarFile) {
      const url = URL.createObjectURL(avatarFile);
      setAvatarPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (profile && !profile.avatar_url) {
      setAvatarPreviewUrl(null);
    }
  }, [avatarFile, profile]);

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
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      toast({
        title: "Erro de Senha",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    if (!gender) {
      toast({
        title: "Gênero Obrigatório",
        description: "Por favor, selecione seu gênero.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    let currentUserId = userId;
    let isNewUser = !userId;

    // 1. Autenticação (SignUp para novo usuário, ou Update de senha/email para existente)
    if (isNewUser) {
      // Novo Cadastro
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          }
        }
      });

      if (authError) {
        toast({ title: "Erro no Cadastro", description: authError.message, variant: "destructive" });
        setIsSubmitting(false);
        return;
      }
      currentUserId = authData.user?.id || null;
    } else {
      // Usuário existente: Atualizar senha e/ou email se preenchidos
      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({ password });
        if (passwordError) {
          toast({ title: "Erro ao atualizar senha", description: passwordError.message, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      }
      if (email && email !== profile?.id) { // O email do Auth não está no profile, mas o ID do profile é o ID do Auth.
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) {
          toast({ title: "Erro ao atualizar email", description: emailError.message, variant: "destructive" });
          setIsSubmitting(false);
          return;
        }
      }
    }

    if (!currentUserId) {
      toast({ title: "Erro Desconhecido", description: "Falha ao obter o ID do usuário.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    let avatarUrl: string | null = profile?.avatar_url || null;

    // 2. Upload da Imagem (se houver um novo arquivo)
    if (avatarFile) {
      const fileName = `${currentUserId}/${Date.now()}_avatar.jpg`;
      const { url, error } = await uploadFile(avatarFile, fileName);
      
      if (error) {
        toast({ title: "Aviso: Falha no Upload", description: `Falha ao carregar a imagem: ${error.message}.`, variant: "destructive" });
      } else {
        avatarUrl = url;
      }
    }

    // 3. Salvar/Atualizar dados adicionais na tabela 'profiles'
    const profileData: Partial<ProfileData> = {
      id: currentUserId,
      first_name: firstName,
      last_name: lastName,
      biografia: biography,
      genero: gender,
      // Mantém o slug se existir, ou cria um novo se for novo usuário
      slug_perfil: profile?.slug_perfil || `${firstName.toLowerCase()}.${lastName.toLowerCase()}-${currentUserId.slice(0, 4)}`, 
      avatar_url: avatarUrl,
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (dbError) {
      toast({ title: "Erro ao Salvar Perfil", description: `Falha ao salvar dados adicionais: ${dbError.message}`, variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    toast({
      title: "Sucesso!",
      description: isNewUser ? "Cadastro concluído. Redirecionando..." : "Dados pessoais atualizados com sucesso.",
    });

    setIsSubmitting(false);
    refetch(); // Recarrega os dados do perfil
    
    // Redirecionar para a próxima etapa ou para Minhas Informações
    if (isNewUser) {
      navigate('/cadastro/redes-sociais');
    } else {
      navigate('/minhas-informacoes');
    }
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
          <Link to={userId ? "/minhas-informacoes" : "/login"}>
            <ArrowLeft className="text-[#3A00FF] h-6 w-6" />
          </Link>
          <h1 className="text-3xl font-bold text-[#3A00FF]">
            {userId ? 'Editar Dados Pessoais' : 'Cadastro'}
          </h1>
        </div>
      </header>

      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center">
        
        {/* Seletor de Imagem de Perfil */}
        <div className="relative mb-8 cursor-pointer" onClick={handleImageClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={uploading || isSubmitting}
          />
          {/* Avatar Style: Cinza claro com borda sutil */}
          <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${avatarPreviewUrl ? 'border-4 border-gray-200' : 'bg-gray-200'}`}>
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
          {/* Ícone da Câmera */}
          <div className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-300">
            <Camera className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          
          {/* Nome e Sobrenome (Grid 2 colunas) */}
          <div className="grid grid-cols-2 gap-4">
            <CustomInput 
              placeholder="Nome" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              disabled={isSubmitting}
            />
            <CustomInput 
              placeholder="Sobrenome" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          {/* E-mail */}
          <CustomInput 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isSubmitting}
          />

          {/* Senha (Opcional para edição, obrigatório para novo cadastro) */}
          <CustomPasswordInput 
            placeholder={userId ? "Nova Senha (opcional)" : "Senha"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required={!userId}
            disabled={isSubmitting}
          />

          {/* Confirma Senha (Opcional para edição, obrigatório para novo cadastro) */}
          <CustomPasswordInput 
            placeholder={userId ? "Confirma Nova Senha" : "Confirma Senha"} 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required={!userId}
            disabled={isSubmitting}
          />

          {/* Biografia */}
          <div className="pt-4 space-y-2">
            <Label htmlFor="biography" className="text-lg font-bold text-gray-900 dark:text-white">
              Biografia
            </Label>
            <CustomTextarea 
              id="biography"
              placeholder="Escreva um pouco sobre você..." 
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Gênero */}
          <div className="pt-4 space-y-2">
            <Label className="text-lg font-bold text-gray-900 dark:text-white">
              Gênero
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                type="button"
                onClick={() => setGender('Homem')}
                className={`h-14 text-lg font-semibold rounded-xl border-2 transition-colors ${
                  gender === 'Homem' 
                    ? 'bg-[#3A00FF] border-[#3A00FF] text-white hover:bg-indigo-700' 
                    : 'bg-white border-[#3A00FF] text-[#3A00FF] hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800'
                }`}
                disabled={isSubmitting}
              >
                Homem
              </Button>
              <Button 
                type="button"
                onClick={() => setGender('Mulher')}
                className={`h-14 text-lg font-semibold rounded-xl border-2 transition-colors ${
                  gender === 'Mulher' 
                    ? 'bg-[#3A00FF] border-[#3A00FF] text-white hover:bg-indigo-700' 
                    : 'bg-white border-[#3A00FF] text-[#3A00FF] hover:bg-gray-50 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800'
                }`}
                disabled={isSubmitting}
              >
                Mulher
              </Button>
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="pt-8 pb-8">
            <Button 
              type="submit" 
              className={`w-full ${saveButtonStyle}`}
              disabled={uploading || isSubmitting}
            >
              {(uploading || isSubmitting) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroDadosPessoais;