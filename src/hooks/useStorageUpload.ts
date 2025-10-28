import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  url: string | null;
  error: Error | null;
  uploading: boolean;
}

/**
 * Hook para fazer upload de um arquivo para um bucket específico no Supabase Storage.
 * @param bucketName O nome do bucket (ex: 'avatars').
 * @param folderPath O caminho da pasta dentro do bucket (ex: 'public/').
 */
export const useStorageUpload = (bucketName: string, folderPath: string = '') => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const ensureSlash = (path: string) => {
    if (!path) return '';
    return path.endsWith('/') ? path : `${path}/`;
  };

  const uploadFile = async (file: File, fileName: string): Promise<UploadResult> => {
    setUploading(true);
    setError(null);

    const safeFolderPath = ensureSlash(folderPath);
    const filePath = `${safeFolderPath}${fileName}`;

    try {
      // Upload com contentType correto e upsert habilitado
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'application/octet-stream',
        });

      if (uploadError) {
        throw uploadError;
      }

      // Obter URL pública (se o bucket for público)
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Falha ao obter a URL pública após o upload.");
      }

      return { url: publicUrlData.publicUrl, error: null, uploading: false };

    } catch (err) {
      const uploadError = err instanceof Error ? err : new Error("Erro desconhecido durante o upload.");
      setError(uploadError);
      return { url: null, error: uploadError, uploading: false };
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};