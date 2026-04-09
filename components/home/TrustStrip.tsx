"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const stats = [
  { value: "99%+", label: "Verified Purity" },
  { value: "100%", label: "Batches Tested" },
  { value: "24hr", label: "Fulfillment Time" },
  { value: "Published", label: "CoA Every Batch", href: "/coa" },
];

export default function TrustStrip() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-[#111111]">
      <div
        ref={animRef}
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 sm:py-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat) => {
            const content = (
              <div key={stat.value} className="text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-white leading-none">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-white/60 mt-1 font-medium">
                  {stat.label}
                </p>
              </div>
            );
            if (stat.href) {
              return (
                <Link
                  key={stat.value}
                  href={stat.href}
                  className="hover:opacity-80 transition-opacity"
                >
                  {content}
                </Link>
              );
            }
            return <div key={stat.value}>{content}</div>;
          })}
        </div>
      </div>
    </section>
  );
}
