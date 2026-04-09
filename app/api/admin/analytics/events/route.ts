import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Fetch all events from last 30 days
  const { data: events } = await supabase
    .from("site_events")
    .select("event_name, properties, page_path, created_at")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("created_at", { ascending: false })
    .limit(10000);

  const rows = events ?? [];

  // --- Event counts by type ---
  const eventCounts: Record<string, number> = {};
  for (const e of rows) {
    eventCounts[e.event_name] = (eventCounts[e.event_name] ?? 0) + 1;
  }

  // --- Conversion funnel (last 30 days) ---
  const funnelSteps = [
    "view_item",
    "add_to_cart",
    "view_cart",
    "begin_checkout",
    "add_shipping_info",
    "purchase",
  ];
  const funnel = funnelSteps.map((step) => ({
    step,
    count: eventCounts[step] ?? 0,
  }));

  // --- Events by day (last 30 days) ---
  const eventsByDay: Record<string, Record<string, number>> = {};
  for (let d = new Date(thirtyDaysAgo); d <= now; d.setDate(d.getDate() + 1)) {
    eventsByDay[d.toISOString().slice(0, 10)] = {};
  }
  for (const e of rows) {
    const day = e.created_at.slice(0, 10);
    if (eventsByDay[day]) {
      eventsByDay[day][e.event_name] = (eventsByDay[day][e.event_name] ?? 0) + 1;
    }
  }
  const eventTimeSeries = Object.entries(eventsByDay).map(([date, counts]) => ({
    date,
    views: counts["view_item"] ?? 0,
    addToCart: counts["add_to_cart"] ?? 0,
    checkouts: counts["begin_checkout"] ?? 0,
    purchases: counts["purchase"] ?? 0,
    searches: counts["search"] ?? 0,
    signups: counts["sign_up"] ?? 0,
    logins: counts["login"] ?? 0,
  }));

  // --- Top searched terms ---
  const searchCounts: Record<string, number> = {};
  for (const e of rows) {
    if (e.event_name === "search" && e.properties?.search_term) {
      const term = String(e.properties.search_term).toLowerCase();
      searchCounts[term] = (searchCounts[term] ?? 0) + 1;
    }
  }
  const topSearches = Object.entries(searchCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([term, count]) => ({ term, count }));

  // --- Top viewed products ---
  const viewCounts: Record<string, { name: string; count: number }> = {};
  for (const e of rows) {
    if (e.event_name === "view_item" && e.properties?.item_name) {
      const name = String(e.properties.item_name);
      const id = String(e.properties.item_id ?? name);
      if (!viewCounts[id]) viewCounts[id] = { name, count: 0 };
      viewCounts[id].count++;
    }
  }
  const topViewedProducts = Object.values(viewCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // --- Top added-to-cart products ---
  const cartCounts: Record<string, { name: string; count: number }> = {};
  for (const e of rows) {
    if (e.event_name === "add_to_cart" && e.properties?.item_name) {
      const name = String(e.properties.item_name);
      const id = String(e.properties.item_id ?? name);
      if (!cartCounts[id]) cartCounts[id] = { name, count: 0 };
      cartCounts[id].count++;
    }
  }
  const topCartProducts = Object.values(cartCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // --- Recent activity feed ---
  const recentActivity = rows.slice(0, 50).map((e) => ({
    event: e.event_name,
    properties: e.properties,
    page: e.page_path,
    time: e.created_at,
  }));

  // --- Summary KPIs ---
  const totalEvents = rows.length;
  const todayStr = now.toISOString().slice(0, 10);
  const todayEvents = rows.filter((e) => e.created_at.slice(0, 10) === todayStr).length;

  return NextResponse.json({
    kpis: {
      totalEvents,
      todayEvents,
      totalSearches: eventCounts["search"] ?? 0,
      totalSignups: eventCounts["sign_up"] ?? 0,
      totalLogins: eventCounts["login"] ?? 0,
      totalAddToCart: eventCounts["add_to_cart"] ?? 0,
      totalCheckouts: eventCounts["begin_checkout"] ?? 0,
      totalPurchases: eventCounts["purchase"] ?? 0,
      totalWishlistAdds: eventCounts["add_to_wishlist"] ?? 0,
      totalContactForms: eventCounts["generate_lead"] ?? 0,
    },
    funnel,
    eventTimeSeries,
    eventCounts: Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([event, count]) => ({ event, count })),
    topSearches,
    topViewedProducts,
    topCartProducts,
    recentActivity,
  });
}
