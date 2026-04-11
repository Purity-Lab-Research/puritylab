"use client";

import Link from "next/link";
import type { Protocol } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCart } from "@/hooks/useCart";
import { getSubscriptionPrice } from "@/lib/utils";

interface ProtocolsProps {
  protocols: Protocol[];
}

const BADGE_STYLES: Record<string, string> = {
  "MOST POPULAR": "bg-[#10B981] text-white",
  PREMIUM: "bg-[#111111] text-white",
};

const CARD_COLORS: Record<string, string> = {
  recovery: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]",
  "fat-loss": "bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]",
  performance: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]",
  "full-recomp": "bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]",
};

/* Price anchoring order: most expensive first so the first number seen frames all subsequent prices */
const SLUG_ORDER: Record<string, number> = {
  "full-recomp": 0,
  "fat-loss": 1,
  performance: 2,
  recovery: 3,
};

function roundPrice(price: number): number {
  return Math.round(price);
}

function dailyCost(monthly: number): string {
  return (monthly / 30).toFixed(2);
}

export default function Protocols({ protocols }: ProtocolsProps) {
  const animRef = useScrollAnimation();
  const { addItem, openCart } = useCart();

  function addProtocolToCart(protocol: Protocol, purchaseType: "one-time" | "subscription") {
    for (const item of protocol.items ?? []) {
      if (!item.product) continue;
      addItem({
        productId: item.product.id,
        variantId: null,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        subscriptionPrice: getSubscriptionPrice(item.product.price),
        size: item.product.size,
        image: item.product.images?.[0] ?? null,
        quantity: item.quantity,
        purchaseType,
        deliveryFrequencyWeeks: purchaseType === "subscription" ? 4 : 0,
        billingCycle: "monthly",
      });
    }
    openCart();
  }

  if (protocols.length === 0) return null;

  /* Sort protocols by anchoring order */
  const sorted = [...protocols].sort((a, b) => {
    const aOrder = SLUG_ORDER[a.slug] ?? 99;
    const bOrder = SLUG_ORDER[b.slug] ?? 99;
    return aOrder - bOrder;
  });

  return (
    <section className="bg-[#FAFAFA] py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Research Configurations
          </h2>
          <p className="mt-3 text-[#6B7280]">
            Pre-configured compound sets commonly studied together in published
            peer-reviewed research.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {sorted.map((protocol) => {
            const colorClass = CARD_COLORS[protocol.slug] ?? "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]";
            const oneTimeTotal = (protocol.items ?? []).reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);
            const subTotal = (protocol.items ?? []).reduce((sum, item) => sum + getSubscriptionPrice(item.product?.price ?? 0) * item.quantity, 0);
            const displaySub = roundPrice(protocol.subscription_price ?? subTotal);
            const displayOneTime = roundPrice(protocol.one_time_price ?? oneTimeTotal);
            const items = (protocol.items ?? []).sort((a, b) => a.sort_order - b.sort_order);

            return (
              <div
                key={protocol.id}
                className="relative bg-white rounded-2xl overflow-hidden flex flex-col transition-all hover:shadow-lg hover:-translate-y-1 duration-300"
              >
                <Link href={`/protocols/${protocol.slug}`} className="flex flex-col flex-1">
                  <div className={`${colorClass} px-5 pt-5 pb-4`}>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold text-[#111111] leading-tight">
                        {protocol.name}
                      </h3>
                      {protocol.badge && (
                        <span
                          className={`flex-shrink-0 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${BADGE_STYLES[protocol.badge] ?? "bg-[#10B981] text-white"}`}
                        >
                          {protocol.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#111111]/60 mt-1 line-clamp-1">
                      {protocol.tagline}
                    </p>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#111111]">${displayOneTime}</span>
                    </div>

                    <div className="mt-4 space-y-1.5 flex-1">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981] flex-shrink-0">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          <span className="text-xs text-[#111111]">{item.product?.name ?? "Unknown"}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-[10px] text-[#6B7280] mt-3">
                      {(protocol.items ?? []).length} compounds included
                    </p>
                  </div>
                </Link>

                <div className="px-5 pb-5 mt-auto">
                  <button
                    onClick={() => addProtocolToCart(protocol, "one-time")}
                    className="block w-full bg-[#111111] text-white text-center rounded-full py-2.5 text-sm font-semibold hover:bg-black hover:scale-[1.01] transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/protocols/build"
            className="inline-flex items-center gap-1.5 text-[#111111] font-semibold hover:underline"
          >
            Build a Custom Configuration
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        <p className="text-xs text-[#6B7280] max-w-3xl mx-auto text-center mt-8">
          All protocols represent common research configurations documented in published scientific literature. They do not constitute medical treatment plans, therapeutic recommendations, or dosing instructions for human use. All products are for in-vitro laboratory research only.
        </p>
      </div>
    </section>
  );
}
