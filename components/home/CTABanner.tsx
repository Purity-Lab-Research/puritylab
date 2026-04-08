"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function CTABanner() {
  const animRef = useScrollAnimation();

  return (
    <section ref={animRef} className="bg-[#FAFAFA] px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl rounded-2xl bg-[#111111] py-10 sm:py-12 px-6 sm:px-12 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5">
          Not sure where to start?
        </h2>
        <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-8 max-w-md mx-auto">
          Take our 60-second quiz. Tell us your goals and experience level, and
          we&apos;ll recommend a personalized protocol.
        </p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 bg-[#10B981] text-white rounded-full px-9 py-3.5 font-bold hover:bg-[#059669] hover:scale-[1.02] transition-all duration-200 animate-[pulse_3s_ease-in-out_infinite]"
        >
          Find My Protocol
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </Link>
        <p className="mt-4 text-xs text-white/40">
          No account required. Takes 60 seconds.
        </p>
      </div>
    </section>
  );
}
