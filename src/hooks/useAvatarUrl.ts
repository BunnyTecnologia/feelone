import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAvatarUrl = (storedPathOrUrl: string | null | undefined) => {
  const [resolvedUrl, setResolvedUrl] = useState<string>('/placeholder.svg');

  useEffect(() => {
    let active = true;

    const resolve = async () => {
      // Sem avatar salvo
      if (!storedPathOrUrl) {
        if (active) setResolvedUrl('/placeholder.svg');
        return;
      }

      // Já é uma URL completa
      if (storedPathOrUrl.startsWith('http')) {
        if (active) setResolvedUrl(storedPathOrUrl);
        return;
      }

      // Caso seja um caminho do storage, cria uma URL assinada
      const { data } = await supabase.storage
        .from('avatars')
        .createSignedUrl(storedPathOrUrl, 60 * 60 * 24 * 7); // 7 dias

      if (active) {
        setResolvedUrl(data?.signedUrl ?? '/placeholder.svg');
      }
    };

    resolve();
    return () => {
      active = false;
    };
  }, [storedPathOrUrl]);

  return resolvedUrl;
};

export default useAvatarUrl;