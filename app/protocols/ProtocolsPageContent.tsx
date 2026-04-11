"use client";

import { useState } from "react";
import Link from "next/link";
import type { Protocol } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useCart } from "@/hooks/useCart";
import { getSubscriptionPrice } from "@/lib/utils";

interface ProtocolsPageContentProps {
  protocols: Protocol[];
}

const TABS = [
  { label: "All", slug: "all" },
  { label: "Tissue Research", slug: "recovery" },
  { label: "Metabolic Research", slug: "fat-loss" },
  { label: "GH Research", slug: "performance" },
];

const BADGE_STYLES: Record<string, string> = {
  "MOST POPULAR": "bg-[#10B981] text-white",
  PREMIUM: "bg-[#111111] text-white",
};

const CARD_COLORS: Record<string, { bg: string; light: string }> = {
  recovery: { bg: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]", light: "bg-[#F0FDF4]" },
  "fat-loss": { bg: "bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]", light: "bg-[#FDF2F8]" },
  performance: { bg: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]", light: "bg-[#EFF6FF]" },
  "full-recomp": { bg: "bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]", light: "bg-[#F5F3FF]" },
};

function roundPrice(price: number): number {
  return Math.round(price);
}

export default function ProtocolsPageContent({
  protocols,
}: ProtocolsPageContentProps) {
  const [activeTab, setActiveTab] = useState("all");
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

  const filtered =
    activeTab === "all"
      ? protocols
      : protocols.filter((p) => p.slug === activeTab);

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-8">
          <nav className="flex items-center gap-1 text-sm text-[#6B7280] mb-3">
            <Link href="/" className="hover:text-[#111111] transition-colors">
              Home
            </Link>
            <span className="text-[#6B7280]/40">&#8250;</span>
            <span className="text-[#111111]">Research Configurations</span>
          </nav>
          <h1 className="text-4xl font-extrabold text-[#111111]">
            Research Configurations
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[#6B7280]">
            Pre-configured compound sets commonly studied together in published peer-reviewed research. Every product is third-party tested.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-[#F0F0F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.slug
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Protocol Cards */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div
          ref={animRef}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5"
        >
          {filtered.map((protocol) => {
            const colors = CARD_COLORS[protocol.slug] ?? { bg: "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]", light: "bg-[#F9FAFB]" };
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
                {/* Clickable card area */}
                <Link href={`/protocols/${protocol.slug}`} className="flex flex-col flex-1">
                  {/* Colored header */}
                  <div className={`${colors.bg} px-5 pt-5 pb-4`}>
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
                    {/* Price */}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-[#111111]">${displayOneTime}</span>
                    </div>

                    {/* Items as compact list */}
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

                {/* Buttons */}
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

        <p className="text-xs text-[#6B7280] max-w-3xl mx-auto text-center mt-10">
          All protocols represent common research configurations documented in published scientific literature. They do not constitute medical treatment plans, therapeutic recommendations, or dosing instructions for human use. All products are for in-vitro laboratory research only.
        </p>

        {/* Build Your Own Stack CTA */}
        <div className="bg-gradient-to-br from-[#EFF6FF] to-[#F5F3FF] rounded-2xl p-10 sm:p-12 text-center mt-12">
          <h2 className="text-2xl font-extrabold text-[#111111] mb-3">
            Need a different combination?
          </h2>
          <p className="text-[#6B7280] max-w-lg mx-auto mb-6">
            Build a custom configuration from our full catalog. Select compounds
            relevant to your research and set up a scheduled reorder.
          </p>
          <Link
            href="/protocols/build"
            className="inline-block bg-[#111111] text-white rounded-full px-8 py-3.5 font-semibold hover:bg-black hover:scale-[1.02] transition-all"
          >
            Build a Custom Configuration
          </Link>
        </div>
      </div>
    </div>
  );
}
