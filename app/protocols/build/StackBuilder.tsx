"use client";

import { useState, useMemo, useCallback } from "react";
import type { Product } from "@/lib/types";
import { getSubscriptionPrice, getFrequencyDiscount, getAnnualPrice, getAnnualMonthlyPrice } from "@/lib/utils";

/* Types */
interface StackItem {
  productId: string;
  product: Product;
  quantity: number;
}

interface StackBuilderProps {
  products: Product[];
}

/* Constants */
const CATEGORY_LABELS: Record<string, string> = {
  recovery: "Recovery",
  fat_loss: "Weight Management",
  performance: "Performance",
  supplies: "Supplies",
};

const CATEGORY_ORDER = ["recovery", "fat_loss", "performance", "supplies"];

const RECOMMENDATIONS: Record<string, { slug: string; message: string }[]> = {
  "bpc-157-5mg": [{ slug: "tb500-5mg", message: "Most athletes stack BPC-157 with TB500 for enhanced recovery." }],
  "bpc-157-10mg": [{ slug: "tb500-10mg", message: "Most athletes stack BPC-157 with TB500 for enhanced recovery." }],
  "bpc-157-20mg": [{ slug: "tb500-10mg", message: "Most athletes stack BPC-157 with TB500 for enhanced recovery." }],
  "tb500-5mg": [{ slug: "bpc-157-5mg", message: "BPC-157 and TB500 work synergistically for faster tissue repair." }],
  "tb500-10mg": [{ slug: "bpc-157-10mg", message: "BPC-157 and TB500 work synergistically for faster tissue repair." }],
  "cjc-ipa-blend-5-5mg": [{ slug: "ipamorelin-10mg", message: "Add standalone Ipamorelin for amplified growth hormone release." }],
};

const SUPPLY_SLUGS = ["bac-water-10ml", "syringes"];
const FREE_SHIPPING_THRESHOLD = 200;

/* Helpers */
function formatPrice(cents: number) {
  return `$${cents.toFixed(2)}`;
}

/* Icons */
function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-[#6B7280] transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
  );
}

