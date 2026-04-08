import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral" | "purple";

interface AdminBadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/10",
  danger: "bg-red-50 text-red-700 ring-red-600/10",
  info: "bg-blue-50 text-blue-700 ring-blue-600/10",
  neutral: "bg-gray-50 text-gray-600 ring-gray-500/10",
  purple: "bg-purple-50 text-purple-700 ring-purple-600/10",
};

const dotStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
  neutral: "bg-gray-400",
  purple: "bg-purple-500",
};

/** Map common order statuses to badge variants */
export const statusVariant: Record<string, BadgeVariant> = {
  pending: "warning",
  processing: "info",
  shipped: "purple",
  delivered: "success",
  cancelled: "danger",
  refunded: "neutral",
  active: "success",
  inactive: "neutral",
  approved: "success",
  rejected: "danger",
  draft: "neutral",
};

export default function AdminBadge({
  variant = "neutral",
  children,
  className,
  dot = false,
}: AdminBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", dotStyles[variant])} />
      )}
      {children}
    </span>
  );
}
