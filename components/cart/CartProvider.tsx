"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { CartContext, type CartContextType } from "@/hooks/useCart";
import type { CartItem } from "@/lib/types";

const CART_KEY = "puritylab_cart";

function cartKey(item: { productId: string; variantId: string | null; purchaseType: string }) {
  return `${item.productId}:${item.variantId ?? "base"}:${item.purchaseType}`;
}

/** Effective price for a cart item based on purchase type */
function itemPrice(item: CartItem): number {
  if (item.purchaseType === "subscription" && item.subscriptionPrice != null) {
    return item.subscriptionPrice;
  }
  return item.price;
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
        // Migrate old cart items that lack new fields
        const migrated = parsed.map((i) => ({
          ...i,
          variantId: i.variantId ?? null,
          subscriptionPrice: i.subscriptionPrice ?? null,
          deliveryFrequencyWeeks: i.deliveryFrequencyWeeks ?? 4,
          purchaseType: i.purchaseType ?? "one-time",
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
        quantity: newItem.quantity || 1,
      };
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
      setItems((prev) => prev.filter((i) => cartKey(i) !== key));
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

  // Subtotal uses subscription price for subscription items
  const subtotal = useMemo(
    () => Math.round(items.reduce((sum, i) => sum + itemPrice(i) * i.quantity, 0) * 100) / 100,
    [items]
  );

  // Savings: difference between all-one-time and actual mixed pricing
  const savings = useMemo(() => {
    const oneTimeTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const actualTotal = items.reduce((sum, i) => sum + itemPrice(i) * i.quantity, 0);
    return Math.round((oneTimeTotal - actualTotal) * 100) / 100;
  }, [items]);

  const hasSubscriptionItems = useMemo(
    () => items.some((i) => i.purchaseType === "subscription"),
    [items]
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
      hasSubscriptionItems,
      isOpen,
      openCart,
      closeCart,
    }),
    [items, addItem, removeItem, updateQuantity, clearCart, itemCount, subtotal, savings, hasSubscriptionItems, isOpen, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
