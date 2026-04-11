"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const goals = [
  { label: "Tissue Research", className: "bg-[#F0FDF4] text-[#059669]" },
  { label: "Metabolic Research", className: "bg-[#FDF2F8] text-[#DB2777]" },
  { label: "GH Research", className: "bg-[#EFF6FF] text-[#2563EB]" },
];

export default function CommunitySection() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-white py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl px-8 sm:px-16 lg:px-24 py-10 sm:py-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] mb-3">
            Not Sure Which Compound Fits Your Research?
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Answer a few quick questions about your research focus and we will
            suggest compounds commonly referenced in published literature.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white rounded-full w-full sm:w-auto px-9 py-3.5 font-bold hover:bg-black hover:scale-[1.02] transition-all duration-200"
          >
            Find Compounds for Your Research
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-3 text-xs text-[#6B7280]">
            No account needed. Free forever.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            {goals.map((goal) => (
              <span
                key={goal.label}
                className={`text-xs font-semibold px-3 py-1 rounded-full ${goal.className}`}
              >
                {goal.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
