"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { X, Check } from "lucide-react";

const rows = [
  {
    industry: "Testing results hidden or unavailable",
    purityLab: "Full Certificate of Analysis published for every batch",
  },
  {
    industry: "No way to verify what's in the vial",
    purityLab: "Batch number on every vial linked to public lab results",
  },
  {
    industry: "Standard ground shipping",
    purityLab: "FedEx 2-Day Cold Chain on every order",
  },
  {
    industry: "Inconsistent pricing with no volume options",
    purityLab: "Transparent pricing with scheduled reorder discounts",
  },
  {
    industry: "No traceability after purchase",
    purityLab: "Track your order, manage subscriptions, view your CoA history",
  },
];

export default function WhyPurityLab() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-white py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            What Makes Us Different
          </h2>
          <p className="mt-3 text-[#6B7280] max-w-lg mx-auto">
            We built Purity Lab because we were tired of guessing what was
            actually in the vial.
          </p>
        </div>

        {/* Desktop comparison table */}
        <div className="hidden md:block bg-white rounded-2xl border border-[#F0F0F0] shadow-sm overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="grid grid-cols-2 border-b border-[#F0F0F0]">
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-[#9CA3AF]">
                The Industry Standard
              </h3>
            </div>
            <div className="px-6 py-4 bg-[#FAFAFA]">
              <h3 className="text-sm font-bold text-[#111111]">
                <span className="border-b-2 border-[#10B981] pb-0.5">
                  The Purity Lab Standard
                </span>
              </h3>
            </div>
          </div>

          {/* Rows */}
          {rows.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-2 ${i < rows.length - 1 ? "border-b border-[#F0F0F0]" : ""}`}
            >
              <div className="px-6 py-4 flex items-start gap-3">
                <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#9CA3AF]">{row.industry}</span>
              </div>
              <div className="px-6 py-4 bg-[#FAFAFA] flex items-start gap-3">
                <Check className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span className="text-sm text-[#111111] font-medium">
                  {row.purityLab}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile stacked list */}
        <div className="md:hidden space-y-4">
          {rows.map((row, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden"
            >
              <div className="px-4 py-3 flex items-start gap-2.5 bg-[#FAFAFA]">
                <X className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#9CA3AF]">{row.industry}</span>
              </div>
              <div className="px-4 py-3 flex items-start gap-2.5">
                <Check className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span className="text-xs text-[#111111] font-medium">
                  {row.purityLab}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
