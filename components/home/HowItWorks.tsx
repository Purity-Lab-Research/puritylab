"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
const steps = [
  {
    number: "1",
    title: "Browse Our Catalog",
    description:
      "Select from 40+ research-grade compounds organized by category.",
    cta: { label: "View catalog", href: "/shop" },
    tint: "bg-[#F0FDF4]",
  },
  {
    number: "2",
    title: "Order with Confidence",
    description:
      "Every product ships with batch-specific documentation and verified purity data.",
    cta: { label: "See products", href: "/shop" },
    tint: "bg-[#EFF6FF]",
  },
  {
    number: "3",
    title: "Verify Your Product",
    description:
      "Look up your batch number in our CoA library to review full test results.",
    cta: { label: "Browse CoA Library", href: "/coa" },
    tint: "bg-[#F5F3FF]",
  },
];

export default function HowItWorks() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-white py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            How It Works
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-5 relative">
          {steps.map((step, i) => (
            <div key={step.number} className="flex-1 max-w-[380px] mx-auto md:mx-0 flex flex-col relative">
              {/* Connecting dashed line between cards (desktop only) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 -right-3 w-6 border-t-2 border-dashed border-[#E5E7EB] z-10" />
              )}

              <div className={`${step.tint} rounded-2xl p-7 sm:p-8 flex-1 flex flex-col`}>
                <span className="text-4xl font-extrabold text-[#10B981] leading-none mb-4 block">
                  {step.number}
                </span>
                <h3 className="text-xl font-bold text-[#111111] mb-2.5">
                  {step.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed flex-1">
                  {step.description}
                </p>
                <Link
                  href={step.cta.href}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-[#10B981] hover:underline mt-4"
                >
                  {step.cta.label}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
