import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ eligible: false, storeCredit: 0 });
    }

    const refCode = request.cookies.get("pl_aff")?.value;
    if (!refCode) {
      // No referral cookie — check if logged-in user has store credit
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const admin = createAdminClient();
        const { data: profile } = await admin
          .from("profiles")
          .select("referral_credits_balance")
          .eq("id", user.id)
          .single();
        return NextResponse.json({
          eligible: false,
          storeCredit: profile?.referral_credits_balance ?? 0,
        });
      }
      return NextResponse.json({ eligible: false, storeCredit: 0 });
    }

    const admin = createAdminClient();

    // Verify it's a valid referral code (not an affiliate code)
    const { data: referrer } = await admin
      .from("profiles")
      .select("id")
      .eq("referral_code", refCode.toUpperCase())
      .maybeSingle();

    if (!referrer) {
      return NextResponse.json({ eligible: false, storeCredit: 0 });
    }

    // Check if buyer has any previous completed orders
    const { count: prevOrders } = await admin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("guest_email", email)
      .in("status", ["processing", "shipped", "delivered"]);

    const isFirstOrder = !prevOrders || prevOrders === 0;

    // Check logged-in user's store credit
    let storeCredit = 0;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await admin
        .from("profiles")
        .select("referral_credits_balance")
        .eq("id", user.id)
        .single();
      storeCredit = profile?.referral_credits_balance ?? 0;
    }

    return NextResponse.json({
      eligible: isFirstOrder,
      storeCredit,
    });
  } catch {
    return NextResponse.json({ eligible: false, storeCredit: 0 });
  }
}
