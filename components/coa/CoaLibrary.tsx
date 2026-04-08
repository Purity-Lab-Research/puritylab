"use client";

import { useState } from "react";
import Link from "next/link";
import { getCoaUrl } from "@/lib/coa-url";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import CoaExplanation from "./CoaExplanation";

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

interface CoaLibraryProps {
  productCoas: ProductWithCoas[];
}

function ChevronDown({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export default function CoaLibrary({ productCoas }: CoaLibraryProps) {
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const gridRef = useScrollAnimation();

  function toggleExpanded(productId: string) {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-20">
      <div className="mb-14">
        {productCoas.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5"
          >
            {productCoas.map((product) => {
              const latest = product.coas[0];
              const olderCoas = product.coas.slice(1);
              const isExpanded = expandedProducts.has(product.id);
              const hasPdf = !!latest?.pdf_url;

              if (!latest) return null;

              return (
                <div
                  key={product.id}
                  className="bg-white border border-[#F0F0F0] rounded-2xl p-5 hover:shadow-lg transition-all flex flex-col"
                >
                  {/* Purity + verified badge */}
                  <div className="flex items-center gap-2 mb-3">
                    {latest.purity_percentage && (
                      <span className={`text-4xl font-extrabold ${latest.purity_percentage >= 98 ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                        {latest.purity_percentage}%
                      </span>
                    )}
                    {latest.purity_percentage >= 98 && (
                      <span className="w-6 h-6 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </div>

                  {/* Product name */}
                  <h3 className="text-sm font-bold text-[#111111] leading-snug mb-1 min-h-[2.25rem]">
                    {product.name}
                  </h3>

                  {/* Batch number */}
                  <p className="text-xs text-[#6B7280] font-mono mb-4">
                    {latest.batch_number}
                  </p>

                  <div className="mt-auto">
                    {hasPdf ? (
                      <a
                        href={getCoaUrl(latest.pdf_url!)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[#10B981] font-semibold text-sm hover:underline"
                      >
                        View Full CoA
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-xs text-[#9CA3AF]">PDF coming soon</span>
                    )}

                    {olderCoas.length > 0 && (
                      <div className="mt-3 border-t border-[#F0F0F0] pt-2">
                        <button
                          onClick={() => toggleExpanded(product.id)}
                          className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#111111] transition-colors"
                        >
                          <ChevronDown open={isExpanded} />
                          {olderCoas.length} previous {olderCoas.length === 1 ? "batch" : "batches"}
                        </button>
                        {isExpanded && (
                          <div className="mt-2 space-y-2">
                            {olderCoas.map((coa) => (
                              <div key={coa.id} className="flex items-center justify-between text-xs">
                                <span className="font-mono text-[#6B7280]">{coa.batch_number}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`font-semibold ${coa.purity_percentage >= 98 ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                                    {coa.purity_percentage}%
                                  </span>
                                  {coa.pdf_url && (
                                    <a href={getCoaUrl(coa.pdf_url)} target="_blank" rel="noopener noreferrer" className="text-[#10B981] hover:underline">
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
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-6 rounded-2xl border border-dashed border-[#F0F0F0] bg-white">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981]">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#111111] mb-2">Certificates Coming Soon</h3>
            <p className="text-sm text-[#6B7280] max-w-md mx-auto mb-6">
              Our lab results are being finalized. Every batch is independently tested before being published here.
            </p>
            <Link href="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-[#10B981] hover:underline">
              Request a specific CoA
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
          </div>
        )}
      </div>

      <CoaExplanation />
    </section>
  );
}
