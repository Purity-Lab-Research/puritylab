import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  orderNumber: z.string().min(1),
  total: z.number(),
});

export async function POST(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { email, orderNumber, total } = parsed.data;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

  const formattedTotal = new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "USD",
  }).format(total);

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
                <img src="https://puritylabresearch.com/images/logo.png" alt="Purity Lab" width="36" height="36" style="display:block;" />
              </td>
              <td style="vertical-align:middle;">
                <p style="margin:0;color:#111111;font-size:18px;font-weight:800;letter-spacing:0.5px;font-family:'Helvetica Neue',Arial,sans-serif;">PURITY LAB</p>
              </td>
            </tr></table>
          </td>
        </tr>

        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">You left something behind!</h2>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">
              We noticed you started an order <strong>(#${orderNumber})</strong> for <strong>${formattedTotal} USD</strong> but didn't complete checkout. Your items are still waiting for you!
            </p>
            <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#555;">
              If you ran into any issues or have questions, email us at <a href="mailto:support@puritylabresearch.com" style="color:#10B981;">support@puritylabresearch.com</a> - we're happy to help.
            </p>
          </td>
        </tr>

        <tr>
          <td style="padding:8px 24px 24px;text-align:center;">
            <a href="${siteUrl}/shop" style="display:inline-block;background:#111111;color:#fff;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              Return to Shop
            </a>
          </td>
        </tr>

        <tr>
          <td style="padding:16px 24px;background:#FAFAFA;border-top:1px solid #F0F0F0;">
            <p style="margin:0;font-size:12px;color:#6B7280;line-height:1.5;text-align:center;">
              <strong>For Research Use Only.</strong> Products sold by Purity Lab are intended solely for
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
    subject: `You left something behind! Complete your Purity Lab order #${orderNumber}`,
    html,
  });

  if (!result.success) {
    logger.error("Failed to send abandoned checkout email", { email, orderNumber, error: result.error });
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  logger.info("Abandoned checkout email sent", { email, orderNumber });
  return NextResponse.json({ success: true });
}
