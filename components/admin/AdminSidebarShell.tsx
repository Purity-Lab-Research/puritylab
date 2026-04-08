"use client";

import Image from "next/image";
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
          <Image
            src="/images/logo.png"
            alt="Purity Lab"
            width={32}
            height={32}
            className="rounded-lg"
          />
        ) : (
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Purity Lab"
              width={36}
              height={36}
              className="rounded-lg"
            />
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
