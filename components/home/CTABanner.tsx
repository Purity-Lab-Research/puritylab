"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function CTABanner() {
  const animRef = useScrollAnimation();

  return (
    <section ref={animRef} className="bg-primary py-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-heading text-4xl font-extrabold text-white mb-5">
          Not sure where to start?
        </h2>
        <p className="text-base text-white/70 leading-relaxed mb-8">
          Take our 60-second quiz. Tell us your goals and experience level, and
          we&apos;ll recommend a personalized protocol.
        </p>
        <Link
          href="/quiz"
          className="inline-block bg-white text-primary rounded-lg px-9 py-3.5 font-bold hover:-translate-y-0.5 hover:shadow-xl transition-all"
        >
          Find My Protocol
        </Link>
        <p className="mt-4 text-xs text-white/40">
          No account required. Takes 60 seconds.
        </p>
      </div>
    </section>
  );
}
