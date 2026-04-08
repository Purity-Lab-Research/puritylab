import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();

  // Fetch all subscriptions with protocol info and items
  const { data: subscriptions, error: subError } = await db
    .from("subscriptions")
    .select(
      "*, protocol:protocols(name, slug), items:subscription_items(id, quantity, product:products(name, size, price, subscription_price))"
    )
    .order("created_at", { ascending: false });

  if (subError) {
    return NextResponse.json({ error: subError.message }, { status: 500 });
  }

  // Fetch profiles for all users who have subscriptions
  const userIds = [
    ...new Set((subscriptions ?? []).map((s: { user_id: string }) => s.user_id).filter(Boolean)),
  ];

  let profilesMap: Record<string, { email: string; full_name: string | null }> = {};

  if (userIds.length > 0) {
    const { data: profiles } = await db
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);

    for (const p of profiles ?? []) {
      profilesMap[p.id] = { email: p.email, full_name: p.full_name };
    }
  }

  // Merge profile data onto subscriptions
  const enriched = (subscriptions ?? []).map((sub: Record<string, unknown>) => ({
    ...sub,
    user_email: profilesMap[(sub.user_id as string)]?.email ?? null,
    user_name: profilesMap[(sub.user_id as string)]?.full_name ?? null,
  }));

  return NextResponse.json(enriched);
}

export async function PATCH(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { subscriptionId, action } = body as {
    subscriptionId?: string;
    action?: "pause" | "resume" | "cancel" | "activate";
  };

  if (!subscriptionId || !action) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const db = createAdminClient();

  const { data: subscription, error: fetchError } = await db
    .from("subscriptions")
    .select("*")
    .eq("id", subscriptionId)
    .single();

  if (fetchError || !subscription) {
    return NextResponse.json(
      { error: "Subscription not found" },
      { status: 404 }
    );
  }

  let updateData: Record<string, unknown>;

  switch (action) {
    case "pause": {
      if (subscription.status !== "active") {
        return NextResponse.json(
          { error: "Only active subscriptions can be paused" },
          { status: 400 }
        );
      }
      updateData = {
        status: "paused",
        paused_at: new Date().toISOString(),
        next_delivery_date: null,
      };
      break;
    }
    case "resume": {
      if (subscription.status !== "paused") {
        return NextResponse.json(
          { error: "Only paused subscriptions can be resumed" },
          { status: 400 }
        );
      }
      const nextDate = new Date();
      nextDate.setDate(
        nextDate.getDate() +
          (subscription.delivery_frequency_weeks ?? 4) * 7
      );
      updateData = {
        status: "active",
        paused_at: null,
        next_delivery_date: nextDate.toISOString(),
      };
      break;
    }
    case "cancel": {
      if (subscription.status === "cancelled") {
        return NextResponse.json(
          { error: "Subscription is already cancelled" },
          { status: 400 }
        );
      }
      updateData = {
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
        next_delivery_date: null,
      };
      break;
    }
    case "activate": {
      if (subscription.status === "active") {
        return NextResponse.json(
          { error: "Subscription is already active" },
          { status: 400 }
        );
      }
      const nextDate = new Date();
      nextDate.setDate(
        nextDate.getDate() +
          (subscription.delivery_frequency_weeks ?? 4) * 7
      );
      updateData = {
        status: "active",
        paused_at: null,
        cancelled_at: null,
        next_delivery_date: nextDate.toISOString(),
      };
      break;
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const { error: updateError } = await db
    .from("subscriptions")
    .update(updateData)
    .eq("id", subscriptionId);

  if (updateError) {
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
