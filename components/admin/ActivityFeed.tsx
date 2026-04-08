"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  ShoppingBag,
  UserPlus,
  Star,
  AlertTriangle,
  Package,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

interface ActivityItem {
  id: string;
  type: "order" | "customer" | "review" | "stock" | "product";
  icon: LucideIcon;
  iconColor: string;
  title: string;
  description: string;
  href: string;
  time: string;
  relativeTime: string;
}

function getRelativeTime(date: string): string {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
}

export default function ActivityFeed({ limit = 15 }: { limit?: number }) {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivity = useCallback(async () => {
    const activities: ActivityItem[] = [];

    try {
      // Fetch recent orders
      const ordersRes = await fetch("/api/admin/orders?limit=10");
      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        for (const order of orders.slice(0, 8)) {
          activities.push({
            id: `order-${order.id}`,
            type: "order",
            icon: ShoppingBag,
            iconColor: "text-blue-600 bg-blue-50",
            title: `Order ${order.order_number}`,
            description: `${order.guest_email || "Customer"} — $${(order.total / 100).toFixed(2)}`,
            href: `/admin/orders/${order.id}`,
            time: order.created_at,
            relativeTime: getRelativeTime(order.created_at),
          });
        }
      }

      // Fetch low stock alerts
      const stockRes = await fetch("/api/admin/inventory/low-stock");
      if (stockRes.ok) {
        const data = await stockRes.json();
        for (const p of (data.products ?? []).slice(0, 3)) {
          activities.push({
            id: `stock-${p.id}`,
            type: "stock",
            icon: AlertTriangle,
            iconColor: "text-amber-600 bg-amber-50",
            title: "Low stock alert",
            description: `${p.name} — ${p.stock_quantity} remaining`,
            href: "/admin/inventory",
            time: new Date().toISOString(),
            relativeTime: "Now",
          });
        }
      }

      // Sort by time, most recent first
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setItems(activities.slice(0, limit));
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <Package className="h-8 w-8 text-gray-200 mx-auto mb-2" />
        <p className="text-sm text-gray-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-start gap-3 px-4 py-3 hover:bg-[#FAFAFA] transition-colors rounded-lg group",
              i === 0 && "admin-fade-in"
            )}
          >
            {/* Timeline line */}
            <div className="relative flex flex-col items-center">
              <div className={cn("rounded-lg p-1.5 shrink-0", item.iconColor)}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              {i < items.length - 1 && (
                <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[16px]" />
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <p className="text-sm font-medium text-gray-900 group-hover:text-[#111111]">
                {item.title}
              </p>
              <p className="text-xs text-gray-500 truncate">{item.description}</p>
            </div>
            <span className="shrink-0 text-[11px] text-gray-400 mt-0.5">
              {item.relativeTime}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
