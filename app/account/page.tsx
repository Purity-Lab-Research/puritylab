import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ReferralSection from "./ReferralSection";
import { Package, RefreshCw, CalendarDays, TrendingUp, ShieldCheck, FileText, FlaskConical, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your Purity Lab account, orders, and subscriptions.",
};

interface SubRow {
  id: string;
  status: string;
  plan_name: string | null;
  protocol_id: string | null;
  delivery_frequency_weeks: number;
  next_delivery_date: string | null;
  paused_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  protocol?: { name: string } | null;
  items?: {
    id: string;
    quantity: number;
    product?: { name: string; size: string } | null;
  }[];
}

const STATUS_BADGE: Record<string, string> = {
  active: "bg-[#D1FAE5] text-[#10B981]",
  paused: "bg-[#FEF3C7] text-[#F59E0B]",
  cancelled: "bg-[#FEE2E2] text-[#EF4444]",
  inactive: "bg-[#F0F0F0] text-[#6B7280]",
};

const ORDER_STATUS: Record<string, string> = {
  pending: "bg-[#FEF3C7] text-[#F59E0B]",
  processing: "bg-[#DBEAFE] text-[#3B82F6]",
  shipped: "bg-[#EDE9FE] text-[#8B5CF6]",
  delivered: "bg-[#D1FAE5] text-[#10B981]",
  cancelled: "bg-[#FEE2E2] text-[#EF4444]",
  refunded: "bg-[#F0F0F0] text-[#6B7280]",
};

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const admin = createAdminClient();
    await admin
      .from("orders")
      .update({ user_id: user.id })
      .eq("guest_email", user.email)
      .is("user_id", null)
      .neq("status", "pending");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const { data: orders, count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .or(`user_id.eq.${user!.id},guest_email.eq.${user!.email}`)
    .neq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<Order[]>();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      "*, protocol:protocols(name), items:subscription_items(id, quantity, product:products(name, size))"
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<SubRow[]>();

  const activeSubs = (subscriptions ?? []).filter((s) => s.status === "active");
  const nextDelivery = activeSubs
    .map((s) => s.next_delivery_date)
    .filter(Boolean)
    .sort()[0];

  const isAdmin = profile?.role === "admin" || profile?.role === "fulfillment";
  const displayName = profile?.full_name || user!.email || "User";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
          Welcome back, {displayName.split(" ")[0]}
        </h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Manage your orders, subscriptions, and account settings.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <RefreshCw className="h-4 w-4 text-[#10B981]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#111111]">{activeSubs.length}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">Active Subscriptions</p>
        </div>
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Package className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#111111]">{orderCount ?? 0}</p>
          <p className="text-xs text-[#6B7280] mt-0.5">Total Orders</p>
        </div>
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <CalendarDays className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <p className="text-sm font-bold text-[#111111] mt-1">
            {nextDelivery
              ? new Date(nextDelivery).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "None"}
          </p>
          <p className="text-xs text-[#6B7280] mt-0.5">Next Delivery</p>
        </div>
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#10B981]" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#10B981]">15%</p>
          <p className="text-xs text-[#6B7280] mt-0.5">Subscription Savings</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-3 bg-[#111111] rounded-2xl p-4 hover:bg-black transition-colors"
          >
            <ShieldCheck className="h-5 w-5 text-white flex-shrink-0" />
            <span className="text-sm font-semibold text-white">Admin Panel</span>
          </Link>
        )}
        <Link href="/account/orders" className="flex items-center gap-3 bg-white border border-[#F0F0F0] rounded-2xl p-4 hover:shadow-md transition-all">
          <ShoppingBag className="h-5 w-5 text-[#10B981] flex-shrink-0" />
          <span className="text-sm font-medium text-[#111111]">Orders</span>
        </Link>
        <Link href="/account/subscriptions" className="flex items-center gap-3 bg-white border border-[#F0F0F0] rounded-2xl p-4 hover:shadow-md transition-all">
          <RefreshCw className="h-5 w-5 text-[#10B981] flex-shrink-0" />
          <span className="text-sm font-medium text-[#111111]">Subscriptions</span>
        </Link>
        <Link href="/protocols" className="flex items-center gap-3 bg-white border border-[#F0F0F0] rounded-2xl p-4 hover:shadow-md transition-all">
          <FlaskConical className="h-5 w-5 text-[#10B981] flex-shrink-0" />
          <span className="text-sm font-medium text-[#111111]">Protocols</span>
        </Link>
        <Link href="/coa" className="flex items-center gap-3 bg-white border border-[#F0F0F0] rounded-2xl p-4 hover:shadow-md transition-all">
          <FileText className="h-5 w-5 text-[#10B981] flex-shrink-0" />
          <span className="text-sm font-medium text-[#111111]">CoA Library</span>
        </Link>
      </div>

      {/* Active Subscriptions */}
      <div>
        <h2 className="text-lg font-bold text-[#111111] mb-4">Active Subscriptions</h2>
        {activeSubs.length > 0 ? (
          <div className="space-y-3">
            {activeSubs.map((sub) => (
              <div key={sub.id} className="bg-white border border-[#F0F0F0] rounded-2xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-bold text-[#111111]">
                      {sub.protocol?.name ?? sub.plan_name ?? "Custom Stack"}
                    </h3>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      Every {sub.delivery_frequency_weeks} weeks
                    </p>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_BADGE[sub.status] ?? STATUS_BADGE.inactive}`}>
                    {sub.status}
                  </span>
                </div>
                {sub.items && sub.items.length > 0 && (
                  <ul className="space-y-1 mb-3">
                    {sub.items.map((item) => (
                      <li key={item.id} className="text-sm text-[#6B7280] flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981] flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                        {item.product?.name ?? "Product"} {item.product?.size && `(${item.product.size})`}
                        {item.quantity > 1 && ` x${item.quantity}`}
                      </li>
                    ))}
                  </ul>
                )}
                {sub.next_delivery_date && (
                  <p className="text-xs text-[#6B7280] mb-3">
                    Next delivery: <span className="font-semibold text-[#111111]">{new Date(sub.next_delivery_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </p>
                )}
                <Link href="/account/subscriptions" className="text-xs font-semibold text-[#10B981] hover:underline">
                  Manage subscription
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#F0F0F0] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="h-5 w-5 text-[#9CA3AF]" />
            </div>
            <p className="text-sm text-[#6B7280] mb-2">No active subscriptions yet.</p>
            <Link href="/protocols" className="text-sm text-[#10B981] font-semibold hover:underline">
              Browse protocols to get started
            </Link>
          </div>
        )}
      </div>

      {/* Referrals */}
      <ReferralSection />

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-[#111111]">Recent Orders</h2>
          {(orderCount ?? 0) > 5 && (
            <Link href="/account/orders" className="text-sm text-[#10B981] font-semibold hover:underline">View all</Link>
          )}
        </div>
        {orders && orders.length > 0 ? (
          <div className="bg-white border border-[#F0F0F0] rounded-2xl divide-y divide-[#F0F0F0] overflow-hidden">
            {orders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors">
                <div>
                  <p className="text-sm font-semibold text-[#111111]">#{order.order_number}</p>
                  <p className="text-xs text-[#6B7280]">{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${ORDER_STATUS[order.status] ?? "bg-[#F0F0F0] text-[#6B7280]"}`}>{order.status}</span>
                  <span className="text-sm font-semibold text-[#111111]">{formatPrice(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#F0F0F0] rounded-2xl p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAFAFA] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-5 w-5 text-[#9CA3AF]" />
            </div>
            <p className="text-sm text-[#6B7280]">No orders yet.</p>
            <Link href="/shop" className="text-sm text-[#10B981] font-semibold hover:underline mt-2 inline-block">Start shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
}
