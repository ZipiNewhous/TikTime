import { cn } from "@/lib/utils";
import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? label;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[#222021]"
          >
            {label}
            {props.required && <span className="text-red-500 mr-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-3 border border-[#e5e5e5] rounded text-base font-[Assistant]",
            "text-right direction-rtl placeholder:text-gray-400",
            "outline-none transition-all duration-200",
            "focus:border-[#c9a96e] focus:ring-2 focus:ring-[#c9a96e]/20",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
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

Input.displayName = "Input";
export default Input;
