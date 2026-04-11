import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import ReferralSection from "./ReferralSection";
import {
  Package,
  RefreshCw,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  FileText,
  FlaskConical,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  ChevronRight,
} from "lucide-react";

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
  active: "bg-[#ECFDF5] text-[#059669]",
  paused: "bg-[#FFFBEB] text-[#D97706]",
  cancelled: "bg-[#FEF2F2] text-[#DC2626]",
  inactive: "bg-[#F3F4F6] text-[#6B7280]",
};

const ORDER_STATUS: Record<string, string> = {
  pending: "bg-[#FFFBEB] text-[#D97706]",
  processing: "bg-[#EFF6FF] text-[#2563EB]",
  shipped: "bg-[#F5F3FF] text-[#7C3AED]",
  delivered: "bg-[#ECFDF5] text-[#059669]",
  cancelled: "bg-[#FEF2F2] text-[#DC2626]",
  refunded: "bg-[#F3F4F6] text-[#6B7280]",
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
  const firstName = displayName.split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E7EB]/60">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">
              Hey, {firstName}
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-1">
              Here&apos;s what&apos;s happening with your account.
            </p>
          </div>
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 bg-[#111111] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-black transition-colors w-fit"
            >
              <ShieldCheck className="h-4 w-4" />
              Admin Panel
            </Link>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-[#F7F7F8] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <RefreshCw className="h-3.5 w-3.5 text-[#10B981]" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              {activeSubs.length}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Active Subs</p>
          </div>
          <div className="bg-[#F7F7F8] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center">
                <Package className="h-3.5 w-3.5 text-[#3B82F6]" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
              {orderCount ?? 0}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Total Orders</p>
          </div>
          <div className="bg-[#F7F7F8] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center">
                <CalendarDays className="h-3.5 w-3.5 text-[#8B5CF6]" />
              </div>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-[#111111]">
              {nextDelivery
                ? new Date(nextDelivery).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "---"}
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Next Delivery</p>
          </div>
          <div className="bg-[#F7F7F8] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-[#10B981]" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#10B981]">
              15%
            </p>
            <p className="text-xs text-[#9CA3AF] mt-0.5">Sub Savings</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link
          href="/account/orders"
          className="group bg-white border border-[#E5E7EB]/60 rounded-2xl p-4 sm:p-5 hover:border-[#10B981]/30 hover:shadow-[0_2px_12px_rgba(16,185,129,0.08)] transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/8 flex items-center justify-center mb-3 group-hover:bg-[#10B981]/12 transition-colors">
            <ShoppingBag className="h-4 w-4 text-[#10B981]" />
          </div>
          <p className="text-sm font-semibold text-[#111111]">Orders</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5 hidden sm:block">Track & manage</p>
        </Link>
        <Link
          href="/account/subscriptions"
          className="group bg-white border border-[#E5E7EB]/60 rounded-2xl p-4 sm:p-5 hover:border-[#10B981]/30 hover:shadow-[0_2px_12px_rgba(16,185,129,0.08)] transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/8 flex items-center justify-center mb-3 group-hover:bg-[#10B981]/12 transition-colors">
            <RefreshCw className="h-4 w-4 text-[#10B981]" />
          </div>
          <p className="text-sm font-semibold text-[#111111]">Subscriptions</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5 hidden sm:block">Pause or update</p>
        </Link>
        <Link
          href="/protocols"
          className="group bg-white border border-[#E5E7EB]/60 rounded-2xl p-4 sm:p-5 hover:border-[#10B981]/30 hover:shadow-[0_2px_12px_rgba(16,185,129,0.08)] transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#8B5CF6]/8 flex items-center justify-center mb-3 group-hover:bg-[#8B5CF6]/12 transition-colors">
            <FlaskConical className="h-4 w-4 text-[#8B5CF6]" />
          </div>
          <p className="text-sm font-semibold text-[#111111]">Configurations</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5 hidden sm:block">Browse compounds</p>
        </Link>
        <Link
          href="/coa"
          className="group bg-white border border-[#E5E7EB]/60 rounded-2xl p-4 sm:p-5 hover:border-[#10B981]/30 hover:shadow-[0_2px_12px_rgba(16,185,129,0.08)] transition-all duration-200"
        >
          <div className="w-9 h-9 rounded-xl bg-[#3B82F6]/8 flex items-center justify-center mb-3 group-hover:bg-[#3B82F6]/12 transition-colors">
            <FileText className="h-4 w-4 text-[#3B82F6]" />
          </div>
          <p className="text-sm font-semibold text-[#111111]">CoA Library</p>
          <p className="text-[11px] text-[#9CA3AF] mt-0.5 hidden sm:block">View lab reports</p>
        </Link>
      </div>

      {/* Active Subscriptions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#111111]">Active Subscriptions</h2>
          {activeSubs.length > 0 && (
            <Link
              href="/account/subscriptions"
              className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
            >
              Manage all <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        {activeSubs.length > 0 ? (
          <div className="space-y-3">
            {activeSubs.map((sub) => (
              <div
                key={sub.id}
                className="bg-white border border-[#E5E7EB]/60 rounded-2xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-[#111111]">
                      {sub.protocol?.name ?? sub.plan_name ?? "Custom Configuration"}
                    </h3>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      Every {sub.delivery_frequency_weeks} weeks
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${STATUS_BADGE[sub.status] ?? STATUS_BADGE.inactive}`}
                  >
                    {sub.status}
                  </span>
                </div>
                {sub.items && sub.items.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {sub.items.map((item) => (
                      <span
                        key={item.id}
                        className="inline-flex items-center gap-1.5 text-xs text-[#6B7280] bg-[#F7F7F8] rounded-lg px-2.5 py-1.5"
                      >
                        {item.product?.name ?? "Product"}
                        {item.product?.size && (
                          <span className="text-[#9CA3AF]">{item.product.size}</span>
                        )}
                        {item.quantity > 1 && (
                          <span className="text-[#9CA3AF]">x{item.quantity}</span>
                        )}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
                  {sub.next_delivery_date ? (
                    <p className="text-xs text-[#9CA3AF]">
                      Next:{" "}
                      <span className="font-semibold text-[#111111]">
                        {new Date(sub.next_delivery_date).toLocaleDateString(
                          "en-US",
                          { month: "long", day: "numeric" }
                        )}
                      </span>
                    </p>
                  ) : (
                    <span />
                  )}
                  <Link
                    href="/account/subscriptions"
                    className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
                  >
                    Manage <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB]/60 border-dashed rounded-2xl p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F7F8] flex items-center justify-center mx-auto mb-3">
              <RefreshCw className="h-5 w-5 text-[#D1D5DB]" />
            </div>
            <p className="text-sm font-medium text-[#6B7280] mb-1">
              No active subscriptions
            </p>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Set up a scheduled reorder for discounted pricing on research compounds.
            </p>
            <Link
              href="/protocols"
              className="inline-flex items-center gap-2 bg-[#111111] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-black transition-colors"
            >
              Browse Configurations <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Referrals */}
      <ReferralSection />

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#111111]">Recent Orders</h2>
          {(orderCount ?? 0) > 5 && (
            <Link
              href="/account/orders"
              className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          )}
        </div>
        {orders && orders.length > 0 ? (
          <div className="bg-white border border-[#E5E7EB]/60 rounded-2xl divide-y divide-[#F3F4F6] overflow-hidden">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#F7F7F8] flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-[#9CA3AF]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">
                      #{order.order_number}
                    </p>
                    <p className="text-xs text-[#9CA3AF]">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${ORDER_STATUS[order.status] ?? "bg-[#F3F4F6] text-[#6B7280]"}`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-[#111111]">
                    {formatPrice(order.total)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-[#D1D5DB] group-hover:text-[#9CA3AF] transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#E5E7EB]/60 border-dashed rounded-2xl p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F7F7F8] flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-5 w-5 text-[#D1D5DB]" />
            </div>
            <p className="text-sm font-medium text-[#6B7280] mb-1">
              No orders yet
            </p>
            <p className="text-xs text-[#9CA3AF] mb-4">
              Your order history will appear here.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#111111] text-white rounded-xl px-5 py-2.5 text-sm font-semibold hover:bg-black transition-colors"
            >
              Start Shopping <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
