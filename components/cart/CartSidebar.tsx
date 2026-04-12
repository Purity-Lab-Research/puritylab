"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Minus, Plus, Trash2, ShoppingBag, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, getSubscriptionPrice, getFrequencyDiscount, getAnnualPrice, freeShippingRemaining, freeShippingProgress } from "@/lib/utils";
import { trackViewCart } from "@/lib/analytics";
import type { Product } from "@/lib/types";
import WaitlistForm from "@/components/prelaunch/WaitlistForm";

type Tab = "cart" | "wishlist";

function itemDisplayPrice(item: { purchaseType: string; subscriptionPrice: number | null; price: number; billingCycle?: string; deliveryFrequencyWeeks?: number }): number {
  if (item.purchaseType === "subscription") {
    if (item.billingCycle === "annual") {
      return getAnnualPrice(item.price);
    }
    return getSubscriptionPrice(item.price, item.deliveryFrequencyWeeks ?? 4);
  }
  return item.price;
}

const ADD_ON_SUGGESTIONS: Record<string, string[]> = {
  tissue_research: ["ghk-cu-5mg", "nad-plus-500mg"],
  metabolic_research: ["5-amino-1mq-50mg", "cjc-ipa-blend-5-5mg"],
  gh_research: ["mots-c-10mg", "sermorelin-5mg"],
};

