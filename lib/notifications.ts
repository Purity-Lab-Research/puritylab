import { createAdminClient } from "@/lib/supabase/admin";

export type NotificationType =
  | "new_order"
  | "needs_shipping"
  | "order_cancelled"
  | "new_review"
  | "low_stock"
  | "out_of_stock"
  | "new_affiliate_app"
  | "new_customer"
  | "inbox_message"
  | "email_bounce"
  | "back_in_stock_request"
  | "subscription_cancelled"
  | "info";

interface CreateNotificationParams {
  type: NotificationType;
  title: string;
  description?: string;
  href?: string;
  entity_type?: string;
  entity_id?: string;
}

/**
 * Create a notification (upserts on entity_type+entity_id to prevent duplicates).
 */
export async function createNotification(params: CreateNotificationParams) {
  const db = createAdminClient();

  // If entity_id is provided, use upsert to avoid duplicates
  if (params.entity_id && params.entity_type) {
    const { error } = await db
      .from("admin_notifications")
      .upsert(
        {
          type: params.type,
          title: params.title,
          description: params.description ?? null,
          href: params.href ?? null,
          entity_type: params.entity_type,
          entity_id: params.entity_id,
          is_read: false,
          dismissed: false,
        },
        { onConflict: "type,entity_type,entity_id" }
      );

    if (error) {
      console.error("Failed to create notification:", error.message);
    }
    return;
  }

  // No entity dedup — just insert
  const { error } = await db.from("admin_notifications").insert({
    type: params.type,
    title: params.title,
    description: params.description ?? null,
    href: params.href ?? null,
    entity_type: params.entity_type ?? null,
    entity_id: params.entity_id ?? null,
  });

  if (error) {
    console.error("Failed to create notification:", error.message);
  }
}

/**
 * Scan all data sources and generate notifications for new items.
 * Called by the notifications API on each poll.
 */
export async function scanAndGenerateNotifications() {
  const db = createAdminClient();

  // Run all scans in parallel
  await Promise.allSettled([
    scanNewOrders(db),
    scanNeedsShipping(db),
    scanCancelledOrders(db),
    scanNewReviews(db),
    scanLowStock(db),
    scanNewAffiliateApps(db),
    scanNewCustomers(db),
    scanUnreadInbox(db),
    scanEmailBounces(db),
    scanBackInStockRequests(db),
  ]);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = ReturnType<typeof createAdminClient>;

async function scanNewOrders(db: DB) {
  // Orders from the last 24 hours
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: orders } = await db
    .from("orders")
    .select("id, order_number, total, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  for (const order of orders ?? []) {
    await createNotification({
      type: "new_order",
      title: `New order #${order.order_number ?? order.id.slice(0, 8)}`,
      description: `$${Number(order.total).toFixed(2)} — ${timeAgo(order.created_at)}`,
      href: "/admin/orders",
      entity_type: "order",
      entity_id: order.id,
    });
  }
}

async function scanNeedsShipping(db: DB) {
  const { data: orders } = await db
    .from("orders")
    .select("id, order_number, created_at")
    .eq("status", "processing")
    .is("tracking_number", null);

  for (const order of orders ?? []) {
    await createNotification({
      type: "needs_shipping",
      title: `Order #${order.order_number ?? order.id.slice(0, 8)} needs shipping`,
      description: `Processing since ${timeAgo(order.created_at)}`,
      href: "/admin/orders",
      entity_type: "order_shipping",
      entity_id: order.id,
    });
  }
}

async function scanCancelledOrders(db: DB) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: orders } = await db
    .from("orders")
    .select("id, order_number, total, cancelled_at")
    .eq("status", "cancelled")
    .gte("cancelled_at", since);

  for (const order of orders ?? []) {
    await createNotification({
      type: "order_cancelled",
      title: `Order #${order.order_number ?? order.id.slice(0, 8)} cancelled`,
      description: `$${Number(order.total).toFixed(2)}`,
      href: "/admin/orders",
      entity_type: "order_cancel",
      entity_id: order.id,
    });
  }
}

