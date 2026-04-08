import { sendEmail, brandedEmailWrapper } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";
const DOMAIN = process.env.RESEND_DOMAIN || "puritylabresearch.com";
const AFFILIATE_FROM = `Purity Lab Affiliates <affiliate@${DOMAIN}>`;
const AFFILIATE_REPLY_TO = `affiliate@${DOMAIN}`;

export async function sendAffiliateConversionEmail(
  affiliateEmail: string,
  affiliateName: string,
  commissionAmount: number,
  orderTotal: number,
  isFirstOrder: boolean
): Promise<void> {
  await sendEmail({
    to: [affiliateEmail],
    from: AFFILIATE_FROM,
    replyTo: AFFILIATE_REPLY_TO,
    subject: `You earned $${commissionAmount.toFixed(2)} from a new referral!`,
    html: brandedEmailWrapper({
      recipientEmail: affiliateEmail,
      contactEmail: AFFILIATE_REPLY_TO,
      showDisclaimer: false,
      body: `
        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">New Referral Conversion!</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${affiliateName},</p>
            <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">Great news! One of your referrals just placed ${isFirstOrder ? "their first" : "a recurring"} order.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px;">
            <div style="background:#F0FDF4;border:1px solid #d1fae5;border-radius:8px;padding:24px;text-align:center;">
              <p style="color:#10B981;font-size:32px;font-weight:800;margin:0;">+$${commissionAmount.toFixed(2)}</p>
              <p style="color:#6B7280;font-size:14px;margin:6px 0 0;">Commission earned on $${orderTotal.toFixed(2)} order</p>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:0 24px 24px;text-align:center;">
            <a href="${SITE_URL}/affiliate/dashboard" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              View Dashboard
            </a>
          </td>
        </tr>`,
    }),
  });
}

export async function sendPayoutProcessedEmail(
  affiliateEmail: string,
  affiliateName: string,
  amount: number
): Promise<void> {
  await sendEmail({
    to: [affiliateEmail],
    from: AFFILIATE_FROM,
    replyTo: AFFILIATE_REPLY_TO,
    subject: `Payout Processed - $${amount.toFixed(2)}`,
    html: brandedEmailWrapper({
      recipientEmail: affiliateEmail,
      contactEmail: AFFILIATE_REPLY_TO,
      showDisclaimer: false,
      body: `
        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Payout Processed</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${affiliateName},</p>
            <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">Your affiliate payout of <strong style="color:#111;">$${amount.toFixed(2)}</strong> has been processed and is on its way.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;text-align:center;">
            <a href="${SITE_URL}/affiliate/dashboard" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              View Payout History
            </a>
          </td>
        </tr>`,
    }),
  });
}

export async function sendApplicationReceivedEmail(
  email: string,
  name: string
): Promise<void> {
  await sendEmail({
    to: [email],
    from: AFFILIATE_FROM,
    replyTo: AFFILIATE_REPLY_TO,
    subject: "Affiliate Application Received - Purity Lab",
    html: brandedEmailWrapper({
      recipientEmail: email,
      contactEmail: AFFILIATE_REPLY_TO,
      showDisclaimer: false,
      body: `
        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Application Received</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${name},</p>
            <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">Thank you for applying to the Purity Lab Affiliate Program. We review most applications within 24 hours and will notify you by email once a decision has been made.</p>
            <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">In the meantime, feel free to explore our products.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:24px;text-align:center;">
            <a href="${SITE_URL}/shop" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              Browse Products
            </a>
          </td>
        </tr>`,
    }),
  });
}

