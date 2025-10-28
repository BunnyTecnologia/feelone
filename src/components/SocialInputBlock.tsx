import React from 'react';
import CustomInput from '@/components/CustomInput';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface SocialInputBlockProps {
  placeholder: string;
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  isSkipped: boolean;
  onSkipChange: (skipped: boolean) => void;
}

const SocialInputBlock: React.FC<SocialInputBlockProps> = ({ 
  placeholder, 
  id, 
  value, 
  onValueChange, 
  isSkipped, 
  onSkipChange 
}) => {
  
  const checkboxId = `skip-${id}`;

  return (
    <div className="space-y-2">
      <CustomInput 
        placeholder={placeholder} 
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        disabled={isSkipped}
      />
      
      <div className="flex items-center space-x-2 pt-1">
        <Checkbox 
          id={checkboxId} 
          checked={isSkipped}
          onCheckedChange={(checked) => onSkipChange(!!checked)}
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