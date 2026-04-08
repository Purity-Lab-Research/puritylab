import type { Order, OrderItem } from "@/lib/types";
import { ADMIN_NOTIFICATION_EMAIL } from "@/lib/constants";

function unsubscribeFooter(email: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";
  const encoded = encodeURIComponent(email);
  return `<p style="margin:8px 0 0;font-size:11px;color:#bbb;">
    <a href="${siteUrl}/policies/privacy" style="color:#999;text-decoration:underline;">Privacy Policy</a>
    &nbsp;|&nbsp;
    <a href="${siteUrl}/api/unsubscribe?email=${encoded}" style="color:#999;text-decoration:underline;">Unsubscribe</a>
  </p>`;
}

// ---------------------------------------------------------------------------
// Branded email wrapper -consistent header, footer, and layout for all emails
// ---------------------------------------------------------------------------

export function brandedEmailWrapper(options: {
  body: string;
  recipientEmail?: string;
  contactEmail?: string;
  showDisclaimer?: boolean;
  showUnsubscribe?: boolean;
}): string {
  const { body, recipientEmail, contactEmail = "support@puritylabresearch.com", showDisclaimer = true, showUnsubscribe = true } = options;

  const disclaimerBlock = showDisclaimer
    ? `<tr>
          <td style="padding:16px 24px;background:#FAFAFA;border-top:1px solid #F0F0F0;">
            <p style="margin:0;font-size:11px;color:#6B7280;line-height:1.5;text-align:center;">
              <strong>For Research Use Only.</strong> Not for human or animal consumption. You must be 21 or older to purchase. Purity Lab assumes no liability for product use or misuse.
            </p>
          </td>
        </tr>`
    : "";

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <!-- Header -->
        <tr>
          <td style="padding:24px 24px 20px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:10px;">
                <img src="https://puritylabresearch.com/images/email-logo.png" alt="Purity Lab" width="36" height="36" style="display:block;" />
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;color:#111111;font-size:18px;font-weight:800;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif;">PURITY LAB</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Body -->
        ${body}

        <!-- Disclaimer -->
        ${disclaimerBlock}

        <!-- Footer -->
        <tr>
          <td style="padding:24px;background:#FAFAFA;text-align:center;border-top:1px solid #F0F0F0;">
            <p style="margin:0;font-size:12px;color:#6B7280;">
              Questions? Email us at
              <a href="mailto:${contactEmail}" style="color:#111111;text-decoration:underline;">${contactEmail}</a>
            </p>
            <p style="margin:10px 0 0;font-size:11px;color:#9CA3AF;">&copy; 2026 Purity Lab. All rights reserved.</p>
            ${showUnsubscribe && recipientEmail ? unsubscribeFooter(recipientEmail) : ""}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatCurrency(amount: number, currency = "USD"): string {
  const formatted = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(amount);
  return `${formatted} ${currency}`;
}

export async function sendEmail(options: {
  from?: string;
  to: string[];
  replyTo?: string;
  subject: string;
  html: string;
  skipSuppressionCheck?: boolean;
}): Promise<{ success: boolean; error?: string; suppressed?: string[] }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not configured -skipping email send");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  const domain = process.env.RESEND_DOMAIN || "puritylabresearch.com";

  // Check suppression list (bounces, complaints, unsubscribes)
  let recipients = options.to;
  const suppressed: string[] = [];

  if (!options.skipSuppressionCheck && recipients.length > 0) {
    try {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      const db = createAdminClient();
      const { data: suppressions } = await db
        .from("email_suppressions")
        .select("email")
        .in("email", recipients.map((e) => e.toLowerCase()));

      if (suppressions && suppressions.length > 0) {
        const suppressedSet = new Set(suppressions.map((s: { email: string }) => s.email.toLowerCase()));
        suppressed.push(...suppressedSet);
        recipients = recipients.filter(
          (r) => !suppressedSet.has(r.toLowerCase())
        );

        if (recipients.length === 0) {
          console.warn("All recipients suppressed, skipping send", {
            suppressed,
            subject: options.subject,
          });
          return { success: true, suppressed };
        }
      }
    } catch {
      // Don't block email sends if suppression check fails
    }
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: options.from ?? `Purity Lab <noreply@${domain}>`,
      to: recipients,
      reply_to: options.replyTo,
      subject: options.subject,
      html: options.html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Resend API error:", text);
    return { success: false, error: text };
  }

  return { success: true, ...(suppressed.length > 0 ? { suppressed } : {}) };
}

