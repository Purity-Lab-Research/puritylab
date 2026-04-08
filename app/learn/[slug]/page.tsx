import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  articles,
  getArticleBySlug,
  CATEGORY_LABELS,
} from "@/lib/articles";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: article.title,
    description: article.excerpt,
  };
}

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

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const paragraphs = article.content
    .split("\n\n")
    .filter((p) => p.trim().length > 0);

  const relatedArticles = article.relatedArticleSlugs
    .map((s) => getArticleBySlug(s))
    .filter(Boolean);

  return (
    <>
      <PageHeader
        title={article.title}
        breadcrumbs={[
          { label: "Learn & Resources", href: "/resources" },
          { label: article.title },
        ]}
      />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Metadata bar */}
        <div className="flex items-center gap-3 mb-10">
          <span className="bg-secondary/10 text-secondary text-[11px] font-bold px-2.5 py-1 rounded tracking-wider">
            {article.tag}
          </span>
          <span className="text-[11px] text-text-secondary">
            {article.readTime}
          </span>
          <span className="text-[11px] text-text-secondary">
            {CATEGORY_LABELS[article.category]}
          </span>
        </div>

        {/* Article body */}
        <div className="space-y-6">
          {paragraphs.map((paragraph, i) => (
            <p
              key={i}
              className={`font-body leading-relaxed ${
                i === 0
                  ? "text-lg text-text-secondary"
                  : "text-base text-text-secondary"
              }`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* Related products */}
        {article.relatedProductSlugs.length > 0 && (
          <div className="bg-background border border-border rounded-xl p-6 my-10">
            <h3 className="font-heading text-base font-bold text-primary mb-3">
              Products mentioned in this article
            </h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {article.relatedProductSlugs.map((productSlug) => (
                <Link
                  key={productSlug}
                  href={`/shop/${productSlug}`}
                  className="text-secondary font-semibold text-sm hover:underline"
                >
                  {productSlug
                    .split("-")
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(" ")}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        <ScrollReveal>
          <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-8 text-center mt-12">
            <h3 className="font-heading text-xl font-bold text-primary mb-2">
              Ready to start?
            </h3>
            <p className="text-sm text-text-secondary mb-4">
              Take our 60-second quiz to find the right protocol for your goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/quiz"
                className="inline-block bg-primary text-white rounded-lg px-6 py-2.5 font-semibold text-sm hover:bg-primary-hover transition-colors"
              >
                Find My Protocol
              </Link>
              <Link
                href="/protocols"
                className="inline-block text-sm text-secondary font-semibold hover:underline"
              >
                Or explore all protocols
              </Link>
            </div>
          </div>
        </ScrollReveal>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16">
            <h3 className="font-heading text-xl font-bold text-primary mb-6">
              Continue Reading
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((related) => (
                <Link
                  key={related!.slug}
                  href={`/learn/${related!.slug}`}
                  className="block bg-surface border border-border rounded-xl p-7 hover:border-secondary hover:-translate-y-0.5 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="bg-secondary/10 text-secondary text-[11px] font-bold px-2.5 py-1 rounded tracking-wider">
                      {related!.tag}
                    </span>
                    <span className="text-[11px] text-text-secondary">
                      {related!.readTime}
                    </span>
                  </div>
                  <h4 className="font-heading text-lg font-bold text-primary leading-snug mt-4">
                    {related!.title}
                  </h4>
                  <span className="inline-flex items-center gap-1 text-secondary text-sm font-semibold mt-3">
                    Read more
                    <ArrowIcon />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
