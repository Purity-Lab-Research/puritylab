"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, Search, LogOut, ExternalLink, User } from "lucide-react";
import { useSidebar } from "./AdminSidebarContext";
import AdminBreadcrumbs from "./AdminBreadcrumbs";
import AdminNotifications from "./AdminNotifications";

interface Props {
  userName?: string;
  userEmail?: string;
}

export default function AdminTopBar({ userName, userEmail }: Props) {
  const { toggle } = useSidebar();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [userMenuOpen]);

  return (
    <div className="sticky top-0 z-20 flex items-center justify-between admin-glass border-b border-[#F0F0F0] px-6 py-2.5">
      {/* Left: hamburger + breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#111111] transition-colors"
          title="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <AdminBreadcrumbs />
      </div>

      {/* Center: search trigger */}
      <button
        onClick={() => {
          // Dispatch custom event for CommandPalette to listen to
          window.dispatchEvent(new CustomEvent("open-command-palette"));
        }}
        className="hidden md:flex items-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-3 py-1.5 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search...</span>
        <kbd className="ml-4 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
          Ctrl+K
        </kbd>
      </button>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-2">
        <AdminNotifications />

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#10B981]/10 text-xs font-bold text-[#10B981]">
              {(userName || userEmail || "A").charAt(0).toUpperCase()}
            </div>
            <span className="hidden lg:block max-w-[120px] truncate text-gray-700 font-medium">
              {userName || userEmail || "Admin"}
            </span>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-gray-200 bg-white shadow-xl z-50 py-1 animate-admin-dropdown">
              {userEmail && (
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                </div>
              )}
              <a
                href="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#111111] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Back to Site
              </a>
              <a
                href="/account"
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#111111] transition-colors"
              >
                <User className="h-4 w-4" />
                My Account
              </a>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