// ---------------------------------------------------------------------------
// Order confirmation email to customer
// ---------------------------------------------------------------------------

export async function sendOrderConfirmation(
  order: Order,
  items: OrderItem[]
): Promise<void> {
  const customerEmail = order.guest_email;
  if (!customerEmail) {
    console.warn(
      `Order ${order.order_number}: no customer email available -skipping confirmation`
    );
    return;
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";
  const safeOrderNumber = escapeHtml(order.order_number);
  const safeName = escapeHtml(order.shipping_name);
  const safeLine1 = escapeHtml(order.shipping_line1);
  const safeLine2 = order.shipping_line2
    ? escapeHtml(order.shipping_line2)
    : "";
  const safeCity = escapeHtml(order.shipping_city);
  const safeProvince = escapeHtml(order.shipping_province);
  const safePostal = escapeHtml(order.shipping_postal);
  const safeCountry = escapeHtml(order.shipping_country);

  const currency = order.currency || "USD";

  const itemRows = items
    .map((item) => {
      const name = escapeHtml(item.product_name);
      const qty = item.quantity;
      const unitPrice = formatCurrency(item.unit_price, currency);
      const lineTotal = formatCurrency(item.unit_price * item.quantity, currency);
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;">${name}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${qty}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${unitPrice}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;">${lineTotal}</td>
        </tr>`;
    })
    .join("");

  const addressBlock = [
    safeName,
    safeLine1,
    safeLine2,
    `${safeCity}, ${safeProvince} ${safePostal}`,
    safeCountry,
  ]
    .filter(Boolean)
    .join("<br/>");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <!-- Header -->
        <tr>
          <td style="padding:24px 24px 20px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:10px;">
                <img src="https://puritylabresearch.com/images/email-logo.png" alt="Purity Lab" width="36" height="36" style="display:block;" />
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;color:#111111;font-size:18px;font-weight:800;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif;">PURITY LAB</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <!-- Title -->
        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Order Confirmed</h2>
            <p style="margin:0;color:#666;font-size:14px;">Order #${safeOrderNumber}</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;">
              Thank you for your order! We have received your payment and your order is now being processed.
            </p>
          </td>
        </tr>

        <!-- Items table -->
        <tr>
          <td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:6px;overflow:hidden;">
              <thead>
                <tr style="background:#fafafa;">
                  <th style="padding:10px 12px;text-align:left;font-size:13px;color:#666;border-bottom:1px solid #eee;">Item</th>
                  <th style="padding:10px 12px;text-align:center;font-size:13px;color:#666;border-bottom:1px solid #eee;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#666;border-bottom:1px solid #eee;">Price</th>
                  <th style="padding:10px 12px;text-align:right;font-size:13px;color:#666;border-bottom:1px solid #eee;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemRows}
              </tbody>
            </table>
          </td>
        </tr>

        <!-- Totals -->
        <tr>
          <td style="padding:0 24px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#666;">Subtotal</td>
                <td style="padding:4px 0;font-size:14px;text-align:right;">${formatCurrency(order.subtotal, currency)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#666;">Shipping</td>
                <td style="padding:4px 0;font-size:14px;text-align:right;">${formatCurrency(order.shipping_cost, currency)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0;font-size:14px;color:#666;">Tax</td>
                <td style="padding:4px 0;font-size:14px;text-align:right;">${formatCurrency(order.tax, currency)}</td>
              </tr>
              <tr>
                <td style="padding:8px 0 0;font-size:16px;font-weight:bold;border-top:2px solid #111;">Total</td>
                <td style="padding:8px 0 0;font-size:16px;font-weight:bold;text-align:right;border-top:2px solid #111;">${formatCurrency(order.total, currency)}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Shipping address -->
        <tr>
          <td style="padding:0 24px 24px;">
            <h3 style="margin:0 0 8px;font-size:14px;color:#111;">Shipping Address</h3>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">${addressBlock}</p>
          </td>
        </tr>

        <!-- Create Account CTA (guest orders only) -->
        ${!order.user_id ? `
        <tr>
          <td style="padding:20px 24px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0 0 12px;font-size:14px;color:#333;">
              <strong>Track your order and save your info for next time!</strong>
            </p>
            <a href="${siteUrl}/register" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              Create a Free Account
            </a>
            <p style="margin:8px 0 0;font-size:12px;color:#999;">View order history, save addresses, and check out faster.</p>
          </td>
        </tr>` : ""}

        <!-- Disclaimer -->
        <tr>
          <td style="padding:16px 24px;background:#FAFAFA;border-top:1px solid #F0F0F0;">
            <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;text-align:center;">
              <strong>For Research Use Only.</strong> All products sold by Purity Lab are for in-vitro laboratory research and educational purposes only. Not for human or animal consumption. The purchaser assumes full responsibility for
              the lawful use of all products. Purity Lab assumes no liability for
              the use or misuse of any products sold. You must be 21+ to purchase.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 24px;background:#fafafa;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#999;">
              Questions about your order? Email us at
              <a href="mailto:support@puritylabresearch.com" style="color:#666;">support@puritylabresearch.com</a>.
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#bbb;">&copy; Purity Lab. All rights reserved.</p>
            ${unsubscribeFooter(customerEmail)}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to: [customerEmail],
    replyTo: "support@puritylabresearch.com",
    subject: `Order Confirmation #${safeOrderNumber}`,
    html,
  });

  if (!result.success) {
    throw new Error(`Failed to send order confirmation: ${result.error}`);
  }

  console.log(`Order confirmation email sent for order #${order.order_number}`);
}

// ---------------------------------------------------------------------------
// Admin notification email
// ---------------------------------------------------------------------------

export async function sendAdminOrderNotification(
  order: Order,
  items: OrderItem[]
): Promise<void> {
  const safeOrderNumber = escapeHtml(order.order_number);
  const customerEmail = order.guest_email
    ? escapeHtml(order.guest_email)
    : "N/A (logged-in user)";
  const currency = order.currency || "USD";

  const itemSummary = items
    .map((item) => {
      const name = escapeHtml(item.product_name);
      return `<li>${name} &times; ${item.quantity}  - ${formatCurrency(item.unit_price * item.quantity, currency)}</li>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <tr>
          <td style="background:#0d6efd;padding:20px 24px;">
            <h2 style="margin:0;color:#fff;font-size:18px;">New Order Received</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:6px 0;font-weight:bold;width:140px;">Order Number</td>
                <td style="padding:6px 0;">#${safeOrderNumber}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-weight:bold;">Customer Email</td>
                <td style="padding:6px 0;">${customerEmail}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-weight:bold;">Total</td>
                <td style="padding:6px 0;font-size:16px;font-weight:bold;color:#0d6efd;">${formatCurrency(order.total, currency)}</td>
              </tr>
            </table>

            <h3 style="margin:20px 0 8px;font-size:14px;">Items</h3>
            <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;">
              ${itemSummary}
            </ul>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px;background:#f8f9fa;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;font-size:12px;color:#999;">Purity Lab Admin Notification</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to: [ADMIN_NOTIFICATION_EMAIL],
    subject: `New Order #${safeOrderNumber} -${formatCurrency(order.total, currency)}`,
    html,
  });

  if (!result.success) {
    throw new Error(`Failed to send admin notification: ${result.error}`);
  }

  console.log(`Admin notification sent for order #${order.order_number}`);
}

// ---------------------------------------------------------------------------
// Shipping notification email to customer
// ---------------------------------------------------------------------------

export async function sendShippingNotification(
  order: Order
): Promise<void> {
  const customerEmail = order.guest_email;
  if (!customerEmail) {
    console.warn(
      `Order ${order.order_number}: no customer email -skipping shipping notification`
    );
    return;
  }

  const safeOrderNumber = escapeHtml(order.order_number);
  const safeName = escapeHtml(order.shipping_name);
  const trackingNumber = order.tracking_number
    ? escapeHtml(order.tracking_number)
    : null;
  const carrier = order.carrier ? escapeHtml(order.carrier) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const trackingUrlProvider = order.tracking_url_provider || null;

  const trackingBlock = trackingNumber
    ? `
      <tr>
        <td style="padding:20px 24px;">
          <div style="background:#f0f4ff;border:1px solid #d0daea;border-radius:8px;padding:20px;">
            <h3 style="margin:0 0 8px;font-size:14px;color:#111111;">Tracking Information</h3>
            ${carrier ? `<p style="margin:0 0 4px;font-size:14px;color:#555;">Carrier: <strong>${carrier}</strong></p>` : ""}
            <p style="margin:0 0 12px;font-size:14px;color:#555;">Tracking Number: <strong style="font-family:monospace;">${trackingNumber}</strong></p>
            ${trackingUrlProvider ? `<a href="${escapeHtml(trackingUrlProvider)}" style="display:inline-block;background:#111111;color:#fff;padding:10px 20px;border-radius:50px;text-decoration:none;font-size:13px;font-weight:600;">Track with ${carrier || "Carrier"}</a>` : ""}
          </div>
        </td>
      </tr>`
    : "";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <tr>
          <td style="padding:24px 24px 20px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:10px;">
                <img src="https://puritylabresearch.com/images/email-logo.png" alt="Purity Lab" width="36" height="36" style="display:block;" />
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;color:#111111;font-size:18px;font-weight:800;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif;">PURITY LAB</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Your Order Has Shipped!</h2>
            <p style="margin:0;color:#666;font-size:14px;">Order #${safeOrderNumber}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;">
              Hi ${safeName}, great news! Your order has been shipped and is on its way to you.
            </p>
          </td>
        </tr>

        ${trackingBlock}

        <tr>
          <td style="padding:20px 24px;">
            <a href="${siteUrl}/track" style="display:inline-block;background:#111111;color:#fff;padding:12px 24px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              Track Your Order
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px;background:#FAFAFA;border-top:1px solid #F0F0F0;">
            <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;text-align:center;">
              <strong>For Research Use Only.</strong> All products sold by Purity Lab are for in-vitro laboratory research and educational purposes only. Not for human or animal consumption. The purchaser assumes full responsibility for
              laboratory and research purposes.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 24px;background:#fafafa;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#999;">
              Questions? Email us at
              <a href="mailto:support@puritylabresearch.com" style="color:#666;">support@puritylabresearch.com</a>.
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#bbb;">&copy; Purity Lab. All rights reserved.</p>
            ${unsubscribeFooter(customerEmail)}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to: [customerEmail],
    replyTo: "support@puritylabresearch.com",
    subject: `Your Order #${safeOrderNumber} Has Shipped!`,
    html,
  });

  if (!result.success) {
    throw new Error(`Failed to send shipping notification: ${result.error}`);
  }

  console.log(`Shipping notification sent for order #${order.order_number}`);
}

// ---------------------------------------------------------------------------
// Low stock alert email to admin
// ---------------------------------------------------------------------------

export async function sendLowStockAlert(
  products: { name: string; sku: string | null; stock_quantity: number; low_stock_threshold: number }[]
): Promise<void> {
  if (products.length === 0) return;

  const rows = products
    .map((p) => {
      const name = escapeHtml(p.name);
      const sku = p.sku ? escapeHtml(p.sku) : "-";
      const isOut = p.stock_quantity <= 0;
      const color = isOut ? "#dc2626" : "#d97706";
      const label = isOut ? "OUT OF STOCK" : "LOW STOCK";
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:monospace;">${sku}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;font-weight:bold;">${p.stock_quantity}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;text-align:center;">
            <span style="color:${color};font-weight:bold;font-size:12px;">${label}</span>
          </td>
        </tr>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <tr>
          <td style="background:#d97706;padding:20px 24px;">
            <h2 style="margin:0;color:#fff;font-size:18px;">Low Stock Alert</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 16px;font-size:14px;color:#555;">
              The following ${products.length} product${products.length > 1 ? "s" : ""} need attention:
            </p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:6px;overflow:hidden;font-size:13px;">
              <thead>
                <tr style="background:#fafafa;">
                  <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;">Product</th>
                  <th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;">SKU</th>
                  <th style="padding:8px 12px;text-align:center;border-bottom:1px solid #eee;">Stock</th>
                  <th style="padding:8px 12px;text-align:center;border-bottom:1px solid #eee;">Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px;background:#f8f9fa;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;font-size:12px;color:#999;">Purity Lab Inventory Alert</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to: ["support@puritylabresearch.com"],
    subject: `Low Stock Alert: ${products.length} product${products.length > 1 ? "s" : ""} need restocking`,
    html,
  });

  if (!result.success) {
    throw new Error(`Failed to send low stock alert: ${result.error}`);
  }

  console.log(`Low stock alert sent for ${products.length} products`);
}

