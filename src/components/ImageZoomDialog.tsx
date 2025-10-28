import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageZoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageZoomDialog: React.FC<ImageZoomDialogProps> = ({ isOpen, onClose, imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] max-w-[95vw] h-[90vh] p-0 bg-transparent border-none shadow-none flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          
          {/* Imagem Ampliada */}
          <img 
            src={imageUrl} 
            alt="Imagem Ampliada" 
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />

          {/* Botão de Fechar */}
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-10 w-10 bg-white/30 backdrop-blur-sm text-white hover:bg-white/50 hover:text-gray-900 rounded-full z-50"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomDialog;