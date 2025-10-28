import React, { useState, useRef, useCallback } from 'react';
import { Plus, X, Image, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploadGalleryProps {
  initialUrls?: string[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxFileSizeMB?: number;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const ImageUploadGallery: React.FC<ImageUploadGalleryProps> = ({
  initialUrls = [],
  onFilesChange,
  maxFiles = 5,
  maxFileSizeMB = 10,
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>(initialUrls);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    
    if (files.length + newFiles.length > maxFiles) {
      toast({
        title: "Limite de Arquivos",
        description: `Você pode selecionar no máximo ${maxFiles} imagens.`,
        variant: "destructive",
      });
      return;
    }

    const validFiles: File[] = [];
    newFiles.forEach(file => {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast({
          title: "Arquivo muito grande",
          description: `O arquivo "${file.name}" excede o limite de ${maxFileSizeMB}MB.`,
          variant: "destructive",
        });
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      const updatedFiles = [...files, ...validFiles];
      setFiles(updatedFiles);
      
      const newPreviews = validFiles.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
      onFilesChange(updatedFiles);
    }
    
    // Limpa o input para permitir a seleção do mesmo arquivo novamente
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (indexToRemove: number) => {
    const fileToRemove = files[indexToRemove];
    
    // Revoga a URL de objeto para liberar memória
    if (fileToRemove) {
      URL.revokeObjectURL(previews[indexToRemove]);
    }

    const updatedFiles = files.filter((_, index) => index !== indexToRemove);
    const updatedPreviews = previews.filter((_, index) => index !== indexToRemove);
    
    setFiles(updatedFiles);
    setPreviews(updatedPreviews);
    onFilesChange(updatedFiles);
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const remainingSlots = maxFiles - previews.length;

  return (
    <div className="space-y-3">
      <Label className="text-lg font-bold text-gray-900 dark:text-white">
        Galeria de Imagens ({previews.length}/{maxFiles})
      </Label>
      <div className="flex flex-wrap gap-3">
        
        {/* Pré-visualizações */}
        {previews.map((url, index) => (
          <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#3A00FF] shadow-md">
            <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full bg-red-600 hover:bg-red-700"
              onClick={() => handleRemoveFile(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {/* Botão Adicionar */}
        {previews.length < maxFiles && (
          <div 
            className={cn(
              "w-24 h-24 rounded-lg border-2 border-dashed border-[#3A00FF] flex items-center justify-center cursor-pointer transition-colors hover:bg-[#D9D0FF]/50",
              remainingSlots === 0 && "opacity-50 cursor-not-allowed"
            )}
            onClick={handleAddClick}
          >
            <Plus className="h-6 w-6 text-[#3A00FF]" />
          </div>
        )}
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        multiple
        className="hidden"
      />
      <p className="text-xs text-gray-500">Máximo de {maxFiles} imagens, até {maxFileSizeMB}MB cada.</p>
    </div>
  );
};

export default ImageUploadGallery;