// ---------------------------------------------------------------------------
// Admin notification for new account signups
// ---------------------------------------------------------------------------

export async function sendAdminNewAccountNotification(
  email: string
): Promise<void> {
  const safeEmail = escapeHtml(email);

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <tr>
          <td style="background:#16a34a;padding:20px 24px;">
            <h2 style="margin:0;color:#fff;font-size:18px;">New Account Created</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:24px;">
            <p style="margin:0 0 8px;font-size:14px;color:#555;">A new customer has created an account:</p>
            <p style="margin:0;font-size:16px;font-weight:bold;color:#111;">${safeEmail}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px;background:#f8f9fa;border-top:1px solid #eee;text-align:center;">
            <p style="margin:0;font-size:12px;color:#999;">Purity Lab Admin Notification</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to: [ADMIN_NOTIFICATION_EMAIL],
    subject: `New Account: ${safeEmail}`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send new account notification: ${result.error}`);
  } else {
    console.log(`Admin notification sent for new account: ${email}`);
  }
}

// ---------------------------------------------------------------------------
// Back-in-stock notification email to customer
// ---------------------------------------------------------------------------

export async function sendBackInStockNotification(
  email: string,
  productName: string,
  productSlug: string
): Promise<void> {
  const safeName = escapeHtml(productName);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <tr>
          <td style="padding:24px 24px 20px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:10px;">
                <img src="https://puritylabresearch.com/images/email-logo.png" alt="Purity Lab" width="36" height="36" style="display:block;" />
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;color:#111111;font-size:18px;font-weight:800;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif;">PURITY LAB</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Good News: It&apos;s Back in Stock!</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;">
              You asked us to let you know when <strong>${safeName}</strong> was back in stock. Great news: it&apos;s available again! Grab yours before it sells out.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:24px;text-align:center;">
            <a href="${siteUrl}/shop/${productSlug}" style="display:inline-block;background:#111111;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              Shop Now
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px;background:#FAFAFA;border-top:1px solid #F0F0F0;">
            <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;text-align:center;">
              <strong>For Research Use Only.</strong> All products sold by Purity Lab are for in-vitro laboratory research and educational purposes only. Not for human or animal consumption. The purchaser assumes full responsibility for
              laboratory and research purposes.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 24px;background:#fafafa;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#999;">
              Questions? Email us at
              <a href="mailto:support@puritylabresearch.com" style="color:#666;">support@puritylabresearch.com</a>.
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#bbb;">&copy; Purity Lab. All rights reserved.</p>
            ${unsubscribeFooter(email)}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: `${safeName} is Back in Stock!`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send back-in-stock notification to ${email}: ${result.error}`);
  } else {
    console.log(`Back-in-stock notification sent to ${email} for ${productName}`);
  }
}

