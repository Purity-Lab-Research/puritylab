import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import AdminButton from "./AdminButton";

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export default function AdminEmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: AdminEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="relative mb-4">
        <div className="absolute inset-0 rounded-full bg-[#10B981]/5 scale-150" />
        <div className="relative rounded-full bg-[#10B981]/10 p-4">
          <Icon className="h-8 w-8 text-[#10B981]" />
        </div>
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-500 text-center max-w-xs">{description}</p>
      )}
      {actionLabel && (
        actionHref ? (
          <a href={actionHref} className="mt-4">
            <AdminButton size="sm">{actionLabel}</AdminButton>
          </a>
        ) : onAction ? (
          <div className="mt-4">
            <AdminButton size="sm" onClick={onAction}>{actionLabel}</AdminButton>
          </div>
        ) : null
      )}
    </div>
  );
}
