"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const TAG_COLORS: Record<string, string> = {
  Beginner: "bg-[#10B981]",
  Guide: "bg-blue-500",
  Trust: "bg-amber-500",
};

const articles = [
  {
    tag: "Beginner",
    readTime: "8 min read",
    title: "New to Peptides? Start Here",
    href: "/learn/getting-started",
  },
  {
    tag: "Guide",
    readTime: "5 min read",
    title: "How to Reconstitute & Dose",
    href: "/learn/how-to-reconstitute",
  },
  {
    tag: "Trust",
    readTime: "4 min read",
    title: "How to Read a Certificate of Analysis",
    href: "/learn/how-to-read-coa",
  },
];

export default function EducationPreview() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-[#F0F0F0]">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
              Learn
            </h2>
            <p className="mt-3 text-[#6B7280]">
              Research-backed guides written for athletes, not scientists.
            </p>
          </div>
          <Link
            href="/resources"
            className="hidden md:inline-flex items-center gap-1.5 text-[#111111] font-semibold text-sm hover:underline"
          >
            View All Guides
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {articles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="p-7 bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${TAG_COLORS[article.tag] ?? "bg-gray-400"}`} />
                  <span className="text-[11px] font-bold text-[#111111] tracking-wider uppercase">
                    {article.tag}
                  </span>
                </span>
                <span className="text-[11px] text-[#6B7280]">
                  {article.readTime}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#111111] leading-snug">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Mobile "View All" link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/resources"
            className="inline-flex items-center gap-1.5 text-[#111111] font-semibold"
          >
            View All Guides
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