// ---------------------------------------------------------------------------
// Review request email -sent after delivery
// ---------------------------------------------------------------------------

export async function sendReviewRequest(
  email: string,
  orderNumber: string,
  items: { product_name: string; slug: string }[]
): Promise<void> {
  const safeOrderNumber = escapeHtml(orderNumber);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const productLinks = items
    .map((item) => {
      const name = escapeHtml(item.product_name);
      return `<li style="margin-bottom:8px;">
        <a href="${siteUrl}/shop/${item.slug}" style="color:#10B981;text-decoration:none;font-weight:600;">${name}</a>
      </li>`;
    })
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#FAFAFA;font-family:'Helvetica Neue',Arial,sans-serif;color:#111111;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAFAFA;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #F0F0F0;">

        <tr>
          <td style="padding:24px 24px 20px;border-bottom:1px solid #F0F0F0;">
            <table cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:middle;padding-right:10px;">
                <img src="https://puritylabresearch.com/images/email-logo.png" alt="Purity Lab" width="36" height="36" style="display:block;" />
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;color:#111111;font-size:18px;font-weight:800;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif;">PURITY LAB</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">How was your order?</h2>
            <p style="margin:0;color:#666;font-size:14px;">Order #${safeOrderNumber}</p>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;">
              We hope you&apos;re happy with your recent purchase! Your feedback helps other researchers make informed decisions. Would you take a moment to leave a review?
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#111;">Products from your order:</p>
            <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;">
              ${productLinks}
            </ul>
          </td>
        </tr>

        <tr>
          <td style="padding:0 24px 24px;text-align:center;">
            <a href="${siteUrl}/account/orders" style="display:inline-block;background:#111111;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              Leave a Review
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:20px 24px;background:#fafafa;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#999;">
              Thank you for choosing Purity Lab!
            </p>
            <p style="margin:8px 0 0;font-size:12px;color:#bbb;">&copy; Purity Lab. All rights reserved.</p>
            ${unsubscribeFooter(email)}
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: `How was your order #${safeOrderNumber}? Leave a review!`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send review request: ${result.error}`);
  } else {
    console.log(`Review request sent for order #${orderNumber}`);
  }
}

