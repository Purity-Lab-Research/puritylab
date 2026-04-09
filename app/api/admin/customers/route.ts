import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";
import { logger } from "@/lib/logger";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10) || 50, 1), 200);
    const offset = Math.max(parseInt(searchParams.get("offset") || "0", 10) || 0, 0);

    const db = createAdminClient();

    // Fetch profiles with pagination
    const { data: profiles, error: profilesError, count } = await db
      .from("profiles")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (profilesError) {
      logger.error("Admin customers GET error", { error: String(profilesError.message) });
      return NextResponse.json({ error: "Failed to load customers" }, { status: 500 });
    }

    // Fetch order counts and totals per user
    const { data: orderStats, error: ordersError } = await db
      .from("orders")
      .select("user_id, total, status");

    if (ordersError) {
      logger.error("Admin customers orders error", { error: String(ordersError.message) });
      return NextResponse.json({ error: "Failed to load customer data" }, { status: 500 });
    }

    // Aggregate order stats by user
    const statsMap: Record<
      string,
      { order_count: number; total_spent: number }
    > = {};
    for (const order of orderStats ?? []) {
      if (!order.user_id || order.status === "cancelled" || order.status === "refunded") continue;
      if (!statsMap[order.user_id]) {
        statsMap[order.user_id] = { order_count: 0, total_spent: 0 };
      }
      statsMap[order.user_id].order_count++;
      statsMap[order.user_id].total_spent += order.total ?? 0;
    }

    const customers = (profiles ?? []).map((p) => ({
      ...p,
      order_count: statsMap[p.id]?.order_count ?? 0,
      total_spent: statsMap[p.id]?.total_spent ?? 0,
    }));

    return NextResponse.json({ data: customers, total: count ?? 0, limit, offset });
  } catch (err) {
    logger.error("Admin customers GET error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { userId, role } = body as { userId?: string; role?: string };

    if (!userId || !role || !["customer", "admin", "fulfillment"].includes(role)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Prevent admins from demoting themselves
    if (userId === admin.id && role !== "admin") {
      return NextResponse.json(
        { error: "You cannot remove your own admin role" },
        { status: 400 }
      );
    }

    const db = createAdminClient();
    const { error } = await db
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) {
      logger.error("Admin customers PATCH error", { error: String(error.message), userId });
      return NextResponse.json({ error: "Failed to update role" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Admin customers PATCH error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
