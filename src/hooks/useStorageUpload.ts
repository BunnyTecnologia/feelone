import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UploadResult {
  url: string | null; // URL utilizável imediatamente (pública ou assinada)
  path: string;       // Caminho do arquivo no bucket (ex: 'public/{uid}/file.jpg')
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

      // Tenta URL pública
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        return { url: publicUrlData.publicUrl, path: filePath, error: null, uploading: false };
      }

      // Fallback: cria URL assinada (se bucket for privado)
      const { data: signedData } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(filePath, 60 * 60 * 24 * 7); // 7 dias

      return { url: signedData?.signedUrl ?? null, path: filePath, error: null, uploading: false };

    } catch (err) {
      const uploadError = err instanceof Error ? err : new Error("Erro desconhecido durante o upload.");
      setError(uploadError);
      return { url: null, path: filePath, error: uploadError, uploading: false };
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error };
};