export async function sendApplicationApprovedEmail(
  email: string,
  name: string,
  affiliateCode: string,
  isNewUser: boolean
): Promise<void> {
  await sendEmail({
    to: [email],
    from: AFFILIATE_FROM,
    replyTo: AFFILIATE_REPLY_TO,
    subject: "Welcome to the Purity Lab Affiliate Program!",
    html: brandedEmailWrapper({
      recipientEmail: email,
      contactEmail: AFFILIATE_REPLY_TO,
      showDisclaimer: false,
      body: `
        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">You're Approved!</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 0;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${name},</p>
            <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">Congratulations! Your affiliate application has been approved. Here are your details:</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 24px;">
            <div style="background:#fafafa;border:1px solid #eee;border-radius:8px;padding:20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
                <tr>
                  <td style="padding:6px 0;font-weight:bold;color:#555;width:140px;">Affiliate Code</td>
                  <td style="padding:6px 0;color:#10B981;font-weight:700;font-family:monospace;font-size:16px;">${affiliateCode}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-weight:bold;color:#555;">Referral Link</td>
                  <td style="padding:6px 0;"><a href="${SITE_URL}/?ref=${affiliateCode}" style="color:#111111;word-break:break-all;">${SITE_URL}/?ref=${affiliateCode}</a></td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-weight:bold;color:#555;">Commission</td>
                  <td style="padding:6px 0;color:#111;">15% first order, 10% recurring</td>
                </tr>
              </table>
            </div>
          </td>
        </tr>
        ${isNewUser ? `
        <tr>
          <td style="padding:0 24px 8px;">
            <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">We created an account for you. Please <a href="${SITE_URL}/forgot-password" style="color:#111111;font-weight:600;">set your password</a> to access the dashboard.</p>
          </td>
        </tr>` : ""}
        <tr>
          <td style="padding:16px 24px 24px;text-align:center;">
            <a href="${SITE_URL}/affiliate/dashboard" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
              Go to Dashboard
            </a>
          </td>
        </tr>`,
    }),
  });
}

export async function sendApplicationRejectedEmail(
  email: string,
  name: string
): Promise<void> {
  await sendEmail({
    to: [email],
    from: AFFILIATE_FROM,
    replyTo: AFFILIATE_REPLY_TO,
    subject: "Affiliate Application Update - Purity Lab",
    html: brandedEmailWrapper({
      recipientEmail: email,
      contactEmail: AFFILIATE_REPLY_TO,
      showDisclaimer: false,
      showUnsubscribe: false,
      body: `
        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">Application Update</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 24px;">
            <p style="margin:0;font-size:15px;line-height:1.6;color:#555;">Hi ${name},</p>
            <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">Thank you for your interest in the Purity Lab Affiliate Program. After reviewing your application, we have determined that it is not a fit at this time.</p>
            <p style="margin:8px 0 0;font-size:15px;line-height:1.6;color:#555;">You are welcome to reapply in the future if your circumstances change.</p>
            <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#555;">Best,<br/>Purity Lab Team</p>
          </td>
        </tr>`,
    }),
  });
}

export async function sendNewApplicationAdminNotification(
  name: string,
  email: string,
  platform: string | null,
  audienceSize: string | null,
  previousExperience: boolean
): Promise<void> {
  const adminEmail = process.env.ADMIN_EMAIL || "support@puritylabresearch.com";
  await sendEmail({
    to: [adminEmail],
    subject: `New Affiliate Application: ${name}`,
    html: brandedEmailWrapper({
      contactEmail: AFFILIATE_REPLY_TO,
      showDisclaimer: false,
      showUnsubscribe: false,
      body: `
        <tr>
          <td style="padding:32px 24px 8px;">
            <h2 style="margin:0 0 4px;font-size:20px;color:#111;">New Affiliate Application</h2>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 24px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border:1px solid #eee;border-radius:6px;overflow:hidden;">
              <tr style="background:#fafafa;">
                <td style="padding:10px 12px;font-weight:bold;color:#555;width:120px;border-bottom:1px solid #eee;">Name</td>
                <td style="padding:10px 12px;color:#111;border-bottom:1px solid #eee;">${name}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-weight:bold;color:#555;border-bottom:1px solid #eee;">Email</td>
                <td style="padding:10px 12px;color:#111;border-bottom:1px solid #eee;"><a href="mailto:${email}" style="color:#111111;">${email}</a></td>
              </tr>
              <tr style="background:#fafafa;">
                <td style="padding:10px 12px;font-weight:bold;color:#555;border-bottom:1px solid #eee;">Platform</td>
                <td style="padding:10px 12px;color:#111;border-bottom:1px solid #eee;">${platform || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding:10px 12px;font-weight:bold;color:#555;border-bottom:1px solid #eee;">Audience</td>
                <td style="padding:10px 12px;color:#111;border-bottom:1px solid #eee;">${audienceSize || "N/A"}</td>
              </tr>
              <tr style="background:#fafafa;">
                <td style="padding:10px 12px;font-weight:bold;color:#555;">Experience</td>
                <td style="padding:10px 12px;color:#111;">${previousExperience ? "Yes" : "No"}</td>
              </tr>
            </table>
            <div style="margin-top:20px;text-align:center;">
              <a href="${SITE_URL}/admin/affiliates/applications" style="display:inline-block;background:#111111;color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;">
                Review Application
              </a>
            </div>
          </td>
        </tr>`,
    }),
  });
}