const SUPPLY_SLUGS = ["bac-water-10ml", "syringes"];

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    addItem,
    subtotal,
    savings,
    shippingCost,
    hasSubscriptionItems,
    itemCount,
  } = useCart();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const [tab, setTab] = useState<Tab>("cart");
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Fetch wishlist products when tab switches to wishlist
  useEffect(() => {
    if (tab !== "wishlist" || wishlistIds.length === 0) {
      setWishlistProducts([]);
      return;
    }
    setLoadingWishlist(true);
    const supabase = createClient();
    supabase
      .from("products")
      .select("*, category:categories(*)")
      .in("id", wishlistIds)
      .eq("active", true)
      .then(({ data }) => {
        const map = new Map((data ?? []).map((p) => [p.id, p as Product]));
        setWishlistProducts(
          wishlistIds.map((id) => map.get(id)).filter((p): p is Product => !!p)
        );
        setLoadingWishlist(false);
      });
  }, [tab, wishlistIds]);

  // Reset to cart tab when sidebar opens + track view_cart
  useEffect(() => {
    if (isOpen) {
      setTab("cart");
      if (items.length > 0) {
        trackViewCart(
          items.map((i) => ({
            item_id: i.productId,
            item_name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          subtotal
        );
      }
    }
  }, [isOpen, items, subtotal]);

  // Get max delivery frequency from subscription items
  const subFrequency = items
    .filter((i) => i.purchaseType === "subscription")
    .reduce((max, i) => Math.max(max, i.deliveryFrequencyWeeks ?? 4), 4);

  if (!isOpen) return null;

  return (
    <div data-cart-sidebar className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={closeCart}
      />

      <aside className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white flex flex-col shadow-2xl z-10">
        {/* Header with tabs */}
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-6 pt-4 pb-0">
            <div className="flex gap-0">
              <button
                onClick={() => setTab("cart")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  tab === "cart"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                Cart {itemCount > 0 && `(${itemCount})`}
              </button>
              <button
                onClick={() => setTab("wishlist")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
                  tab === "wishlist"
                    ? "border-red-500 text-red-500"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <Heart className="h-4 w-4" />
                Wishlist {wishlistIds.length > 0 && `(${wishlistIds.length})`}
              </button>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Tab - Pre-launch state */}
        {tab === "cart" && (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <ShoppingBag className="w-14 h-14 text-gray-300" />
            <div>
              <p className="text-lg font-bold text-[#111111]">We&apos;re not accepting orders yet</p>
              <p className="text-sm text-[#6B7280] mt-2 leading-relaxed">
                Our first batch is completing independent testing. Join the waitlist to be first in line.
              </p>
            </div>
            <WaitlistForm
              buttonLabel="Notify Me"
              successMessage="You're on the list. We'll be in touch soon."
              className="w-full max-w-xs"
            />
          </div>
        )}

        {/* Wishlist Tab */}
        {tab === "wishlist" && (
          <>
            {wishlistIds.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <Heart className="w-14 h-14 text-gray-300" />
                <p className="text-gray-500">Your wishlist is empty</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-block rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-all"
                >
                  Browse Products
                </Link>
              </div>
            ) : loadingWishlist ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                Loading...
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto divide-y divide-gray-100 px-6">
                {wishlistProducts.map((product) => {
                  const image = product.images?.[0] ?? null;
                  return (
                    <li key={product.id} className="flex gap-4 py-4">
                      <Link
                        href={`/shop/${product.slug}`}
                        onClick={closeCart}
                        className="relative w-16 h-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden"
                      >
                        {image ? (
                          <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="object-contain p-1"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-5 h-5" />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/shop/${product.slug}`}
                          onClick={closeCart}
                          className="text-sm font-semibold text-gray-900 truncate block hover:text-secondary transition-colors"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {product.size} &middot; {formatPrice(product.price)}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <Link
                            href={`/shop/${product.slug}`}
                            onClick={closeCart}
                            className="text-xs font-semibold text-secondary hover:underline"
                          >
                            View Details
                          </Link>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="text-xs font-semibold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </aside>
    </div>
  );
}

/** Contextual add-on suggestions for subscription carts */
function CartAddOns() {
  const { items, addItem } = useCart();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  const cartSlugs = items.map((i) => i.slug);
  const cartGoals = items.map((i) => (i as unknown as { goal_category?: string }).goal_category).filter(Boolean);

  // Determine which slugs to suggest
  const targetSlugs = useMemo(() => {
    const slugs = new Set<string>();

    // Always suggest supplies if not in cart
    for (const s of SUPPLY_SLUGS) {
      if (!cartSlugs.includes(s)) slugs.add(s);
    }

    // Goal-based suggestions
    for (const goal of cartGoals) {
      const goalSuggestions = ADD_ON_SUGGESTIONS[goal as string];
      if (goalSuggestions) {
        for (const s of goalSuggestions) {
          if (!cartSlugs.includes(s)) slugs.add(s);
        }
      }
    }

    // Cap at 3
    return Array.from(slugs).slice(0, 3);
  }, [cartSlugs, cartGoals]);

  useEffect(() => {
    if (targetSlugs.length === 0 || loaded) return;
    const supabase = createClient();
    supabase
      .from("products")
      .select("id, name, slug, size, price, subscription_price, goal_category, images")
      .in("slug", targetSlugs)
      .eq("active", true)
      .then(({ data }) => {
        if (data) setSuggestions(data as Product[]);
        setLoaded(true);
      });
  }, [targetSlugs, loaded]);

  if (suggestions.length === 0) return null;

  const subFreq = items
    .filter((i) => i.purchaseType === "subscription")
    .reduce((max, i) => Math.max(max, i.deliveryFrequencyWeeks ?? 4), 4);

  return (
    <div className="border-t border-border pt-3 pb-1">
      <p className="text-xs font-semibold text-primary mb-2">Related compounds</p>
      <div className="space-y-2">
        {suggestions.slice(0, 3).map((product) => {
          const subPrice = getSubscriptionPrice(product.price, subFreq);
          return (
            <div key={product.id} className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{product.name}</p>
                <p className="text-[10px] text-text-secondary">{formatPrice(subPrice)}/delivery</p>
              </div>
              <button
                onClick={() => {
                  addItem({
                    productId: product.id,
                    variantId: null,
                    name: product.name,
                    slug: product.slug,
                    price: product.price,
                    subscriptionPrice: subPrice,
                    size: product.size,
                    image: product.images?.[0] ?? null,
                    purchaseType: "subscription",
                    deliveryFrequencyWeeks: subFreq,
                    billingCycle: "monthly",
                  });
                }}
                className="text-[10px] font-semibold text-secondary hover:underline flex-shrink-0 ml-2"
              >
                + Add
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
