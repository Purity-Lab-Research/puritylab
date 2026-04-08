import { sendEmail } from "@/lib/email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

export async function sendAffiliateConversionEmail(
  affiliateEmail: string,
  affiliateName: string,
  commissionAmount: number,
  orderTotal: number,
  isFirstOrder: boolean
): Promise<void> {
  await sendEmail({
    to: [affiliateEmail],
    subject: `You earned $${commissionAmount.toFixed(2)} from a new referral!`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#111111;">New Referral Conversion!</h2>
        <p style="color:#6B7280;">Hi ${affiliateName},</p>
        <p style="color:#6B7280;">Great news! One of your referrals just placed ${isFirstOrder ? "their first" : "a recurring"} order.</p>
        <div style="background:#F0FDF4;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
          <p style="color:#10B981;font-size:28px;font-weight:800;margin:0;">+$${commissionAmount.toFixed(2)}</p>
          <p style="color:#6B7280;font-size:14px;margin:4px 0 0;">Commission earned on $${orderTotal.toFixed(2)} order</p>
        </div>
        <p style="color:#6B7280;">View your earnings in your <a href="${SITE_URL}/affiliate/dashboard" style="color:#10B981;">affiliate dashboard</a>.</p>
        <p style="color:#6B7280;margin-top:24px;">Keep it up!<br/>Purity Lab Team</p>
      </div>
    `,
  });
}

export async function sendPayoutProcessedEmail(
  affiliateEmail: string,
  affiliateName: string,
  amount: number
): Promise<void> {
  await sendEmail({
    to: [affiliateEmail],
    subject: `Payout Processed - $${amount.toFixed(2)}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#111111;">Payout Processed</h2>
        <p style="color:#6B7280;">Hi ${affiliateName},</p>
        <p style="color:#6B7280;">Your affiliate payout of <strong style="color:#111111;">$${amount.toFixed(2)}</strong> has been processed and is on its way.</p>
        <p style="color:#6B7280;">View your full payout history in your <a href="${SITE_URL}/affiliate/dashboard" style="color:#10B981;">affiliate dashboard</a>.</p>
        <p style="color:#6B7280;margin-top:24px;">Best,<br/>Purity Lab Team</p>
      </div>
    `,
  });
}

export async function sendApplicationReceivedEmail(
  email: string,
  name: string
): Promise<void> {
  await sendEmail({
    to: [email],
    subject: "Affiliate Application Received - Purity Lab",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#111111;">Application Received</h2>
        <p style="color:#6B7280;">Hi ${name},</p>
        <p style="color:#6B7280;">Thank you for applying to the Purity Lab Affiliate Program. We review most applications within 24 hours and will notify you by email once a decision has been made.</p>
        <p style="color:#6B7280;">In the meantime, feel free to explore our products at <a href="${SITE_URL}/shop" style="color:#10B981;">puritylabresearch.com/shop</a>.</p>
        <p style="color:#6B7280;margin-top:24px;">Best,<br/>Purity Lab Team</p>
      </div>
    `,
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
    subject: "Welcome to the Purity Lab Affiliate Program!",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#111111;">You're Approved!</h2>
        <p style="color:#6B7280;">Hi ${name},</p>
        <p style="color:#6B7280;">Congratulations! Your affiliate application has been approved. Here are your details:</p>
        <div style="background:#FAFAFA;border-radius:12px;padding:20px;margin:16px 0;">
          <p style="color:#111111;font-weight:600;margin:0 0 8px;">Your Affiliate Code: <span style="color:#10B981;">${affiliateCode}</span></p>
          <p style="color:#111111;font-weight:600;margin:0 0 8px;">Your Referral Link: <a href="${SITE_URL}/?ref=${affiliateCode}" style="color:#10B981;">${SITE_URL}/?ref=${affiliateCode}</a></p>
          <p style="color:#111111;font-weight:600;margin:0;">Commission: 15% first order, 10% recurring</p>
        </div>
        <p style="color:#6B7280;">Visit your <a href="${SITE_URL}/affiliate/dashboard" style="color:#10B981;">affiliate dashboard</a> to track clicks, conversions, and earnings.</p>
        ${isNewUser ? `<p style="color:#6B7280;">We created an account for you. Please <a href="${SITE_URL}/forgot-password" style="color:#10B981;">set your password</a> to access the dashboard.</p>` : ""}
        <p style="color:#6B7280;margin-top:24px;">Welcome aboard!<br/>Purity Lab Team</p>
      </div>
    `,
  });
}

export async function sendApplicationRejectedEmail(
  email: string,
  name: string
): Promise<void> {
  await sendEmail({
    to: [email],
    subject: "Affiliate Application Update - Purity Lab",
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#111111;">Application Update</h2>
        <p style="color:#6B7280;">Hi ${name},</p>
        <p style="color:#6B7280;">Thank you for your interest in the Purity Lab Affiliate Program. After reviewing your application, we have determined that it is not a fit at this time.</p>
        <p style="color:#6B7280;">You are welcome to reapply in the future if your circumstances change.</p>
        <p style="color:#6B7280;margin-top:24px;">Best,<br/>Purity Lab Team</p>
      </div>
    `,
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
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
        <h2 style="color:#111111;">New Affiliate Application</h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Name:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${name}</td></tr>
          <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Email:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${email}</td></tr>
          <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Platform:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${platform || "N/A"}</td></tr>
          <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Audience:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${audienceSize || "N/A"}</td></tr>
          <tr><td style="padding:4px 8px;color:#6B7280;font-size:14px;"><strong>Experience:</strong></td><td style="padding:4px 8px;color:#111111;font-size:14px;">${previousExperience ? "Yes" : "No"}</td></tr>
        </table>
        <p style="color:#6B7280;margin-top:16px;">Review in the <a href="${SITE_URL}/admin/affiliates/applications" style="color:#10B981;">admin panel</a>.</p>
      </div>
    `,
  });
}
