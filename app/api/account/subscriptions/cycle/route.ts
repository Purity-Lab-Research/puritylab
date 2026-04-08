import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";

const CycleSchema = z.object({
  subscriptionId: z.string().uuid(),
  action: z.enum(["enable", "disable"]),
});

export async function POST(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(request, { limit: 5, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = CycleSchema.safeParse(body);

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
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    let updateData: Record<string, unknown>;

    if (action === "enable") {
      updateData = {
        cycle_management: true,
        cycle_phase: "active",
        cycle_week: 1,
      };
    } else {
      updateData = {
        cycle_management: false,
        cycle_phase: null,
        cycle_week: null,
      };
    }

    const { data: updated, error: updateError } = await supabase
      .from("subscriptions")
      .update(updateData)
      .eq("id", subscriptionId)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }

    return NextResponse.json({ subscription: updated });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
