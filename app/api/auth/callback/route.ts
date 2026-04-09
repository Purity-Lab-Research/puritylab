import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminNewAccountNotification, sendWelcomeEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Redirect password recovery to reset page
      if (type === "recovery") {
        return NextResponse.redirect(`${origin}/reset-password`);
      }

      // Link any guest orders to this account and handle new signups
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
          const admin = createAdminClient();
          await admin
            .from("orders")
            .update({ user_id: user.id })
            .eq("guest_email", user.email)
            .is("user_id", null);

          // Check if this is a new signup by looking for a welcome_email_sent flag
          const { data: profile } = await admin
            .from("profiles")
            .select("welcome_email_sent")
            .eq("id", user.id)
            .single();

          const isNewAccount = !profile?.welcome_email_sent;

          if (isNewAccount) {
            // Mark as sent so we never send again on future logins
            await admin
              .from("profiles")
              .update({ welcome_email_sent: true })
              .eq("id", user.id);

            // Handle referral: if the user signed up via a referral link, create a referral record
            try {
              const cookieStore = await cookies();
              const refCode = cookieStore.get("pl_aff")?.value;
              if (refCode) {
                // Look up the referrer by their referral code
                const { data: referrer } = await admin
                  .from("profiles")
                  .select("id")
                  .eq("referral_code", refCode.toUpperCase())
                  .maybeSingle();

                if (referrer && referrer.id !== user.id) {
                  // Create a pending referral record
                  await admin.from("referrals").insert({
                    referrer_user_id: referrer.id,
                    referred_user_id: user.id,
                    referral_code: refCode.toUpperCase(),
                    status: "pending",
                  });

                  // Store which code referred this user
                  await admin
                    .from("profiles")
                    .update({ referred_by_code: refCode.toUpperCase() })
                    .eq("id", user.id);
                }
              }
            } catch (refErr) {
              logger.error("Referral tracking error", { error: String(refErr) });
            }
            // Notify admin of new signup (non-blocking)
            sendAdminNewAccountNotification(user.email).catch((err) => {
              logger.error("Failed to send admin signup notification", { error: String(err) });
            });

            // Send welcome email to new user (non-blocking)
            const fullName = user.user_metadata?.full_name || "";
            sendWelcomeEmail(user.email, fullName).catch((err) => {
              logger.error("Failed to send welcome email", { error: String(err) });
            });
          }
        }
      } catch (err) {
        logger.error("Auth callback post-processing error", { error: String(err) });
      }

      return NextResponse.redirect(`${origin}/account`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
