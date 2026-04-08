"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      requestAnimationFrame(() => {
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });
    }
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[68vh] sm:min-h-[73vh] lg:min-h-[78vh] flex items-center justify-center">
      {/* Background image */}
      <Image
        src="/images/hero-vials-v2.jpg"
        alt="Purity Lab peptide vials including BPC-157, TB-500, GLP-3, NAD+, and Bacteriostatic Water"
        fill
        className="object-cover" style={{ objectPosition: "center 80%" }}
        priority
      />
      {/* Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/60 to-transparent" />

      {/* Centered text content */}
      <div ref={contentRef} className="relative z-10 text-center px-4 sm:px-6 pt-8 pb-20 sm:pb-24 max-w-2xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#111111] leading-[1.08]">
          Premium Peptides
          <br />
          You Can Trust
        </h1>
        <p className="mt-4 sm:mt-6 text-base sm:text-lg text-[#555] max-w-lg mx-auto leading-relaxed">
          Research-grade peptide protocols designed for athletes. Every vial
          batch-tested by independent US labs with 98%+ verified purity.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white rounded-full px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-base hover:bg-black hover:scale-[1.03] transition-all duration-200"
          >
            Shop Now
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#111111] border border-[#111111] rounded-full px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-base hover:bg-gray-50 hover:scale-[1.03] transition-all duration-200"
          >
            Find My Protocol
          </Link>
        </div>
      </div>
    </section>
  );
}
