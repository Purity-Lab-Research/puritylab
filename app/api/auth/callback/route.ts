import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminNewAccountNotification, sendWelcomeEmail } from "@/lib/email";

export async function GET(request: NextRequest) {
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

      // Link any guest orders to this account & handle new signups
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
            // Notify admin of new signup (non-blocking)
            sendAdminNewAccountNotification(user.email).catch((err) => {
              console.error("Failed to send admin signup notification:", err);
            });

            // Send welcome email to new user (non-blocking)
            const fullName = user.user_metadata?.full_name || "";
            sendWelcomeEmail(user.email, fullName).catch((err) => {
              console.error("Failed to send welcome email:", err);
            });
          }
        }
      } catch (err) {
        console.error("Auth callback post-processing error:", err);
      }

      return NextResponse.redirect(`${origin}/account`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
