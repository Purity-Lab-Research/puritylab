"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  ExternalLink,
  AlertTriangle,
  ShoppingCart,
} from "lucide-react";
import { PEPTIDE_DATA } from "@/lib/peptide-research";

const cardCls = "bg-surface border border-border rounded-xl p-6 md:p-8";

export default function ResearchLibrary() {
  const [filterPeptide, setFilterPeptide] = useState("All");

  const peptideNames = ["All", ...PEPTIDE_DATA.map((p) => p.name)];

  const entries =
    filterPeptide === "All"
      ? PEPTIDE_DATA.filter((p) => p.studies.length > 0)
      : PEPTIDE_DATA.filter(
          (p) => p.name === filterPeptide && p.studies.length > 0
        );

  const totalStudies = PEPTIDE_DATA.reduce((n, p) => n + p.studies.length, 0);

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <FileText className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Published Research Library
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        {totalStudies} peer-reviewed studies across {PEPTIDE_DATA.length}{" "}
        peptides. All links go to PubMed for full abstracts and citations.
      </p>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {peptideNames.map((name) => (
          <button
            key={name}
            onClick={() => setFilterPeptide(name)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterPeptide === name
                ? "bg-primary text-white"
                : "bg-background text-text-secondary hover:text-primary border border-border"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {entries.map((p) => (
          <div
            key={p.name}
            className="bg-background rounded-lg border border-border p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <h4 className="font-heading font-bold text-primary text-sm">
                  {p.name}
                </h4>
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold">
                  {p.category}
                </span>
              </div>
              {p.productSlugs.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.productSlugs.map((ps) => (
                    <Link
                      key={ps.slug}
                      href={`/shop/${ps.slug}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-semibold hover:bg-secondary/20 transition-colors"
                    >
                      <ShoppingCart className="w-2.5 h-2.5" />
                      {ps.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              {p.studies.map((s, si) => (
                <div
                  key={si}
                  className="flex items-start gap-3 text-xs group"
                >
                  <span className="text-text-secondary mt-0.5 shrink-0 font-mono text-[10px] w-4 text-right">
                    {si + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    {s.pmid ? (
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-primary hover:text-secondary transition-colors"
                      >
                        {s.title}
                        <ExternalLink className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    ) : (
                      <span className="text-text-primary">{s.title}</span>
                    )}
                    <p className="text-text-secondary mt-0.5">
                      {s.journal} ({s.year})
                      {s.pmid && (
                        <span className="ml-2 text-text-secondary/60">
                          PMID: {s.pmid}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-amber-500/5 border border-amber-500/10 rounded-lg p-4 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-xs text-text-secondary leading-relaxed">
          These references are provided for educational purposes only. Inclusion
          of a study does not imply endorsement of its conclusions. Many studies
          were conducted in animal models and may not translate directly to human
          outcomes. Always review the full text and consult qualified
          professionals before drawing conclusions.
        </p>
      </div>
    </div>
  );
}