// ---------------------------------------------------------------------------
// Welcome email -sent to new customers after account creation
// ---------------------------------------------------------------------------

export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const safeName = escapeHtml(name || "there");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: email,
    showDisclaimer: true,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Welcome to Purity Lab</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${safeName},</p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">
            Thank you for creating your Purity Lab account. You now have access to:
          </p>
          <ul style="margin:12px 0 0;padding-left:20px;font-size:14px;line-height:2;color:#555;">
            <li><strong>Order tracking</strong> -real-time shipping updates</li>
            <li><strong>Order history</strong> -view past orders and reorder</li>
            <li><strong>Saved addresses</strong> -faster checkout</li>
            <li><strong>Wishlist</strong> -save products for later</li>
            <li><strong>Back-in-stock alerts</strong> -get notified when items return</li>
            <li><strong>Research library</strong> -access to protocols and guides</li>
          </ul>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;text-align:center;">
          <a href="${siteUrl}/shop" style="display:inline-block;background:#111111;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
            Browse Products
          </a>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px;">
          <div style="background:#f0f4ff;border:1px solid #d0daea;border-radius:8px;padding:20px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#666;font-weight:bold;">EARN WITH US</p>
            <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">
              Interested in earning commissions? Join our
              <a href="${siteUrl}/affiliate" style="color:#111111;font-weight:600;">Affiliate Program</a>
              and earn up to 15% on referrals.
            </p>
          </div>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: "Welcome to Purity Lab -Your Account is Ready",
    html,
  });

  if (!result.success) {
    console.error(`Failed to send welcome email: ${result.error}`);
  } else {
    console.log(`Welcome email sent to ${email}`);
  }
}

// ---------------------------------------------------------------------------
// Refund confirmation email to customer
// ---------------------------------------------------------------------------

export async function sendRefundConfirmation(
  email: string,
  orderNumber: string,
  refundAmount: number,
  currency = "USD",
  isPartial = false
): Promise<void> {
  const safeOrderNumber = escapeHtml(orderNumber);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: email,
    showDisclaimer: false,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">${isPartial ? "Partial " : ""}Refund Processed</h2>
          <p style="margin:0;color:#666;font-size:14px;">Order #${safeOrderNumber}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
            We have processed a ${isPartial ? "partial " : ""}refund for your order. Here are the details:
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:24px;text-align:center;">
            <p style="margin:0 0 4px;font-size:13px;color:#666;font-weight:bold;text-transform:uppercase;">Refund Amount</p>
            <p style="margin:0;font-size:32px;font-weight:800;color:#10B981;">${formatCurrency(refundAmount, currency)}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">
            The refund has been issued to your original payment method. Please allow <strong>5–10 business days</strong> for the funds to appear in your account, depending on your bank.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px;text-align:center;">
          <a href="${siteUrl}/account/orders" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
            View Order Details
          </a>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: `${isPartial ? "Partial " : ""}Refund Processed -Order #${safeOrderNumber}`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send refund confirmation: ${result.error}`);
  } else {
    console.log(`Refund confirmation sent for order #${orderNumber}`);
  }
}

// ---------------------------------------------------------------------------
// Order cancellation email to customer
// ---------------------------------------------------------------------------

export async function sendOrderCancellation(
  email: string,
  orderNumber: string,
  reason?: string
): Promise<void> {
  const safeOrderNumber = escapeHtml(orderNumber);
  const safeReason = reason ? escapeHtml(reason) : null;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: email,
    showDisclaimer: false,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Order Cancelled</h2>
          <p style="margin:0;color:#666;font-size:14px;">Order #${safeOrderNumber}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
            Your order #${safeOrderNumber} has been cancelled.${safeReason ? ` <strong>Reason:</strong> ${safeReason}.` : ""}
          </p>
          <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:#555;">
            If a payment was collected, a full refund will be issued to your original payment method within 5–10 business days.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;text-align:center;">
          <a href="${siteUrl}/shop" style="display:inline-block;background:#111111;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
            Continue Shopping
          </a>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: `Order #${safeOrderNumber} Has Been Cancelled`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send cancellation email: ${result.error}`);
  } else {
    console.log(`Cancellation email sent for order #${orderNumber}`);
  }
}

// ---------------------------------------------------------------------------
// Order delivered notification
// ---------------------------------------------------------------------------

