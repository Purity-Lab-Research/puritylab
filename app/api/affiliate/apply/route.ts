import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import { sendEmail } from "@/lib/email";
import { ADMIN_NOTIFICATION_EMAIL } from "@/lib/constants";
import { createNotification } from "@/lib/notifications";

const ApplicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  websiteUrl: z.string().url().nullable().optional(),
  platform: z.string().nullable().optional(),
  audienceSize: z.string().nullable().optional(),
  promotionPlan: z.string().nullable().optional(),
  previousExperience: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(request, { limit: 3, windowMs: 3_600_000 });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = ApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const supabase = createAdminClient();

    // Check for duplicate pending application
    const { data: existing } = await supabase
      .from("affiliate_applications")
      .select("id")
      .eq("email", data.email)
      .eq("status", "pending")
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You already have a pending application. We will review it shortly." },
        { status: 409 }
      );
    }

    const { data: inserted, error: insertError } = await supabase
      .from("affiliate_applications")
      .insert({
        name: data.name,
        email: data.email,
        website_url: data.websiteUrl ?? null,
        platform: data.platform ?? null,
        audience_size: data.audienceSize ?? null,
        promotion_plan: data.promotionPlan ?? null,
        previous_experience: data.previousExperience,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Failed to insert affiliate application:", insertError.message);
      return NextResponse.json(
        { error: "Failed to submit application" },
        { status: 500 }
      );
    }

    // Create admin notification
    if (inserted) {
      createNotification({
        type: "new_affiliate_app",
        title: `Affiliate application from ${data.name}`,
        description: `${data.email} — ${data.platform ?? "No platform specified"}`,
        href: "/admin/affiliates",
        entity_type: "affiliate_application",
        entity_id: inserted.id,
      }).catch(() => {});
    }

    // Send confirmation to applicant
    await sendEmail({
      to: [data.email],
      subject: "Affiliate Application Received - Purity Lab",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#111111;">Application Received</h2>
          <p style="color:#6B7280;">Hi ${data.name},</p>
          <p style="color:#6B7280;">Thank you for applying to the Purity Lab Referral Program. We review most applications within 24 hours and will notify you by email once a decision has been made.</p>
          <p style="color:#6B7280;">In the meantime, feel free to explore our products at <a href="https://puritylabresearch.com/shop" style="color:#10B981;">puritylabresearch.com/shop</a>.</p>
          <p style="color:#6B7280;margin-top:24px;">Best,<br/>Purity Lab Team</p>
        </div>
      `,
    });

    // Notify admin
    const domain = process.env.RESEND_DOMAIN || "puritylabresearch.com";
    await sendEmail({
      from: `Purity Lab Affiliates <affiliate@${domain}>`,
      to: [ADMIN_NOTIFICATION_EMAIL],
      subject: `New Affiliate Application: ${data.name}`,
      skipSuppressionCheck: true,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#111111;">New Affiliate Application</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Name:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${data.name}</td></tr>
            <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Email:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${data.email}</td></tr>
            <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Platform:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${data.platform || "N/A"}</td></tr>
            <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Audience:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${data.audienceSize || "N/A"}</td></tr>
            <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Experience:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${data.previousExperience ? "Yes" : "No"}</td></tr>
          </table>
          <p style="color:#6B7280;margin-top:16px;">Review in the <a href="https://puritylabresearch.com/admin/affiliates/applications" style="color:#10B981;">admin panel</a>.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Affiliate application error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
