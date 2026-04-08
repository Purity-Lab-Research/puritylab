"use client";

import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
    <section className="bg-[#FAFAFA] py-16 sm:py-20">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Tabbed content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-8">
              Quality you can verify, not just trust
            </h2>

            {/* Tab buttons */}
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

            {/* Tab content */}
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6">
              <h3 className="text-lg font-bold text-[#111111] mb-2">{tabs[active].label}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {tabs[active].description}
              </p>
            </div>
          </div>

          {/* Right: Visual with floating badge */}
          <div className="relative flex items-center justify-center">
            <div className="w-full aspect-[4/3] rounded-2xl bg-gradient-to-br from-[#F0FDF4] via-[#EFF6FF] to-[#F5F3FF] flex items-center justify-center">
              <div className="text-center">
                <FlaskIcon />
                <p className="mt-4 text-lg font-bold text-[#111111]">Independently Tested</p>
                <p className="text-sm text-[#6B7280]">Every batch. Every product.</p>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-2 sm:bottom-4 sm:right-4 bg-white rounded-xl shadow-lg border border-[#F0F0F0] px-5 py-3">
              <p className="text-2xl font-extrabold text-[#10B981]">99%+</p>
              <p className="text-xs text-[#6B7280] font-medium">Purity Verified by HPLC</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FlaskIcon() {
  return (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981] mx-auto">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
    </svg>
  );
}
