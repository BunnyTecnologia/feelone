import React, { useState, useRef, useEffect } from 'react';
import { Camera, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import CustomInput from '@/components/CustomInput';
import CustomPasswordInput from '@/components/CustomPasswordInput';
import CustomTextarea from '@/components/CustomTextarea';

const CadastroDadosPessoais = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [biography, setBiography] = useState('');
  const [gender, setGender] = useState<'Homem' | 'Mulher' | null>(null);
  
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

    if (password !== confirmPassword) {
      toast({
        title: "Erro de Senha",
        description: "As senhas não coincidem.",
        variant: "destructive",
      });
      return;
    }

    if (!gender) {
      toast({
        title: "Gênero Obrigatório",
        description: "Por favor, selecione seu gênero.",
        variant: "destructive",
      });
      return;
    }

    // 1. Criar o usuário no Supabase Auth
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
      toast({
        title: "Erro no Cadastro",
        description: authError.message,
        variant: "destructive",
      });
      return;
    }

    const userId = authData.user?.id;
    if (!userId) {
      toast({
        title: "Erro Desconhecido",
        description: "Falha ao obter o ID do usuário após o cadastro.",
        variant: "destructive",
      });
      return;
    }

    let avatarUrl: string | null = null;

    // 2. Upload da Imagem (se houver)
    if (avatarFile) {
      const fileName = `${userId}/${Date.now()}_avatar.jpg`;
      const { url, error } = await uploadFile(avatarFile, fileName);
      
      if (error) {
        // O cadastro do usuário já foi feito, mas falhou o upload. Avisamos e continuamos.
        toast({
          title: "Aviso: Falha no Upload",
          description: `Falha ao carregar a imagem: ${error.message}. Continuando sem avatar.`,
          variant: "destructive",
        });
      } else {
        avatarUrl = url;
      }
    }

    // 3. Salvar/Atualizar dados adicionais na tabela 'profiles'
    // Nota: O trigger handle_new_user já deve ter criado a linha básica.
    const profileData = {
      id: userId,
      first_name: firstName,
      last_name: lastName,
      biografia: biography,
      genero: gender,
      // Usamos um slug simples baseado no nome por enquanto, se não houver um campo de slug na imagem
      slug_perfil: `${firstName.toLowerCase()}.${lastName.toLowerCase()}-${userId.slice(0, 4)}`, 
      ...(avatarUrl && { avatar_url: avatarUrl }),
    };

    const { error: dbError } = await supabase
      .from('profiles')
      .upsert([profileData], { onConflict: 'id' });

    if (dbError) {
      toast({
        title: "Erro ao Salvar Perfil",
        description: `Falha ao salvar dados adicionais: ${dbError.message}`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso!",
      description: "Cadastro concluído. Redirecionando para as Redes Sociais.",
    });

    // Redirecionar para a próxima etapa do cadastro
    navigate('/cadastro/redes-sociais');
  };

  // Estilo para o botão principal (Salvar)
  const saveButtonStyle = "bg-[#3A00FF] hover:bg-indigo-700 text-white h-14 text-lg font-semibold rounded-xl";

  return (
    <div className="min-h-screen flex flex-col items-center bg-white dark:bg-gray-900 p-4">
      
      <div className="w-full max-w-sm md:max-w-md flex flex-col items-center pt-12">
        
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
            />
            <CustomInput 
              placeholder="Sobrenome" 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* E-mail */}
          <CustomInput 
            type="email" 
            placeholder="E-mail" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Senha */}
          <CustomPasswordInput 
            placeholder="Senha" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Confirma Senha */}
          <CustomPasswordInput 
            placeholder="Confirma Senha" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
              disabled={uploading}
            >
              {uploading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroDadosPessoais;