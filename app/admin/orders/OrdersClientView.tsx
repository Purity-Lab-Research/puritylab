"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import AdminBadge, { statusVariant } from "@/components/admin/ui/AdminBadge";
import type { Order, OrderItem, OrderStatus } from "@/lib/types";

const STATUSES: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

const PAGE_SIZE = 20;

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

interface Props {
  orders: (Order & { order_items: OrderItem[] })[];
}

export default function OrdersClientView({ orders }: Props) {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let result = orders;

    if (statusFilter !== "all") {
      result = result.filter((o) => o.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(q) ||
          o.guest_email?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [orders, statusFilter, searchQuery]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Count per status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: orders.length };
    for (const o of orders) {
      counts[o.status] = (counts[o.status] ?? 0) + 1;
    }
    return counts;
  }, [orders]);

  return (
    <div>
      {/* Filters bar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Status pills */}
        <div className="flex items-center gap-1 flex-wrap">
          {STATUSES.map((s) => {
            const count = statusCounts[s.value] ?? 0;
            const active = statusFilter === s.value;
            return (
              <button
                key={s.value}
                onClick={() => {
                  setStatusFilter(s.value);
                  setPage(0);
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200",
                  active
                    ? "bg-[#111111] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {s.label}
                <span className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  active ? "bg-white/20" : "bg-gray-200"
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order # or email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full sm:w-64 rounded-xl border border-gray-200 bg-white py-2 pl-10 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#F0F0F0] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-[#FAFAFA]/50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 text-right font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paged.map((order) => (
                <tr key={order.id} className="transition-colors hover:bg-[#FAFAFA]/50 group">
                  <td className="whitespace-nowrap px-5 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-[#10B981] hover:text-[#059669] transition-colors"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-600 max-w-[180px] truncate">
                    {order.guest_email ?? "-"}
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs max-w-[220px]">
                    {order.order_items?.length > 0 ? (
                      <div className="space-y-0.5">
                        {order.order_items.slice(0, 2).map((item) => (
                          <div key={item.id} className="truncate">
                            {item.product_name}
                            {item.variant_size && ` (${item.variant_size})`}{" "}
                            <span className="font-medium">&times;{item.quantity}</span>
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <span className="text-gray-400">+{order.order_items.length - 2} more</span>
                        )}
                      </div>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <AdminBadge variant={statusVariant[order.status] ?? "neutral"} dot>
                      {order.status}
                    </AdminBadge>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-medium">
                    {formatPrice(order.total)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-gray-400 text-xs">
                    {getRelativeTime(order.created_at)}
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-[#10B981]"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-gray-400">
                    {searchQuery || statusFilter !== "all"
                      ? "No orders match your filters."
                      : "No orders yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
            <p className="text-xs text-gray-500">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#111111] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                const pageNum =
                  totalPages <= 5
                    ? i
                    : page < 3
                    ? i
                    : page > totalPages - 4
                    ? totalPages - 5 + i
                    : page - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-colors",
                      page === pageNum
                        ? "bg-[#111111] text-white"
                        : "text-gray-500 hover:bg-gray-100"
                    )}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-[#111111] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
