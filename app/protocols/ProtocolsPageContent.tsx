"use client";

import { useState } from "react";
import Link from "next/link";
import type { Protocol } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ProtocolsPageContentProps {
  protocols: Protocol[];
}

const TABS = [
  { label: "All", slug: "all" },
  { label: "Recovery", slug: "recovery" },
  { label: "Fat Loss", slug: "fat-loss" },
  { label: "Performance", slug: "performance" },
];

const BADGE_STYLES: Record<string, string> = {
  "MOST POPULAR": "bg-secondary text-white",
  PREMIUM: "bg-primary text-white",
};

export default function ProtocolsPageContent({
  protocols,
}: ProtocolsPageContentProps) {
  const [activeTab, setActiveTab] = useState("all");
  const animRef = useScrollAnimation();

  const filtered =
    activeTab === "all"
      ? protocols
      : protocols.filter((p) => p.slug === activeTab);

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8">
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-4">
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">Protocols</span>
          </nav>
          <h1 className="font-heading text-4xl font-extrabold text-primary">
            Protocols
          </h1>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-3 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.slug}
                onClick={() => setActiveTab(tab.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.slug
                    ? "bg-primary text-white"
                    : "text-text-secondary hover:bg-background hover:text-text-primary"
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
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
        >
          {filtered.map((protocol) => (
            <div
              key={protocol.id}
              className="relative bg-surface border border-border rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-lg"
              style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
            >
              {/* Badge */}
              {protocol.badge && (
                <span
                  className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded ${BADGE_STYLES[protocol.badge] ?? "bg-secondary text-white"}`}
                >
                  {protocol.badge}
                </span>
              )}

              {/* Top Section */}
              <div className="p-8 pb-0">
                <div
                  className="w-1 h-8 rounded mb-4"
                  style={{ backgroundColor: protocol.accent_color }}
                />
                <h3 className="font-heading text-xl font-bold text-primary">
                  {protocol.name}
                </h3>
                <p className="font-body text-sm text-text-secondary mt-1">
                  {protocol.tagline}
                </p>
                {protocol.description && (
                  <p className="font-body text-sm text-text-secondary mt-3 leading-relaxed">
                    {protocol.description}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="px-8 flex-1">
                <div className="border-t border-border pt-4 mt-4">
                  <ul className="space-y-2.5">
                    {protocol.items
                      ?.sort((a, b) => a.sort_order - b.sort_order)
                      .map((item) => (
                        <li
                          key={item.id}
                          className="flex items-start gap-2 text-xs text-text-primary"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-success flex-shrink-0 mt-0.5"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {item.product?.name ?? "Unknown product"}
                        </li>
                      ))}
                  </ul>
                  <p className="text-xs text-text-secondary mt-3">
                    Recommended cycle: {protocol.cycle_length}
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="p-8 border-t border-border mt-4">
                <div className="mb-4">
                  <span className="font-heading text-3xl font-extrabold text-primary">
                    ${protocol.subscription_price}
                  </span>
                  <span className="text-xs text-text-secondary ml-1">
                    /month
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-4">
                  One-time: ${protocol.one_time_price} - Save $
                  {(
                    protocol.one_time_price - protocol.subscription_price
                  ).toFixed(0)}
                  /mo with subscription
                </p>
                <Link
                  href="#"
                  className="block w-full bg-primary text-white text-center rounded-lg py-3 font-semibold hover:bg-primary-hover transition-colors"
                >
                  Subscribe &amp; Save
                </Link>
                <Link
                  href="#"
                  className="block w-full bg-transparent border border-border text-primary text-center rounded-lg py-3 font-medium mt-2 hover:border-primary transition-colors"
                >
                  Buy Once
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Build Your Own Stack CTA */}
        <div className="bg-background border border-border rounded-xl p-12 text-center mt-12">
          <h2 className="font-heading text-2xl font-extrabold text-primary mb-3">
            Don&apos;t see exactly what you need?
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-6">
            Build a custom stack from our full catalog. Pick your peptides, set
            your delivery schedule, and save 10% with a subscription.
          </p>
          <Link
            href="/protocols/build"
            className="inline-block bg-primary text-white rounded-lg px-8 py-3 font-semibold hover:bg-primary-hover transition-colors"
          >
            Build Your Own Stack
          </Link>
        </div>
      </div>
    </div>
  );
}
