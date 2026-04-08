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

function roundPrice(price: number): number {
  return Math.round(price);
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

  return (
    <section className="bg-[#FAFAFA] py-16 sm:py-20">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Protocols
          </h2>
          <p className="mt-3 text-[#6B7280]">
            Complete stacks designed for specific goals. Everything you need in
            one monthly shipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {protocols.map((protocol) => {
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
                {/* Colored header */}
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

                {/* Price + items */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-extrabold text-[#111111]">${displaySub}</span>
                    <span className="text-sm text-[#6B7280]">/mo</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-[#9CA3AF] line-through">${displayOneTime}</span>
                    <span className="text-[10px] font-semibold text-[#10B981]">Save {roundPrice(displayOneTime - displaySub > 0 ? ((displayOneTime - displaySub) / displayOneTime) * 100 : 15)}%</span>
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
                    {protocol.cycle_length} cycle · Free shipping
                  </p>
                </div>

                {/* Buttons */}
                <div className="px-5 pb-5 space-y-2">
                  <button
                    onClick={() => addProtocolToCart(protocol, "subscription")}
                    className="block w-full bg-[#111111] text-white text-center rounded-full py-2.5 text-sm font-semibold hover:bg-black hover:scale-[1.01] transition-all"
                  >
                    Subscribe &amp; Save
                  </button>
                  <button
                    onClick={() => addProtocolToCart(protocol, "one-time")}
                    className="block w-full text-[#6B7280] text-center text-xs font-medium hover:text-[#111111] transition-colors py-1"
                  >
                    or buy once for ${displayOneTime}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Build Your Own */}
        <div className="text-center mt-10">
          <Link
            href="/protocols/build"
            className="inline-flex items-center gap-1.5 text-[#111111] font-semibold hover:underline"
          >
            Build Your Own Stack
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
