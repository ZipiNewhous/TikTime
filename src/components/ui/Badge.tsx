import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "dark" | "red" | "green" | "gray" | "custom";
  color?: string;
  className?: string;
}

export default function Badge({ children, variant = "gold", color, className }: BadgeProps) {
  const variants = {
    gold: "bg-[#c9a96e] text-white",
    dark: "bg-[#222021] text-white",
    red: "bg-red-500 text-white",
    green: "bg-green-600 text-white",
    gray: "bg-gray-200 text-gray-700",
    custom: "",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold",
        variants[variant],
        className
      )}
      style={color ? { backgroundColor: color, color: "#fff" } : undefined}
    >
      {children}
    </span>
  );
}
