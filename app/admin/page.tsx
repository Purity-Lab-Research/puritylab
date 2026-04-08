import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffPage } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import {
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  Package,
  AlertTriangle,
  TrendingUp,
  Users,
  CreditCard,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import type { Order, OrderStatus } from "@/lib/types";
import SendAbandonedEmailButton from "@/components/admin/SendAbandonedEmailButton";
import DeleteAbandonedButton from "@/components/admin/DeleteAbandonedButton";
import DashboardTabs from "@/components/admin/DashboardTabs";
import DashboardStatCard from "@/components/admin/DashboardStatCard";
import AdminBadge, { statusVariant } from "@/components/admin/ui/AdminBadge";

export default async function AdminDashboard() {
  const staff = await requireStaffPage();

  if (staff.role === "fulfillment") redirect("/admin/orders");
  const supabase = createAdminClient();

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const sixtyDaysAgo = new Date();
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

  const [
    ordersRes,
    revenueRes,
    allTimeRevenueRes,
    prevRevenueRes,
    productsRes,
    lowStockRes,
    customersRes,
    recentRes,
    topProductsRes,
    abandonedRes,
    protocolsRes,
  ] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact", head: true }).neq("status", "pending"),
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .neq("status", "refunded")
      .neq("status", "pending")
      .gte("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .neq("status", "refunded")
      .neq("status", "pending"),
    // Previous 30 days for trend comparison
    supabase
      .from("orders")
      .select("total")
      .neq("status", "cancelled")
      .neq("status", "refunded")
      .neq("status", "pending")
      .gte("created_at", sixtyDaysAgo.toISOString())
      .lt("created_at", thirtyDaysAgo.toISOString()),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
    supabase
      .from("products")
      .select("id, stock_quantity, low_stock_threshold")
      .eq("active", true),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*")
      .neq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("order_items")
      .select("product_id, product_name, quantity, unit_price"),
    supabase
      .from("orders")
      .select("id, order_number, guest_email, total, created_at, stripe_payment_intent_id")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("protocols")
      .select("id", { count: "exact", head: true })
      .eq("active", true),
  ]);

  const totalOrders = ordersRes.count ?? 0;
  const revenue30d = revenueRes.data?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;
  const prevRevenue30d = prevRevenueRes.data?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;
  const totalRevenue = allTimeRevenueRes.data?.reduce((sum, o) => sum + (o.total ?? 0), 0) ?? 0;
  const activeProducts = productsRes.count ?? 0;
  const activeProtocols = protocolsRes.count ?? 0;
  const lowStock = lowStockRes.data?.filter((p) => p.stock_quantity <= p.low_stock_threshold).length ?? 0;
  const totalCustomers = customersRes.count ?? 0;
  const recentOrders = (recentRes.data ?? []) as Order[];
  const abandonedCheckouts = abandonedRes.data ?? [];

  // Aggregate top products
  const productSales = new Map<string, { name: string; totalQty: number; totalRevenue: number }>();
  for (const item of topProductsRes.data ?? []) {
    const existing = productSales.get(item.product_id);
    if (existing) {
      existing.totalQty += item.quantity;
      existing.totalRevenue += item.quantity * item.unit_price;
    } else {
      productSales.set(item.product_id, {
        name: item.product_name,
        totalQty: item.quantity,
        totalRevenue: item.quantity * item.unit_price,
      });
    }
  }
  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.totalQty - a.totalQty)
    .slice(0, 5);

  const maxQty = topProducts.length > 0 ? topProducts[0].totalQty : 1;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const abandonedCount = abandonedCheckouts.length;

  // Calculate revenue trend
  const revenueTrend = prevRevenue30d > 0 ? ((revenue30d - prevRevenue30d) / prevRevenue30d) * 100 : 0;

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

  const primaryStats = [
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      sub: "All time",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
      href: "/admin/analytics",
    },
    {
      label: "Revenue (30d)",
      value: formatPrice(revenue30d),
      sub: "Last 30 days",
      icon: TrendingUp,
      color: "text-green-600 bg-green-50",
      href: "/admin/analytics",
      trend: revenueTrend,
    },
    {
      label: "Total Orders",
      value: totalOrders.toLocaleString(),
      sub: "All time",
      icon: ShoppingBag,
      color: "text-blue-600 bg-blue-50",
      href: "/admin/orders",
    },
    {
      label: "Total Customers",
      value: totalCustomers.toLocaleString(),
      sub: "Registered",
      icon: Users,
      color: "text-violet-600 bg-violet-50",
      href: "/admin/customers",
    },
    {
      label: "Active Products",
      value: activeProducts.toLocaleString(),
      sub: "In catalog",
      icon: Package,
      color: "text-[#111111] bg-[#10B981]/10",
      href: "/admin/products",
    },
    {
      label: "Avg Order Value",
      value: formatPrice(avgOrderValue),
      sub: "All time",
      icon: CreditCard,
      color: "text-amber-600 bg-amber-50",
      href: "/admin/analytics",
    },
  ];

  const secondaryStats = [
    {
      label: "Active Protocols",
      value: activeProtocols.toLocaleString(),
      sub: "Subscription stacks",
      icon: Layers,
      color: "text-teal-600 bg-teal-50",
      href: "/admin/protocols",
    },
    {
      label: "Low Stock",
      value: lowStock.toLocaleString(),
      sub: lowStock > 0 ? "Needs attention" : "All stocked",
      icon: AlertTriangle,
      color: lowStock > 0 ? "text-red-600 bg-red-50" : "text-gray-600 bg-gray-50",
      href: "/admin/inventory",
    },
    {
      label: "Abandoned Carts",
      value: abandonedCount.toLocaleString(),
      sub: abandonedCount > 0 ? "Awaiting follow-up" : "None pending",
      icon: ShoppingCart,
      color: abandonedCount > 0 ? "text-orange-600 bg-orange-50" : "text-gray-600 bg-gray-50",
      href: "#abandoned",
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here&apos;s what&apos;s happening.</p>
        </div>
      </div>

      <DashboardTabs>
        {/* Primary stats — 3 columns */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primaryStats.map((stat, i) => (
            <DashboardStatCard key={stat.label} {...stat} staggerIndex={i} />
          ))}
        </div>

        {/* Secondary stats — 3 columns, smaller */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {secondaryStats.map((stat, i) => (
            <DashboardStatCard key={stat.label} {...stat} staggerIndex={i + 6} />
          ))}
        </div>

        {/* Two-column content: Top Products + Recent Orders */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Top Products */}
          <div className="rounded-2xl border border-[#F0F0F0] bg-white lg:col-span-1 admin-card-hover">
            <div className="border-b border-gray-100 px-5 py-4">
              <h2 className="text-base font-semibold text-gray-900">Top Products</h2>
              <p className="text-xs text-gray-400">By units sold</p>
            </div>
            <div className="divide-y max-h-[320px] overflow-y-auto">
              {topProducts.map((product, i) => {
                const pct = (product.totalQty / maxQty) * 100;
                return (
                  <div key={product.name} className="px-5 py-3 hover:bg-[#FAFAFA]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10B981]/10 text-xs font-bold text-[#10B981]">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-400">
                          {product.totalQty} sold &middot; {formatPrice(product.totalRevenue)}
                        </p>
                        {/* Mini bar */}
                        <div className="mt-1.5 h-1 rounded-full bg-gray-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#10B981] transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {topProducts.length === 0 && (
                <p className="px-5 py-8 text-center text-sm text-gray-400">No sales data yet.</p>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="rounded-2xl border border-[#F0F0F0] bg-white lg:col-span-2 admin-card-hover">
            <div className="border-b border-gray-100 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-xs text-gray-400">Last 10 orders</p>
                </div>
                <Link
                  href="/admin/orders"
                  className="flex items-center gap-1 text-sm font-medium text-[#10B981] hover:text-[#059669] transition-colors"
                >
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[440px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-[#FAFAFA]/50 text-xs uppercase tracking-wider text-gray-500 sticky top-0 bg-white z-10">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order</th>
                    <th className="px-5 py-3 font-medium">Customer</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="transition-colors hover:bg-[#FAFAFA]/50 group">
                      <td className="whitespace-nowrap px-5 py-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="font-medium text-[#10B981] hover:text-[#059669] transition-colors"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{order.guest_email ?? "\u2014"}</td>
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
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-gray-400">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Abandoned Checkouts */}
        {abandonedCheckouts.length > 0 && (
          <div id="abandoned" className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/30">
            <div className="border-b border-amber-200 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-amber-100 p-2">
                  <ShoppingCart className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-amber-800">
                    Abandoned Checkouts
                    <span className="ml-2 inline-flex items-center rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-800">
                      {abandonedCount}
                    </span>
                  </h2>
                  <p className="text-xs text-amber-600">
                    Started checkout but didn&apos;t pay
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-amber-200 text-xs uppercase tracking-wider text-amber-700 sticky top-0 bg-amber-50 z-10">
                  <tr>
                    <th className="px-5 py-3 font-medium">Order #</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 text-right font-medium">Total</th>
                    <th className="px-5 py-3 font-medium">Started</th>
                    <th className="px-5 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-amber-100">
                  {abandonedCheckouts.map((checkout: { id: string; order_number: string; guest_email: string | null; total: number; created_at: string; stripe_payment_intent_id: string | null }) => (
                    <tr key={checkout.id} className={`hover:bg-amber-50/50 ${checkout.stripe_payment_intent_id ? "bg-green-50/30" : ""}`}>
                      <td className="whitespace-nowrap px-5 py-3 font-medium text-gray-900">
                        <Link href={`/admin/orders/${checkout.id}`} className="text-[#10B981] hover:text-[#059669]">
                          {checkout.order_number}
                        </Link>
                        {checkout.stripe_payment_intent_id && (
                          <AdminBadge variant="success" className="ml-2">May have paid</AdminBadge>
                        )}
                      </td>
                      <td className="px-5 py-3 text-gray-700">{checkout.guest_email ?? "-"}</td>
                      <td className="whitespace-nowrap px-5 py-3 text-right font-medium text-gray-900">
                        {formatPrice(checkout.total)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-gray-400 text-xs">
                        {getRelativeTime(checkout.created_at)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {checkout.guest_email && (
                            <SendAbandonedEmailButton
                              email={checkout.guest_email}
                              orderNumber={checkout.order_number}
                              total={checkout.total}
                            />
                          )}
                          <DeleteAbandonedButton orderId={checkout.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardTabs>
    </div>
  );
}