export async function sendDeliveryConfirmation(
  order: Order
): Promise<void> {
  const customerEmail = order.guest_email;
  if (!customerEmail) return;

  const safeOrderNumber = escapeHtml(order.order_number);
  const safeName = escapeHtml(order.shipping_name);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: customerEmail,
    showDisclaimer: true,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Your Order Has Been Delivered!</h2>
          <p style="margin:0;color:#666;font-size:14px;">Order #${safeOrderNumber}</p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
            Hi ${safeName}, your order has been delivered. We hope everything arrived safely!
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <div style="background:#F0FDF4;border:1px solid #d1fae5;border-radius:8px;padding:20px;text-align:center;">
            <p style="margin:0;font-size:14px;color:#059669;font-weight:bold;">DELIVERED</p>
            <p style="margin:4px 0 0;font-size:13px;color:#6B7280;">Order #${safeOrderNumber}</p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px;">
          <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:20px;">
            <p style="margin:0 0 8px;font-size:14px;font-weight:bold;color:#111;">Important Storage Information</p>
            <ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8;color:#555;">
              <li>Store peptides at <strong>-20&deg;C</strong> for long-term storage</li>
              <li>Reconstituted peptides should be stored at <strong>2–8&deg;C</strong></li>
              <li>Protect from light and avoid repeated freeze-thaw cycles</li>
              <li>Use bacteriostatic water for reconstitution</li>
            </ul>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;text-align:center;">
          <a href="${siteUrl}/account/orders" style="display:inline-block;background:#111111;color:#fff;padding:12px 24px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;margin-right:8px;">
            View Order
          </a>
          <a href="${siteUrl}/protocols" style="display:inline-block;background:#fff;color:#111111;padding:12px 24px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;border:2px solid #1A2B4A;">
            Research Protocols
          </a>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [customerEmail],
    replyTo: "support@puritylabresearch.com",
    subject: `Your Order #${safeOrderNumber} Has Been Delivered`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send delivery confirmation: ${result.error}`);
  } else {
    console.log(`Delivery confirmation sent for order #${order.order_number}`);
  }
}

// ---------------------------------------------------------------------------
// Subscription renewal reminder
// ---------------------------------------------------------------------------

