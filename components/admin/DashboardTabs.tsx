"use client";

import { useState } from "react";
import { LayoutDashboard, BarChart3, Activity, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import AnalyticsCharts from "@/components/admin/AnalyticsCharts";
import ActivityFeed from "@/components/admin/ActivityFeed";
import PerformanceTab from "@/components/admin/PerformanceTab";

interface Props {
  children: React.ReactNode;
}

type Tab = "overview" | "analytics" | "activity" | "performance";

const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "performance", label: "Performance", icon: Zap },
];

export default function DashboardTabs({ children }: Props) {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <div>
      {/* Pill-style tab bar */}
      <div className="mb-6 flex items-center gap-1 rounded-xl bg-gray-100 p-1 w-fit">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-[#10B981] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
              )}
            >
              <Icon className="h-4 w-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="admin-fade-in" key={tab}>
        {tab === "overview" && children}
        {tab === "analytics" && <AnalyticsCharts />}
        {tab === "activity" && (
          <div className="rounded-2xl border border-[#F0F0F0] bg-white">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
              <p className="text-xs text-gray-400">Latest events across your store</p>
            </div>
            <ActivityFeed limit={25} />
          </div>
        )}
        {tab === "performance" && <PerformanceTab />}
      </div>
    </div>
  );
}
