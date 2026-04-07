"use client";

import { Truck, FlaskConical, Shield, FileCheck, BadgePercent } from "lucide-react";

const items = [
  { icon: Shield, text: "EVERY BATCH THIRD-PARTY TESTED" },
  { icon: FlaskConical, text: "98%+ VERIFIED PURITY" },
  { icon: FileCheck, text: "FULL CoA PUBLISHED ON EVERY PRODUCT" },
  { icon: Truck, text: "SAME-DAY FULFILLMENT" },
  { icon: BadgePercent, text: "SUBSCRIBE & SAVE 10%" },
];

export default function Ticker() {
  return (
    <div data-ticker className="bg-[#1A2B4A] overflow-hidden relative">
      {/* Subtle edge fades */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#1A2B4A] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#1A2B4A] to-transparent z-10 pointer-events-none" />

      <div className="ticker-track flex items-center gap-10 py-2.5 whitespace-nowrap">
        {/* Render items twice for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2.5 text-[11px] font-semibold tracking-[0.18em] text-white/90 uppercase"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
              <item.icon className="h-3 w-3 text-secondary-light flex-shrink-0" strokeWidth={2.5} />
            </span>
            {item.text}
            <span className="text-secondary/60 ml-8">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
