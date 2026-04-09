"use client";

import { useState } from "react";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Check } from "lucide-react";

const tabs = [
  {
    label: "Potency",
    description:
      "Every peptide is tested for accurate concentration to ensure the labeled amount matches what is in each vial. Potency testing confirms that each product delivers its full intended strength.",
  },
  {
    label: "Purity",
    description:
      "HPLC analysis verifies that each batch meets our 98%+ purity threshold. Any batch that falls below this standard is rejected before it reaches our inventory.",
  },
  {
    label: "Stability",
    description:
      "Products are stored in temperature-controlled cold chain facilities and shipped via FedEx 2-Day Cold to maintain peptide integrity from warehouse to delivery.",
  },
  {
    label: "Safety",
    description:
      "All products are manufactured in facilities that follow current Good Manufacturing Practice (cGMP) standards. Every batch undergoes identity confirmation via mass spectrometry.",
  },
  {
    label: "Consistency",
    description:
      "Batch-to-batch consistency is verified through standardized testing protocols. Every Certificate of Analysis is published so you can compare results across batches.",
  },
];

export default function QualitySection() {
  const [active, setActive] = useState(0);
  const animRef = useScrollAnimation();

  return (
    <section className="bg-[#FAFAFA] py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Tabbed content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-8">
              Quality you can verify, not just trust
            </h2>

            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab, i) => (
                <button
                  key={tab.label}
                  onClick={() => setActive(i)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active === i
                      ? "bg-[#111111] text-white"
                      : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
              <h3 className="text-lg font-bold text-[#111111] mb-2">{tabs[active].label}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {tabs[active].description}
              </p>
            </div>
          </div>

          {/* Right: CoA preview card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-[#F0F0F0] overflow-hidden transform rotate-1 hover:rotate-0 transition-transform duration-300">
              {/* Card header */}
              <div className="bg-[#FAFAFA] border-b border-[#F0F0F0] px-6 py-4">
                <p className="text-xs font-semibold text-[#6B7280] tracking-wider uppercase">
                  Certificate of Analysis
                </p>
              </div>

              {/* Card body */}
              <div className="px-6 py-5 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280]">Product</span>
                  <span className="text-sm font-bold text-[#111111]">BPC-157 5mg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280]">Batch</span>
                  <span className="text-sm font-semibold text-[#111111]">PL-2026-0412</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280]">Test Date</span>
                  <span className="text-sm text-[#111111]">March 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280]">Method</span>
                  <span className="text-sm text-[#111111]">HPLC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#6B7280]">Lab</span>
                  <span className="text-sm text-[#111111]">Independent US Laboratory</span>
                </div>

                {/* Purity highlight */}
                <div className="bg-[#F0FDF4] rounded-xl px-4 py-3 text-center mt-2">
                  <p className="text-3xl font-extrabold text-[#10B981]">99.4%</p>
                  <p className="text-xs text-[#6B7280] font-medium mt-0.5">Purity</p>
                </div>

                {/* Verified badge */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-xs font-bold text-[#10B981]">Verified</span>
                </div>
              </div>

              {/* Card footer */}
              <div className="px-6 pb-5">
                <Link
                  href="/coa"
                  className="block w-full bg-[#111111] text-white text-center rounded-full py-2.5 text-sm font-semibold hover:bg-black hover:scale-[1.01] transition-all"
                >
                  View Full CoA Library
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
