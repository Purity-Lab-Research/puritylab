import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";
import { sendEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const url = new URL(request.url);
    const status = url.searchParams.get("status");

    let query = supabase
      .from("affiliate_payouts")
      .select("*, affiliates(affiliate_code, user_id, profiles:user_id(full_name, email))")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ payouts: data || [] });
  } catch (err) {
    console.error("Admin payouts GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, payoutId, affiliateId, amount } = body;
    const supabase = createAdminClient();

    if (action === "create" && affiliateId && amount) {
      // Create a manual payout
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const { error } = await supabase.from("affiliate_payouts").insert({
        affiliate_id: affiliateId,
        amount,
        payment_method: "ach",
        period_start: periodStart.toISOString().split("T")[0],
        period_end: periodEnd.toISOString().split("T")[0],
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Deduct from pending balance
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("pending_balance, paid_balance, payment_email, user_id")
        .eq("id", affiliateId)
        .single();

      if (affiliate) {
        await supabase
          .from("affiliates")
          .update({
            pending_balance: Math.max(0, Number(affiliate.pending_balance) - amount),
            paid_balance: Number(affiliate.paid_balance) + amount,
          })
          .eq("id", affiliateId);

        // Get profile for email
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", affiliate.user_id)
          .single();

        if (profile?.email) {
          await sendEmail({
            to: [profile.email],
            subject: `Payout Processed - $${amount.toFixed(2)}`,
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
                <h2 style="color:#111111;">Payout Processed</h2>
                <p style="color:#6B7280;">Hi ${profile.full_name || "there"},</p>
                <p style="color:#6B7280;">Your affiliate payout of <strong style="color:#111111;">$${amount.toFixed(2)}</strong> has been processed and is on its way.</p>
                <p style="color:#6B7280;">View your payout history in your <a href="https://puritylabresearch.com/affiliate/dashboard" style="color:#10B981;">affiliate dashboard</a>.</p>
                <p style="color:#6B7280;margin-top:24px;">Best,<br/>Purity Lab Team</p>
              </div>
            `,
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    if (action === "update-status" && payoutId) {
      const { status: newStatus } = body;
      if (!["pending", "processing", "completed", "failed"].includes(newStatus)) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const { error } = await supabase
        .from("affiliate_payouts")
        .update({ status: newStatus })
        .eq("id", payoutId);

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("Admin payouts POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
