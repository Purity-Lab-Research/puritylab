"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ResearchLibrary from "@/components/learn/ResearchLibrary";
import {
  articles,
  CATEGORY_ORDER,
  CATEGORY_LABELS,
  getArticlesByCategory,
} from "@/lib/articles";
import {
  Calculator,
  FlaskConical,
  BookOpen,
  Thermometer,
  ShieldCheck,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  FileText,
  ShoppingCart,
} from "lucide-react";
import { PEPTIDE_DATA } from "@/lib/peptide-research";

/* ─── Shared Styles ─── */
const inputCls =
  "w-full rounded-lg border border-[#F0F0F0] bg-white px-4 py-3 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/20 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";

const labelCls =
  "block text-xs font-semibold text-[#111111] uppercase tracking-wider mb-1.5";

const sectionTitleCls =
  "text-xl sm:text-2xl md:text-3xl font-extrabold text-[#111111] mb-1 sm:mb-2";

const sectionDescCls = "text-xs sm:text-sm text-[#6B7280] mb-6 sm:mb-8 max-w-2xl";

const cardCls = "bg-white border border-[#F0F0F0] rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8";

/* ─── 4 Simple Tabs ─── */
const TABS = [
  { id: "getting-started", label: "Getting Started", icon: BookOpen },
  { id: "tools", label: "Tools", icon: Calculator },
  { id: "reference", label: "Reference", icon: FlaskConical },
  { id: "faq", label: "FAQ & Help", icon: HelpCircle },
];

