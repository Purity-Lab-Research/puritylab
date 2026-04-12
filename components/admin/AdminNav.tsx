"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FileCheck,
  ShoppingBag,
  Layers,
  Warehouse,
  MessageCircleQuestion,
  Ticket,
  Settings,
  ShieldCheck,
  Users,
  Star,
  Mail,
  UserPlus,
  RefreshCw,
  ChevronDown,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSidebar } from "./AdminSidebarContext";
import type { StaffRole } from "@/lib/admin";

interface NavItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles?: StaffRole[];
  badgeKey?: "orders" | "reviews" | "email";
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingBag, roles: ["admin", "fulfillment"], badgeKey: "orders" },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw },
      { label: "Affiliates", href: "/admin/affiliates", icon: UserPlus },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Protocols", href: "/admin/protocols", icon: Layers },
      { label: "Inventory", href: "/admin/inventory", icon: Warehouse },
      { label: "COA Documents", href: "/admin/coa", icon: FileCheck },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Waitlist", href: "/admin/waitlist", icon: Bell },
      { label: "Discounts", href: "/admin/discounts", icon: Ticket },
      { label: "Email", href: "/admin/email", icon: Mail, badgeKey: "email" },
      { label: "Reviews", href: "/admin/reviews", icon: Star, badgeKey: "reviews" },
      { label: "FAQ Manager", href: "/admin/faq", icon: MessageCircleQuestion },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Compliance", href: "/admin/compliance", icon: ShieldCheck },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminNav({ role }: { role: StaffRole }) {
  const pathname = usePathname();
  const { collapsed } = useSidebar();
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const [badges, setBadges] = useState<Record<string, number>>({});

  // Load collapsed state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("admin-nav-groups");
      if (saved) setCollapsedGroups(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  function toggleGroup(label: string) {
    setCollapsedGroups((prev) => {
      const next = { ...prev, [label]: !prev[label] };
      localStorage.setItem("admin-nav-groups", JSON.stringify(next));
      return next;
    });
  }

  // Fetch badge counts
  const fetchBadges = useCallback(async () => {
    try {
      const [ordersRes, inboxRes] = await Promise.all([
        fetch("/api/admin/orders?status=processing"),
        fetch("/api/admin/inbox"),
      ]);

      const newBadges: Record<string, number> = {};

      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        const count = orders.filter((o: { tracking_number: string | null }) => !o.tracking_number).length;
        if (count > 0) newBadges.orders = count;
      }

      if (inboxRes.ok) {
        const messages = await inboxRes.json();
        const unread = messages.filter(
          (m: { direction: string; is_read: boolean }) => m.direction === "inbound" && !m.is_read
        ).length;
        if (unread > 0) newBadges.email = unread;
      }

      setBadges(newBadges);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetchBadges();
    const interval = setInterval(fetchBadges, 60_000);
    return () => clearInterval(interval);
  }, [fetchBadges]);

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  function isVisible(item: NavItem) {
    if (!item.roles) return role === "admin";
    return item.roles.includes(role);
  }

  return (
    <nav className="flex flex-1 flex-col justify-between px-3 py-2 overflow-y-auto scrollbar-hide">
      <div className="space-y-1">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(isVisible);
          if (visibleItems.length === 0) return null;
          const isGroupCollapsed = collapsedGroups[group.label];
          const hasActiveItem = visibleItems.some((item) => isActive(item.href));

          return (
            <div key={group.label}>
              {/* Group header — hide in collapsed sidebar */}
              {!collapsed && group.label !== "Main" && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex w-full items-center justify-between px-3 py-2 mt-3 mb-0.5"
                >
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    {group.label}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-gray-400 transition-transform duration-200",
                      isGroupCollapsed && "-rotate-90"
                    )}
                  />
                </button>
              )}

              {/* Items — show if not collapsed, or if has active item */}
              {(!isGroupCollapsed || hasActiveItem || collapsed) && (
                <ul className="space-y-0.5">
                  {visibleItems.map((item) => {
                    // In collapsed group, only show active item
                    if (isGroupCollapsed && !isActive(item.href) && !collapsed) return null;

                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const badgeCount = item.badgeKey ? badges[item.badgeKey] : undefined;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 relative",
                            active
                              ? "bg-gradient-to-r from-[#10B981]/10 to-transparent font-semibold text-[#111111] border-l-[3px] border-[#10B981]"
                              : "text-gray-500 border-l-[3px] border-transparent hover:border-[#10B981]/50 hover:bg-[#10B981]/5 hover:text-[#111111]",
                            collapsed && "justify-center px-0"
                          )}
                        >
                          <Icon className={cn("h-4 w-4 shrink-0", active && "text-[#10B981]")} />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{item.label}</span>
                              {badgeCount && badgeCount > 0 && (
                                <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#10B981] px-1.5 text-[10px] font-bold text-white">
                                  {badgeCount > 99 ? "99+" : badgeCount}
                                </span>
                              )}
                            </>
                          )}
                          {collapsed && badgeCount && badgeCount > 0 && (
                            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981] text-[8px] font-bold text-white">
                              {badgeCount > 9 ? "9+" : badgeCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
