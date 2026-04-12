import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";
import { ADMIN_NOTIFICATION_EMAIL } from "@/lib/constants";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const rl = await rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (rl) return rl;

  try {
    const body = await req.json();
    const email = (body.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("waitlist")
      .upsert({ email }, { onConflict: "email", ignoreDuplicates: true });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ success: true, alreadyExists: true });
      }
      throw error;
    }

    // Get total waitlist count for the notification
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    // Send admin notification (fire and forget)
    sendEmail({
      to: [ADMIN_NOTIFICATION_EMAIL],
      subject: `New waitlist signup: ${email}`,
      html: brandedEmailWrapper({
        showDisclaimer: false,
        showUnsubscribe: false,
        body: `
        <tr>
          <td style="padding:24px;">
            <h2 style="margin:0 0 12px;font-size:20px;font-weight:700;color:#111111;">New Waitlist Signup</h2>
            <p style="margin:0 0 16px;font-size:14px;color:#6B7280;">Someone just joined the launch waitlist.</p>
            <table cellpadding="0" cellspacing="0" style="width:100%;border:1px solid #F0F0F0;border-radius:8px;overflow:hidden;">
              <tr style="background:#FAFAFA;">
                <td style="padding:12px 16px;font-size:12px;color:#6B7280;font-weight:600;">EMAIL</td>
                <td style="padding:12px 16px;font-size:14px;color:#111111;font-weight:500;">${email}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px;font-size:12px;color:#6B7280;font-weight:600;border-top:1px solid #F0F0F0;">TOTAL SIGNUPS</td>
                <td style="padding:12px 16px;font-size:14px;color:#111111;font-weight:700;border-top:1px solid #F0F0F0;">${count ?? "N/A"}</td>
              </tr>
            </table>
            <p style="margin:20px 0 0;">
              <a href="https://puritylabresearch.com/admin/waitlist" style="display:inline-block;background:#111111;color:#ffffff;text-decoration:none;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:600;">View Waitlist</a>
            </p>
          </td>
        </tr>`,
      }),
      skipSuppressionCheck: true,
    }).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = createAdminClient();
    const { count } = await supabase
      .from("waitlist")
      .select("*", { count: "exact", head: true });

    return NextResponse.json({ count: count ?? 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
