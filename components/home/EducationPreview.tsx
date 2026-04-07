"use client";

import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

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
    <section className="bg-surface py-20 border-t border-border">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-4xl font-extrabold text-primary">
              Learn
            </h2>
            <p className="mt-3 text-text-secondary">
              Research-backed guides written for athletes, not scientists.
            </p>
          </div>
          <Link
            href="/learn"
            className="hidden md:inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
          >
            View All Guides
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.title}
              href={article.href}
              className="p-7 bg-background border border-border rounded-xl transition-all hover:border-secondary hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2.5 mb-4">
                <span className="bg-secondary/10 text-secondary text-[11px] font-bold px-2.5 py-1 rounded tracking-wider">
                  {article.tag}
                </span>
                <span className="text-[11px] text-text-secondary">
                  {article.readTime}
                </span>
              </div>
              <h3 className="font-heading text-lg font-bold text-primary leading-snug">
                {article.title}
              </h3>
            </Link>
          ))}
        </div>

        {/* Mobile "View All" link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/learn"
            className="inline-flex items-center gap-1.5 text-secondary font-semibold"
          >
            View All Guides
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
