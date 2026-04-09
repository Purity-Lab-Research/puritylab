"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Bell,
  Mail,
  Package,
  AlertTriangle,
  X,
  ShoppingCart,
  Star,
  Users,
  UserPlus,
  AlertCircle,
  MailWarning,
  PackageCheck,
  Check,
  CheckCheck,
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string | null;
  href: string | null;
  is_read: boolean;
  created_at: string;
}

type FilterTab = "all" | "unread" | "orders" | "inventory" | "other";

const iconMap: Record<string, typeof Bell> = {
  new_order: ShoppingCart,
  needs_shipping: Package,
  order_cancelled: AlertCircle,
  new_review: Star,
  low_stock: AlertTriangle,
  out_of_stock: AlertTriangle,
  new_affiliate_app: Users,
  new_customer: UserPlus,
  inbox_message: Mail,
  email_bounce: MailWarning,
  back_in_stock_request: PackageCheck,
  subscription_cancelled: AlertCircle,
  info: Bell,
};

const colorMap: Record<string, string> = {
  new_order: "text-emerald-600 bg-emerald-50",
  needs_shipping: "text-purple-600 bg-purple-50",
  order_cancelled: "text-red-600 bg-red-50",
  new_review: "text-yellow-600 bg-yellow-50",
  low_stock: "text-orange-600 bg-orange-50",
  out_of_stock: "text-red-600 bg-red-50",
  new_affiliate_app: "text-blue-600 bg-blue-50",
  new_customer: "text-teal-600 bg-teal-50",
  inbox_message: "text-blue-600 bg-blue-50",
  email_bounce: "text-red-600 bg-red-50",
  back_in_stock_request: "text-indigo-600 bg-indigo-50",
  subscription_cancelled: "text-amber-600 bg-amber-50",
  info: "text-gray-600 bg-gray-50",
};

const filterTabs: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "orders", label: "Orders" },
  { key: "inventory", label: "Stock" },
  { key: "other", label: "Other" },
];

const orderTypes = ["new_order", "needs_shipping", "order_cancelled"];
const inventoryTypes = ["low_stock", "out_of_stock", "back_in_stock_request"];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications?limit=50");
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications ?? []);
      setUnreadCount(data.unread_count ?? 0);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  async function handleAction(action: string, id?: string) {
    setLoading(true);
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      await fetchNotifications();
    } catch {
      /* ignore */
    }
    setLoading(false);
  }

  // Optimistic mark-as-read when clicking a notification link
  function handleNotificationClick(n: Notification) {
    if (!n.is_read) {
      handleAction("read", n.id);
    }
    setOpen(false);
  }

  // Apply filter
  const filtered = notifications.filter((n) => {
    switch (filter) {
      case "unread":
        return !n.is_read;
      case "orders":
        return orderTypes.includes(n.type);
      case "inventory":
        return inventoryTypes.includes(n.type);
      case "other":
        return !orderTypes.includes(n.type) && !inventoryTypes.includes(n.type);
      default:
        return true;
    }
  });

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-500 hover:text-[#111111] hover:bg-gray-100 transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-gray-200 bg-white shadow-xl z-50 animate-admin-dropdown">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={() => handleAction("read_all")}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4" />
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={() => handleAction("dismiss_all")}
                  disabled={loading}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex border-b px-2 pt-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-colors ${
                  filter === tab.key
                    ? "text-emerald-700 bg-emerald-50 border-b-2 border-emerald-500"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
                {tab.key === "unread" && unreadCount > 0 && (
                  <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Notification list */}
          <div className="max-h-[420px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <Bell className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  {filter === "unread" ? "No unread notifications" : "All caught up!"}
                </p>
              </div>
            ) : (
              filtered.map((n) => {
                const Icon = iconMap[n.type] ?? Bell;
                const color = colorMap[n.type] ?? "text-gray-600 bg-gray-50";
                const content = (
                  <div
                    className={`flex items-start gap-3 px-4 py-3 transition-colors border-b border-gray-50 last:border-0 group ${
                      n.is_read
                        ? "bg-white hover:bg-gray-50"
                        : "bg-emerald-50/30 hover:bg-emerald-50/50"
                    }`}
                  >
                    <div className={`rounded-lg p-2 ${color} shrink-0 mt-0.5`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm leading-snug ${
                            n.is_read ? "text-gray-700" : "font-medium text-gray-900"
                          }`}
                        >
                          {n.title}
                        </p>
                        {!n.is_read && (
                          <span className="shrink-0 mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      {n.description && (
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {n.description}
                        </p>
                      )}
                      <p className="text-[10px] text-gray-400 mt-1">
                        {timeAgo(n.created_at)}
                      </p>
                    </div>
                    {/* Quick actions */}
                    <div className="flex shrink-0 opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                      {!n.is_read && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAction("read", n.id);
                          }}
                          className="p-1 text-gray-400 hover:text-emerald-600 rounded transition-colors"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleAction("dismiss", n.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                        title="Dismiss"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );

                if (n.href) {
                  return (
                    <Link
                      key={n.id}
                      href={n.href}
                      onClick={() => handleNotificationClick(n)}
                    >
                      {content}
                    </Link>
                  );
                }

                return <div key={n.id}>{content}</div>;
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
