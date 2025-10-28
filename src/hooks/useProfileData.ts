import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

// Definição de tipos para a tabela profiles
export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  biografia: string | null;
  genero: 'Homem' | 'Mulher' | null;
  link_facebook: string | null;
  link_instagram: string | null;
  celular_whatsapp: string | null;
  link_site: string | null;
  chave_pix: string | null;
  cep: string | null;
  endereco: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  emergencia_nome: string | null;
  emergencia_telefone: string | null;
  emergencia_parentesco: string | null;
  emergencia_email: string | null;
  tipo_sanguineo: string | null;
  tem_diabetes: boolean | null;
  tem_problema_cardiaco: boolean | null;
  tem_pressao_alta: boolean | null;
  medicamentos_uso: string | null;
  alergias_medicamentos: string | null;
}

interface UseProfileResult {
  profile: ProfileData | null;
  loading: boolean;
  userId: string | null;
  refetch: () => void;
}

export const useProfileData = (): UseProfileResult => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    setUserId(user.id);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found
      toast({
        title: "Erro ao carregar perfil",
        description: error.message,
        variant: "destructive",
      });
      setProfile(null);
    } else if (data) {
      setProfile(data as ProfileData);
    } else {
      // Se não houver perfil, retorna um objeto básico com o ID
      setProfile({ id: user.id } as ProfileData);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { profile, loading, userId, refetch: fetchProfile };
};