export async function sendSubscriptionRenewalReminder(
  email: string,
  name: string,
  productName: string,
  renewalDate: string,
  amount: number,
  currency = "USD"
): Promise<void> {
  const safeName = escapeHtml(name || "there");
  const safeProduct = escapeHtml(productName);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: email,
    showDisclaimer: true,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Subscription Renewal Reminder</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${safeName},</p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">
            This is a friendly reminder that your subscription is coming up for renewal.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:20px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
              <tr>
                <td style="padding:6px 0;font-weight:bold;color:#555;width:140px;">Product</td>
                <td style="padding:6px 0;color:#111;">${safeProduct}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-weight:bold;color:#555;">Renewal Date</td>
                <td style="padding:6px 0;color:#111;">${escapeHtml(renewalDate)}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;font-weight:bold;color:#555;">Amount</td>
                <td style="padding:6px 0;color:#111;font-weight:bold;">${formatCurrency(amount, currency)}</td>
              </tr>
            </table>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 8px;">
          <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">
            Your payment method on file will be charged automatically. If you need to update your payment info or manage your subscription, visit your account.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 24px;text-align:center;">
          <a href="${siteUrl}/account/subscriptions" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
            Manage Subscription
          </a>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: `Subscription Renewal Reminder -${safeProduct}`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send renewal reminder: ${result.error}`);
  } else {
    console.log(`Renewal reminder sent to ${email}`);
  }
}

// ---------------------------------------------------------------------------
// Discount / promo code email
// ---------------------------------------------------------------------------

export async function sendPromoCodeEmail(
  email: string,
  name: string,
  promoCode: string,
  discountPercent: number,
  expiresAt?: string
): Promise<void> {
  const safeName = escapeHtml(name || "there");
  const safeCode = escapeHtml(promoCode);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const expiryLine = expiresAt
    ? `<p style="margin:8px 0 0;font-size:13px;color:#999;">Expires ${escapeHtml(expiresAt)}</p>`
    : "";

  const html = brandedEmailWrapper({
    recipientEmail: email,
    showDisclaimer: true,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">A Special Offer Just for You</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${safeName},</p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">
            We appreciate your support! Here&apos;s an exclusive discount on your next order:
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <div style="background:#111111;border-radius:12px;padding:32px;text-align:center;">
            <p style="margin:0 0 4px;font-size:14px;color:#9CA3AF;font-weight:bold;text-transform:uppercase;letter-spacing:2px;">Your Code</p>
            <p style="margin:0;font-size:36px;font-weight:800;color:#fff;letter-spacing:4px;font-family:monospace;">${safeCode}</p>
            <p style="margin:12px 0 0;font-size:18px;color:#10B981;font-weight:bold;">${discountPercent}% OFF</p>
            ${expiryLine}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 24px;text-align:center;">
          <a href="${siteUrl}/shop" style="display:inline-block;background:#10B981;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
            Shop Now
          </a>
          <p style="margin:12px 0 0;font-size:13px;color:#999;">Apply the code at checkout to claim your discount.</p>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: `${discountPercent}% Off Your Next Order -Code: ${safeCode}`,
    html,
  });

  if (!result.success) {
    console.error(`Failed to send promo email: ${result.error}`);
  } else {
    console.log(`Promo code email sent to ${email}`);
  }
}

// ---------------------------------------------------------------------------
// Password changed confirmation
// ---------------------------------------------------------------------------

export async function sendPasswordChangedEmail(
  email: string
): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const html = brandedEmailWrapper({
    recipientEmail: email,
    showDisclaimer: false,
    showUnsubscribe: false,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Password Changed</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 24px;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
            Your Purity Lab account password has been successfully changed. If you did not make this change, please reset your password immediately and contact us.
          </p>
          <div style="margin:20px 0;padding:16px;background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;">
            <p style="margin:0;font-size:14px;color:#991B1B;">
              <strong>Didn&apos;t change your password?</strong><br/>
              <a href="${siteUrl}/forgot-password" style="color:#111111;font-weight:600;">Reset it now</a> or email
              <a href="mailto:support@puritylabresearch.com" style="color:#111111;font-weight:600;">support@puritylabresearch.com</a>
            </p>
          </div>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [email],
    skipSuppressionCheck: true,
    subject: "Your Purity Lab Password Has Been Changed",
    html,
  });

  if (!result.success) {
    console.error(`Failed to send password changed email: ${result.error}`);
  } else {
    console.log(`Password changed email sent to ${email}`);
  }
}

// ---------------------------------------------------------------------------
// Reorder reminder -nudge customers to reorder (e.g. 30 days after purchase)
// ---------------------------------------------------------------------------

export async function sendReorderReminder(
  email: string,
  name: string,
  items: { product_name: string; slug: string }[]
): Promise<void> {
  const safeName = escapeHtml(name || "there");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const productLinks = items
    .map((item) => {
      const n = escapeHtml(item.product_name);
      return `<li style="margin-bottom:8px;">
        <a href="${siteUrl}/shop/${item.slug}" style="color:#111111;text-decoration:none;font-weight:600;">${n}</a>
      </li>`;
    })
    .join("");

  const html = brandedEmailWrapper({
    recipientEmail: email,
    showDisclaimer: true,
    body: `
      <tr>
        <td style="padding:32px 24px 8px;">
          <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Time to Restock?</h2>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 0;">
          <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${safeName},</p>
          <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">
            It&apos;s been a while since your last order. Running low on supplies? Here&apos;s what you ordered last time:
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 24px;">
          <ul style="margin:0;padding-left:20px;font-size:14px;line-height:1.8;">
            ${productLinks}
          </ul>
        </td>
      </tr>
      <tr>
        <td style="padding:0 24px 8px;">
          <div style="background:#f0f4ff;border:1px solid #d0daea;border-radius:8px;padding:16px;text-align:center;">
            <p style="margin:0;font-size:14px;color:#555;">
              <strong>Save with subscriptions!</strong> Get up to <strong style="color:#10B981;">15% off</strong> with auto-delivery and never run out.
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px 24px;text-align:center;">
          <a href="${siteUrl}/shop" style="display:inline-block;background:#111111;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
            Reorder Now
          </a>
        </td>
      </tr>`,
  });

  const result = await sendEmail({
    to: [email],
    replyTo: "support@puritylabresearch.com",
    subject: "Time to Restock? Your Purity Lab Order",
    html,
  });

  if (!result.success) {
    console.error(`Failed to send reorder reminder: ${result.error}`);
  } else {
    console.log(`Reorder reminder sent to ${email}`);
  }
}
