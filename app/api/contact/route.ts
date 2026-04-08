import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import { logger } from "@/lib/logger";
import { CONTACT_EMAIL, ADMIN_NOTIFICATION_EMAIL } from "@/lib/constants";
import { brandedEmailWrapper } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";
import crypto from "crypto";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const ContactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  category: z.string().min(1, "Category is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(request, { limit: 3, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const parsed = ContactSchema.safeParse(body);

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || "Invalid request";
      return NextResponse.json(
        { error: firstError, details: fieldErrors },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, category, message } = parsed.data;
    const name = escapeHtml(`${firstName} ${lastName}`);
    const safeEmail = escapeHtml(email);
    const safeCategory = escapeHtml(category);
    const safeMessage = escapeHtml(message);

    // Save to inbox database
    const threadId = crypto.randomUUID();
    try {
      const db = createAdminClient();
      await db.from("inbox_messages").insert({
        thread_id: threadId,
        direction: "inbound",
        sender_name: `${firstName} ${lastName}`,
        sender_email: email,
        subject: `[${category}] Contact from ${firstName} ${lastName}`,
        category,
        body: message,
        is_read: false,
      });
    } catch (dbErr) {
      logger.error("Failed to save contact message to inbox", { error: String(dbErr) });
    }

    // Send email via Resend if configured
    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `Purity Lab Contact <noreply@${process.env.RESEND_DOMAIN || "puritylabresearch.com"}>`,
          to: [ADMIN_NOTIFICATION_EMAIL],
          reply_to: email,
          subject: `[${safeCategory}] Contact from ${name}`,
          html: brandedEmailWrapper({
            showDisclaimer: false,
            showUnsubscribe: false,
            body: `
              <tr>
                <td style="padding:32px 24px 8px;">
                  <h2 style="margin:0 0 4px;font-size:20px;color:#111;">New Contact Form Submission</h2>
                  <p style="margin:0;color:#666;font-size:14px;">${safeCategory}</p>
                </td>
              </tr>
              <tr>
                <td style="padding:16px 24px 24px;">
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                    <tr>
                      <td style="padding:6px 0;font-weight:bold;width:100px;color:#555;">Name</td>
                      <td style="padding:6px 0;color:#111;">${name}</td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-weight:bold;color:#555;">Email</td>
                      <td style="padding:6px 0;"><a href="mailto:${safeEmail}" style="color:#1A2B4A;">${safeEmail}</a></td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;font-weight:bold;color:#555;">Category</td>
                      <td style="padding:6px 0;color:#111;">${safeCategory}</td>
                    </tr>
                  </table>
                  <div style="margin-top:16px;padding:16px;background:#fafafa;border-radius:6px;border:1px solid #eee;">
                    <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#666;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
                    <p style="margin:0;font-size:15px;line-height:1.6;color:#333;">${safeMessage.replace(/\n/g, "<br />")}</p>
                  </div>
                </td>
              </tr>`,
          }),
        }),
      });

      if (!res.ok) {
        logger.error("Failed to send contact email", { error: await res.text() });
      }
    } else {
      logger.warn("Contact form submitted but no email provider configured", { name, email, category });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Contact form error", { error: String(err) });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
