import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";
import { randomUUID } from "crypto";
import { createHmac, timingSafeEqual } from "crypto";

const log = logger.child({ route: "/api/webhooks/resend" });

/**
 * Verify Resend webhook signature (svix).
 * Set RESEND_WEBHOOK_SECRET in env to enable verification.
 */
function verifySignature(
  payload: string,
  headers: Headers
): boolean {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if not configured

  const msgId = headers.get("svix-id");
  const timestamp = headers.get("svix-timestamp");
  const signature = headers.get("svix-signature");

  if (!msgId || !timestamp || !signature) {
    log.warn("Missing svix headers");
    return false;
  }

  // Reject timestamps older than 5 minutes
  const now = Math.floor(Date.now() / 1000);
  const ts = parseInt(timestamp, 10);
  if (Math.abs(now - ts) > 300) {
    log.warn("Webhook timestamp too old", { timestamp, now });
    return false;
  }

  const toSign = `${msgId}.${timestamp}.${payload}`;
  // Secret from Resend starts with "whsec_" and is base64-encoded after prefix
  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", secretBytes)
    .update(toSign)
    .digest("base64");

  // Resend may send multiple signatures separated by spaces (v1,<sig>)
  const signatures = signature.split(" ");
  for (const sig of signatures) {
    const sigValue = sig.replace(/^v\d+,/, "");
    try {
      const sigBuf = Buffer.from(sigValue, "base64");
      const expBuf = Buffer.from(expected, "base64");
      if (sigBuf.length === expBuf.length && timingSafeEqual(sigBuf, expBuf)) {
        return true;
      }
    } catch {
      continue;
    }
  }

  log.warn("Webhook signature verification failed");
  return false;
}

