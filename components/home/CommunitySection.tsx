"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function CommunitySection() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F5F3FF] via-[#EDE9FE] to-[#F5F3FF] rounded-2xl px-8 sm:px-16 lg:px-24 py-8 sm:py-10 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] mb-4">
            Not sure where to start?
          </h2>
          <p className="text-sm sm:text-base text-[#6B7280] max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Take our 60-second quiz. Tell us your goals and experience level, and
            we&apos;ll recommend a personalized protocol.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white rounded-full w-full sm:w-auto px-9 py-3.5 font-bold hover:bg-black hover:scale-[1.02] transition-all duration-200"
          >
            Find My Protocol
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
          <p className="mt-4 text-xs text-[#6B7280]/60">
            No account required. Takes 60 seconds.
          </p>
        </div>
      </div>
    </section>
  );
}
