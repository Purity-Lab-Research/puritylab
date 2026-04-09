"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "4,200+", label: "Vials shipped" },
  { value: "99.2%", label: "Average batch purity" },
  { value: "48 hrs", label: "Average delivery time" },
  { value: "0", label: "Failed purity tests" },
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
              <p className="text-xs sm:text-sm text-[#6B7280] mt-2 font-medium">
                {stat.label}
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
