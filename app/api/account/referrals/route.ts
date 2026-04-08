import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get or create referral code
  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code, referral_credits_balance")
    .eq("id", user.id)
    .single();

  let referralCode = profile?.referral_code;

  if (!referralCode) {
    referralCode = generateCode();
    await supabase
      .from("profiles")
      .update({ referral_code: referralCode })
      .eq("id", user.id);
  }

  // Check if user is an approved affiliate
  const { data: affiliate } = await supabase
    .from("affiliates")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  // Check if user has a pending affiliate application
  const { data: application } = await supabase
    .from("affiliate_applications")
    .select("id, status")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  // Get referral history
  const { data: referrals } = await supabase
    .from("referrals")
    .select("*")
    .eq("referrer_user_id", user.id)
    .order("created_at", { ascending: false });

  const completed = (referrals ?? []).filter((r) => r.status === "completed" || r.status === "credited");
  const totalEarned = completed.reduce((sum, r) => sum + (r.credit_amount ?? 0), 0);

  return NextResponse.json({
    referralCode,
    referralLink: `https://puritylabresearch.com/?ref=${referralCode}`,
    balance: profile?.referral_credits_balance ?? 0,
    totalEarned,
    referralCount: (referrals ?? []).length,
    completedCount: completed.length,
    referrals: referrals ?? [],
    isAffiliate: affiliate?.status === "active",
    affiliateApplicationStatus: application?.status ?? null,
  });
}

export async function POST(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 5, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  if (body.action === "generate-code") {
    const { data: profile } = await supabase
      .from("profiles")
      .select("referral_code")
      .eq("id", user.id)
      .single();

    if (profile?.referral_code) {
      return NextResponse.json({ code: profile.referral_code });
    }

    const code = generateCode();
    await supabase
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", user.id);

    return NextResponse.json({ code });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
