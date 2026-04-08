import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface AdminCardProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  noPadding?: boolean;
  className?: string;
  accent?: "default" | "amber" | "red" | "emerald";
}

const accentStyles = {
  default: "border-[#F0F0F0] bg-white",
  amber: "border-amber-200 bg-amber-50/30",
  red: "border-red-200 bg-red-50/30",
  emerald: "border-emerald-200 bg-emerald-50/30",
};

export default function AdminCard({
  title,
  description,
  icon: Icon,
  headerRight,
  children,
  noPadding = false,
  className,
  accent = "default",
}: AdminCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-200",
        accentStyles[accent],
        className
      )}
    >
      {(title || headerRight) && (
        <div className="flex items-center justify-between border-b border-inherit px-5 py-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="rounded-lg bg-[#10B981]/10 p-2">
                <Icon className="h-4 w-4 text-[#10B981]" />
              </div>
            )}
            <div>
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              )}
              {description && (
                <p className="text-xs text-gray-400">{description}</p>
              )}
            </div>
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}
      <div className={noPadding ? "" : "p-5"}>{children}</div>
    </div>
  );
}