async function scanNewReviews(db: DB) {
  const { data: reviews } = await db
    .from("product_reviews")
    .select("id, author_name, rating, title, created_at, product:products(name)")
    .eq("approved", false)
    .order("created_at", { ascending: false })
    .limit(20);

  for (const review of reviews ?? []) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const productName = (review.product as any)?.name ?? "a product";
    await createNotification({
      type: "new_review",
      title: `New review from ${review.author_name ?? "Anonymous"}`,
      description: `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)} on ${productName}`,
      href: "/admin/reviews",
      entity_type: "review",
      entity_id: review.id,
    });
  }
}

async function scanLowStock(db: DB) {
  // Get all products with stock info, filter client-side (Supabase can't compare two columns)
  const { data: products } = await db
    .from("products")
    .select("id, name, stock_quantity, low_stock_threshold")
    .gt("stock_quantity", 0);

  const lowStock = (products ?? []).filter(
    (p) => p.stock_quantity <= (p.low_stock_threshold ?? 5)
  );

  for (const product of lowStock) {
    await createNotification({
      type: "low_stock",
      title: `${product.name} is low on stock`,
      description: `${product.stock_quantity} units remaining`,
      href: "/admin/inventory",
      entity_type: "product_low_stock",
      entity_id: product.id,
    });
  }

  // Out of stock
  const { data: oos } = await db
    .from("products")
    .select("id, name")
    .eq("stock_quantity", 0);

  for (const product of oos ?? []) {
    await createNotification({
      type: "out_of_stock",
      title: `${product.name} is out of stock`,
      description: "0 units remaining — restock needed",
      href: "/admin/inventory",
      entity_type: "product_oos",
      entity_id: product.id,
    });
  }
}

async function scanNewAffiliateApps(db: DB) {
  const { data: apps } = await db
    .from("affiliate_applications")
    .select("id, name, email, created_at")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  for (const app of apps ?? []) {
    await createNotification({
      type: "new_affiliate_app",
      title: `Affiliate application from ${app.name}`,
      description: `${app.email} — ${timeAgo(app.created_at)}`,
      href: "/admin/affiliates",
      entity_type: "affiliate_application",
      entity_id: app.id,
    });
  }
}

async function scanNewCustomers(db: DB) {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { data: profiles } = await db
    .from("profiles")
    .select("id, full_name, created_at")
    .eq("role", "customer")
    .gte("created_at", since)
    .order("created_at", { ascending: false });

  for (const profile of profiles ?? []) {
    await createNotification({
      type: "new_customer",
      title: `New customer: ${profile.full_name ?? "Unknown"}`,
      description: `Signed up ${timeAgo(profile.created_at)}`,
      href: "/admin/customers",
      entity_type: "customer",
      entity_id: profile.id,
    });
  }
}

async function scanUnreadInbox(db: DB) {
  const { data: messages } = await db
    .from("inbox_messages")
    .select("id, sender_name, sender_email, subject, created_at")
    .eq("direction", "inbound")
    .eq("is_read", false)
    .order("created_at", { ascending: false })
    .limit(20);

  for (const msg of messages ?? []) {
    await createNotification({
      type: "inbox_message",
      title: `Message from ${msg.sender_name ?? msg.sender_email}`,
      description: msg.subject ?? "No subject",
      href: "/admin/email",
      entity_type: "inbox_message",
      entity_id: msg.id,
    });
  }
}

async function scanEmailBounces(db: DB) {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
  const { data: bounces } = await db
    .from("email_events")
    .select("id, recipient_email, event_type, created_at")
    .in("event_type", ["bounced", "complained"])
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(10);

  for (const bounce of bounces ?? []) {
    await createNotification({
      type: "email_bounce",
      title: `Email ${bounce.event_type}: ${bounce.recipient_email}`,
      description: `${bounce.event_type === "bounced" ? "Bounced" : "Complaint"} — ${timeAgo(bounce.created_at)}`,
      href: "/admin/email",
      entity_type: "email_bounce",
      entity_id: bounce.id,
    });
  }
}

async function scanBackInStockRequests(db: DB) {
  const { data: requests } = await db
    .from("back_in_stock_requests")
    .select("id, email, product_name, created_at")
    .eq("notified", false)
    .order("created_at", { ascending: false })
    .limit(10);

  for (const req of requests ?? []) {
    await createNotification({
      type: "back_in_stock_request",
      title: `Back-in-stock request: ${req.product_name}`,
      description: `${req.email} wants to be notified`,
      href: "/admin/inventory",
      entity_type: "back_in_stock",
      entity_id: req.id,
    });
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
