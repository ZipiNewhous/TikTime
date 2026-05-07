import { cn } from "@/lib/utils";
import { forwardRef, type TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-[#222021]">
            {label}
            {props.required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border border-[#e5e5e5] rounded text-base font-[Assistant]",
            "text-right placeholder:text-gray-400 resize-y min-h-[100px]",
            "outline-none transition-all duration-200",
            "focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20",
            error && "border-red-500",
            className
          )}
          dir="rtl"
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {hint && !error && <p className="text-gray-500 text-sm">{hint}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
