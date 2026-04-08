import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg" | "icon";

interface AdminButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[#10B981] text-white hover:bg-[#059669] shadow-sm active:scale-[0.97]",
  secondary:
    "bg-[#111111] text-white hover:bg-black shadow-sm active:scale-[0.97]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 shadow-sm active:scale-[0.97]",
  ghost:
    "text-gray-600 hover:bg-gray-100 hover:text-[#111111]",
  outline:
    "border border-gray-300 bg-white text-gray-700 hover:bg-[#FAFAFA] hover:border-gray-400 shadow-sm active:scale-[0.97]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-2.5 text-sm rounded-xl gap-2",
  icon: "p-2 rounded-xl",
};

export default function AdminButton({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  children,
  className,
  disabled,
  ...props
}: AdminButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-200",
        "disabled:opacity-50 disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : Icon ? (
        <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
      ) : null}
      {children}
    </button>
  );
}
