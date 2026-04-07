"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const protocols = [
  {
    name: "Recovery Protocol",
    tagline: "Accelerate tissue repair and reduce downtime",
    items: [
      "Wolverine Blend (BPC-157 10mg / TB500 10mg)",
      "Bac Water 10ml",
      "Syringes",
    ],
    cycle: "4-6 weeks",
    subPrice: 149,
    fullPrice: 165,
    badge: "MOST POPULAR",
    badgeClass: "bg-secondary text-white",
    accentColor: "bg-secondary",
  },
  {
    name: "Fat Loss Protocol",
    tagline: "Target stubborn fat while preserving lean muscle",
    items: [
      "MOTS-C 40mg",
      "AOD 9604 5mg",
      "CJC/Ipa Blend 5/5mg",
      "Bac Water 10ml",
      "Syringes",
    ],
    cycle: "8-12 weeks",
    subPrice: 275,
    fullPrice: 305,
    badge: null,
    badgeClass: "",
    accentColor: "bg-warning",
  },
  {
    name: "Performance Protocol",
    tagline: "Optimize growth hormone for recovery and lean mass",
    items: [
      "CJC/Ipa Blend 5/5mg",
      "Ipamorelin 10mg",
      "Bac Water 10ml",
      "Syringes",
    ],
    cycle: "8-12 weeks",
    subPrice: 140,
    fullPrice: 155,
    badge: null,
    badgeClass: "",
    accentColor: "bg-success",
  },
  {
    name: "Full Recomp Protocol",
    tagline: "The complete athlete optimization stack",
    items: [
      "BPC-157 10mg",
      "TB500 10mg",
      "CJC/Ipa Blend 5/5mg",
      "MOTS-C 40mg",
      "Bac Water 10ml",
      "Syringes",
    ],
    cycle: "8-12 weeks",
    subPrice: 342,
    fullPrice: 380,
    badge: "PREMIUM",
    badgeClass: "bg-primary text-white",
    accentColor: "bg-primary",
  },
];

export default function Protocols() {
  const animRef = useScrollAnimation();

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
              key={protocol.name}
              className="relative bg-surface border border-border rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-lg"
              style={{ transition: "border-color 0.3s, box-shadow 0.3s" }}
            >
              {/* Badge */}
              {protocol.badge && (
                <span
                  className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded ${protocol.badgeClass}`}
                >
                  {protocol.badge}
                </span>
              )}

              {/* Top Section */}
              <div className="p-8 pb-0">
                <div
                  className={`w-1 h-8 rounded ${protocol.accentColor} mb-4`}
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
                    {protocol.items.map((item) => (
                      <li
                        key={item}
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
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-text-secondary mt-3">
                    Recommended cycle: {protocol.cycle}
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="p-8 border-t border-border mt-4">
                <div className="mb-4">
                  <span className="font-heading text-3xl font-extrabold text-primary">
                    ${protocol.subPrice}
                  </span>
                  <span className="text-xs text-text-secondary ml-1">
                    /month
                  </span>
                </div>
                <p className="text-xs text-text-secondary mb-4">
                  One-time: ${protocol.fullPrice} — Save $
                  {protocol.fullPrice - protocol.subPrice}/mo with subscription
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
