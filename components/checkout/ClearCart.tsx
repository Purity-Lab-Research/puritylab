"use client";

import { useEffect } from "react";
import { useCart } from "@/hooks/useCart";
import { trackPurchase } from "@/lib/analytics";

export default function ClearCart({ orderId, orderTotal, orderShipping, orderTax, orderItems }: {
  orderId?: string;
  orderTotal?: number;
  orderShipping?: number;
  orderTax?: number;
  orderItems?: { item_id: string; item_name: string; price: number; quantity: number }[];
}) {
  const { clearCart } = useCart();

  useEffect(() => {
    if (orderId && orderItems) {
      trackPurchase(orderId, orderItems, orderTotal ?? 0, orderShipping ?? 0, orderTax ?? 0);
    }
    clearCart();
    try { sessionStorage.removeItem("puritylab_checkout"); } catch { /* ignore */ }
  }, [clearCart, orderId, orderTotal, orderShipping, orderTax, orderItems]);

  return null;
}
