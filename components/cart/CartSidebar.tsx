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
  recovery: ["ghk-cu-5mg", "nad-plus-500mg"],
  fat_loss: ["5-amino-1mq-50mg", "cjc-ipa-blend-5-5mg"],
  performance: ["mots-c-10mg", "sermorelin-5mg"],
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

        {/* Cart Tab */}
        {tab === "cart" && (
          <>
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag className="w-14 h-14 text-gray-300" />
                <p className="text-gray-500">Your cart is empty</p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-block rounded-lg bg-primary px-7 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-all"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <ul className="flex-1 overflow-y-auto divide-y divide-gray-100 px-6">
                {items.map((item) => {
                  const key = `${item.productId}-${item.variantId ?? "base"}-${item.purchaseType}`;
                  const price = itemDisplayPrice(item);
                  return (
                    <li key={key} className="flex gap-4 py-5">
                      <div className="relative w-18 h-18 shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 flex flex-col gap-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{item.size}</span>
                          {item.purchaseType === "subscription" ? (
                            <span className="text-[10px] font-semibold text-secondary">
                              {item.billingCycle === "annual" ? "Annual" : "Subscribing"}
                            </span>
                          ) : (
                            <span className="text-[10px] text-text-secondary">
                              One-time
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-1">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.purchaseType,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-7 text-center text-sm font-medium text-gray-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.variantId,
                                  item.purchaseType,
                                  item.quantity + 1
                                )
                              }
                              className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                              {formatPrice(price * item.quantity)}
                            </span>
                            <button
                              onClick={() =>
                                removeItem(item.productId, item.variantId, item.purchaseType)
                              }
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {items.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-5 space-y-3">
                {/* Add-ons for subscription carts */}
                {hasSubscriptionItems && <CartAddOns />}

                {/* Affiliate discount notice */}
                {typeof document !== "undefined" && document.cookie.includes("pl_aff_active=1") && (
                  <div className="bg-[#10B981]/5 border border-[#10B981]/10 rounded-lg px-3 py-2">
                    <p className="text-xs font-semibold text-[#10B981]">
                      10% new customer discount applied at checkout
                    </p>
                  </div>
                )}

                {/* Subscription savings */}
                {hasSubscriptionItems && savings > 0 && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-success font-semibold">
                        Subscription savings
                      </span>
                      <span className="text-sm text-success font-semibold">
                        -{formatPrice(savings)}
                      </span>
                    </div>
                    {items.some((i) => i.purchaseType === "subscription" && i.billingCycle === "annual") ? (
                      <p className="text-[10px] text-text-secondary">Annual plan, billed once</p>
                    ) : (
                      <p className="text-[10px] text-text-secondary">
                        Every {subFrequency} weeks: {getFrequencyDiscount(subFrequency)}% off
                      </p>
                    )}
                  </div>
                )}

                {/* Free shipping progress */}
                {!hasSubscriptionItems && subtotal < 200 && subtotal > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-text-secondary">
                        Add {formatPrice(freeShippingRemaining(subtotal))} more for free shipping
                      </span>
                      <span className="text-text-secondary font-medium">
                        {Math.round(freeShippingProgress(subtotal))}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full transition-all duration-300"
                        style={{ width: `${freeShippingProgress(subtotal)}%` }}
                      />
                    </div>
                  </div>
                )}
                {hasSubscriptionItems && (
                  <p className="text-[10px] text-success font-semibold">Free shipping on all subscriptions</p>
                )}
                {!hasSubscriptionItems && subtotal >= 200 && (
                  <p className="text-[10px] text-success font-semibold">Free shipping on this order</p>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-semibold ${shippingCost === 0 ? "text-success" : "text-gray-900"}`}>
                      {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-base pt-1.5 border-t border-border">
                    <span className="font-semibold text-gray-900">Estimated Total</span>
                    <span className="font-bold text-gray-900">{formatPrice(subtotal + shippingCost)}</span>
                  </div>
                </div>

                {subtotal < 50 ? (
                  <div>
                    <button
                      disabled
                      className="block w-full text-center rounded-lg bg-primary/50 px-7 py-3.5 text-sm font-semibold text-white cursor-not-allowed"
                    >
                      Minimum Order: $50
                    </button>
                    <p className="text-[10px] text-center text-warning mt-1.5 font-medium">
                      Add {formatPrice(50 - subtotal)} more to checkout.
                    </p>
                  </div>
                ) : (
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full text-center rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-white hover:bg-primary-hover transition-all"
                  >
                    Proceed to Checkout
                  </Link>
                )}
                <p className="text-[10px] text-center text-gray-400 leading-tight mt-1.5">
                  All products are for laboratory and research purposes only. Not for human consumption.
                </p>
              </div>
            )}
          </>
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
                          <button
                            onClick={() => {
                              addItem({
                                productId: product.id,
                                variantId: null,
                                name: product.name,
                                slug: product.slug,
                                price: product.price,
                                subscriptionPrice: getSubscriptionPrice(product.price),
                                size: product.size,
                                image,
                                purchaseType: "one-time",
                                deliveryFrequencyWeeks: 4,
                                billingCycle: "monthly",
                              });
                              setTab("cart");
                            }}
                            className="text-xs font-semibold text-secondary hover:underline"
                          >
                            Add to Cart
                          </button>
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
      <p className="text-xs font-semibold text-primary mb-2">Complete your protocol</p>
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
