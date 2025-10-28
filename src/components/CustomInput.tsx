import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { EyeOff } from "lucide-react";

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  isPassword?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, isPassword = false, ...props }, ref) => {
    const baseStyle =
      "border-2 border-[#3A00FF] h-14 text-base placeholder:text-gray-500 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0";

    return (
      <div className="relative flex items-center w-full">
        <Input
          className={cn(baseStyle, className)}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <EyeOff className="absolute right-4 h-5 w-5 text-[#3A00FF] cursor-pointer" />
        )}
      </div>
    );
  },
);
CustomInput.displayName = "CustomInput";

export default CustomInput;