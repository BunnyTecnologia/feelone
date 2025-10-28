import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeOff, Eye } from "lucide-react";

interface CustomPasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const CustomPasswordInput = React.forwardRef<HTMLInputElement, CustomPasswordInputProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    
    // Estilo da imagem: Borda roxa forte, fundo levemente cinza/azul claro
    const baseStyle =
      "border-2 border-[#3A00FF] h-14 text-base placeholder:text-gray-500 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 pr-12 bg-gray-50 dark:bg-gray-800";

    return (
      <div className="relative flex items-center w-full">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn(baseStyle, className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 h-5 w-5 text-[#3A00FF] cursor-pointer p-0 m-0"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
        </button>
      </div>
    );
  },
);
CustomPasswordInput.displayName = "CustomPasswordInput";

export default CustomPasswordInput;