import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

const SettingsSchema = z.object({
  paymentMethod: z.enum(["ach", "paypal"]).nullable().optional(),
  paymentEmail: z.string().email().nullable().optional(),
  bankName: z.string().nullable().optional(),
  bankAccountLast4: z.string().max(4).nullable().optional(),
});

async function getAffiliate(userId: string) {
  const admin = createAdminClient();
  const { data } = await admin
    .from("affiliates")
    .select("id, payment_method, payment_email, bank_name, bank_account_last4")
    .eq("user_id", userId)
    .maybeSingle();
  return data;
}

export async function GET(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 30, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const affiliate = await getAffiliate(user.id);
    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 403 });
    }

    return NextResponse.json({
      paymentMethod: affiliate.payment_method,
      paymentEmail: affiliate.payment_email,
      bankName: affiliate.bank_name,
      bankAccountLast4: affiliate.bank_account_last4,
    });
  } catch (err) {
    logger.error("Affiliate settings GET error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = createAdminClient();
    const { data: affiliate } = await admin
      .from("affiliates")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (!affiliate) {
      return NextResponse.json({ error: "Not an affiliate" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = SettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { paymentMethod, paymentEmail, bankName, bankAccountLast4 } = parsed.data;

    await admin
      .from("affiliates")
      .update({
        payment_method: paymentMethod ?? null,
        payment_email: paymentEmail ?? null,
        bank_name: bankName ?? null,
        bank_account_last4: bankAccountLast4 ?? null,
      })
      .eq("id", affiliate.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Affiliate settings PUT error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
