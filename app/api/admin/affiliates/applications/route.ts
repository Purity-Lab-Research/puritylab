import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";
import { sendEmail } from "@/lib/email";

function generateAffiliateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const url = new URL(request.url);
    const status = url.searchParams.get("status") || "pending";

    const { data, error } = await supabase
      .from("affiliate_applications")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ applications: data || [] });
  } catch (err) {
    console.error("Admin applications GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const adminUser = await requireAdmin();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { applicationId, action } = body;

    if (!applicationId || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get the application
    const { data: application } = await supabase
      .from("affiliate_applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (application.status !== "pending") {
      return NextResponse.json({ error: "Application already processed" }, { status: 400 });
    }

    if (action === "reject") {
      await supabase
        .from("affiliate_applications")
        .update({
          status: "rejected",
          reviewed_at: new Date().toISOString(),
          reviewed_by: adminUser.id,
        })
        .eq("id", applicationId);

      await sendEmail({
        to: [application.email],
        subject: "Affiliate Application Update - Purity Lab",
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="color:#111111;">Application Update</h2>
            <p style="color:#6B7280;">Hi ${application.name},</p>
            <p style="color:#6B7280;">Thank you for your interest in the Purity Lab Affiliate Program. After reviewing your application, we have determined that it is not a fit at this time.</p>
            <p style="color:#6B7280;">You are welcome to reapply in the future if your circumstances change.</p>
            <p style="color:#6B7280;margin-top:24px;">Best,<br/>Purity Lab Team</p>
          </div>
        `,
      });

      return NextResponse.json({ success: true });
    }

    // Approve: create user account if needed, then create affiliate record
    // First check if user exists with this email
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email === application.email
    );

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create a user account with a temporary password (they can reset it)
      const tempPassword = `Temp${Math.random().toString(36).slice(2)}!1`;
      const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
        email: application.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: { full_name: application.name },
      });

      if (userError || !newUser.user) {
        console.error("Failed to create user for affiliate:", userError?.message);
        return NextResponse.json(
          { error: "Failed to create user account" },
          { status: 500 }
        );
      }

      userId = newUser.user.id;
    }

    // Generate unique affiliate code
    let affiliateCode = generateAffiliateCode();
    let attempts = 0;
    while (attempts < 5) {
      const { data: existing } = await supabase
        .from("affiliates")
        .select("id")
        .eq("affiliate_code", affiliateCode)
        .maybeSingle();

      if (!existing) break;
      affiliateCode = generateAffiliateCode();
      attempts++;
    }

    // Create affiliate record
    const { error: affError } = await supabase.from("affiliates").insert({
      user_id: userId,
      affiliate_code: affiliateCode,
    });

    if (affError) {
      console.error("Failed to create affiliate record:", affError.message);
      return NextResponse.json(
        { error: "Failed to create affiliate record" },
        { status: 500 }
      );
    }

    // Update application status
    await supabase
      .from("affiliate_applications")
      .update({
        status: "approved",
        reviewed_at: new Date().toISOString(),
        reviewed_by: adminUser.id,
      })
      .eq("id", applicationId);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

    // Send approval email
    await sendEmail({
      to: [application.email],
      subject: "Welcome to the Purity Lab Affiliate Program!",
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;">
          <h2 style="color:#111111;">You're Approved!</h2>
          <p style="color:#6B7280;">Hi ${application.name},</p>
          <p style="color:#6B7280;">Congratulations! Your affiliate application has been approved. Here are your details:</p>
          <div style="background:#FAFAFA;border-radius:12px;padding:20px;margin:16px 0;">
            <p style="color:#111111;font-weight:600;margin:0 0 8px;">Your Affiliate Code: <span style="color:#10B981;">${affiliateCode}</span></p>
            <p style="color:#111111;font-weight:600;margin:0 0 8px;">Your Referral Link: <a href="${siteUrl}/?ref=${affiliateCode}" style="color:#10B981;">${siteUrl}/?ref=${affiliateCode}</a></p>
            <p style="color:#111111;font-weight:600;margin:0;">Commission: 15% first order, 10% recurring</p>
          </div>
          <p style="color:#6B7280;">Visit your <a href="${siteUrl}/affiliate/dashboard" style="color:#10B981;">affiliate dashboard</a> to track clicks, conversions, and earnings.</p>
          ${!existingUser ? '<p style="color:#6B7280;">We created an account for you. Please <a href="' + siteUrl + '/forgot-password" style="color:#10B981;">set your password</a> to access the dashboard.</p>' : ""}
          <p style="color:#6B7280;margin-top:24px;">Welcome aboard!<br/>Purity Lab Team</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, affiliateCode });
  } catch (err) {
    console.error("Admin applications PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
