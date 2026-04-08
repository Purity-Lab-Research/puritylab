import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";

const UpgradeSchema = z.object({
  subscriptionId: z.string().uuid(),
  targetProtocolSlug: z.string().min(1),
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
    const parsed = UpgradeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { subscriptionId, targetProtocolSlug } = parsed.data;
    const admin = createAdminClient();

    // Verify subscription belongs to user
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("id", subscriptionId)
      .eq("user_id", user.id)
      .single();

    if (subError || !subscription) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    if (subscription.status !== "active") {
      return NextResponse.json({ error: "Only active subscriptions can be upgraded" }, { status: 400 });
    }

    // Fetch target protocol with items
    const { data: protocol, error: protoError } = await admin
      .from("protocols")
      .select("*, items:protocol_items(product_id, quantity, sort_order)")
      .eq("slug", targetProtocolSlug)
      .eq("active", true)
      .single();

    if (protoError || !protocol) {
      return NextResponse.json({ error: "Target protocol not found" }, { status: 404 });
    }

    // Update subscription with new protocol
    const { error: updateError } = await admin
      .from("subscriptions")
      .update({
        protocol_id: protocol.id,
        plan_name: protocol.name,
      })
      .eq("id", subscriptionId);

    if (updateError) {
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
    }

    // Replace subscription items
    await admin.from("subscription_items").delete().eq("subscription_id", subscriptionId);

    if (protocol.items && protocol.items.length > 0) {
      const itemRows = protocol.items.map((item: { product_id: string; quantity: number }) => ({
        subscription_id: subscriptionId,
        product_id: item.product_id,
        quantity: item.quantity,
      }));
      await admin.from("subscription_items").insert(itemRows);
    }

    return NextResponse.json({
      success: true,
      protocolName: protocol.name,
      message: `Upgraded to ${protocol.name}. Changes take effect on your next billing cycle.`,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
