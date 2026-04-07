"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { getCoaUrl } from "@/lib/coa-url";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import CoaExplanation from "./CoaExplanation";

/* ─── Types ─── */
interface CoaRow {
  id: string;
  batch_number: string;
  purity_percentage: number;
  pdf_url: string | null;
  test_date: string | null;
  created_at: string;
  product_id: string;
}

interface ProductWithCoas {
  id: string;
  name: string;
  slug: string;
  size: string;
  coas: CoaRow[];
}

interface BatchResult {
  batch_number: string;
  purity_percentage: number;
  pdf_url: string | null;
  test_date: string | null;
  product_name: string;
}

interface CoaLibraryProps {
  productCoas: ProductWithCoas[];
}

/* ─── Helpers ─── */
function formatDate(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function purityColor(purity: number): string {
  return purity >= 98 ? "text-success" : "text-warning";
}

/* ─── Icons ─── */
function ShieldCheck() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-success"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-white"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-75"
      />
    </svg>
  );
}

function DownloadIcon() {
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
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ─── Main Component ─── */
export default function CoaLibrary({ productCoas }: CoaLibraryProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<BatchResult | null>(null);
  const [searched, setSearched] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(
    new Set()
  );

  const gridRef = useScrollAnimation();

  const handleLookup = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    setSearching(true);
    setSearched(false);
    setResult(null);

    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("coa")
        .select("batch_number, purity_percentage, pdf_url, test_date, product:products(name)")
        .ilike("batch_number", trimmed)
        .limit(1)
        .single();

      if (data) {
        const productRaw = data.product as unknown as { name: string } | { name: string }[] | null;
        const product = Array.isArray(productRaw) ? productRaw[0] ?? null : productRaw;
        setResult({
          batch_number: data.batch_number,
          purity_percentage: data.purity_percentage,
          pdf_url: data.pdf_url,
          test_date: data.test_date,
          product_name: product?.name ?? "Unknown Product",
        });
      }
    } catch {
      // not found or error
    } finally {
      setSearching(false);
      setSearched(true);
    }
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLookup();
  }

  function toggleExpanded(productId: string) {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  return (
    <>
      {/* ─── CoA Library Grid ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        {/* ─── Batch Tracker — collapsible pill ─── */}
        <div className="max-w-2xl mx-auto mb-12 -mt-6 relative z-10">
          {/* Trigger button */}
          <button
            onClick={() => setTrackerOpen((o) => !o)}
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-full bg-white border border-border shadow-sm hover:shadow-md hover:border-secondary/40 transition-all text-sm font-medium text-text-secondary group"
          >
            <SearchIcon />
            <span>Have a batch number? <span className="text-secondary font-semibold">Look it up</span></span>
            <ChevronDown open={trackerOpen} />
          </button>

          {/* Expandable panel */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              trackerOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"
            }`}
          >
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-lg text-center">
              <p className="text-sm text-text-secondary mb-5">
                Enter the batch number from your vial to see the exact Certificate of Analysis.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. PL-2026-0142"
                  className="flex-1 bg-surface border border-border rounded-xl px-5 py-3.5 text-primary placeholder-text-secondary/40 text-center font-mono tracking-wider focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary/20 transition-all"
                />
                <button
                  onClick={handleLookup}
                  disabled={searching || !query.trim()}
                  className="bg-primary text-white rounded-xl px-6 py-3.5 font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                >
                  {searching ? <Spinner /> : <SearchIcon />}
                  {searching ? "Searching..." : "Look Up"}
                </button>
              </div>

              {/* Result */}
              {searched && result && (
                <div className="mt-6 bg-surface rounded-xl p-6 text-left max-w-lg mx-auto border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-heading text-lg font-bold text-primary">
                        {result.product_name}
                      </h3>
                      <p className="font-mono text-xs text-text-secondary mt-0.5">
                        {result.batch_number}
                      </p>
                    </div>
                    <ShieldCheck />
                  </div>

                  <div className="mb-4">
                    <span
                      className={`font-heading text-4xl font-extrabold ${purityColor(result.purity_percentage)}`}
                    >
                      {result.purity_percentage}%
                    </span>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">
                      Verified Purity
                    </p>
                  </div>

                  <div className="space-y-2 text-sm text-text-secondary border-t border-border pt-3">
                    <div className="flex justify-between">
                      <span>Test Date</span>
                      <span className="text-text-primary font-medium">
                        {formatDate(result.test_date)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Methodology</span>
                      <span className="text-text-primary font-medium text-right text-xs">
                        HPLC + Mass Spec
                      </span>
                    </div>
                  </div>

                  {result.pdf_url && (
                    <a
                      href={getCoaUrl(result.pdf_url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 flex items-center justify-center gap-2 w-full bg-primary text-white rounded-lg py-3 font-semibold hover:bg-primary-hover transition-colors text-sm"
                    >
                      <DownloadIcon />
                      Download Full CoA
                    </a>
                  )}
                </div>
              )}

              {searched && !result && (
                <p className="mt-4 text-sm text-text-secondary">
                  No results found. Please check the batch number and try again.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-14">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-primary">
              All Certificates of Analysis
            </h2>
            <p className="mt-2 text-text-secondary">
              Every product, every batch, every test result published.
            </p>
          </div>

          {productCoas.length > 0 ? (
            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {productCoas.map((product) => {
                const latest = product.coas[0];
                const olderCoas = product.coas.slice(1);
                const isExpanded = expandedProducts.has(product.id);

                if (!latest) return null;

                return (
                  <div
                    key={product.id}
                    className="bg-surface border border-border rounded-xl p-6 hover:border-secondary hover:shadow-md transition-all relative"
                  >
                    {/* Verified badge */}
                    <div className="absolute top-4 right-4">
                      <ShieldCheck />
                    </div>

                    {/* Product info */}
                    <h3 className="font-heading text-lg font-bold text-primary pr-8">
                      {product.name}
                    </h3>
                    <p className="text-sm text-text-secondary">{product.size}</p>

                    {/* Purity */}
                    <div className="mt-4 mb-1">
                      <span
                        className={`font-heading text-4xl font-extrabold ${purityColor(latest.purity_percentage)}`}
                      >
                        {latest.purity_percentage}%
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary uppercase tracking-wider mb-4">
                      Verified Purity
                    </p>

                    {/* Details */}
                    <div className="space-y-1.5 text-xs text-text-secondary border-t border-border pt-3">
                      <p>
                        <span className="font-mono">{latest.batch_number}</span>
                      </p>
                      <p>{formatDate(latest.test_date)}</p>
                    </div>

                    {/* View CoA */}
                    <div className="mt-4">
                      {latest.pdf_url ? (
                        <a
                          href={getCoaUrl(latest.pdf_url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-secondary font-semibold text-sm hover:underline"
                        >
                          <DownloadIcon />
                          View Full CoA
                        </a>
                      ) : (
                        <span className="text-xs text-text-secondary">
                          PDF coming soon
                        </span>
                      )}
                    </div>

                    {/* Previous batches */}
                    {olderCoas.length > 0 && (
                      <div className="mt-4 border-t border-border pt-3">
                        <button
                          onClick={() => toggleExpanded(product.id)}
                          className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors"
                        >
                          <ChevronDown open={isExpanded} />
                          {olderCoas.length} previous{" "}
                          {olderCoas.length === 1 ? "batch" : "batches"}
                        </button>
                        {isExpanded && (
                          <div className="mt-2 space-y-2">
                            {olderCoas.map((coa) => (
                              <div
                                key={coa.id}
                                className="flex items-center justify-between text-xs"
                              >
                                <div>
                                  <span className="font-mono text-text-secondary">
                                    {coa.batch_number}
                                  </span>
                                  <span className="text-text-secondary ml-2">
                                    {formatDate(coa.test_date)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span
                                    className={`font-semibold ${purityColor(coa.purity_percentage)}`}
                                  >
                                    {coa.purity_percentage}%
                                  </span>
                                  {coa.pdf_url && (
                                    <a
                                      href={getCoaUrl(coa.pdf_url)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-secondary hover:underline"
                                    >
                                      PDF
                                    </a>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            /* ─── Empty state ─── */
            <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-border bg-surface/50">
              <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-secondary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="font-heading text-lg font-bold text-primary mb-2">
                Certificates Coming Soon
              </h3>
              <p className="text-sm text-text-secondary max-w-md mx-auto mb-6">
                Our lab results are being finalized. Every batch is independently
                tested before being published here.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
              >
                Request a specific CoA
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          )}
        </div>

        {/* ─── CoA Explanation ─── */}
        <CoaExplanation />
      </section>
    </>
  );
}
