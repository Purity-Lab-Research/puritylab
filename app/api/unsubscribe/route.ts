import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

/**
 * GET /api/unsubscribe?email=xxx
 * One-click unsubscribe endpoint. Adds email to suppression list
 * and marks the profile as unsubscribed.
 */
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return new NextResponse(renderPage("Missing email parameter.", false), {
      status: 400,
      headers: { "Content-Type": "text/html" },
    });
  }

  const normalized = email.toLowerCase().trim();

  try {
    const db = createAdminClient();

    // Add to suppression list
    await db.from("email_suppressions").upsert(
      {
        email: normalized,
        reason: "manual_unsubscribe",
        source: "user_request",
      },
      { onConflict: "email" }
    );

    // Mark profile if they have an account
    try {
      const { data: authData } = await db.auth.admin.listUsers();
      const matchedUser = authData?.users?.find(
        (u) => u.email?.toLowerCase() === normalized
      );
      if (matchedUser) {
        await db
          .from("profiles")
          .update({ email_unsubscribed: true })
          .eq("id", matchedUser.id);
      }
    } catch {
      // Non-critical
    }

    logger.info("User unsubscribed", { email: normalized });

    return new NextResponse(
      renderPage("You have been unsubscribed from Purity Lab marketing emails.", true),
      { status: 200, headers: { "Content-Type": "text/html" } }
    );
  } catch (err) {
    logger.error("Unsubscribe error", { error: String(err), email: normalized });
    return new NextResponse(
      renderPage("Something went wrong. Please email support@puritylabresearch.com to unsubscribe.", false),
      { status: 500, headers: { "Content-Type": "text/html" } }
    );
  }
}

function renderPage(message: string, success: boolean): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${success ? "Unsubscribed" : "Error"} — Purity Lab</title>
  <style>
    body{margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background:#f5f5f5;display:flex;justify-content:center;align-items:center;min-height:100vh;}
    .card{background:#fff;border-radius:12px;padding:48px;max-width:480px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
    h1{color:#111111;font-size:24px;margin:0 0 16px;}
    p{color:#555;font-size:16px;line-height:1.6;margin:0 0 24px;}
    a{color:#111111;text-decoration:underline;}
    .icon{font-size:48px;margin-bottom:16px;}
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">${success ? "&#9989;" : "&#9888;&#65039;"}</div>
    <h1>${success ? "Unsubscribed" : "Error"}</h1>
    <p>${message}</p>
    <a href="https://puritylabresearch.com">Back to Purity Lab</a>
  </div>
</body>
</html>`;
}
