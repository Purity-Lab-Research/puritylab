"use client";

import { useSidebar } from "./AdminSidebarContext";
import AdminNav from "./AdminNav";
import { cn } from "@/lib/utils";
import type { StaffRole } from "@/lib/admin";

export default function AdminSidebarShell({ role }: { role: StaffRole }) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-30 flex flex-col border-r border-gray-200 bg-white transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo/Brand */}
      <div className={cn(
        "flex items-center border-b border-gray-100 transition-all duration-300",
        collapsed ? "justify-center px-2 py-4" : "px-6 py-4"
      )}>
        {collapsed ? (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111]">
            <span className="text-xs font-bold text-white">PL</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#111111]">
              <span className="text-xs font-bold text-white">PL</span>
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-[#111111]">
                Purity Lab
              </h1>
              <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
                Admin
              </p>
            </div>
          </div>
        )}
      </div>

      <AdminNav role={role} />
    </aside>
  );
}
