"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "cGMP", label: "Certified Manufacturing", subtext: "All compounds sourced from facilities meeting current Good Manufacturing Practice standards" },
  { value: "≥99%", label: "Purity Guaranteed", subtext: "Every batch verified by independent third-party laboratory analysis" },
  { value: "24hr", label: "Order Processing", subtext: "Orders processed and shipped within one business day of placement" },
  { value: "100%", label: "Batches Independently Tested", subtext: "No product ships without a published Certificate of Analysis" },
];

export default function SocialProof() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-[#FAFAFA] py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] text-center mb-8 sm:mb-10">
          Trusted by Researchers Nationwide
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-[#F0F0F0]"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-[#10B981] leading-none">
                {stat.value}
              </p>
              <p className="text-xs sm:text-sm text-[#111111] mt-2 font-medium">
                {stat.label}
              </p>
              <p className="text-[11px] sm:text-xs text-[#6B7280] mt-1.5 leading-relaxed">
                {stat.subtext}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-[#6B7280] mt-6 sm:mt-8">
          Don&apos;t take our word for it. Every batch result is published in
          our{" "}
          <Link
            href="/coa"
            className="text-[#10B981] font-semibold hover:underline"
          >
            CoA Library
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
