import React from 'react';
import CustomInput from '@/components/CustomInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SocialInputBlockProps {
  placeholder: string;
  id: string;
}

const SocialInputBlock: React.FC<SocialInputBlockProps> = ({ placeholder, id }) => {
  // O estilo do checkbox na imagem é um círculo com borda azul forte.
  // O shadcn/ui Checkbox padrão é quadrado, mas podemos estilizar o wrapper.
  // Para replicar o estilo do checkbox da imagem (círculo com borda azul forte),
  // vamos usar o Checkbox padrão do shadcn/ui e ajustar o estilo do input.
  
  const checkboxId = `skip-${id}`;

  return (
    <div className="space-y-2">
      <CustomInput placeholder={placeholder} />
      
      <div className="flex items-center space-x-2 pt-1">
        <Checkbox 
          id={checkboxId} 
          className="h-5 w-5 border-2 border-[#3A00FF] data-[state=checked]:bg-[#3A00FF] data-[state=checked]:text-white rounded-full"
        />
        <Label 
          htmlFor={checkboxId} 
          className="text-base font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          Não desejo colocar
        </Label>
      </div>
    </div>
  );
};

export default SocialInputBlock;