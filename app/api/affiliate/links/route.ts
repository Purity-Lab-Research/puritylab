import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

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
    const { data: affiliate } = await admin
      .from("affiliates")
      .select("affiliate_code, status")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json({ error: "Not an active affiliate" }, { status: 403 });
    }

    const code = affiliate.affiliate_code;
    const referralLink = `${SITE_URL}/?ref=${code}`;

    return NextResponse.json({
      affiliateCode: code,
      referralLink,
      discountCode: code,
      shareLinks: {
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out Purity Lab for research-grade peptides. Use my code ${code} for 10% off your first order. ${referralLink}`)}`,
        email: `mailto:?subject=${encodeURIComponent("Check out Purity Lab")}&body=${encodeURIComponent(`I recommend Purity Lab for research peptides. Use my code ${code} for 10% off your first order: ${referralLink}`)}`,
      },
      shareTexts: [
        `Check out Purity Lab for research-grade peptides. Use my code ${code} for 10% off your first order.`,
        `Every batch third-party tested with published CoAs. Use my link for 10% off: ${referralLink}`,
      ],
    });
  } catch (err) {
    console.error("Affiliate links error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
