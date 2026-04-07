"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const goals = [
  {
    title: "Recover Faster",
    description: "Accelerate healing from injuries, surgery, and intense training",
    href: "/protocols#recovery",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Lose Fat",
    description: "Target stubborn fat while preserving lean muscle mass",
    href: "/protocols#fatloss",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Build Muscle",
    description: "Optimize growth hormone and performance output",
    href: "/protocols#muscle",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 20V10" />
        <path d="M12 20V4" />
        <path d="M6 20v-6" />
      </svg>
    ),
  },
];

function GoalCard({ goal, className }: { goal: typeof goals[number]; className?: string }) {
  return (
    <Link
      href={goal.href}
      className={`group bg-[#0c2240]/80 border border-cyan-500/25 rounded-xl p-4 backdrop-blur-md transition-all duration-300 hover:bg-[#0c2240]/95 hover:border-cyan-400/50 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,200,200,0.1)] block ${className ?? ""}`}
    >
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary/20 text-secondary-light shrink-0">
          {goal.icon}
        </div>
        <h3 className="font-[family-name:var(--font-heading)] text-[15px] font-bold text-white">
          {goal.title}
        </h3>
      </div>
      <p className="text-[13px] text-white/50 leading-relaxed mb-1.5">
        {goal.description}
      </p>
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-light group-hover:gap-2.5 transition-all">
        See Protocol
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}

function GlowDot({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`absolute z-30 ${className ?? ""}`} style={style}>
      <div className="w-4 h-4 rounded-full bg-cyan-400/90 shadow-[0_0_12px_rgba(0,220,220,0.9),0_0_24px_rgba(0,220,220,0.5),0_0_40px_rgba(0,220,220,0.2)]" />
      <div className="absolute inset-0 w-4 h-4 rounded-full bg-cyan-400 animate-ping opacity-20" />
    </div>
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const lockedRef = useRef(false);
  const bufferRef = useRef(0);
  const doneRef = useRef(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Smooth animation loop — lerps current toward target
    function animate() {
      const diff = targetRef.current - currentRef.current;
      if (Math.abs(diff) > 0.001) {
        currentRef.current += diff * 0.1; // ease factor — lower = silkier
        setSmoothProgress(currentRef.current);
      } else if (currentRef.current !== targetRef.current) {
        currentRef.current = targetRef.current;
        setSmoothProgress(currentRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      const p = targetRef.current;

      // Animation done + in dead zone buffer — absorb scroll
      if (doneRef.current && e.deltaY > 0) {
        bufferRef.current += e.deltaY;
        if (bufferRef.current < 400) {
          e.preventDefault();
          return;
        }
        doneRef.current = false;
        return;
      }

      // If at end and scrolling up, recapture
      if (p >= 1 && e.deltaY < 0) {
        e.preventDefault();
        lockedRef.current = true;
        doneRef.current = false;
        bufferRef.current = 0;
      }

      // If animation in progress, capture scroll
      if (p > 0 && p < 1) {
        e.preventDefault();
        lockedRef.current = true;
      }

      // If at start and scrolling down, start capturing
      if (p === 0 && e.deltaY > 0) {
        e.preventDefault();
        lockedRef.current = true;
      }

      if (lockedRef.current) {
        const step = e.deltaY / 500;
        const next = Math.max(0, Math.min(1, p + step));
        targetRef.current = next;

        if (next <= 0) {
          lockedRef.current = false;
          bufferRef.current = 0;
          doneRef.current = false;
        }
        if (next >= 1) {
          lockedRef.current = false;
          doneRef.current = true;
          bufferRef.current = 0;
        }
      }
    }

    const el = sectionRef.current;
    if (el) {
      el.addEventListener("wheel", handleWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const progress = smoothProgress;

  // Eased curves for silky transitions
  const ease = (t: number) => t * t * (3 - 2 * t); // smoothstep
  const p = ease(progress);

  const textOpacity = Math.max(0, 1 - p * 2.2);
  const textScale = 1 - p * 0.05;
  const textBlur = p * 10;
  const cardsOpacity = Math.max(0, ease(Math.max(0, (progress - 0.25) / 0.75)));
  const cardsSlide = 30 * (1 - cardsOpacity);
  const overlayFade = 1 - p;

  return (
    <div ref={sectionRef}>
      <section className="relative overflow-hidden bg-[#0a1628]" style={{ height: "clamp(600px, 84vh, 830px)" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-athlete.png"
            alt=""
            fill
            className="object-cover"
            style={{ objectPosition: "center 95%" }}
            priority
          />
          {/* Bottom fade only — keeps athlete visible */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628] via-transparent to-transparent" />
          {/* Subtle side vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628]/40 via-transparent to-[#0a1628]/40" />
          {/* Dark overlay that lifts as you scroll to reveal the athlete */}
          <div
            className="absolute inset-0 bg-[#0a1628]/70 transition-none"
            style={{ opacity: Math.max(0, overlayFade * 0.85) }}
          />
        </div>

        {/* Text — fades out on scroll */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-center"
          style={{
            opacity: Math.max(0, textOpacity),
            transform: `scale(${textScale}) translateY(-5%)`,
            filter: `blur(${Math.max(0, textBlur)}px)`,
            pointerEvents: progress > 0.4 ? "none" : "auto",
          }}
        >
          <div className="text-center px-4">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white mb-4 drop-shadow-[0_2px_30px_rgba(0,0,0,0.5)]">
              Engineered Recovery.
              <br />
              Verified Purity.
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-lg mx-auto leading-relaxed drop-shadow-[0_1px_10px_rgba(0,0,0,0.4)]">
              Research-grade peptide protocols designed for athletes.
              <br className="hidden sm:block" />
              Every vial batch-tested by independent US labs.
            </p>
          </div>
        </div>

        {/* Cards + dots — fade in as text fades out */}
        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: cardsOpacity,
            pointerEvents: progress < 0.4 ? "none" : "auto",
          }}
        >
          <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full flex flex-col">
            {/* Desktop: cards around athlete */}
            <div className="hidden lg:block relative flex-1 mt-16">
              {/* Glow dots — matching the blue circles baked into the image */}
              <GlowDot className="left-[52%] top-[15%]" style={{ opacity: cardsOpacity }} />   {/* Shoulder circle */}
              <GlowDot className="left-[53%] top-[35%]" style={{ opacity: cardsOpacity }} />   {/* Stomach/core circle */}
              <GlowDot className="left-[51%] top-[44%]" style={{ opacity: cardsOpacity }} />   {/* Front thigh (raised leg) */}

              {/* Connector lines — solid */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" style={{ opacity: cardsOpacity }}>
                <defs>
                  <linearGradient id="line-glow-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,220,220,0.15)" />
                    <stop offset="50%" stopColor="rgba(0,240,240,0.6)" />
                    <stop offset="100%" stopColor="rgba(0,220,220,0.15)" />
                  </linearGradient>
                  <linearGradient id="line-glow-2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,220,220,0.15)" />
                    <stop offset="50%" stopColor="rgba(0,240,240,0.6)" />
                    <stop offset="100%" stopColor="rgba(0,220,220,0.15)" />
                  </linearGradient>
                  <linearGradient id="line-glow-3" x1="100%" y1="0%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="rgba(0,220,220,0.15)" />
                    <stop offset="50%" stopColor="rgba(0,240,240,0.6)" />
                    <stop offset="100%" stopColor="rgba(0,220,220,0.15)" />
                  </linearGradient>
                  <filter id="line-blur">
                    <feGaussianBlur stdDeviation="3" />
                  </filter>
                  <filter id="line-blur-wide">
                    <feGaussianBlur stdDeviation="6" />
                  </filter>
                </defs>
                {/* Wide outer glow */}
                <line x1="19%" y1="10%" x2="52%" y2="16%" stroke="rgba(0,240,240,0.15)" strokeWidth="10" filter="url(#line-blur-wide)" />
                <line x1="19%" y1="52%" x2="53%" y2="36%" stroke="rgba(0,240,240,0.15)" strokeWidth="10" filter="url(#line-blur-wide)" />
                <line x1="81%" y1="55%" x2="51%" y2="45%" stroke="rgba(0,240,240,0.15)" strokeWidth="10" filter="url(#line-blur-wide)" />
                {/* Inner glow */}
                <line x1="19%" y1="10%" x2="52%" y2="16%" stroke="rgba(0,240,240,0.4)" strokeWidth="5" filter="url(#line-blur)" />
                <line x1="19%" y1="52%" x2="53%" y2="36%" stroke="rgba(0,240,240,0.4)" strokeWidth="5" filter="url(#line-blur)" />
                <line x1="81%" y1="55%" x2="51%" y2="45%" stroke="rgba(0,240,240,0.4)" strokeWidth="5" filter="url(#line-blur)" />
                {/* Sharp bright core */}
                <line x1="19%" y1="10%" x2="52%" y2="16%" stroke="url(#line-glow-1)" strokeWidth="2.5" />
                <line x1="19%" y1="52%" x2="53%" y2="36%" stroke="url(#line-glow-2)" strokeWidth="2.5" />
                <line x1="81%" y1="55%" x2="51%" y2="45%" stroke="url(#line-glow-3)" strokeWidth="2.5" />
              </svg>

              {/* Recover Faster — upper left, points to bicep */}
              <div className="absolute left-0 top-[-2%] w-[195px] z-20" style={{ transform: `translateY(${cardsSlide}px)` }}>
                <GoalCard goal={goals[0]} />
              </div>

              {/* Lose Fat — mid left, points to stomach */}
              <div className="absolute left-0 top-[38%] w-[195px] z-20" style={{ transform: `translateY(${cardsSlide}px)` }}>
                <GoalCard goal={goals[1]} />
              </div>

              {/* Build Muscle — right side, points to thigh */}
              <div className="absolute right-[2%] top-[42%] w-[195px] z-20" style={{ transform: `translateY(${cardsSlide}px)` }}>
                <GoalCard goal={goals[2]} />
              </div>
            </div>

            {/* Mobile: horizontal scroll */}
            <div className="mt-auto pb-4 lg:hidden" style={{ transform: `translateY(${cardsSlide}px)` }}>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-4 px-4">
                {goals.map((goal) => (
                  <GoalCard key={goal.title} goal={goal} className="min-w-[190px] max-w-[190px] snap-start shrink-0" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
