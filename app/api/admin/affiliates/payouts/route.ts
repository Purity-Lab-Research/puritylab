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
      .select("*, affiliates(affiliate_code, user_id)")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Enrich with profile/auth data
    const userIds = [...new Set(
      (data || [])
        .map((p: { affiliates?: { user_id?: string } }) => p.affiliates?.user_id)
        .filter(Boolean) as string[]
    )];

    const [profilesRes, usersRes, appsRes] = await Promise.all([
      userIds.length > 0
        ? supabase.from("profiles").select("id, full_name, email").in("id", userIds)
        : Promise.resolve({ data: [] }),
      userIds.length > 0
        ? supabase.auth.admin.listUsers()
        : Promise.resolve({ data: { users: [] } }),
      supabase.from("affiliate_applications").select("name, email").eq("status", "approved"),
    ]);

    const profileMap = new Map((profilesRes.data || []).map((p) => [p.id, p]));
    const authMap = new Map((usersRes.data?.users || []).map((u) => [u.id, u]));
    const appMap = new Map((appsRes.data || []).map((a) => [a.email, a.name]));

    const enriched = (data || []).map((p: Record<string, unknown>) => {
      const aff = p.affiliates as { affiliate_code: string; user_id: string } | null;
      const userId = aff?.user_id;
      const profile = userId ? profileMap.get(userId) : null;
      const authUser = userId ? authMap.get(userId) : null;
      const email = profile?.email || authUser?.email || "";
      const name = profile?.full_name || appMap.get(email) || authUser?.user_metadata?.full_name || null;
      return {
        ...p,
        affiliates: aff ? {
          affiliate_code: aff.affiliate_code,
          profiles: { full_name: name, email },
        } : null,
      };
    });

    return NextResponse.json({ payouts: enriched });
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

        // Get email from profile or auth user
        const { data: profile } = await supabase
          .from("profiles")
          .select("email, full_name")
          .eq("id", affiliate.user_id)
          .single();

        const { data: authData } = await supabase.auth.admin.getUserById(affiliate.user_id);
        const recipientEmail = profile?.email || authData?.user?.email || affiliate.payment_email;
        const recipientName = profile?.full_name || authData?.user?.user_metadata?.full_name || "there";

        if (recipientEmail) {
          await sendEmail({
            to: [recipientEmail],
            subject: `Payout Processed - $${amount.toFixed(2)}`,
            html: `
              <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
                <h2 style="color:#111111;">Payout Processed</h2>
                <p style="color:#6B7280;">Hi ${recipientName},</p>
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
