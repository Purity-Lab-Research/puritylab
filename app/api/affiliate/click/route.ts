import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 20, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { code, landingPage } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing affiliate code" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Look up affiliate by code
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, status")
      .eq("affiliate_code", code.toUpperCase())
      .eq("status", "active")
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json({ error: "Invalid affiliate code" }, { status: 404 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Record the click
    await supabase.from("affiliate_clicks").insert({
      affiliate_id: affiliate.id,
      ip_address: ip,
      user_agent: request.headers.get("user-agent") || null,
      referrer_url: request.headers.get("referer") || null,
      landing_page: landingPage || null,
    });

    // Increment total_clicks
    const { data: current } = await supabase
      .from("affiliates")
      .select("total_clicks")
      .eq("id", affiliate.id)
      .single();

    if (current) {
      await supabase
        .from("affiliates")
        .update({ total_clicks: (current.total_clicks || 0) + 1 })
        .eq("id", affiliate.id);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Affiliate click tracking error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