/* ─── Nav Component ─── */
function ResourceNav({
  active,
  onChange,
}: {
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-[#F0F0F0]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-around sm:justify-center sm:gap-2 py-2">
          {TABS.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                aria-label={tab.label}
                className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-full text-[10px] sm:text-sm font-semibold transition-all min-w-0 ${
                  isActive
                    ? "bg-[#111111] text-white shadow-sm"
                    : "text-[#6B7280] hover:text-[#111111] hover:bg-[#F5F5F5]"
                }`}
              >
                <tab.icon className={`w-5 h-5 sm:w-4 sm:h-4 shrink-0 ${isActive ? "" : "opacity-50"}`} />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   DILUTION CALCULATOR
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function DilutionCalculator() {
  const [soluteMg, setSoluteMg] = useState("");
  const [solventMl, setSolventMl] = useState("");

  const result = useMemo(() => {
    const s = parseFloat(soluteMg);
    const v = parseFloat(solventMl);
    if (!s || !v || s <= 0 || v <= 0) return null;

    const totalMcg = s * 1000;
    const concMcgPerMl = totalMcg / v;
    const concMgPerMl = s / v;

    return {
      concMcgPerMl: Math.round(concMcgPerMl * 10) / 10,
      concMgPerMl: Math.round(concMgPerMl * 100) / 100,
    };
  }, [soluteMg, solventMl]);

  const refTable = useMemo(() => {
    const s = parseFloat(soluteMg);
    if (!s || s <= 0) return [];
    return [1, 2, 3, 5].map((ml) => ({
      ml,
      concMcgPerMl: Math.round(((s * 1000) / ml) * 10) / 10,
      concMgPerMl: Math.round((s / ml) * 100) / 100,
    }));
  }, [soluteMg]);

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Dilution Calculator for Laboratory Preparation
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Determine the resulting concentration when dissolving a lyophilized
        reference standard into a known volume of solvent.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Solute amount (mg)</label>
            <input
              type="number"
              value={soluteMg}
              onChange={(e) => setSoluteMg(e.target.value)}
              placeholder="e.g. 5"
              className={inputCls}
              min="0"
              step="any"
            />
          </div>
          <div>
            <label className={labelCls}>Solvent volume (mL)</label>
            <input
              type="number"
              value={solventMl}
              onChange={(e) => setSolventMl(e.target.value)}
              placeholder="e.g. 2"
              className={inputCls}
              min="0"
              step="any"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {result ? (
            <div className="space-y-4">
              <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-text-secondary">
                    Concentration (mcg/mL)
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {result.concMcgPerMl} mcg/mL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">
                    Concentration (mg/mL)
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {result.concMgPerMl} mg/mL
                  </span>
                </div>
              </div>

              {refTable.length > 0 && (
                <div>
                  <p className="text-xs text-text-secondary mb-2">
                    Reference table (various solvent volumes):
                  </p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-background">
                          <th className="px-3 py-2 text-left text-text-secondary font-semibold">
                            Solvent (mL)
                          </th>
                          <th className="px-3 py-2 text-right text-text-secondary font-semibold">
                            mcg/mL
                          </th>
                          <th className="px-3 py-2 text-right text-text-secondary font-semibold">
                            mg/mL
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {refTable.map((row) => (
                          <tr
                            key={row.ml}
                            className={
                              row.ml === parseFloat(solventMl)
                                ? "bg-secondary/5"
                                : ""
                            }
                          >
                            <td className="px-3 py-2 text-text-primary">
                              {row.ml} mL
                            </td>
                            <td className="px-3 py-2 text-right text-text-primary font-medium">
                              {row.concMcgPerMl} mcg/mL
                            </td>
                            <td className="px-3 py-2 text-right text-text-primary font-medium">
                              {row.concMgPerMl} mg/mL
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-sm text-text-secondary py-8">
              Enter values to calculate the resulting concentration.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ARTICLES & GUIDES (from /learn)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const TAG_COLORS: Record<string, string> = {
  Beginner: "bg-[#10B981] text-white",
  Guide: "bg-blue-500 text-white",
  Trust: "bg-amber-500 text-white",
  Science: "bg-purple-500 text-white",
  Protocol: "bg-[#111111] text-white",
  Advanced: "bg-rose-500 text-white",
};

function ArticlesSection() {
  return (
    <div className="space-y-10">
      {CATEGORY_ORDER.map((category) => {
        const categoryArticles = getArticlesByCategory(category);
        if (categoryArticles.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-bold text-[#111111] mb-4">
              {CATEGORY_LABELS[category]}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {categoryArticles.map((article, i) => (
                <ScrollReveal key={article.slug} delay={i * 0.06}>
                  <Link
                    href={`/learn/${article.slug}`}
                    className="block bg-[#FAFAFA] sm:bg-white border border-[#F0F0F0] rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 h-full"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider ${
                          TAG_COLORS[article.tag] ?? "bg-[#111111] text-white"
                        }`}
                      >
                        {article.tag}
                      </span>
                      <span className="text-[11px] text-[#6B7280]">
                        {article.readTime}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#111111] leading-snug mt-3">
                      {article.title}
                    </h4>

                    <p className="text-sm text-[#6B7280] leading-relaxed mt-1.5 line-clamp-2">
                      {article.excerpt}
                    </p>

                    <span className="inline-flex items-center gap-1 text-[#10B981] text-sm font-semibold mt-3">
                      Read more
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
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PEPTIDE QUICK-REFERENCE GUIDE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function PeptideGuide() {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [filterCat, setFilterCat] = useState("All");

  const categories = [
    "All",
    ...Array.from(new Set(PEPTIDE_DATA.map((p) => p.category))),
  ];

  const filtered =
    filterCat === "All"
      ? PEPTIDE_DATA
      : PEPTIDE_DATA.filter((p) => p.category === filterCat);

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Peptide Quick-Reference Guide
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        At-a-glance comparison of research peptides, including molecular
        properties and published study references. Tap any row for details.
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              filterCat === cat
                ? "bg-primary text-white"
                : "bg-background text-text-secondary hover:text-primary border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Table - desktop */}
      <div className="hidden md:block border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-background text-left">
              <th className="px-4 py-3 font-semibold text-text-secondary">
                Peptide
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">
                Category
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">
                Mechanism
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary w-8" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <>
                <tr
                  key={p.name}
                  onClick={() =>
                    setExpandedRow(expandedRow === p.name ? null : p.name)
                  }
                  className="hover:bg-primary/[0.02] cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-primary">
                    {p.name}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {p.category}
                  </td>
                  <td className="px-4 py-3 text-text-primary text-xs">{p.mechanism}</td>
                  <td className="px-4 py-3 text-text-secondary">
                    {expandedRow === p.name ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </td>
                </tr>
                {expandedRow === p.name && (
                  <tr key={`${p.name}-detail`}>
                    <td
                      colSpan={4}
                      className="px-4 py-4 bg-primary/[0.02] text-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            Mechanism of Action
                          </p>
                          <p className="text-text-primary">{p.mechanism}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            Research Applications
                          </p>
                          <p className="text-text-primary">{p.researchApplications}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border">
                        {p.productSlugs.length > 0 && (
                          <div className="flex items-center gap-2">
                            <ShoppingCart className="w-3.5 h-3.5 text-secondary" />
                            {p.productSlugs.map((ps) => (
                              <Link
                                key={ps.slug}
                                href={`/shop/${ps.slug}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-colors"
                              >
                                {ps.label}
                              </Link>
                            ))}
                          </div>
                        )}
                        {p.studies.length > 0 && (
                          <div className="flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5 text-text-secondary" />
                            <span className="text-xs text-text-secondary">
                              {p.studies.length} published studies
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cards - mobile */}
      <div className="md:hidden space-y-3">
        {filtered.map((p) => (
          <div
            key={p.name}
            className="border border-border rounded-lg overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedRow(expandedRow === p.name ? null : p.name)
              }
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="font-semibold text-primary text-sm">{p.name}</p>
                <p className="text-xs text-text-secondary">{p.category}</p>
              </div>
              {expandedRow === p.name ? (
                <ChevronUp className="w-4 h-4 text-text-secondary" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-secondary" />
              )}
            </button>
            {expandedRow === p.name && (
              <div className="px-4 pb-4 space-y-2 text-xs border-t border-border pt-3">
                <div className="pt-1">
                  <p className="text-text-secondary font-semibold mb-0.5">
                    Mechanism of Action
                  </p>
                  <p className="text-text-primary">{p.mechanism}</p>
                </div>
                <div>
                  <p className="text-text-secondary font-semibold mb-0.5">
                    Research Applications
                  </p>
                  <p className="text-text-primary">{p.researchApplications}</p>
                </div>
                {p.productSlugs.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-2">
                    {p.productSlugs.map((ps) => (
                      <Link
                        key={ps.slug}
                        href={`/shop/${ps.slug}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold hover:bg-secondary/20 transition-colors"
                      >
                        <ShoppingCart className="w-3 h-3" />
                        {ps.label}
                      </Link>
                    ))}
                  </div>
                )}
                {p.studies.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-text-secondary">
                    <FileText className="w-3 h-3" />
                    <span>{p.studies.length} published studies</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-text-secondary mt-4 italic">
        All information is from published research literature and is
        provided for reference purposes only. These materials do not
        constitute recommendations for human or animal use.
      </p>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   HANDLING AND STORAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const STORAGE_ITEMS = [
  {
    state: "Lyophilized (powder)",
    icon: "vial",
    temp: "Room temp or refrigerated",
    duration: "12-24+ months",
    notes:
      "Stable at room temperature during shipping. Refrigeration extends shelf life. Keep away from direct sunlight and heat sources. Sealed vials are highly stable.",
  },
  {
    state: "Reconstituted (in solution)",
    icon: "droplet",
    temp: "2-8\u00B0C (refrigerator)",
    duration: "28-30 days",
    notes:
      "Must be refrigerated immediately after reconstitution. Never freeze reconstituted peptides, as ice crystals damage peptide bonds. Keep vials upright to avoid contaminating the stopper.",
  },
  {
    state: "Bacteriostatic Water",
    icon: "water",
    temp: "Room temp or refrigerated",
    duration: "28 days once opened",
    notes:
      "Contains 0.9% benzyl alcohol as preservative. Stable at room temperature when sealed. Once the stopper is pierced, use within 28 days. Always swab before withdrawing solvent.",
  },
];

function StorageGuide() {
  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <Thermometer className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Handling and Storage
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Proper storage is critical for maintaining the integrity and stability
        of research peptides in a laboratory setting.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {STORAGE_ITEMS.map((item) => (
          <div
            key={item.state}
            className="bg-background rounded-lg p-5 border border-border"
          >
            <p className="font-heading font-bold text-primary text-sm mb-3">
              {item.state}
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-text-secondary">Temperature</span>
                <span className="text-text-primary font-medium text-right">
                  {item.temp}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Shelf life</span>
                <span className="text-text-primary font-medium">
                  {item.duration}
                </span>
              </div>
            </div>
            <p className="text-xs text-text-secondary mt-3 leading-relaxed">
              {item.notes}
            </p>
          </div>
        ))}
      </div>

      {/* Do's and Don'ts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-500/5 border border-green-500/10 rounded-lg p-5">
          <p className="font-heading font-bold text-green-700 text-sm mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Recommended Practices
          </p>
          <ul className="space-y-2 text-xs text-text-primary">
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Swab vial stoppers with 70% isopropyl alcohol before each withdrawal
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Use sterile, single-use transfer equipment for each procedure
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Store reconstituted vials upright in a refrigerator at 2-8 degrees C
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Label vials with reconstitution date and concentration
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Allow solvent to trickle down the vial wall rather than spraying directly on powder
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Gently roll or swirl vials to dissolve; never shake
            </li>
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-5">
          <p className="font-heading font-bold text-red-700 text-sm mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Avoid
          </p>
          <ul className="space-y-2 text-xs text-text-primary">
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Freezing reconstituted peptides; ice crystal formation damages peptide bonds
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Exposing vials to direct sunlight or temperatures above 25 degrees C
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Reusing transfer equipment, which risks contamination
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Using reconstituted peptides past 30 days
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Shaking vials vigorously, which can denature the peptide
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Using cloudy, discolored, or particulate-containing solutions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   LABORATORY SAFETY CHECKLIST
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const CHECKLIST_SECTIONS = [
  {
    title: "Before You Begin",
    items: [
      "Verify your peptide has a valid, batch-specific Certificate of Analysis",
      "Confirm peptide identity via Mass Spectrometry and purity via HPLC (98%+)",
      "Check the vial seal is intact and the lyophilized powder appears normal (white to off-white)",
      "Ensure you have all required supplies: solvent, sterile transfer equipment, alcohol swabs",
      "Wash hands thoroughly and use appropriate personal protective equipment",
      "Prepare a clean, flat, well-lit laboratory workspace",
    ],
  },
  {
    title: "During Reconstitution",
    items: [
      "Swab both the peptide vial and solvent vial stoppers with alcohol",
      "Withdraw the desired volume of solvent with sterile equipment",
      "Insert needle and allow solvent to trickle down the inside wall of the peptide vial",
      "Gently roll or swirl to dissolve; never shake the vial",
      "Wait until the solution is completely clear before proceeding",
      "Label the vial with: peptide name, concentration, and date of reconstitution",
    ],
  },
  {
    title: "After Preparation",
    items: [
      "Return the reconstituted vial to refrigerated storage (2-8 degrees C) immediately",
      "Dispose of used transfer equipment in an appropriate sharps container",
      "Log the preparation details: compound, concentration, date, and solvent used",
      "Discard reconstituted peptides after 28-30 days, regardless of remaining volume",
    ],
  },
];

function SafetyChecklist() {
  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Laboratory Safety Checklist
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Follow this step-by-step checklist for proper handling and
        preparation of research peptides.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CHECKLIST_SECTIONS.map((section, si) => (
          <div
            key={section.title}
            className="bg-background rounded-lg border border-border p-5"
          >
            <p className="font-heading font-bold text-primary text-sm mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                {si + 1}
              </span>
              {section.title}
            </p>
            <ul className="space-y-2">
              {section.items.map((item, ii) => (
                <li key={ii} className="flex gap-2 text-xs text-text-primary">
                  <span className="text-secondary mt-0.5 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GLOSSARY
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const GLOSSARY: { term: string; definition: string }[] = [
  { term: "Amino Acid", definition: "The building blocks of peptides and proteins. There are 20 standard amino acids that combine in different sequences to form peptides." },
  { term: "AMPK", definition: "AMP-activated protein kinase, a master metabolic regulator that controls energy balance at the cellular level." },
  { term: "Angiogenesis", definition: "The formation of new blood vessels from existing ones. A key process studied in tissue biology and wound healing research." },
  { term: "BAC Water", definition: "Bacteriostatic water: sterile water containing 0.9% benzyl alcohol as a preservative. A common solvent for reconstituting lyophilized peptides." },
  { term: "BDNF", definition: "Brain-Derived Neurotrophic Factor, a protein that supports neuron growth, survival, and plasticity. Investigated in neuroscience research." },
  { term: "Bioavailability", definition: "The proportion of a substance that enters systemic circulation and is available to exert biological activity. A key pharmacokinetic parameter." },
  { term: "CoA (Certificate of Analysis)", definition: "A document from an analytical laboratory confirming the identity (via MS) and purity (via HPLC) of a specific product batch." },
  { term: "DAC (Drug Affinity Complex)", definition: "A molecular modification that extends the biological half-life of certain peptide compounds in research settings." },
  { term: "GH (Growth Hormone)", definition: "A peptide hormone produced by the pituitary gland that stimulates growth, cell reproduction, and regeneration. Widely studied in endocrinology." },
  { term: "GHRH", definition: "Growth Hormone Releasing Hormone, a naturally occurring hormone that stimulates GH release from the anterior pituitary. A subject of endocrine research." },
  { term: "GHS (Growth Hormone Secretagogue)", definition: "A class of compounds studied for their ability to stimulate pituitary release of growth hormone through receptor-mediated pathways." },
  { term: "Half-life", definition: "The time required for the concentration of a compound to decrease by half. A fundamental pharmacokinetic property that informs experimental design." },
  { term: "HPLC", definition: "High-Performance Liquid Chromatography, the industry-standard analytical method for measuring peptide purity. Research-grade peptides test at 98%+." },
  { term: "IU (International Unit)", definition: "A standardized measurement unit for biological substances based on their biological activity, as defined by international agreement." },
  { term: "Lyophilized", definition: "Freeze-dried. Peptides are supplied as lyophilized powder for maximum stability. Must be reconstituted with an appropriate solvent before use." },
  { term: "Mass Spectrometry (MS)", definition: "An analytical technique that measures molecular weight to confirm the identity of a compound. Used alongside HPLC on Certificates of Analysis." },
  { term: "mcg (Microgram)", definition: "One millionth of a gram (1/1000 of a mg). A standard unit of measurement in peptide research. Example: 250 mcg = 0.25 mg." },
  { term: "Peptide Bond", definition: "The chemical bond that links amino acids together to form peptides and proteins. Formed by a condensation reaction between the carboxyl and amino groups." },
  { term: "Reconstitution", definition: "The process of dissolving lyophilized peptide powder into a liquid solution using an appropriate solvent such as bacteriostatic water." },
  { term: "Telomerase", definition: "An enzyme that maintains telomere length on chromosomes. A subject of aging and cell biology research." },
  { term: "VEGF", definition: "Vascular Endothelial Growth Factor, a signaling protein that promotes blood vessel formation. Studied in tissue biology and angiogenesis research." },
];

function Glossary() {
  const [search, setSearch] = useState("");
  const filtered = search
    ? GLOSSARY.filter(
        (g) =>
          g.term.toLowerCase().includes(search.toLowerCase()) ||
          g.definition.toLowerCase().includes(search.toLowerCase())
      )
    : GLOSSARY;

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <BookOpen className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Peptide Glossary
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-4">
        {GLOSSARY.length} terms covering peptide science, analytical testing,
        and laboratory terminology.
      </p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search terms..."
        className={inputCls + " mb-4"}
      />

      <div className="max-h-[500px] overflow-y-auto space-y-0 divide-y divide-border border border-border rounded-lg">
        {filtered.map((g) => (
          <div key={g.term} className="px-4 py-3">
            <p className="font-semibold text-primary text-sm">{g.term}</p>
            <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
              {g.definition}
            </p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-8 text-center text-sm text-text-secondary">
            No terms match your search.
          </div>
        )}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FAQ
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const FAQ_ITEMS = [
  {
    q: "What is the difference between peptides and proteins?",
    a: "Size. Peptides are short chains of amino acids (typically 2-50 amino acids), while proteins are longer chains (50+ amino acids) with complex three-dimensional structures. All peptides and proteins are made of amino acids linked by peptide bonds, but peptides are smaller and often act as signaling molecules rather than structural components.",
  },
  {
    q: "Do peptides need to be refrigerated before reconstitution?",
    a: "Not strictly necessary for short-term storage. Lyophilized (freeze-dried) peptides are highly stable at room temperature for weeks to months. However, refrigeration (2-8 degrees C) extends shelf life and is recommended for long-term storage. Once reconstituted with bacteriostatic water, refrigeration is mandatory. Use within 28-30 days.",
  },
  {
    q: "Can sterile water be used instead of bacteriostatic water?",
    a: "Technically yes, but it is not recommended for multi-use applications. Sterile water has no preservative, so the reconstituted solution must be used within 24 hours and fresh sterile equipment used each time to avoid bacterial contamination. Bacteriostatic water contains 0.9% benzyl alcohol, which inhibits bacterial growth and allows the solution to remain viable for up to 28 days.",
  },
  {
    q: "How can I tell if a peptide has degraded?",
    a: "After reconstitution, the solution should be clear and colorless. Warning signs include: cloudiness, discoloration (yellow, brown), visible particles or floaters, or an unusual odor. If any of these are observed, discard the vial. Also discard if it has been more than 30 days since reconstitution, or if the vial was left unrefrigerated for an extended period. Lyophilized powder should be white to off-white; discoloration may indicate degradation.",
  },
  {
    q: "What does 98%+ purity mean? Is 99% significantly better than 98%?",
    a: "Purity is measured by HPLC and represents the percentage of the sample that is the actual target peptide versus impurities (truncated sequences, degraded fragments, etc.). 98%+ is considered research-grade. The difference between 98% and 99% is marginal in practice. It is more important that the testing is legitimate (third-party lab, batch-specific CoA) than to chase the highest number, as some vendors fabricate purity claims.",
  },
  {
    q: "Why do some peptides come in different vial sizes (5mg, 10mg, 20mg)?",
    a: "Different vial sizes accommodate different experimental requirements. Smaller vials (5mg) are suitable for preliminary studies or short-duration experiments. Standard 10mg vials are common for most research applications. Larger vials (20mg) offer better value per milligram for extended studies. The peptide compound is identical regardless of vial size.",
  },
  {
    q: "Are research peptides legal to purchase?",
    a: "In most jurisdictions, research peptides are legal to purchase and possess when intended for legitimate research purposes. They are sold as research chemicals not intended for human or animal consumption and are not FDA-approved drugs. However, regulations vary by country and are subject to change. It is the buyer's responsibility to understand and comply with all applicable local, state, and federal laws.",
  },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <HelpCircle className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Frequently Asked Questions
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Common questions about research peptides, quality testing, and
        laboratory handling.
      </p>

      <div className="divide-y divide-border border border-border rounded-lg">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between px-4 py-4 text-left hover:bg-primary/[0.02] transition-colors"
            >
              <span className="font-semibold text-sm text-primary pr-4">
                {item.q}
              </span>
              {openIdx === i ? (
                <ChevronUp className="w-4 h-4 text-text-secondary shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-secondary shrink-0" />
              )}
            </button>
            {openIdx === i && (
              <div className="px-4 pb-4 text-sm text-text-secondary leading-relaxed">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SECTION META & ROUTER
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SECTION_META: Record<string, { title: string; desc: string }> = {
  "getting-started": {
    title: "Getting Started",
    desc: "Articles, guides, and checklists for laboratory research with peptides.",
  },
  tools: {
    title: "Laboratory Tools",
    desc: "Interactive calculator for preparing reference standard dilutions.",
  },
  reference: {
    title: "Reference Library",
    desc: "Peptide data, published research, and scientific terminology in one place.",
  },
  faq: {
    title: "FAQ & Help",
    desc: "Common questions, storage guidelines, and handling best practices.",
  },
};

/* Map subsection hash to parent tab */
const SUBSECTION_TO_TAB: Record<string, string> = {
  articles: "getting-started",
  safety: "getting-started",
  "dilution-calculator": "tools",
  "peptide-guide": "reference",
  research: "reference",
  glossary: "reference",
  "faq-questions": "faq",
  storage: "faq",
};

/* Subsection definitions per tab */
const TAB_SUBSECTIONS: Record<string, { id: string; label: string; desc: string; icon: typeof Calculator }[]> = {
  "getting-started": [
    { id: "articles", label: "Articles & Guides", desc: "Research-backed guides covering peptide science and laboratory techniques", icon: BookOpen },
    { id: "safety", label: "Laboratory Safety Checklist", desc: "Step-by-step protocol for proper handling and preparation", icon: ShieldCheck },
  ],
  tools: [
    { id: "dilution-calculator", label: "Dilution Calculator", desc: "Calculate concentration when dissolving a reference standard into solvent", icon: FlaskConical },
  ],
  reference: [
    { id: "peptide-guide", label: "Peptide Quick-Reference", desc: "Compare mechanisms, research applications, and published study references", icon: FlaskConical },
    { id: "research", label: "Published Research Library", desc: "Peer-reviewed studies organized by peptide with PubMed links", icon: FileText },
    { id: "glossary", label: "Glossary", desc: "Peptide and analytical terminology explained clearly", icon: BookOpen },
  ],
  faq: [
    { id: "faq-questions", label: "Frequently Asked Questions", desc: "Quick answers to the most common research questions", icon: HelpCircle },
    { id: "storage", label: "Handling and Storage", desc: "How to properly store and care for research peptides in the laboratory", icon: Thermometer },
  ],
};

function SubsectionContent({ id }: { id: string }) {
  switch (id) {
    case "articles": return <ArticlesSection />;
    case "safety": return <SafetyChecklist />;
    case "dilution-calculator":
      return (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 flex-shrink-0 mt-0.5">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>NOTE:</strong> This calculator is provided exclusively for laboratory reference purposes. It does not constitute recommendations for human or animal use.
            </p>
          </div>
          <DilutionCalculator />
        </div>
      );
    case "peptide-guide": return <PeptideGuide />;
    case "research": return <ResearchLibrary />;
    case "glossary": return <Glossary />;
    case "faq-questions": return <FAQ />;
    case "storage": return <StorageGuide />;
    default: return null;
  }
}

function ActiveSection({ id, openSubsection, onToggleSubsection }: { id: string; openSubsection: string | null; onToggleSubsection: (sub: string) => void }) {
  const subsections = TAB_SUBSECTIONS[id] || [];

  return (
    <div className="space-y-2 sm:space-y-3">
      {subsections.map((sub) => {
        const isOpen = openSubsection === sub.id;
        return (
          <div key={sub.id} id={sub.id} className="border border-[#F0F0F0] rounded-xl sm:rounded-2xl overflow-hidden bg-white transition-shadow hover:shadow-sm">
            <button
              onClick={() => onToggleSubsection(sub.id)}
              className="w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 text-left transition-colors hover:bg-[#FAFAFA]"
            >
              <div className={`flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl shrink-0 transition-colors ${isOpen ? "bg-[#111111] text-white" : "bg-[#F5F5F5] text-[#6B7280]"}`}>
                <sub.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#111111] text-sm sm:text-[15px]">{sub.label}</p>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5 hidden sm:block">{sub.desc}</p>
              </div>
              <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-[#9CA3AF] shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
              <div className="px-3 sm:px-6 pb-4 sm:pb-6 pt-2 border-t border-[#F0F0F0]">
                <SubsectionContent id={sub.id} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   PAGE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState("getting-started");
  const [openSubsection, setOpenSubsection] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const meta = SECTION_META[activeTab];

  /* Read hash on mount & on hash change */
  useEffect(() => {
    function handleHash() {
      const hash = window.location.hash.replace("#", "");
      if (!hash) return;

      // Hash matches a tab directly
      if (SECTION_META[hash]) {
        setActiveTab(hash);
        setOpenSubsection(null);
        return;
      }

      // Hash matches a subsection: open the right tab + subsection
      const parentTab = SUBSECTION_TO_TAB[hash];
      if (parentTab) {
        setActiveTab(parentTab);
        setOpenSubsection(hash);
        setPendingScroll(hash);
      }
    }

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  /* Scroll to subsection after it opens */
  useEffect(() => {
    if (!pendingScroll) return;
    const id = pendingScroll;
    setPendingScroll(null);

    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        const offset = 140;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  }, [pendingScroll, activeTab, openSubsection]);

  /* Update hash when switching tabs via nav */
  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id);
    setOpenSubsection(null);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  /* Toggle a subsection open/closed */
  const handleToggleSubsection = useCallback((sub: string) => {
    setOpenSubsection((prev) => {
      const next = prev === sub ? null : sub;
      window.history.replaceState(null, "", next ? `#${next}` : `#${activeTab}`);
      if (next) {
        // Scroll to the opened subsection after render
        requestAnimationFrame(() => {
          const el = document.getElementById(sub);
          if (el) {
            const offset = 140;
            const top = el.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: "smooth" });
          }
        });
      }
      return next;
    });
  }, [activeTab]);

  return (
    <>
      <PageHeader
        title="Research Resources"
        description="Laboratory guides, reference tools, published research, and technical documentation for peptide research."
        breadcrumbs={[{ label: "Research Resources" }]}
      />

      <ResourceNav active={activeTab} onChange={handleTabChange} />

      <section className="mx-auto max-w-5xl px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="mb-4 sm:mb-6">
          <h2 className={sectionTitleCls}>{meta.title}</h2>
          <p className={sectionDescCls}>{meta.desc}</p>
        </div>

        <ActiveSection id={activeTab} openSubsection={openSubsection} onToggleSubsection={handleToggleSubsection} />

        {/* Legal Disclaimers */}
        <div className="mt-8 sm:mt-12 space-y-6 sm:space-y-8">
          <div className="bg-surface border border-border rounded-xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-primary text-sm mb-2">
                  For Research Use Only
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  All products sold by Purity Lab are intended strictly for
                  in-vitro laboratory research and educational purposes. They are
                  not intended for human or animal consumption,
                  self-administration, therapeutic use, or any form of bodily
                  introduction. By purchasing from Purity Lab, you confirm that
                  you are at least 21 years of age and that all products will be
                  used exclusively for lawful research purposes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-primary text-sm mb-2">
                  Not Medical Advice
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Nothing on this website, including articles, calculators,
                  reference data, glossary entries, FAQs, and any other
                  content, constitutes medical, pharmaceutical, or healthcare
                  advice. The information provided is compiled from published
                  research literature for educational purposes only. It should
                  not be used as a substitute for professional medical advice,
                  diagnosis, or treatment.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-primary text-sm mb-2">
                  Limitation of Liability
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Purity Lab, its owners, employees, and affiliates assume no
                  liability for any misuse, adverse effects, injury, loss, or
                  damage arising from the use or misuse of any products or
                  information provided on this website. All information is
                  provided &ldquo;as is&rdquo; without warranty of any kind.
                  Reference data and research citations are drawn from
                  third-party published studies and are not guaranteed to be
                  accurate, complete, or current. Use of any product or
                  information is entirely at your own risk.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-primary text-sm mb-2">
                  Regulatory Notice
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Research peptides are not FDA-approved drugs or dietary
                  supplements. They have not been evaluated by the Food and Drug
                  Administration or any other regulatory body for safety or
                  efficacy. Regulatory status varies by jurisdiction. It is the
                  buyer&apos;s sole responsibility to understand and comply with
                  all applicable local, state, and federal laws regarding the
                  purchase, possession, and use of research chemicals in their
                  region.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <h3 className="font-heading font-bold text-primary text-sm mb-2">
                  Third-Party Content
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">
                  References to published studies, external research, and
                  third-party data are provided for informational purposes only.
                  Purity Lab does not endorse, verify, or guarantee the accuracy
                  of any third-party content. Inclusion of any reference does not
                  imply endorsement of its conclusions or recommendations.
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-[10px] text-text-secondary max-w-2xl mx-auto leading-relaxed">
            &copy; {new Date().getFullYear()} Purity Lab. All rights reserved.
            By using this website you agree to our Terms of Service and
            acknowledge that you have read and understood the disclaimers above.
          </p>
        </div>
      </section>
    </>
  );
}
