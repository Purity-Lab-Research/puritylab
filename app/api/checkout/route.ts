import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { generateOrderNumber, getSubscriptionPrice, getAnnualPrice, calculateShipping } from "@/lib/utils";
import { rateLimit } from "@/lib/rate-limit";
import { verifyCsrf } from "@/lib/csrf";
import { logger } from "@/lib/logger";

const CartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable(),
  name: z.string(),
  slug: z.string(),
  price: z.number(),
  subscriptionPrice: z.number().nullable(),
  size: z.string(),
  image: z.string().nullable(),
  quantity: z.number().int().positive(),
  purchaseType: z.enum(["one-time", "subscription"]),
  deliveryFrequencyWeeks: z.number().int().min(1).default(4),
  billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
});

const ShippingSchema = z.object({
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().nullable(),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});

const CheckoutSchema = z.object({
  items: z.array(CartItemSchema).min(1, "Cart cannot be empty"),
  shipping: ShippingSchema,
  email: z.string().email(),
  paymentMethod: z.enum(["stripe", "paypal"]),
  researchDisclaimerAccepted: z.literal(true),
  ageVerified: z.literal(true),
  termsAccepted: z.literal(true),
  applyReferralCredits: z.number().min(0).default(0),
  cycleManagement: z.boolean().default(false),
  affiliateCode: z.string().nullable().optional(),
  createAccount: z.boolean().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character")
    .optional(),
});

import { TAX_RATE } from "@/lib/constants";

export async function POST(_request: NextRequest) {
  // Pre-launch: orders disabled until first batch clears testing
  return NextResponse.json(
    { error: "Orders are not yet open. Join our waitlist to be notified when we launch." },
    { status: 503 }
  );
}

