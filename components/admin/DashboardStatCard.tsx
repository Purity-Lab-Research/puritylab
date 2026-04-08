"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import type { LucideIcon } from "lucide-react";

interface DashboardStatCardProps {
  label: string;
  value: string;
  sub: string;
  icon: LucideIcon;
  color: string;
  href: string;
  trend?: number; // percentage change
  sparklineData?: number[];
  staggerIndex?: number;
}

export default function DashboardStatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
  href,
  trend,
  sparklineData,
  staggerIndex = 0,
}: DashboardStatCardProps) {
  const trendColor = trend && trend > 0 ? "text-emerald-600" : trend && trend < 0 ? "text-red-500" : "text-gray-400";
  const sparkColor = trend && trend >= 0 ? "#10B981" : "#EF4444";

  return (
    <Link
      href={href}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white p-5 transition-all duration-200 admin-card-hover group cursor-pointer",
        `admin-fade-in admin-stagger-${staggerIndex + 1}`
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("rounded-xl p-2.5", color)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-gray-500 group-hover:text-[#111111] transition-colors">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight text-gray-900 mt-0.5">
              {value}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-xs text-gray-400">{sub}</p>
              {trend !== undefined && trend !== 0 && (
                <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", trendColor)}>
                  {trend > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {trend > 0 ? "+" : ""}
                  {trend.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mini sparkline */}
      {sparklineData && sparklineData.length > 1 && (
        <div className="absolute bottom-0 right-0 h-12 w-24 opacity-40 group-hover:opacity-60 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparklineData.map((v) => ({ v }))}>
              <defs>
                <linearGradient id={`spark-${label.replace(/\s/g, "")}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={sparkColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={sparkColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={sparkColor}
                strokeWidth={1.5}
                fill={`url(#spark-${label.replace(/\s/g, "")})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </Link>
  );
}
