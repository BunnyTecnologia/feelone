import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ className, ...props }, ref) => {
    const baseStyle =
      "border-2 border-[#3A00FF] text-base placeholder:text-gray-500 rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[100px]";

    return (
      <Textarea
        className={cn(baseStyle, className)}
        ref={ref}
        {...props}
      />
    );
  },
);
CustomTextarea.displayName = "CustomTextarea";

export default CustomTextarea;