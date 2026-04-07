"use client";

import Link from "next/link";
import type { Protocol } from "@/lib/types";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface ProtocolsProps {
  protocols: Protocol[];
}

const BADGE_STYLES: Record<string, string> = {
  "MOST POPULAR": "bg-secondary text-white",
  PREMIUM: "bg-primary text-white",
};

export default function Protocols({ protocols }: ProtocolsProps) {
  const animRef = useScrollAnimation();

  if (protocols.length === 0) return null;

  return (
    <section className="bg-surface py-20 border-t border-border">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-4xl font-extrabold text-primary">
            Protocols
          </h2>
          <p className="mt-3 text-text-secondary">
            Complete stacks designed for specific goals. Everything you need in
            one monthly shipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {protocols.map((protocol) => (
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
                  {(protocol.one_time_price - protocol.subscription_price).toFixed(0)}/mo with
                  subscription
                </p>
                <Link
                  href="/subscribe"
                  className="block w-full bg-primary text-white text-center rounded-lg py-3 font-semibold hover:bg-primary-hover transition-colors"
                >
                  Subscribe &amp; Save
                </Link>
                <Link
                  href="/shop"
                  className="block w-full bg-transparent border border-border text-primary text-center rounded-lg py-3 font-medium mt-2 hover:border-primary transition-colors"
                >
                  Buy Once
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Build Your Own */}
        <div className="text-center mt-10">
          <Link
            href="/protocols/build"
            className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
          >
            Build Your Own Stack
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
