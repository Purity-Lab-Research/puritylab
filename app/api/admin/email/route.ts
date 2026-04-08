import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCsrf } from "@/lib/csrf";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";
import { writeAuditLog } from "@/lib/audit";
import { logger } from "@/lib/logger";
import { z } from "zod";
import { randomUUID } from "crypto";

// GET sent emails from DB
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("inbox_messages")
    .select("*")
    .eq("direction", "outbound")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

const schema = z.object({
  to: z.string().email(),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Message is required"),
});

export async function POST(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { to, subject, body } = parsed.data;

  // Convert plain text line breaks to HTML
  const bodyHtml = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const domain = process.env.RESEND_DOMAIN || "puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: to,
    showDisclaimer: false,
    showUnsubscribe: true,
    body: `
      <tr>
        <td style="padding:32px 24px;">
          <p style="margin:0;font-size:15px;line-height:1.8;color:#333;">
            ${bodyHtml}
          </p>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    from: `Purity Lab Support <support@${domain}>`,
    to: [to],
    replyTo: `support@${domain}`,
    subject,
    html,
  });

  if (!result.success) {
    logger.error("Failed to send admin email", { to, subject, error: result.error });
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  // Save to inbox_messages so it shows in Sent history
  const db = createAdminClient();
  const threadId = randomUUID();
  await db.from("inbox_messages").insert({
    thread_id: threadId,
    direction: "outbound",
    sender_name: "Purity Lab",
    sender_email: `support@${domain}`,
    recipient_email: to,
    subject,
    category: "composed",
    body,
    is_read: true,
  });

  writeAuditLog({
    admin_id: admin.id,
    action: "settings.update",
    entity_type: "email",
    details: { to, subject },
  });

  logger.info("Admin email sent", { to, subject });
  return NextResponse.json({ success: true });
}
