export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 30, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const { code, landingPage } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Missing affiliate code" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const upperCode = code.toUpperCase();
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Try affiliate first
    const { data: affiliate } = await supabase
      .from("affiliates")
      .select("id, status")
      .eq("affiliate_code", upperCode)
      .eq("status", "active")
      .maybeSingle();

    if (affiliate) {
      // Deduplicate: only count 1 click per IP per affiliate per 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: recentAffClicks } = await supabase
        .from("affiliate_clicks")
        .select("id", { count: "exact", head: true })
        .eq("affiliate_id", affiliate.id)
        .eq("ip_address", ip)
        .gte("created_at", twentyFourHoursAgo);

      if ((recentAffClicks ?? 0) > 0) {
        return NextResponse.json({ success: true });
      }

      // Record affiliate click
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
    }

    // Fall back to basic referral code (from profiles)
    const { data: referrer } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", upperCode)
      .maybeSingle();

    if (referrer) {
      // Deduplicate: only count 1 click per IP per code per 24 hours
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { count: recentClicks } = await supabase
        .from("referral_clicks")
        .select("id", { count: "exact", head: true })
        .eq("referral_code", upperCode)
        .eq("ip_address", ip)
        .gte("created_at", twentyFourHoursAgo);

      if ((recentClicks ?? 0) > 0) {
        return NextResponse.json({ success: true });
      }

      await supabase.from("referral_clicks").insert({
        referral_code: upperCode,
        referrer_user_id: referrer.id,
        ip_address: ip,
        user_agent: request.headers.get("user-agent") || null,
        landing_page: landingPage || null,
      });

      return NextResponse.json({ success: true });
    }

    // Code not found in either system
    return NextResponse.json({ error: "Invalid code" }, { status: 404 });
  } catch (err) {
    const { logger } = await import("@/lib/logger");
    logger.error("Affiliate click tracking error", { error: String(err) });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
