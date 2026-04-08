import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";
import { logger } from "@/lib/logger";
import { z } from "zod";

// GET all messages (grouped by thread)
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("inbox_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

const replySchema = z.object({
  threadId: z.string().uuid(),
  to: z.string().email(),
  subject: z.string().min(1),
  body: z.string().min(1),
  senderName: z.string().min(1),
});

// POST a reply
export async function POST(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = replySchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { threadId, to, subject, body, senderName } = parsed.data;
  const db = createAdminClient();

  // Send the email
  const bodyHtml = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");

  const domain = process.env.RESEND_DOMAIN || "puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: to,
    showDisclaimer: false,
    showUnsubscribe: false,
    body: `
      <tr>
        <td style="padding:24px;">
          <p style="margin:0 0 8px;font-size:13px;color:#999;">Re: ${subject}</p>
          <p style="margin:0;font-size:15px;line-height:1.8;color:#333;">${bodyHtml}</p>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    from: `Purity Lab Support <support@${domain}>`,
    to: [to],
    replyTo: `support@${domain}`,
    subject: `Re: ${subject}`,
    html,
  });

  if (!result.success) {
    logger.error("Failed to send inbox reply", { to, error: result.error });
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }

  // Save outbound reply to thread
  await db.from("inbox_messages").insert({
    thread_id: threadId,
    direction: "outbound",
    sender_name: "Purity Lab",
    sender_email: `support@${domain}`,
    subject: `Re: ${subject}`,
    body,
    is_read: true,
  });

  // Mark all inbound messages in this thread as read
  await db
    .from("inbox_messages")
    .update({ is_read: true })
    .eq("thread_id", threadId)
    .eq("direction", "inbound");

  logger.info("Inbox reply sent", { to, threadId });
  return NextResponse.json({ success: true });
}

// PUT - mark message(s) as read
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await req.json();
  if (!threadId) {
    return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
  }

  const db = createAdminClient();
  await db
    .from("inbox_messages")
    .update({ is_read: true })
    .eq("thread_id", threadId);

  return NextResponse.json({ success: true });
}

// DELETE a thread
export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { threadId } = await req.json();
  if (!threadId) {
    return NextResponse.json({ error: "Missing threadId" }, { status: 400 });
  }

  const db = createAdminClient();
  await db.from("inbox_messages").delete().eq("thread_id", threadId);

  return NextResponse.json({ success: true });
}
