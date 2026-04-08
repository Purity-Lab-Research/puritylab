import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();

    // Get affiliate record
    const { data: affiliate } = await admin
      .from("affiliates")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 403 });
    }

    // Get recent conversions
    const { data: conversions } = await admin
      .from("affiliate_conversions")
      .select("id, order_id, order_total, commission_rate, commission_amount, is_first_order, status, created_at")
      .eq("affiliate_id", affiliate.id)
      .order("created_at", { ascending: false })
      .limit(20);

    // Get 30-day stats
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { count: clicks30d } = await admin
      .from("affiliate_clicks")
      .select("id", { count: "exact", head: true })
      .eq("affiliate_id", affiliate.id)
      .gte("created_at", thirtyDaysAgo.toISOString());

    const { data: conversions30d } = await admin
      .from("affiliate_conversions")
      .select("commission_amount")
      .eq("affiliate_id", affiliate.id)
      .gte("created_at", thirtyDaysAgo.toISOString());

    const thisMonthEarnings = (conversions30d || []).reduce(
      (sum, c) => sum + Number(c.commission_amount),
      0
    );

    // Get daily earnings for chart (last 30 days)
    const { data: dailyData } = await admin
      .from("affiliate_conversions")
      .select("commission_amount, created_at")
      .eq("affiliate_id", affiliate.id)
      .gte("created_at", thirtyDaysAgo.toISOString())
      .order("created_at", { ascending: true });

    const dailyEarnings: Record<string, number> = {};
    for (const c of dailyData || []) {
      const day = new Date(c.created_at).toISOString().split("T")[0];
      dailyEarnings[day] = (dailyEarnings[day] || 0) + Number(c.commission_amount);
    }

    // Fill in missing days
    const chartData: { date: string; earnings: number }[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      chartData.push({ date: key, earnings: dailyEarnings[key] || 0 });
    }

    return NextResponse.json({
      affiliate: {
        id: affiliate.id,
        affiliateCode: affiliate.affiliate_code,
        status: affiliate.status,
        commissionRateFirst: affiliate.commission_rate_first,
        commissionRateRecurring: affiliate.commission_rate_recurring,
        totalEarnings: affiliate.total_earnings,
        pendingBalance: affiliate.pending_balance,
        paidBalance: affiliate.paid_balance,
        totalClicks: affiliate.total_clicks,
        totalConversions: affiliate.total_conversions,
      },
      stats: {
        clicks30d: clicks30d || 0,
        conversions30d: (conversions30d || []).length,
        conversionRate:
          clicks30d && clicks30d > 0
            ? (((conversions30d || []).length / clicks30d) * 100).toFixed(1)
            : "0.0",
        thisMonthEarnings,
      },
      conversions: conversions || [],
      chartData,
    });
  } catch (err) {
    console.error("Affiliate dashboard error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
