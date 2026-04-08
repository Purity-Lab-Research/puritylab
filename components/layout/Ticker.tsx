"use client";

import { Truck, FlaskConical, Shield, FileCheck, BadgePercent } from "lucide-react";

const items = [
  { icon: Shield, text: "EVERY BATCH THIRD-PARTY TESTED" },
  { icon: FlaskConical, text: "98%+ VERIFIED PURITY" },
  { icon: FileCheck, text: "FULL CoA PUBLISHED ON EVERY PRODUCT" },
  { icon: Truck, text: "SAME-DAY FULFILLMENT" },
  { icon: BadgePercent, text: "SUBSCRIBE & SAVE UP TO 15%" },
];

export default function Ticker() {
  return (
    <div data-ticker className="bg-[#F5F5F5] overflow-hidden relative border-b border-border">
      {/* Subtle edge fades */}
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#F5F5F5] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#F5F5F5] to-transparent z-10 pointer-events-none" />

      <div className="ticker-track flex items-center gap-6 sm:gap-10 py-2 whitespace-nowrap">
        {/* Render items twice for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 sm:gap-2.5 text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] text-text-secondary uppercase"
          >
            <item.icon className="h-3 w-3 text-secondary flex-shrink-0" strokeWidth={2} />
            {item.text}
            <span className="text-border ml-4 sm:ml-8">&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