/* Main Component */
export default function StackBuilder({ products }: StackBuilderProps) {
  const [stack, setStack] = useState<StackItem[]>([]);
  const [subscribe, setSubscribe] = useState(true);
  const [frequency, setFrequency] = useState(4);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set());
  const [dismissedSupplyHint, setDismissedSupplyHint] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  const productsBySlug = useMemo(() => {
    const map = new Map<string, Product>();
    products.forEach((p) => map.set(p.slug, p));
    return map;
  }, [products]);

  const stackMap = useMemo(() => {
    const map = new Map<string, StackItem>();
    stack.forEach((item) => map.set(item.productId, item));
    return map;
  }, [stack]);

  const grouped = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    for (const cat of CATEGORY_ORDER) groups[cat] = [];
    products.forEach((p) => {
      const cat = p.goal_category ?? "supplies";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });
    return groups;
  }, [products]);

  const hasPeptide = stack.some((item) => item.product.goal_category !== "supplies");

  const needsSupplyHint =
    hasPeptide &&
    !dismissedSupplyHint &&
    !SUPPLY_SLUGS.every((slug) => stack.some((item) => item.product.slug === slug));

  const addItem = useCallback((product: Product) => {
    setStack((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { productId: product.id, product, quantity: 1 }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setStack((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, qty: number) => {
    if (qty < 1) return;
    setStack((prev) => prev.map((i) => i.productId === productId ? { ...i, quantity: qty } : i));
  }, []);

  const toggleSection = useCallback((cat: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  }, []);

  /* Totals */
  const { subTotal, oneTimeTotal, savings } = useMemo(() => {
    let sub = 0;
    let oneTime = 0;
    stack.forEach((item) => {
      if (billingCycle === "annual") {
        sub += getAnnualPrice(item.product.price) * item.quantity;
      } else {
        sub += getSubscriptionPrice(item.product.price, frequency) * item.quantity;
      }
      oneTime += item.product.price * item.quantity;
    });
    return {
      subTotal: Math.round(sub * 100) / 100,
      oneTimeTotal: Math.round(oneTime * 100) / 100,
      savings: Math.round((oneTime - sub) * 100) / 100,
    };
  }, [stack, frequency, billingCycle]);

  const displayTotal = subscribe ? subTotal : oneTimeTotal;
  const itemCount = stack.reduce((sum, i) => sum + i.quantity, 0);
  const shippingProgress = Math.min((displayTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const freeShippingReached = displayTotal >= FREE_SHIPPING_THRESHOLD;

  /* Recommendation logic */
  function getRecommendationsFor(product: Product) {
    const recs = RECOMMENDATIONS[product.slug];
    if (!recs) return [];
    return recs.filter(
      (rec) => !stack.some((item) => item.product.slug === rec.slug) && productsBySlug.has(rec.slug)
    );
  }

  /* Render helpers */
  function renderQuantityControl(item: StackItem) {
    return (
      <div className="flex items-center gap-0">
        <button
          onClick={() => setQuantity(item.productId, item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#F0F0F0] text-[#6B7280] hover:bg-[#FAFAFA] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <MinusIcon />
        </button>
        <span className="w-8 h-8 flex items-center justify-center text-xs font-semibold text-[#111111]">
          {item.quantity}
        </span>
        <button
          onClick={() => setQuantity(item.productId, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[#F0F0F0] text-[#6B7280] hover:bg-[#FAFAFA] transition-colors"
          aria-label="Increase quantity"
        >
          <PlusIcon />
        </button>
      </div>
    );
  }

  function renderProductRow(product: Product) {
    const inStack = stackMap.get(product.id);
    const recs = getRecommendationsFor(product);

    return (
      <div key={product.id}>
        <div
          className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-[#FAFAFA] ${
            inStack ? "bg-[#10B981]/[0.03]" : ""
          }`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-medium text-[#111111]">{product.name}</span>
              {product.size && (
                <span className="text-xs text-[#6B7280]">{product.size}</span>
              )}
            </div>
            {product.short_description && (
              <p className="text-xs text-[#6B7280] mt-0.5 line-clamp-1">{product.short_description}</p>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            <span className="text-sm font-semibold text-[#111111]">{formatPrice(product.price)}</span>
            {subscribe && (
              <span className="block text-[10px] text-[#10B981] font-medium">
                {billingCycle === "annual"
                  ? `${formatPrice(getAnnualPrice(product.price))}/yr`
                  : `${formatPrice(getSubscriptionPrice(product.price, frequency))}/delivery`}
              </span>
            )}
          </div>

          <div className="flex-shrink-0 w-[100px] flex justify-end">
            {inStack ? (
              renderQuantityControl(inStack)
            ) : (
              <button
                onClick={() => addItem(product)}
                className="bg-[#111111] text-white rounded-full px-4 py-1.5 text-xs font-semibold hover:bg-black transition-colors"
              >
                Add
              </button>
            )}
          </div>
        </div>

        {/* Specific recommendations */}
        {inStack &&
          recs.map((rec) => {
            const recProduct = productsBySlug.get(rec.slug)!;
            return (
              <div
                key={rec.slug}
                className="bg-[#F0FDF4] border border-[#D1FAE5] rounded-lg p-3 mx-5 mt-1 mb-2 flex items-center gap-3"
              >
                <p className="text-xs text-[#6B7280] flex-1">{rec.message}</p>
                <button
                  onClick={() => addItem(recProduct)}
                  className="text-xs text-[#10B981] font-semibold hover:underline whitespace-nowrap"
                >
                  Add {recProduct.name}
                </button>
              </div>
            );
          })}
      </div>
    );
  }

  function renderSummaryContent() {
    return (
      <>
        {stack.length === 0 ? (
          <p className="text-sm text-[#6B7280] py-8 text-center">
            Add peptides from the{" "}
            <span className="hidden md:inline">left</span>
            <span className="md:hidden">catalog</span> to build your custom stack.
          </p>
        ) : (
          <div className="divide-y divide-[#F0F0F0]">
            {stack.map((item) => {
              const price = subscribe
                ? (billingCycle === "annual"
                  ? getAnnualPrice(item.product.price)
                  : getSubscriptionPrice(item.product.price, frequency))
                : item.product.price;
              return (
                <div key={item.productId} className="flex items-center gap-3 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">{item.product.name}</p>
                    <p className="text-xs text-[#6B7280]">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-[#111111] flex-shrink-0">
                    {formatPrice(price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <XIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {stack.length > 0 && (
          <div className="border-t border-[#F0F0F0] pt-5 mt-2 space-y-4">
            {/* Subscribe toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setSubscribe(true)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-full transition-all ${
                  subscribe ? "bg-[#111111] text-white" : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                }`}
              >
                Subscribe &amp; Save
              </button>
              <button
                onClick={() => setSubscribe(false)}
                className={`flex-1 px-3 py-2 text-xs font-semibold rounded-full transition-all ${
                  !subscribe ? "bg-[#111111] text-white" : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                }`}
              >
                One-time
              </button>
            </div>

            {/* Billing cycle + Frequency */}
            {subscribe && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 px-3 py-2 text-xs font-semibold rounded-full transition-all ${
                      billingCycle === "monthly" ? "bg-[#111111] text-white" : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("annual")}
                    className={`flex-1 px-3 py-2 text-xs font-semibold rounded-full transition-all ${
                      billingCycle === "annual" ? "bg-[#111111] text-white" : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                    }`}
                  >
                    Annual (2 mo free)
                  </button>
                </div>

                {billingCycle === "monthly" && (
                  <div>
                    <label className="text-xs text-[#6B7280] block mb-1.5">Delivery frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(Number(e.target.value))}
                      className="w-full rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm text-[#111111] focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 outline-none"
                    >
                      <option value={4}>Every 4 weeks (Save 15%)</option>
                      <option value={6}>Every 6 weeks (Save 10%)</option>
                      <option value={8}>Every 8 weeks (Save 5%)</option>
                    </select>
                  </div>
                )}

                {billingCycle === "annual" && (
                  <p className="text-xs text-[#6B7280]">Ships every 4 weeks. Billed annually (10 months for the price of 12).</p>
                )}
              </div>
            )}

            {/* Free shipping progress */}
            <div>
              <div className="flex justify-between text-xs text-[#6B7280] mb-1.5">
                <span>{freeShippingReached ? "Free shipping unlocked!" : `$${(FREE_SHIPPING_THRESHOLD - displayTotal).toFixed(0)} away from free shipping`}</span>
              </div>
              <div className="h-2 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6B7280]">Subtotal</span>
                <span className="font-semibold text-[#111111]">{formatPrice(displayTotal)}</span>
              </div>
              {subscribe && savings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#10B981] font-semibold">You save</span>
                  <span className="text-[#10B981] font-semibold">{formatPrice(savings)}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <button
              disabled={stack.length === 0}
              className="block w-full bg-[#111111] text-white text-center rounded-full py-4 font-bold text-base hover:bg-black hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-[#6B7280] text-center">
              Free shipping on orders over $200
            </p>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* LEFT: Product Selector */}
        <div className="flex-1 lg:w-[60%] min-w-0">
          {CATEGORY_ORDER.filter((cat) => (grouped[cat]?.length ?? 0) > 0).map((cat) => {
            const isOpen = !collapsedSections.has(cat);
            return (
              <div key={cat} className="bg-white border border-[#F0F0F0] rounded-2xl mb-4 overflow-hidden">
                <button
                  onClick={() => toggleSection(cat)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAFAFA] transition-colors"
                >
                  <h3 className="text-base font-bold text-[#111111]">{CATEGORY_LABELS[cat] ?? cat}</h3>
                  <ChevronDown open={isOpen} />
                </button>
                {isOpen && (
                  <div className="border-t border-[#F0F0F0] divide-y divide-[#F0F0F0]/50">
                    {grouped[cat].map((product) => renderProductRow(product))}
                  </div>
                )}
              </div>
            );
          })}

          {/* Supply recommendation */}
          {needsSupplyHint && (
            <div className="bg-[#F0FDF4] border border-[#D1FAE5] rounded-2xl p-4 flex items-center gap-4">
              <div className="flex-1">
                <p className="text-xs text-[#6B7280]">
                  <span className="font-semibold text-[#111111]">Don&apos;t forget supplies.</span>{" "}
                  You&apos;ll need bacteriostatic water and syringes to reconstitute and dose your peptides.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {SUPPLY_SLUGS.map((slug) => {
                  const p = productsBySlug.get(slug);
                  if (!p || stack.some((i) => i.product.slug === slug)) return null;
                  return (
                    <button
                      key={slug}
                      onClick={() => addItem(p)}
                      className="text-xs text-[#10B981] font-semibold hover:underline whitespace-nowrap"
                    >
                      + {p.name}
                    </button>
                  );
                })}
                <button
                  onClick={() => setDismissedSupplyHint(true)}
                  className="text-[#6B7280] hover:text-[#111111] ml-1"
                  aria-label="Dismiss"
                >
                  <XIcon />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Desktop Stack Summary */}
        <div className="hidden lg:block lg:w-[40%]">
          <div className="sticky top-24 bg-white border border-[#F0F0F0] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#111111] mb-1">
              Your Stack
              {itemCount > 0 && (
                <span className="text-sm font-normal text-[#6B7280] ml-2">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              )}
            </h2>
            {renderSummaryContent()}
          </div>
        </div>
      </div>

      {/* MOBILE: Fixed Bottom Bar */}
      {stack.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#111111] px-4 py-3 safe-area-bottom">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">{formatPrice(displayTotal)}</p>
              <p className="text-xs text-white/60">
                {itemCount} {itemCount === 1 ? "item" : "items"}
                {subscribe && " · Subscription"}
              </p>
            </div>
            <button
              onClick={() => setMobileSheetOpen(true)}
              className="bg-white text-[#111111] rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-gray-100 transition-colors"
            >
              View Stack
            </button>
          </div>
        </div>
      )}

      {/* MOBILE: Slide-up Sheet */}
      {mobileSheetOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileSheetOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden bg-white rounded-t-2xl border-t border-[#F0F0F0] max-h-[85vh] overflow-y-auto safe-area-bottom animate-slide-up">
            <div className="px-5 pt-4 pb-2 flex items-center justify-between border-b border-[#F0F0F0] sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-[#111111]">
                Your Stack
                <span className="text-sm font-normal text-[#6B7280] ml-2">
                  ({itemCount} {itemCount === 1 ? "item" : "items"})
                </span>
              </h2>
              <button
                onClick={() => setMobileSheetOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FAFAFA] transition-colors"
                aria-label="Close"
              >
                <XIcon />
              </button>
            </div>
            <div className="p-5">{renderSummaryContent()}</div>
          </div>
        </>
      )}
    </div>
  );
}