// Original checkout handler - uncomment when launching
/*
async function _checkoutHandler(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const rateLimited = await rateLimit(request, { limit: 5, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const log = logger.child({ route: "/api/checkout" });

  try {
    const body = await request.json();
    const parsed = CheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, shipping, email, paymentMethod, researchDisclaimerAccepted, ageVerified, termsAccepted, applyReferralCredits, cycleManagement, createAccount, password, affiliateCode: bodyAffCode } = parsed.data;

    // Read affiliate code from httpOnly cookie or request body
    const cookieAffCode = request.cookies.get("pl_aff")?.value;
    const affiliateCode = bodyAffCode || cookieAffCode || null;
    const supabase = createAdminClient();

    // Fetch actual prices from database - never trust client prices
    const productIds = items.map((item) => item.productId);
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, name, price, subscription_price, stock_quantity, active")
      .in("id", productIds);

    if (productsError || !products) {
      log.error("Failed to verify products", { error: productsError?.message });
      return NextResponse.json(
        { error: "Failed to verify products" },
        { status: 500 }
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Fetch variants if any items have variantId
    const variantIds = items.map((i) => i.variantId).filter(Boolean) as string[];
    const variantMap = new Map<string, { price: number; stock_quantity: number; size: string }>();
    if (variantIds.length > 0) {
      const { data: variants } = await supabase
        .from("product_variants")
        .select("id, price, stock_quantity, size, active")
        .in("id", variantIds);

      for (const v of variants ?? []) {
        if (v.active) variantMap.set(v.id, v);
      }
    }

    // Validate all products exist, are active, and in stock
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.name}` },
          { status: 400 }
        );
      }
      if (!product.active) {
        return NextResponse.json(
          { error: `Product is no longer available: ${product.name}` },
          { status: 400 }
        );
      }

      // Use variant stock/price if applicable
      if (item.variantId) {
        const variant = variantMap.get(item.variantId);
        if (!variant) {
          return NextResponse.json(
            { error: `Variant not found for ${product.name}` },
            { status: 400 }
          );
        }
        if (variant.stock_quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name} (${variant.size}). Only ${variant.stock_quantity} available.` },
            { status: 400 }
          );
        }
      } else {
        if (product.stock_quantity < item.quantity) {
          return NextResponse.json(
            { error: `Insufficient stock for ${product.name}. Only ${product.stock_quantity} available.` },
            { status: 400 }
          );
        }
      }
    }

    // Calculate totals from verified DB prices (use tiered subscription pricing)
    const subtotal = items.reduce((sum, item) => {
      if (item.variantId) {
        const variant = variantMap.get(item.variantId)!;
        return sum + variant.price * item.quantity;
      }
      const product = productMap.get(item.productId)!;
      let unitPrice: number;
      if (item.purchaseType === "subscription") {
        if (item.billingCycle === "annual") {
          unitPrice = getAnnualPrice(product.price);
        } else {
          unitPrice = getSubscriptionPrice(product.price, item.deliveryFrequencyWeeks);
        }
      } else {
        unitPrice = product.price;
      }
      return sum + unitPrice * item.quantity;
    }, 0);

    // Check if buyer was referred and this is their first order → 10% off
    let referralDiscount = 0;
    const cookieRefCode = request.cookies.get("pl_aff")?.value;
    if (cookieRefCode) {
      // Verify the code belongs to a basic referral (not an active affiliate)
      const { data: refProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", cookieRefCode.toUpperCase())
        .maybeSingle();

      if (refProfile) {
        // Check if buyer has any previous completed orders
        const { count: prevOrders } = await supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("guest_email", email)
          .in("status", ["processing", "shipped", "delivered"]);

        if (!prevOrders || prevOrders === 0) {
          referralDiscount = Math.round(subtotal * 0.10 * 100) / 100;
        }
      }
    }

    // Use tiered shipping: free for subscriptions, free for $200+, $9.95 for $100-199, $12.95 under $100
    const hasSubItems = items.some((i) => i.purchaseType === "subscription");
    const shippingCost = calculateShipping(subtotal, hasSubItems);
    const cycleManagementFee = cycleManagement ? 14.99 : 0;
    const referralCreditApplied = Math.min(applyReferralCredits, subtotal + cycleManagementFee - referralDiscount);
    const taxableSubtotal = subtotal + cycleManagementFee - referralDiscount - referralCreditApplied;
    const tax = Math.round(taxableSubtotal * TAX_RATE * 100) / 100;
    const total = Math.round((taxableSubtotal + shippingCost + tax) * 100) / 100;

    // Enforce $50 minimum order
    if (subtotal < 50) {
      return NextResponse.json(
        { error: "Minimum order is $50. Please add more items to your cart." },
        { status: 400 }
      );
    }

    const orderNumber = generateOrderNumber();

    // Create order in database first
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        guest_email: email,
        status: "pending",
        subtotal,
        discount_amount: referralDiscount > 0 ? referralDiscount : 0,
        discount_code: referralDiscount > 0 ? `REF-${cookieRefCode?.toUpperCase()}` : null,
        shipping_cost: shippingCost,
        tax,
        total,
        currency: "USD",
        shipping_name: shipping.fullName,
        shipping_line1: shipping.line1,
        shipping_line2: shipping.line2,
        shipping_city: shipping.city,
        shipping_province: shipping.province,
        shipping_postal: shipping.postalCode,
        shipping_country: shipping.country,
        payment_method: paymentMethod,
        research_disclaimer_accepted: researchDisclaimerAccepted,
        age_verified: ageVerified,
        terms_accepted: termsAccepted,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      log.error("Failed to create order", { error: orderError?.message, email });
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    // Create order items (use subscription price where applicable)
    const orderItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const variant = item.variantId ? variantMap.get(item.variantId) : null;
      const unitPrice = variant
        ? variant.price
        : item.purchaseType === "subscription"
          ? (item.billingCycle === "annual"
            ? getAnnualPrice(product.price)
            : getSubscriptionPrice(product.price, item.deliveryFrequencyWeeks))
          : product.price;
      return {
        order_id: order.id,
        product_id: item.productId,
        variant_id: item.variantId ?? null,
        product_name: product.name,
        variant_size: variant?.size ?? null,
        quantity: item.quantity,
        unit_price: unitPrice,
        purchase_type: item.purchaseType,
      };
    });

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      log.error("Failed to create order items", { orderId: order.id, error: itemsError.message });
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order items" },
        { status: 500 }
      );
    }

    // Create subscription records if there are subscription items
    const subscriptionItems = items.filter((i) => i.purchaseType === "subscription");
    if (subscriptionItems.length > 0) {
      // Determine delivery frequency (use the max from cart items)
      const deliveryWeeks = Math.max(...subscriptionItems.map((i) => i.deliveryFrequencyWeeks ?? 4));
      const nextDelivery = new Date();
      nextDelivery.setDate(nextDelivery.getDate() + deliveryWeeks * 7);

      const { data: subscription, error: subError } = await supabase
        .from("subscriptions")
        .insert({
          user_id: null,
          status: "active",
          plan_name: `Custom Stack (${subscriptionItems.length} items)`,
          delivery_frequency_weeks: deliveryWeeks,
          next_delivery_date: nextDelivery.toISOString(),
          cycle_management: cycleManagement,
          cycle_phase: cycleManagement ? "active" : null,
          cycle_week: cycleManagement ? 1 : null,
        })
        .select("id")
        .single();

      if (subscription && !subError) {
        // Create subscription_items
        const subItemRows = subscriptionItems.map((item) => ({
          subscription_id: subscription.id,
          product_id: item.productId,
          variant_id: item.variantId ?? null,
          quantity: item.quantity,
        }));

        await supabase.from("subscription_items").insert(subItemRows);

        // Link subscription to order
        await supabase.from("orders").update({ user_id: null }).eq("id", order.id);

        log.info("Subscription created", { subscriptionId: subscription.id, orderId: order.id, items: subItemRows.length });
      } else if (subError) {
        // Non-fatal: log but don't fail the order
        log.warn("Failed to create subscription record", { orderId: order.id, error: subError.message });
      }
    }

    // Affiliate tracking: record conversion if affiliate code is present
    let affiliateDiscountApplied = false;
    if (affiliateCode) {
      const { data: affiliate } = await supabase
        .from("affiliates")
        .select("id, commission_rate_first, commission_rate_recurring, status")
        .eq("affiliate_code", affiliateCode.toUpperCase())
        .eq("status", "active")
        .maybeSingle();

      if (affiliate) {
        // Check if customer has previous orders (to determine first vs recurring)
        const { count: previousOrders } = await supabase
          .from("orders")
          .select("id", { count: "exact", head: true })
          .eq("guest_email", email)
          .neq("id", order.id)
          .in("status", ["processing", "shipped", "delivered"]);

        const isFirstOrder = !previousOrders || previousOrders === 0;
        const commissionRate = isFirstOrder
          ? Number(affiliate.commission_rate_first)
          : Number(affiliate.commission_rate_recurring);
        const commissionAmount = Math.round(subtotal * (commissionRate / 100) * 100) / 100;

        // Create conversion record
        await supabase.from("affiliate_conversions").insert({
          affiliate_id: affiliate.id,
          order_id: order.id,
          customer_user_id: null,
          order_total: subtotal,
          commission_rate: commissionRate,
          commission_amount: commissionAmount,
          is_first_order: isFirstOrder,
        });

        // Update affiliate stats
        const { data: currentAff } = await supabase
          .from("affiliates")
          .select("total_conversions, total_earnings, pending_balance")
          .eq("id", affiliate.id)
          .single();

        if (currentAff) {
          await supabase
            .from("affiliates")
            .update({
              total_conversions: (currentAff.total_conversions || 0) + 1,
              total_earnings: Number(currentAff.total_earnings || 0) + commissionAmount,
              pending_balance: Number(currentAff.pending_balance || 0) + commissionAmount,
            })
            .eq("id", affiliate.id);
        }

        // Store affiliate info on order
        await supabase
          .from("orders")
          .update({
            affiliate_id: affiliate.id,
            affiliate_code: affiliateCode.toUpperCase(),
          })
          .eq("id", order.id);

        affiliateDiscountApplied = isFirstOrder;

        log.info("Affiliate conversion recorded", {
          orderId: order.id,
          affiliateId: affiliate.id,
          commissionRate,
          commissionAmount,
          isFirstOrder,
        });
      }
    }

    // Basic referral credit: if buyer was referred, give referrer 10% of order as store credit (max $25)
    if (!affiliateDiscountApplied) {
      try {
        // Check if this buyer has a pending referral
        const { data: referral } = await supabase
          .from("referrals")
          .select("id, referrer_user_id, status")
          .eq("referral_code", (affiliateCode || "").toUpperCase())
          .eq("status", "pending")
          .maybeSingle();

        // Also check by referred_by_code on the buyer's profile
        const { data: buyerProfile } = !referral
          ? await supabase
              .from("profiles")
              .select("referred_by_code")
              .eq("id", (await supabase.auth.getUser()).data.user?.id || "")
              .maybeSingle()
          : { data: null };

        const refCode = referral ? null : buyerProfile?.referred_by_code;
        const matchedReferral = referral
          ? referral
          : refCode
            ? (await supabase
                .from("referrals")
                .select("id, referrer_user_id, status")
                .eq("referral_code", refCode)
                .eq("status", "pending")
                .maybeSingle()).data
            : null;

        if (matchedReferral) {
          // 10% of order subtotal, capped at $25
          const creditAmount = Math.min(Math.round(subtotal * 0.10 * 100) / 100, 25);

          // Complete the referral and record credit amount
          await supabase
            .from("referrals")
            .update({
              status: "completed",
              completed_at: new Date().toISOString(),
              credit_amount: creditAmount,
            })
            .eq("id", matchedReferral.id);

          // Add store credit to referrer's balance
          const { data: referrerProfile } = await supabase
            .from("profiles")
            .select("referral_credits_balance")
            .eq("id", matchedReferral.referrer_user_id)
            .single();

          if (referrerProfile) {
            await supabase
              .from("profiles")
              .update({
                referral_credits_balance: Number(referrerProfile.referral_credits_balance || 0) + creditAmount,
              })
              .eq("id", matchedReferral.referrer_user_id);
          }

          log.info("Referral completed — store credit awarded", {
            referralId: matchedReferral.id,
            referrerId: matchedReferral.referrer_user_id,
            orderId: order.id,
            creditAmount,
          });
        }
      } catch (refErr) {
        log.warn("Referral credit processing error", { error: String(refErr) });
      }
    }

    // Create payment session based on selected method
    let clientSecret: string | null = null;

    if (paymentMethod === "stripe") {
      try {
        const paymentIntent = await getStripe().paymentIntents.create({
          amount: Math.round(total * 100),
          currency: "usd",
          automatic_payment_methods: { enabled: true },
          receipt_email: email,
          shipping: {
            name: shipping.fullName,
            address: {
              line1: shipping.line1,
              line2: shipping.line2 || undefined,
              city: shipping.city,
              state: shipping.province,
              postal_code: shipping.postalCode,
              country: shipping.country,
            },
          },
          metadata: { orderNumber, email, orderId: order.id },
        });

        clientSecret = paymentIntent.client_secret;

        // Link PaymentIntent to order
        await supabase
          .from("orders")
          .update({ stripe_payment_intent_id: paymentIntent.id })
          .eq("id", order.id);
      } catch (stripeErr) {
        log.error("Stripe PaymentIntent error", { orderId: order.id, error: String(stripeErr) });
        await supabase.from("orders").delete().eq("id", order.id);
        return NextResponse.json(
          { error: "Failed to initialize payment. Please try again." },
          { status: 500 }
        );
      }
    }
    // For PayPal: order is created with "pending" status.
    // Frontend will call /api/paypal/create-order with the orderId,
    // then redirect to PayPal, then call /api/paypal/capture-order.

    // Create account if opted in (uses signUp to trigger verification email)
    let accountCreated = false;
    if (createAccount && password) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

      // Use a separate Supabase client for signUp (not admin) so it triggers confirmation email
      const { createClient } = await import("@supabase/supabase-js");
      const signupClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { data: signupData, error: signupError } = await signupClient.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: shipping.fullName },
          emailRedirectTo: `${siteUrl}/api/auth/callback`,
        },
      });

      if (signupError) {
        log.warn("Account creation failed", { email, error: signupError.message });
      }

      if (signupData?.user) {
        accountCreated = true;
        // Link previous paid guest orders to the new account (not pending ones)
        await supabase
          .from("orders")
          .update({ user_id: signupData.user.id })
          .eq("guest_email", email)
          .neq("status", "pending");
      }
    }

    // Deduct referral credits if applied
    if (referralCreditApplied > 0) {
      // Try to find the user by email and deduct credits
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, referral_credits_balance")
        .eq("email", email)
        .single();

      if (profile && profile.referral_credits_balance >= referralCreditApplied) {
        await supabase
          .from("profiles")
          .update({
            referral_credits_balance: Math.max(0, profile.referral_credits_balance - referralCreditApplied),
          })
          .eq("id", profile.id);

        log.info("Referral credits applied", { email, amount: referralCreditApplied });
      }
    }

    return NextResponse.json({
      orderId: order.id,
      orderNumber,
      clientSecret,
      accountCreated,
      referralDiscount,
    });
  } catch (err) {
    log.error("Checkout error", { error: String(err) });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
*/
