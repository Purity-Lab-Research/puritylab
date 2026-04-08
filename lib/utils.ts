import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "USD"): string {
  const safe = isNaN(amount) ? 0 : amount;
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(safe);
  return `${formatted} ${currency}`;
}

export function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "JRT-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function calculateSavings(
  price: number,
  originalPrice: number | null
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Calculate the subscription price based on delivery frequency.
 * 4 weeks = 15% off, 6 weeks = 10% off, 8 weeks = 5% off.
 */
export function getSubscriptionPrice(price: number, frequencyWeeks: number = 4): number {
  if (!price || isNaN(price)) return 0;
  const discount = frequencyWeeks <= 4 ? 0.15 : frequencyWeeks <= 6 ? 0.10 : 0.05;
  return Math.round(price * (1 - discount) * 100) / 100;
}

/** Get the discount percentage for a delivery frequency tier. */
export function getFrequencyDiscount(frequencyWeeks: number): number {
  return frequencyWeeks <= 4 ? 15 : frequencyWeeks <= 6 ? 10 : 5;
}

/**
 * Calculate annual prepay price: 10 months at the 15% tier (2 months free).
 * Always uses 4-week frequency for annual plans.
 */
export function getAnnualPrice(price: number): number {
  return Math.round(getSubscriptionPrice(price, 4) * 10 * 100) / 100;
}

/** Effective monthly cost for annual billing. */
export function getAnnualMonthlyPrice(price: number): number {
  return Math.round((getAnnualPrice(price) / 12) * 100) / 100;
}

/**
 * Calculate shipping cost based on order subtotal and subscription status.
 * Subscriptions always ship free. Otherwise: $200+ free, $100-199 = $9.95, under $100 = $12.95.
 */
export function calculateShipping(subtotal: number, hasSubscription: boolean): number {
  if (hasSubscription) return 0;
  if (subtotal >= 200) return 0;
  if (subtotal >= 100) return 9.95;
  return 12.95;
}

/** Dollars remaining until the free shipping threshold. */
export function freeShippingRemaining(subtotal: number): number {
  return Math.max(0, 200 - subtotal);
}

/** Progress percentage toward the $200 free shipping threshold (capped at 100). */
export function freeShippingProgress(subtotal: number): number {
  return Math.min(100, (subtotal / 200) * 100);
}
