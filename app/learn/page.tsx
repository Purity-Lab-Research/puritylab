import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import {
  articles,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getArticlesByCategory,
} from "@/lib/articles";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "Education Hub",
  description:
    "Research-backed guides on peptides written for athletes. Learn about reconstitution, dosing, CoAs, recovery protocols, fat loss, and more.",
};

function ArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
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
  );
}

export default function LearnPage() {
  return (
    <>
      <PageHeader
        title="Education Hub"
        description="Research-backed guides written for athletes, not scientists."
        breadcrumbs={[{ label: "Learn" }]}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {CATEGORY_ORDER.map((category) => {
          const categoryArticles = getArticlesByCategory(category);
          if (categoryArticles.length === 0) return null;

          return (
            <div key={category} className="mb-14">
              <h2 className="font-heading text-2xl font-bold text-primary mb-6">
                {CATEGORY_LABELS[category]}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryArticles.map((article, i) => (
                  <ScrollReveal key={article.slug} delay={i * 0.08}>
                    <Link
                      href={`/learn/${article.slug}`}
                      className="block bg-surface border border-border rounded-xl p-7 hover:border-secondary hover:-translate-y-0.5 transition-all h-full"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="bg-secondary/10 text-secondary text-[11px] font-bold px-2.5 py-1 rounded tracking-wider">
                          {article.tag}
                        </span>
                        <span className="text-[11px] text-text-secondary">
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="font-heading text-lg font-bold text-primary leading-snug mt-4">
                        {article.title}
                      </h3>

                      <p className="text-sm text-text-secondary leading-relaxed mt-2 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <span className="inline-flex items-center gap-1 text-secondary text-sm font-semibold mt-4">
                        Read more
                        <ArrowIcon />
                      </span>
                    </Link>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
