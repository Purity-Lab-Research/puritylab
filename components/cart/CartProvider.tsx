"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { CartContext, type CartContextType } from "@/hooks/useCart";
import { getSubscriptionPrice, getAnnualPrice, calculateShipping } from "@/lib/utils";
import { trackAddToCart, trackRemoveFromCart } from "@/lib/analytics";
import type { CartItem } from "@/lib/types";

const CART_KEY = "puritylab_cart";

function cartKey(item: { productId: string; variantId: string | null; purchaseType: string }) {
  return `${item.productId}:${item.variantId ?? "base"}:${item.purchaseType}`;
}

/** Effective per-delivery price for a cart item */
function itemPrice(item: CartItem): number {
  if (item.purchaseType === "subscription") {
    if (item.billingCycle === "annual") {
      return getAnnualPrice(item.price) / item.quantity;
    }
    return getSubscriptionPrice(item.price, item.deliveryFrequencyWeeks);
  }
  return item.price;
}

/** Total cost for a cart item (all units) */
function itemTotal(item: CartItem): number {
  if (item.purchaseType === "subscription") {
    if (item.billingCycle === "annual") {
      return getAnnualPrice(item.price) * item.quantity;
    }
    return getSubscriptionPrice(item.price, item.deliveryFrequencyWeeks) * item.quantity;
  }
  return item.price * item.quantity;
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[];
        const migrated = parsed.map((i) => ({
          ...i,
          variantId: i.variantId ?? null,
          subscriptionPrice: i.subscriptionPrice ?? null,
          deliveryFrequencyWeeks: i.deliveryFrequencyWeeks ?? 4,
          purchaseType: i.purchaseType ?? "one-time",
          billingCycle: i.billingCycle ?? "monthly",
        }));
        setItems(migrated);
      } catch {
        localStorage.removeItem(CART_KEY);
      }
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = useCallback(
    (newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      const key = cartKey(newItem);
      const full: CartItem = {
        ...newItem,
        variantId: newItem.variantId ?? null,
        subscriptionPrice: newItem.subscriptionPrice ?? null,
        deliveryFrequencyWeeks: newItem.deliveryFrequencyWeeks ?? 4,
        billingCycle: newItem.billingCycle ?? "monthly",
        quantity: newItem.quantity || 1,
      };
      trackAddToCart({
        item_id: newItem.productId,
        item_name: newItem.name,
        price: newItem.price,
        quantity: newItem.quantity || 1,
        item_variant: newItem.size ?? undefined,
      });
      setItems((prev) => {
        const existing = prev.find((i) => cartKey(i) === key);
        if (existing) {
          return prev.map((i) =>
            cartKey(i) === key
              ? { ...i, quantity: Math.min(i.quantity + (newItem.quantity || 1), 20) }
              : i
          );
        }
        return [...prev, full];
      });
      setIsOpen(true);
    },
    []
  );

  const removeItem = useCallback(
    (productId: string, variantId: string | null, purchaseType: string) => {
      const key = cartKey({ productId, variantId, purchaseType });
      setItems((prev) => {
        const removed = prev.find((i) => cartKey(i) === key);
        if (removed) {
          trackRemoveFromCart({
            item_id: removed.productId,
            item_name: removed.name,
            price: removed.price,
            quantity: removed.quantity,
          });
        }
        return prev.filter((i) => cartKey(i) !== key);
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, variantId: string | null, purchaseType: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, variantId, purchaseType);
        return;
      }
      const key = cartKey({ productId, variantId, purchaseType });
      setItems((prev) =>
        prev.map((i) =>
          cartKey(i) === key ? { ...i, quantity: Math.min(quantity, 20) } : i
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    setIsOpen(false);
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => Math.round(items.reduce((sum, i) => sum + itemTotal(i), 0) * 100) / 100,
    [items]
  );

  const savings = useMemo(() => {
    const oneTimeTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const actualTotal = items.reduce((sum, i) => sum + itemTotal(i), 0);
    return Math.round((oneTimeTotal - actualTotal) * 100) / 100;
  }, [items]);

  const hasSubscriptionItems = useMemo(
    () => items.some((i) => i.purchaseType === "subscription"),
    [items]
  );

  const shippingCost = useMemo(
    () => calculateShipping(subtotal, hasSubscriptionItems),
    [subtotal, hasSubscriptionItems]
  );

  const value: CartContextType = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      itemCount,
      subtotal,
      savings,
      shippingCost,
      hasSubscriptionItems,
      isOpen,
      openCart,
      closeCart,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, savings, shippingCost, hasSubscriptionItems, isOpen, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
