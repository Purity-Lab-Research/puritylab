/**
 * Google Analytics 4 e-commerce event helpers.
 * Fires GA4 standard e-commerce events for product views,
 * add-to-cart, checkout, and purchases.
 *
 * Setup: Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your env vars.
 * All events respect the user's cookie consent preferences.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gtag(...args: any[]) {
  if (typeof window === "undefined") return;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.gtag === "function") {
    w.gtag(...args);
  }
}

/** Fire-and-forget beacon to our own API for admin dashboard */
function beacon(eventName: string, properties?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    const payload = JSON.stringify({
      event_name: eventName,
      properties: properties ?? {},
      page_path: window.location.pathname,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track/event", new Blob([payload], { type: "application/json" }));
    } else {
      fetch("/api/track/event", { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  } catch { /* ignore */ }
}

interface GAItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price: number;
  quantity?: number;
  item_variant?: string;
}

/** Generic event tracker */
export function trackEvent(action: string, params?: Record<string, unknown>) {
  gtag("event", action, params);
  beacon(action, params);
}

/** Fired when a user views a product detail page */
export function trackViewItem(item: GAItem) {
  gtag("event", "view_item", {
    currency: "USD",
    value: item.price,
    items: [item],
  });
  beacon("view_item", { item_id: item.item_id, item_name: item.item_name, price: item.price });
}

/** Fired when a user adds a product to the cart */
export function trackAddToCart(item: GAItem) {
  gtag("event", "add_to_cart", {
    currency: "USD",
    value: item.price * (item.quantity ?? 1),
    items: [item],
  });
  beacon("add_to_cart", { item_id: item.item_id, item_name: item.item_name, price: item.price, quantity: item.quantity ?? 1 });
}

/** Fired when a user removes a product from the cart */
export function trackRemoveFromCart(item: GAItem) {
  gtag("event", "remove_from_cart", {
    currency: "USD",
    value: item.price * (item.quantity ?? 1),
    items: [item],
  });
  beacon("remove_from_cart", { item_id: item.item_id, item_name: item.item_name, price: item.price, quantity: item.quantity ?? 1 });
}

/** Fired when a user views the cart */
export function trackViewCart(items: GAItem[], total: number) {
  gtag("event", "view_cart", {
    currency: "USD",
    value: total,
    items,
  });
  beacon("view_cart", { item_count: items.length, total });
}

/** Fired when a user starts checkout */
export function trackBeginCheckout(items: GAItem[], total: number) {
  gtag("event", "begin_checkout", {
    currency: "USD",
    value: total,
    items,
  });
  beacon("begin_checkout", { item_count: items.length, total });
}

/** Fired when a user adds shipping info */
export function trackAddShippingInfo(items: GAItem[], total: number, shippingTier: string) {
  gtag("event", "add_shipping_info", {
    currency: "USD",
    value: total,
    shipping_tier: shippingTier,
    items,
  });
  beacon("add_shipping_info", { total, shipping_tier: shippingTier });
}

/** Fired when a user adds payment info */
export function trackAddPaymentInfo(items: GAItem[], total: number, paymentType: string) {
  gtag("event", "add_payment_info", {
    currency: "USD",
    value: total,
    payment_type: paymentType,
    items,
  });
  beacon("add_payment_info", { total, payment_type: paymentType });
}

/** Fired when a user completes a purchase */
export function trackPurchase(
  transactionId: string,
  items: GAItem[],
  total: number,
  shipping: number,
  tax: number
) {
  gtag("event", "purchase", {
    transaction_id: transactionId,
    currency: "USD",
    value: total,
    shipping,
    tax,
    items,
  });
  beacon("purchase", { transaction_id: transactionId, total, shipping, tax, item_count: items.length });
}

/** Fired when a user searches for products */
export function trackSearch(searchTerm: string) {
  gtag("event", "search", {
    search_term: searchTerm,
  });
  beacon("search", { search_term: searchTerm });
}

/** Fired when a user signs up */
export function trackSignUp(method: string) {
  gtag("event", "sign_up", {
    method,
  });
  beacon("sign_up", { method });
}

/** Fired when a user logs in */
export function trackLogin(method: string) {
  gtag("event", "login", {
    method,
  });
  beacon("login", { method });
}