/**
 * Resend webhook handler for all email events.
 *
 * Set up in Resend Dashboard > Webhooks:
 *   URL: https://puritylabresearch.com/api/webhooks/resend
 *   Events: email.sent, email.delivered, email.delivery_delayed,
 *           email.bounced, email.complained, email.opened,
 *           email.clicked, email.received
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();

    // Verify webhook signature
    if (!verifySignature(rawBody, request.headers)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = payload.type as string;
    const data = payload.data ?? {};
    const db = createAdminClient();

    switch (eventType) {
      // ---------------------------------------------------------------
      // INBOUND: Someone emailed support@, affiliate@, or noreply@
      // ---------------------------------------------------------------
      case "email.received": {
        const fromAddress = data?.from ?? "";
        const fromName =
          fromAddress.replace(/<.*>/, "").trim() ||
          fromAddress.replace(/.*<|>.*/g, "");
        const fromEmail = fromAddress.includes("<")
          ? fromAddress.replace(/.*<|>.*/g, "")
          : fromAddress;
        const subject = data?.subject ?? "(No subject)";
        const bodyText: string = data?.text ?? data?.html ?? "";
        const toAddresses: string[] = Array.isArray(data?.to)
          ? data.to
          : [data?.to].filter(Boolean);

        // Categorize by receiving address
        let category = "general";
        const toLower = toAddresses
          .map((a: string) => a.toLowerCase())
          .join(",");
        if (toLower.includes("affiliate@")) category = "affiliate";
        else if (toLower.includes("support@")) category = "support";

        // Thread matching: find existing thread from same sender with similar subject
        const normalizedSubject = subject
          .replace(/^(re:\s*|fwd?:\s*)+/i, "")
          .trim();
        const { data: existingThread } = await db
          .from("inbox_messages")
          .select("thread_id")
          .eq("sender_email", fromEmail)
          .ilike("subject", `%${normalizedSubject}%`)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        const threadId = existingThread?.thread_id ?? randomUUID();

        await db.from("inbox_messages").insert({
          thread_id: threadId,
          direction: "inbound",
          sender_name: fromName || fromEmail,
          sender_email: fromEmail,
          subject,
          category,
          body: bodyText,
          is_read: false,
        });

        log.info("Inbound email saved", {
          from: fromEmail,
          subject,
          category,
          threadId,
        });
        break;
      }

      // ---------------------------------------------------------------
      // OUTBOUND TRACKING: sent, delivered, delayed, opened, clicked
      // ---------------------------------------------------------------
      case "email.sent": {
        const recipient = data?.to?.[0] ?? data?.to;
        await db.from("email_events").insert({
          email_id: data?.email_id,
          event_type: "sent",
          recipient_email: recipient,
          subject: data?.subject,
          from_address: data?.from,
          metadata: data,
        });
        log.info("Email sent", { to: recipient, emailId: data?.email_id });
        break;
      }

      case "email.delivered": {
        const recipient = data?.to?.[0] ?? data?.to;
        await db.from("email_events").insert({
          email_id: data?.email_id,
          event_type: "delivered",
          recipient_email: recipient,
          subject: data?.subject,
          from_address: data?.from,
          metadata: data,
        });
        log.info("Email delivered", { to: recipient, emailId: data?.email_id });
        break;
      }

      case "email.delivery_delayed": {
        const recipient = data?.to?.[0] ?? data?.to;
        await db.from("email_events").insert({
          email_id: data?.email_id,
          event_type: "delivery_delayed",
          recipient_email: recipient,
          subject: data?.subject,
          from_address: data?.from,
          metadata: data,
        });
        log.warn("Email delivery delayed", {
          to: recipient,
          emailId: data?.email_id,
        });
        break;
      }

      case "email.opened": {
        const recipient = data?.to?.[0] ?? data?.to;
        await db.from("email_events").insert({
          email_id: data?.email_id,
          event_type: "opened",
          recipient_email: recipient,
          subject: data?.subject,
          from_address: data?.from,
          metadata: data,
        });
        log.info("Email opened", { to: recipient, emailId: data?.email_id });
        break;
      }

      case "email.clicked": {
        const recipient = data?.to?.[0] ?? data?.to;
        await db.from("email_events").insert({
          email_id: data?.email_id,
          event_type: "clicked",
          recipient_email: recipient,
          subject: data?.subject,
          from_address: data?.from,
          metadata: { ...data, click_url: data?.click?.url },
        });
        log.info("Email link clicked", {
          to: recipient,
          url: data?.click?.url,
          emailId: data?.email_id,
        });
        break;
      }

      // ---------------------------------------------------------------
      // BOUNCES: auto-suppress hard bounces
      // ---------------------------------------------------------------
      case "email.bounced": {
        const recipient = data?.to?.[0] ?? data?.to;
        const bounceType = data?.bounce?.type; // hard or soft
        const bounceDesc = data?.bounce?.description;

        await db.from("email_events").insert({
          email_id: data?.email_id,
          event_type: "bounced",
          recipient_email: recipient,
          subject: data?.subject,
          from_address: data?.from,
          bounce_type: bounceType,
          bounce_description: bounceDesc,
          metadata: data,
        });

        // Hard bounces: auto-suppress to protect sender reputation
        if (bounceType === "hard" && recipient) {
          await db
            .from("email_suppressions")
            .upsert(
              {
                email: recipient.toLowerCase(),
                reason: "bounce_hard",
                source: "webhook",
              },
              { onConflict: "email" }
            );

          // Also mark profile as unsubscribed if they have an account
          try {
            const { data: authData } = await db.auth.admin.listUsers();
            const matchedUser = authData?.users?.find(
              (u) => u.email?.toLowerCase() === recipient.toLowerCase()
            );
            if (matchedUser) {
              await db
                .from("profiles")
                .update({ email_unsubscribed: true })
                .eq("id", matchedUser.id);
            }
          } catch {
            // Non-critical — suppression list is the primary protection
          }

          log.warn("Hard bounce — email suppressed", {
            to: recipient,
            reason: bounceDesc,
          });
        } else {
          log.warn("Soft bounce", {
            to: recipient,
            reason: bounceDesc,
            emailId: data?.email_id,
          });
        }
        break;
      }

      // ---------------------------------------------------------------
      // COMPLAINTS: auto-suppress and unsubscribe
      // ---------------------------------------------------------------
      case "email.complained": {
        const recipient = data?.to?.[0] ?? data?.to;

        await db.from("email_events").insert({
          email_id: data?.email_id,
          event_type: "complained",
          recipient_email: recipient,
          subject: data?.subject,
          from_address: data?.from,
          complaint_type: data?.complaint?.type,
          metadata: data,
        });

        // Always suppress on complaint — this is critical for deliverability
        if (recipient) {
          await db
            .from("email_suppressions")
            .upsert(
              {
                email: recipient.toLowerCase(),
                reason: "complaint",
                source: "webhook",
              },
              { onConflict: "email" }
            );
        }

        log.warn("Spam complaint — email suppressed", {
          to: recipient,
          emailId: data?.email_id,
        });
        break;
      }

      default:
        log.info("Unhandled Resend event", { type: eventType });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    log.error("Resend webhook error", { error: String(err) });
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
