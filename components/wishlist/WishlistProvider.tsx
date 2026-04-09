"use client";

import { useState, useEffect, useCallback, useMemo, type ReactNode } from "react";
import { WishlistContext, type WishlistContextType } from "@/hooks/useWishlist";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "puritylab_wishlist";

function readFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export default function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setWishlistIds(readFromStorage());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
      } catch {
        // storage full or unavailable
      }
    }
  }, [wishlistIds, mounted]);

  const toggleWishlist = useCallback((productId: string) => {
    setWishlistIds((prev) => {
      const removing = prev.includes(productId);
      trackEvent(removing ? "remove_from_wishlist" : "add_to_wishlist", { item_id: productId });
      return removing
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
    });
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const value: WishlistContextType = useMemo(
    () => ({ wishlistIds, toggleWishlist, isWishlisted }),
    [wishlistIds, toggleWishlist, isWishlisted]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}
