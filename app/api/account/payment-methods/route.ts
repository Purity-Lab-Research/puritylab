import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyCsrf } from "@/lib/csrf";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// GET saved payment methods
export async function GET(req: NextRequest) {
  const rateLimited = await rateLimit(req, { limit: 30, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    // Get or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({ paymentMethods: [] });
    }

    const methods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    const defaultPmId = (
      typeof customer.invoice_settings?.default_payment_method === "string"
        ? customer.invoice_settings.default_payment_method
        : customer.invoice_settings?.default_payment_method?.id
    ) ?? null;

    const paymentMethods = methods.data.map((pm) => ({
      id: pm.id,
      brand: pm.card?.brand ?? "unknown",
      last4: pm.card?.last4 ?? "????",
      expMonth: pm.card?.exp_month ?? 0,
      expYear: pm.card?.exp_year ?? 0,
      isDefault: pm.id === defaultPmId,
    }));

    return NextResponse.json({ paymentMethods });
  } catch (err) {
    logger.error("Payment methods GET error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// POST - create SetupIntent for adding a new card
export async function POST(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    // Get or create Stripe customer
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    let customer = customers.data[0];
    if (!customer) {
      customer = await stripe.customers.create({ email: user.email! });
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ["card"],
    });

    return NextResponse.json({ clientSecret: setupIntent.client_secret });
  } catch (err) {
    logger.error("Payment methods POST error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// PUT - set default payment method
export async function PUT(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { paymentMethodId } = await req.json();
    if (!paymentMethodId || typeof paymentMethodId !== "string") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    const customers = await stripe.customers.list({ email: user.email!, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Payment methods PUT error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

// DELETE - remove a payment method
export async function DELETE(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(req, { limit: 10, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const user = await getAuthUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { paymentMethodId } = await req.json();
    if (!paymentMethodId || typeof paymentMethodId !== "string") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();
    await stripe.paymentMethods.detach(paymentMethodId);

    return NextResponse.json({ success: true });
  } catch (err) {
    logger.error("Payment methods DELETE error", { error: String(err) });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
