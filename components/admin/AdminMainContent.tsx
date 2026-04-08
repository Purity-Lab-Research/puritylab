"use client";

import { useSidebar } from "./AdminSidebarContext";
import AdminTopBar from "./AdminTopBar";
import CommandPalette from "./CommandPalette";
import AdminKeyboardShortcuts from "./AdminKeyboardShortcuts";
import AdminQuickActions from "./AdminQuickActions";
import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  userName: string;
  userEmail?: string;
}

export default function AdminMainContent({ children, userName, userEmail }: Props) {
  const { collapsed } = useSidebar();

  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto bg-[#FAFAFA] transition-all duration-300 ease-in-out",
        collapsed ? "ml-16" : "ml-64"
      )}
    >
      <AdminTopBar userName={userName} userEmail={userEmail} />
      <div className="p-6 lg:p-8 pt-4 admin-fade-in">
        {children}
      </div>
      <CommandPalette />
      <AdminKeyboardShortcuts />
      <AdminQuickActions />
    </div>
  );
}
