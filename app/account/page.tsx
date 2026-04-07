import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Order } from "@/lib/types";
import { formatPrice } from "@/lib/utils";

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

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    cancelled: "bg-error/10 text-error",
    inactive: "bg-border text-text-secondary",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${styles[status] ?? styles.inactive}`}
    >
      {status}
    </span>
  );
}

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Link paid guest orders
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

  // Orders
  const { data: orders, count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact" })
    .or(`user_id.eq.${user!.id},guest_email.eq.${user!.email}`)
    .neq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5)
    .returns<Order[]>();

  // Subscriptions
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      "*, protocol:protocols(name), items:subscription_items(id, quantity, product:products(name, size))"
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<SubRow[]>();

  const activeSubs = (subscriptions ?? []).filter(
    (s) => s.status === "active"
  );
  const nextDelivery = activeSubs
    .map((s) => s.next_delivery_date)
    .filter(Boolean)
    .sort()[0];

  const isAdmin =
    profile?.role === "admin" || profile?.role === "fulfillment";
  const displayName = profile?.full_name || user!.email || "User";

  const statusColors: Record<string, string> = {
    pending: "bg-warning/10 text-warning",
    processing: "bg-secondary/10 text-secondary",
    shipped: "bg-secondary/10 text-secondary",
    delivered: "bg-success/10 text-success",
    cancelled: "bg-error/10 text-error",
    refunded: "bg-border text-text-secondary",
  };

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-primary tracking-tight">
          Welcome, {displayName}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          Manage your orders, subscriptions, and account settings.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
            Active Subscriptions
          </p>
          <p className="font-heading text-2xl font-bold text-primary mt-1">
            {activeSubs.length}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
            Total Orders
          </p>
          <p className="font-heading text-2xl font-bold text-primary mt-1">
            {orderCount ?? 0}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
            Next Delivery
          </p>
          <p className="text-sm font-semibold text-primary mt-2">
            {nextDelivery
              ? new Date(nextDelivery).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "No active subs"}
          </p>
        </div>
        <div className="bg-surface border border-border rounded-xl p-5">
          <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">
            Total Saved
          </p>
          <p className="font-heading text-2xl font-bold text-success mt-1">
             - 
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className={`grid gap-4 ${isAdmin ? "grid-cols-5" : "grid-cols-4"}`}>
        {isAdmin && (
          <Link
            href="/admin"
            className="flex flex-col items-center gap-2 bg-primary rounded-xl p-4 hover:bg-primary-hover transition-colors text-center"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
            <span className="text-sm font-medium text-white">Admin</span>
          </Link>
        )}
        <Link href="/account/orders" className="flex flex-col items-center gap-2 bg-surface border border-border rounded-xl p-4 hover:border-secondary transition-colors text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a4 4 0 0 0-8 0v2" /></svg>
          <span className="text-sm font-medium text-text-primary">Orders</span>
        </Link>
        <Link href="/account/subscriptions" className="flex flex-col items-center gap-2 bg-surface border border-border rounded-xl p-4 hover:border-secondary transition-colors text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 16h5v5" /></svg>
          <span className="text-sm font-medium text-text-primary">Subscriptions</span>
        </Link>
        <Link href="/protocols" className="flex flex-col items-center gap-2 bg-surface border border-border rounded-xl p-4 hover:border-secondary transition-colors text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /></svg>
          <span className="text-sm font-medium text-text-primary">Protocols</span>
        </Link>
        <Link href="/coa" className="flex flex-col items-center gap-2 bg-surface border border-border rounded-xl p-4 hover:border-secondary transition-colors text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="m9 15 2 2 4-4" /></svg>
          <span className="text-sm font-medium text-text-primary">CoA Library</span>
        </Link>
      </div>

      {/* Active Subscriptions */}
      <div>
        <h2 className="font-heading text-lg font-bold text-primary mb-4">
          Active Subscriptions
        </h2>
        {activeSubs.length > 0 ? (
          <div className="space-y-4">
            {activeSubs.map((sub) => (
              <div key={sub.id} className="bg-surface border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-heading text-base font-bold text-primary">
                      {sub.protocol?.name ?? sub.plan_name ?? "Custom Stack"}
                    </h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Every {sub.delivery_frequency_weeks} weeks
                    </p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
                {sub.items && sub.items.length > 0 && (
                  <ul className="space-y-1 mb-4">
                    {sub.items.map((item) => (
                      <li key={item.id} className="text-sm text-text-secondary flex items-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                        {item.product?.name ?? "Product"} {item.product?.size && `(${item.product.size})`}
                        {item.quantity > 1 && ` x${item.quantity}`}
                      </li>
                    ))}
                  </ul>
                )}
                {sub.next_delivery_date && (
                  <p className="text-xs text-text-secondary mb-3">
                    Next delivery: <span className="font-semibold text-primary">{new Date(sub.next_delivery_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </p>
                )}
                <Link href="/account/subscriptions" className="text-xs font-semibold text-secondary hover:underline">
                  Manage
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-text-secondary mb-2">No active subscriptions yet.</p>
            <Link href="/protocols" className="text-sm text-secondary font-semibold hover:underline">
              Browse protocols to get started
            </Link>
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-lg font-bold text-primary">Recent Orders</h2>
          {(orderCount ?? 0) > 5 && (
            <Link href="/account/orders" className="text-sm text-secondary font-semibold hover:underline">View all</Link>
          )}
        </div>
        {orders && orders.length > 0 ? (
          <div className="bg-surface border border-border rounded-xl divide-y divide-border">
            {orders.map((order) => (
              <Link key={order.id} href={`/account/orders/${order.id}`} className="flex items-center justify-between px-5 py-4 hover:bg-background transition-colors">
                <div>
                  <p className="text-sm font-semibold text-primary">#{order.order_number}</p>
                  <p className="text-xs text-text-secondary">{new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] ?? "bg-border text-text-secondary"}`}>{order.status}</span>
                  <span className="text-sm font-semibold text-primary">{formatPrice(order.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-sm text-text-secondary">No orders yet.</p>
            <Link href="/shop" className="text-sm text-secondary font-semibold hover:underline mt-2 inline-block">Start shopping</Link>
          </div>
        )}
      </div>
    </div>
  );
}
