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
 * @param folderPath O caminho da pasta dentro do bucket (ex: 'user_uploads/').
 */
export const useStorageUpload = (bucketName: string, folderPath: string = '') => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const uploadFile = async (file: File, fileName: string): Promise<UploadResult> => {
    setUploading(true);
    setError(null);
    
    const filePath = `${folderPath}${fileName}`;

    try {
      // 1. Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true, // Permite sobrescrever se o arquivo já existir
        });

      if (uploadError) {
        throw uploadError;
      }

      // 2. Obter a URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (!publicUrlData || !publicUrlData.publicUrl) {
        throw new Error("Failed to retrieve public URL after upload.");
      }

      return { url: publicUrlData.publicUrl, error: null, uploading: false };

    } catch (err) {
      const uploadError = err instanceof Error ? err : new Error("An unknown error occurred during upload.");
      setError(uploadError);
      return { url: null, error: uploadError, uploading: false };
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};