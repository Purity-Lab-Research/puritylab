import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";

const ActionSchema = z.object({
  subscriptionId: z.string().uuid(),
  action: z.enum(["pause", "resume", "cancel"]),
});

export async function PUT(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(request, { limit: 5, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = ActionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { subscriptionId, action } = parsed.data;

    // Verify subscription belongs to user
    const { data: subscription, error: fetchError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
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
    }

    const { data: updated, error: updateError } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", subscriptionId)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update subscription" },
        { status: 500 }
      );
    }

    return NextResponse.json({ subscription: updated });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
