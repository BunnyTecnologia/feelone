import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, ...props }, ref) => {
    // Estilo da imagem: Borda roxa forte, cantos arredondados, altura maior.
    const baseStyle =
      "border-2 border-[#3A00FF] h-14 text-base placeholder:text-gray-500 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0";

    return (
      <Input
        className={cn(baseStyle, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
CustomInput.displayName = "CustomInput";

export default CustomInput;