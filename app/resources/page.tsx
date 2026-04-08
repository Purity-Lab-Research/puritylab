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
  CalendarDays,
  BookOpen,
  Thermometer,
  Syringe,
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
   CALCULATORS
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

function DosingCalculator() {
  const [peptideMg, setPeptideMg] = useState("");
  const [waterMl, setWaterMl] = useState("");
  const [doseMcg, setDoseMcg] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(peptideMg);
    const w = parseFloat(waterMl);
    const d = parseFloat(doseMcg);
    if (!p || !w || !d || p <= 0 || w <= 0 || d <= 0) return null;

    const totalMcg = p * 1000;
    const concPerMl = totalMcg / w;
    const concPerUnit = concPerMl / 100;
    const units = d / concPerUnit;
    const totalDoses = totalMcg / d;

    return {
      units: Math.round(units * 10) / 10,
      concPerUnit: Math.round(concPerUnit * 10) / 10,
      totalDoses: Math.floor(totalDoses),
    };
  }, [peptideMg, waterMl, doseMcg]);

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Dosing Calculator
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Calculate how many units to draw on your insulin syringe for a desired
        dose.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Peptide amount in vial (mg)</label>
            <input
              type="number"
              value={peptideMg}
              onChange={(e) => setPeptideMg(e.target.value)}
              placeholder="e.g. 10"
              className={inputCls}
              min="0"
              step="any"
            />
          </div>
          <div>
            <label className={labelCls}>Bacteriostatic water added (ml)</label>
            <input
              type="number"
              value={waterMl}
              onChange={(e) => setWaterMl(e.target.value)}
              placeholder="e.g. 2"
              className={inputCls}
              min="0"
              step="any"
            />
          </div>
          <div>
            <label className={labelCls}>Desired dose (mcg)</label>
            <input
              type="number"
              value={doseMcg}
              onChange={(e) => setDoseMcg(e.target.value)}
              placeholder="e.g. 250"
              className={inputCls}
              min="0"
              step="any"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          {result ? (
            <div className="space-y-4">
              <div className="bg-primary/5 border border-primary/10 rounded-xl p-6 text-center">
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">
                  Draw
                </p>
                <p className="font-heading text-4xl font-extrabold text-primary">
                  {result.units}
                </p>
                <p className="text-sm text-text-secondary">
                  units on your insulin syringe
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-xs text-text-secondary">Per unit</p>
                  <p className="font-heading text-lg font-bold text-primary">
                    {result.concPerUnit} mcg
                  </p>
                </div>
                <div className="bg-background rounded-lg p-3 text-center">
                  <p className="text-xs text-text-secondary">Total doses</p>
                  <p className="font-heading text-lg font-bold text-primary">
                    {result.totalDoses}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-sm text-text-secondary py-8">
              Enter values to calculate your dose.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReconstitutionCalculator() {
  const [peptideMg, setPeptideMg] = useState("");
  const [waterMl, setWaterMl] = useState("");

  const result = useMemo(() => {
    const p = parseFloat(peptideMg);
    const w = parseFloat(waterMl);
    if (!p || !w || p <= 0 || w <= 0) return null;

    const totalMcg = p * 1000;
    const per10Units = totalMcg / w / 10;
    const perUnit = totalMcg / w / 100;

    return {
      per10Units: Math.round(per10Units * 10) / 10,
      perUnit: Math.round(perUnit * 10) / 10,
    };
  }, [peptideMg, waterMl]);

  const refTable = useMemo(() => {
    const p = parseFloat(peptideMg);
    if (!p || p <= 0) return [];
    return [1, 2, 3].map((ml) => ({
      ml,
      per10Units: Math.round(((p * 1000) / ml / 10) * 10) / 10,
      perUnit: Math.round(((p * 1000) / ml / 100) * 10) / 10,
    }));
  }, [peptideMg]);

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <FlaskConical className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Reconstitution Calculator
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Determine the concentration after reconstituting your peptide.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Peptide amount (mg)</label>
            <input
              type="number"
              value={peptideMg}
              onChange={(e) => setPeptideMg(e.target.value)}
              placeholder="e.g. 5"
              className={inputCls}
              min="0"
              step="any"
            />
          </div>
          <div>
            <label className={labelCls}>Water volume (ml)</label>
            <input
              type="number"
              value={waterMl}
              onChange={(e) => setWaterMl(e.target.value)}
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
                    Per 0.1ml (10 units)
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {result.per10Units} mcg
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-text-secondary">
                    Per unit (0.01ml)
                  </span>
                  <span className="font-heading text-xl font-bold text-primary">
                    {result.perUnit} mcg
                  </span>
                </div>
              </div>

              {refTable.length > 0 && (
                <div>
                  <p className="text-xs text-text-secondary mb-2">
                    Reference table:
                  </p>
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-background">
                          <th className="px-3 py-2 text-left text-text-secondary font-semibold">
                            Water
                          </th>
                          <th className="px-3 py-2 text-right text-text-secondary font-semibold">
                            Per 10 units
                          </th>
                          <th className="px-3 py-2 text-right text-text-secondary font-semibold">
                            Per unit
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {refTable.map((row) => (
                          <tr
                            key={row.ml}
                            className={
                              row.ml === parseFloat(waterMl)
                                ? "bg-secondary/5"
                                : ""
                            }
                          >
                            <td className="px-3 py-2 text-text-primary">
                              {row.ml}ml
                            </td>
                            <td className="px-3 py-2 text-right text-text-primary font-medium">
                              {row.per10Units} mcg
                            </td>
                            <td className="px-3 py-2 text-right text-text-primary font-medium">
                              {row.perUnit} mcg
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
              Enter values to see concentrations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Cycle Planner ─── */
const PROTOCOL_PRESETS: Record<
  string,
  { label: string; daysPerWeek: number }
> = {
  recovery: { label: "Recovery (daily)", daysPerWeek: 7 },
  fatloss: { label: "Fat Loss (5x/week)", daysPerWeek: 5 },
  performance: { label: "Performance (3x/week)", daysPerWeek: 3 },
  custom: { label: "Custom", daysPerWeek: 5 },
};

function CyclePlanner() {
  const [protocol, setProtocol] = useState("recovery");
  const [startDate, setStartDate] = useState(() =>
    new Date().toISOString().split("T")[0]
  );
  const [cycleWeeks, setCycleWeeks] = useState(4);
  const [customDays, setCustomDays] = useState(5);

  const daysPerWeek =
    protocol === "custom"
      ? customDays
      : PROTOCOL_PRESETS[protocol].daysPerWeek;

  const schedule = useMemo(() => {
    const start = new Date(startDate + "T00:00:00");
    if (isNaN(start.getTime()))
      return { weeks: [], totalInjections: 0, endDate: "" };

    const totalDays = cycleWeeks * 7;
    const endDate = new Date(start);
    endDate.setDate(endDate.getDate() + totalDays - 1);

    const weeks: {
      weekNum: number;
      days: { date: Date; isInjection: boolean; dayOfWeek: number }[];
    }[] = [];
    let totalInjections = 0;

    for (let w = 0; w < cycleWeeks; w++) {
      const days: {
        date: Date;
        isInjection: boolean;
        dayOfWeek: number;
      }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(start);
        date.setDate(date.getDate() + w * 7 + d);
        const isInjection = d < daysPerWeek;
        if (isInjection) totalInjections++;
        days.push({ date, isInjection, dayOfWeek: date.getDay() });
      }
      weeks.push({ weekNum: w + 1, days });
    }

    return {
      weeks,
      totalInjections,
      endDate: endDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
  }, [startDate, cycleWeeks, daysPerWeek]);

  const dayLabels = ["S", "M", "T", "W", "T", "F", "S"];

  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <CalendarDays className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Cycle Planner
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Generate an injection schedule for your protocol.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Protocol</label>
            <select
              value={protocol}
              onChange={(e) => setProtocol(e.target.value)}
              className={inputCls}
            >
              {Object.entries(PROTOCOL_PRESETS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>
          {protocol === "custom" && (
            <div>
              <label className={labelCls}>Days per week</label>
              <input
                type="number"
                value={customDays}
                onChange={(e) =>
                  setCustomDays(
                    Math.max(1, Math.min(7, parseInt(e.target.value) || 1))
                  )
                }
                min="1"
                max="7"
                className={inputCls}
              />
            </div>
          )}
          <div>
            <label className={labelCls}>Start date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Cycle length</label>
            <select
              value={cycleWeeks}
              onChange={(e) => setCycleWeeks(Number(e.target.value))}
              className={inputCls}
            >
              <option value={4}>4 weeks</option>
              <option value={6}>6 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary">Total injections</p>
              <p className="font-heading text-lg font-bold text-primary">
                {schedule.totalInjections}
              </p>
            </div>
            <div className="bg-background rounded-lg p-3 text-center">
              <p className="text-xs text-text-secondary">Cycle ends</p>
              <p className="text-sm font-semibold text-primary">
                {schedule.endDate}
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
            {dayLabels.map((d, i) => (
              <span
                key={i}
                className="text-[10px] text-text-secondary font-semibold"
              >
                {d}
              </span>
            ))}
          </div>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {schedule.weeks.map((week) => (
              <div key={week.weekNum}>
                <p className="text-[10px] text-text-secondary mb-0.5">
                  Wk {week.weekNum}
                </p>
                <div className="grid grid-cols-7 gap-0.5">
                  {week.days.map((day, i) => (
                    <div
                      key={i}
                      className={`h-8 rounded flex items-center justify-center text-[10px] font-medium ${
                        day.isInjection
                          ? "bg-secondary text-white"
                          : "bg-background text-text-secondary"
                      }`}
                    >
                      {day.date.getDate()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 text-[10px] text-text-secondary">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-secondary inline-block" />{" "}
              Injection day
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-background border border-border inline-block" />{" "}
              Rest day
            </span>
          </div>
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
        At-a-glance comparison of popular research peptides. Tap any row for
        details.
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

      {/* Table  -  desktop */}
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
                Typical Dose
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">
                Frequency
              </th>
              <th className="px-4 py-3 font-semibold text-text-secondary">
                Cycle
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
                  <td className="px-4 py-3 text-text-primary">{p.typicalDose}</td>
                  <td className="px-4 py-3 text-text-primary">{p.frequency}</td>
                  <td className="px-4 py-3 text-text-primary">
                    {p.cycleLength}
                  </td>
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
                      colSpan={6}
                      className="px-4 py-4 bg-primary/[0.02] text-sm"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            Mechanism
                          </p>
                          <p className="text-text-primary">{p.mechanism}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            Best For
                          </p>
                          <p className="text-text-primary">{p.bestFor}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-text-secondary uppercase mb-1">
                            Stacks With
                          </p>
                          <p className="text-text-primary">{p.stacksWith}</p>
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

      {/* Cards  -  mobile */}
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
                <div className="flex justify-between">
                  <span className="text-text-secondary">Dose</span>
                  <span className="text-text-primary font-medium">
                    {p.typicalDose}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Frequency</span>
                  <span className="text-text-primary font-medium">
                    {p.frequency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Cycle</span>
                  <span className="text-text-primary font-medium">
                    {p.cycleLength}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Stacks With</span>
                  <span className="text-text-primary font-medium">
                    {p.stacksWith}
                  </span>
                </div>
                <div className="pt-1">
                  <p className="text-text-secondary font-semibold mb-0.5">
                    Mechanism
                  </p>
                  <p className="text-text-primary">{p.mechanism}</p>
                </div>
                <div>
                  <p className="text-text-secondary font-semibold mb-0.5">
                    Best For
                  </p>
                  <p className="text-text-primary">{p.bestFor}</p>
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
        All dosing information is from published research literature and is
        provided for educational purposes only. Not medical advice.
      </p>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   STORAGE & HANDLING GUIDE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const STORAGE_ITEMS = [
  {
    state: "Lyophilized (powder)",
    icon: "vial",
    temp: "Room temp or refrigerated",
    duration: "12-24+ months",
    notes:
      "Stable at room temperature during shipping. Refrigeration extends shelf life. Keep away from direct sunlight and heat sources. Sealed vials are very stable.",
  },
  {
    state: "Reconstituted (liquid)",
    icon: "droplet",
    temp: "2-8\u00B0C (refrigerator)",
    duration: "28-30 days",
    notes:
      "Must be refrigerated immediately after reconstitution. Never freeze reconstituted peptides  -  ice crystals damage peptide bonds. Keep upright to avoid contaminating the stopper.",
  },
  {
    state: "Bacteriostatic Water",
    icon: "water",
    temp: "Room temp or refrigerated",
    duration: "28 days once opened",
    notes:
      "Contains 0.9% benzyl alcohol as preservative. Stable at room temperature when sealed. Once the stopper is pierced, use within 28 days. Always swab before drawing.",
  },
];

function StorageGuide() {
  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <Thermometer className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Storage & Handling Guide
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Proper storage is critical for maintaining peptide potency and safety.
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
            Do
          </p>
          <ul className="space-y-2 text-xs text-text-primary">
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Swab vial stoppers with alcohol before every draw
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Use a fresh syringe for each injection
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Store reconstituted vials upright in the fridge
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Label vials with reconstitution date and concentration
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Let BAC water trickle down the vial wall, don&apos;t spray on powder
            </li>
            <li className="flex gap-2">
              <span className="text-green-600 mt-0.5 shrink-0">&#10003;</span>
              Gently roll vials to mix  -  never shake
            </li>
          </ul>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-5">
          <p className="font-heading font-bold text-red-700 text-sm mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            Don&apos;t
          </p>
          <ul className="space-y-2 text-xs text-text-primary">
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Freeze reconstituted peptides  -  ice crystals destroy bonds
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Expose vials to direct sunlight or heat above 25°C
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Reuse syringes  -  dulled needles damage tissue and risk contamination
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Use reconstituted peptides past 30 days
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Shake vials vigorously  -  it denatures the peptide
            </li>
            <li className="flex gap-2">
              <span className="text-red-600 mt-0.5 shrink-0">&#10007;</span>
              Use cloudy, discolored, or particulate solutions
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SUPPLIES GUIDE
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const SUPPLY_ITEMS = [
  {
    name: "Insulin Syringes",
    desc: "The standard tool for measuring and administering peptides. Available in different sizes based on dose volume.",
    details: [
      { label: "0.3ml (30 unit)", use: "Best for small doses under 30 units. More precise markings for accurate low-volume dosing." },
      { label: "0.5ml (50 unit)", use: "Good all-around choice. Suitable for most peptide doses." },
      { label: "1ml (100 unit)", use: "Best for larger doses or when reconstituting with less water for higher concentrations." },
    ],
    tip: "29-31 gauge needles are standard for SubQ injections. Thinner gauge = less discomfort.",
  },
  {
    name: "Bacteriostatic Water (BAC Water)",
    desc: "Sterile water with 0.9% benzyl alcohol preservative. The only recommended solvent for reconstituting peptides.",
    details: [
      { label: "Why not sterile water?", use: "Sterile water has no preservative and must be used immediately. BAC water stays safe for 28 days." },
      { label: "How much do I need?", use: "1-2ml per vial is standard. Less water = higher concentration = fewer units to draw per dose." },
    ],
    tip: "Keep a spare vial on hand. Running out mid-cycle means you can't reconstitute new vials.",
  },
  {
    name: "Alcohol Swabs",
    desc: "70% isopropyl alcohol prep pads for sterilizing vial stoppers and injection sites before each use.",
    details: [
      { label: "When to swab", use: "Before every draw from a vial and before every injection. Every single time, no exceptions." },
    ],
    tip: "Buy in bulk  -  you'll use 2 per injection (one for vial, one for skin).",
  },
  {
    name: "Sharps Container",
    desc: "A puncture-resistant container for safe disposal of used syringes and needles.",
    details: [
      { label: "Disposal", use: "Never throw loose syringes in regular trash. Most pharmacies accept full sharps containers for free disposal." },
    ],
    tip: "A 1-quart container holds about 30-50 insulin syringes.",
  },
];

function SuppliesGuide() {
  return (
    <div className={cardCls}>
      <div className="flex items-center gap-2 mb-1">
        <Syringe className="w-5 h-5 text-secondary" />
        <h3 className="font-heading text-xl font-bold text-primary">
          Supplies Guide
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Everything you need beyond the peptide itself for a proper research
        setup.
      </p>

      <div className="space-y-4">
        {SUPPLY_ITEMS.map((item) => (
          <div
            key={item.name}
            className="bg-background rounded-lg border border-border p-5"
          >
            <p className="font-heading font-bold text-primary text-sm mb-1">
              {item.name}
            </p>
            <p className="text-xs text-text-secondary mb-3">{item.desc}</p>
            <div className="space-y-2 mb-3">
              {item.details.map((d) => (
                <div
                  key={d.label}
                  className="flex flex-col sm:flex-row sm:gap-3 text-xs"
                >
                  <span className="font-semibold text-primary shrink-0 min-w-[160px]">
                    {d.label}
                  </span>
                  <span className="text-text-primary">{d.use}</span>
                </div>
              ))}
            </div>
            <div className="flex items-start gap-1.5 text-xs text-secondary bg-secondary/5 rounded-md px-3 py-2">
              <Info className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{item.tip}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   SAFETY CHECKLIST
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

const CHECKLIST_SECTIONS = [
  {
    title: "Before You Start",
    items: [
      "Verify your peptide has a valid, batch-specific Certificate of Analysis",
      "Confirm the peptide identity via Mass Spectrometry and purity via HPLC (98%+)",
      "Check the vial seal is intact and the lyophilized powder appears normal (white to off-white)",
      "Ensure you have all required supplies: BAC water, syringes, alcohol swabs",
      "Wash hands thoroughly with soap and water",
      "Clean your workspace  -  a flat, well-lit surface is ideal",
    ],
  },
  {
    title: "During Reconstitution",
    items: [
      "Swab both the peptide vial and BAC water vial stoppers with alcohol",
      "Draw the desired amount of BAC water with a fresh syringe",
      "Insert needle and let water trickle down the inside wall of the peptide vial",
      "Gently roll or swirl  -  never shake the vial",
      "Wait until the solution is completely clear before proceeding",
      "Label the vial with: peptide name, concentration, and date of reconstitution",
    ],
  },
  {
    title: "During Administration",
    items: [
      "Swab the vial stopper with a fresh alcohol pad",
      "Draw the calculated dose with a new, unused syringe",
      "Remove any air bubbles by tapping the syringe and gently pushing the plunger",
      "Clean the injection site with an alcohol swab and let it dry",
      "Pinch the skin, insert needle at 45\u00B0 angle for SubQ injection",
      "Inject slowly, then withdraw and apply gentle pressure with a clean swab",
    ],
  },
  {
    title: "After Use",
    items: [
      "Return the reconstituted vial to the refrigerator immediately",
      "Dispose of the used syringe in a sharps container  -  never recap or reuse",
      "Log your dose, time, and injection site for tracking purposes",
      "Rotate injection sites to prevent tissue irritation (abdomen, thigh, upper arm)",
      "Monitor for any unusual reactions at the injection site",
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
          Safety Checklist
        </h3>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Follow this step-by-step checklist every time for safe and sterile
        handling.
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
  { term: "AMPK", definition: "AMP-activated protein kinase  -  a master metabolic regulator that controls energy balance at the cellular level. Activated by MOTS-C." },
  { term: "Angiogenesis", definition: "The formation of new blood vessels from existing ones. Critical for tissue repair as it delivers nutrients and oxygen to damaged areas." },
  { term: "BAC Water", definition: "Bacteriostatic water  -  sterile water containing 0.9% benzyl alcohol as a preservative. The standard solvent for reconstituting peptides." },
  { term: "BDNF", definition: "Brain-Derived Neurotrophic Factor  -  a protein that supports neuron growth, survival, and plasticity. Upregulated by nootropic peptides like Semax and Selank." },
  { term: "Bioavailability", definition: "The proportion of a substance that enters circulation and is able to have an active effect. SubQ injection has high bioavailability for peptides." },
  { term: "CoA (Certificate of Analysis)", definition: "A document from an analytical laboratory confirming the identity (via MS) and purity (via HPLC) of a specific product batch." },
  { term: "DAC (Drug Affinity Complex)", definition: "A modification added to CJC-1295 that extends its half-life from ~30 minutes to ~8 days. CJC-1295 without DAC is generally preferred." },
  { term: "GH (Growth Hormone)", definition: "A peptide hormone produced by the pituitary gland that stimulates growth, cell reproduction, and regeneration." },
  { term: "GHRH", definition: "Growth Hormone Releasing Hormone  -  a naturally occurring hormone that stimulates GH release. CJC-1295 is a synthetic GHRH analogue." },
  { term: "GHS (Growth Hormone Secretagogue)", definition: "A class of compounds that stimulate the pituitary gland to release growth hormone naturally, as opposed to injecting exogenous GH." },
  { term: "Half-life", definition: "The time it takes for the concentration of a peptide in the body to decrease by half. Determines dosing frequency." },
  { term: "HPLC", definition: "High-Performance Liquid Chromatography  -  the industry standard analytical method for measuring peptide purity. Research-grade peptides test at 98%+." },
  { term: "IM (Intramuscular)", definition: "Injection into muscle tissue. Less common for peptides than SubQ, but used for some compounds like TB500." },
  { term: "IU (International Unit)", definition: "A measurement unit for biological substances based on their biological activity. Used primarily for HGH dosing, not most peptides." },
  { term: "Lipolysis", definition: "The breakdown of stored fat (triglycerides) into free fatty acids for energy use. Stimulated by compounds like AOD 9604." },
  { term: "Lyophilized", definition: "Freeze-dried. Peptides ship as lyophilized powder for maximum stability. Must be reconstituted with BAC water before use." },
  { term: "Mass Spectrometry (MS)", definition: "An analytical technique that measures molecular weight to confirm the identity of a compound. Used alongside HPLC on Certificates of Analysis." },
  { term: "mcg (Microgram)", definition: "One millionth of a gram (1/1000 of a mg). The standard unit for most peptide doses. Example: 250 mcg = 0.25 mg." },
  { term: "Peptide Bond", definition: "The chemical bond that links amino acids together to form peptides and proteins. Formed by a condensation reaction between the carboxyl and amino groups." },
  { term: "Reconstitution", definition: "The process of dissolving lyophilized peptide powder into a liquid solution using bacteriostatic water." },
  { term: "SubQ (Subcutaneous)", definition: "Injection into the fatty tissue layer just beneath the skin. The most common route for peptide administration. Common sites: abdomen, thigh." },
  { term: "Telomerase", definition: "An enzyme that maintains telomere length on chromosomes. Activated by Epithalon. Telomere shortening is associated with cellular aging." },
  { term: "Unit (on syringe)", definition: "A marking on an insulin syringe. 100 units = 1ml, 10 units = 0.1ml, 1 unit = 0.01ml. Used to measure precise peptide doses." },
  { term: "VEGF", definition: "Vascular Endothelial Growth Factor  -  a signaling protein that promotes blood vessel formation. Upregulated by BPC-157 to support tissue repair." },
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
        {GLOSSARY.length} terms covering peptide science, dosing, and testing
        terminology.
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
    q: "What's the difference between peptides and proteins?",
    a: "Size. Peptides are short chains of amino acids (typically 2-50 amino acids), while proteins are longer chains (50+ amino acids) with complex three-dimensional structures. All peptides and proteins are made of amino acids linked by peptide bonds, but peptides are smaller and often act as signaling molecules rather than structural components.",
  },
  {
    q: "Do I need to refrigerate peptides before reconstitution?",
    a: "Not strictly necessary for short-term storage. Lyophilized (freeze-dried) peptides are very stable at room temperature for weeks to months. However, refrigeration (2-8\u00B0C) extends shelf life and is recommended for long-term storage. Once reconstituted with BAC water, refrigeration is mandatory  -  use within 28-30 days.",
  },
  {
    q: "Can I use sterile water instead of bacteriostatic water?",
    a: "Technically yes, but it's not recommended. Sterile water has no preservative, so the reconstituted solution must be used within 24 hours and a fresh syringe used each time to avoid bacterial contamination. Bacteriostatic water contains 0.9% benzyl alcohol, which prevents bacterial growth and allows the solution to remain safe for up to 28 days. Always use BAC water unless you plan to use the entire vial in a single session.",
  },
  {
    q: "What does 'units' mean on an insulin syringe?",
    a: "Insulin syringes are marked in 'units'  -  100 units equals 1ml. So 10 units = 0.1ml, and 1 unit = 0.01ml. When someone says 'draw 5 units,' they mean draw to the 5-unit mark on the syringe. The actual amount of peptide those 5 units contain depends on your reconstitution concentration  -  use the dosing calculator above to figure it out.",
  },
  {
    q: "How do I know if my peptide has gone bad?",
    a: "After reconstitution, the solution should be clear and colorless. Red flags include: cloudiness, discoloration (yellow, brown), visible particles or floaters, or an unusual smell. If you see any of these, discard the vial. Also discard if it's been more than 30 days since reconstitution, or if it was left unrefrigerated for an extended period. Lyophilized powder should be white to off-white  -  discoloration in the powder itself may indicate degradation.",
  },
  {
    q: "What does 98%+ purity mean? Is 99% significantly better than 98%?",
    a: "Purity is measured by HPLC and represents the percentage of the sample that is the actual target peptide vs. impurities (truncated sequences, degraded fragments, etc.). 98%+ is considered research-grade. The difference between 98% and 99% is marginal in practice  -  both are high quality. Be more concerned about the testing being legitimate (third-party lab, batch-specific CoA) than chasing the highest number, because some vendors fabricate purity claims.",
  },
  {
    q: "Why do some peptides come in different sizes (5mg, 10mg, 20mg)?",
    a: "Different vial sizes accommodate different dosing needs. A 5mg vial is great for trying a peptide or running a short cycle. 10mg vials are the standard for most protocols. 20mg vials offer better value per milligram for longer cycles or higher-dose protocols. The peptide itself is identical  -  only the amount per vial changes.",
  },
  {
    q: "What's the best injection site for SubQ peptides?",
    a: "The most common SubQ injection sites are: the abdominal area (1-2 inches from the navel), the front of the thigh, and the back of the upper arm. Rotate sites with each injection to prevent tissue irritation or lipodystrophy. For recovery peptides like BPC-157, some researchers prefer injecting near the area of interest, though the peptide has systemic effects regardless of site.",
  },
  {
    q: "Can I mix two different peptides in the same syringe?",
    a: "Some peptides are commonly combined in a single injection (like CJC-1295 + Ipamorelin), and pre-made blends exist for this reason. However, mixing arbitrary peptides yourself carries risks of interaction or degradation. Stick to well-established combinations or pre-formulated blends. Never mix peptides from different vials into a single vial for long-term storage  -  only combine in the syringe immediately before use if needed.",
  },
  {
    q: "How long does it take for peptides to show effects?",
    a: "It varies significantly by peptide and the effect you're measuring. Recovery peptides (BPC-157, TB500)  -  noticeable improvements in 1-2 weeks. GH secretagogues (CJC/Ipamorelin)  -  improved sleep within days, body composition changes over 8-12 weeks. Metabolic peptides (MOTS-C)  -  energy/endurance improvements in 2-4 weeks. Cognitive peptides (Semax, Selank)  -  often within days to a week. Patience and consistency are key.",
  },
  {
    q: "What's the difference between SubQ and IM injection?",
    a: "SubQ (subcutaneous) is injection into the fat layer just beneath the skin  -  pinch the skin, insert at a 45\u00B0 angle, use a short needle (29-31 gauge). It's slower absorption but easier and less painful. IM (intramuscular) is injection directly into muscle tissue  -  longer needle, 90\u00B0 angle, faster absorption. Most peptides are administered SubQ. Some larger-volume peptides like TB500 can be given IM. When in doubt, SubQ is the standard.",
  },
  {
    q: "Are research peptides legal?",
    a: "In most jurisdictions, research peptides are legal to purchase and possess when intended for legitimate research purposes. They are sold as 'not for human consumption' and are not FDA-approved drugs. However, regulations vary by country and are subject to change. It is the buyer's responsibility to understand and comply with local laws. Some peptides (like certain SARMs) may be more heavily regulated in some regions.",
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
        Answers to the most common questions we hear from researchers.
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
    desc: "Articles, guides, and checklists to help you get started with confidence.",
  },
  tools: {
    title: "Calculators & Tools",
    desc: "Interactive calculators for reconstitution, dosing, and cycle planning.",
  },
  reference: {
    title: "Reference Library",
    desc: "Peptide data, published research, and terminology  -  all in one place.",
  },
  faq: {
    title: "FAQ & Help",
    desc: "Common questions, storage tips, and everything else you need to know.",
  },
};

/* Map subsection hash → parent tab */
const SUBSECTION_TO_TAB: Record<string, string> = {
  articles: "getting-started",
  supplies: "getting-started",
  safety: "getting-started",
  calculators: "tools",
  "dosing-calculator": "tools",
  "reconstitution-calculator": "tools",
  "cycle-planner": "tools",
  "peptide-guide": "reference",
  research: "reference",
  glossary: "reference",
  "faq-questions": "faq",
  storage: "faq",
};

/* ─── Subsection definitions per tab ─── */
const TAB_SUBSECTIONS: Record<string, { id: string; label: string; desc: string; icon: typeof Calculator }[]> = {
  "getting-started": [
    { id: "articles", label: "Articles & Guides", desc: "Research-backed guides from beginner basics to advanced protocols", icon: BookOpen },
    { id: "supplies", label: "Supplies Guide", desc: "Everything you need beyond the peptide itself", icon: Syringe },
    { id: "safety", label: "Safety Checklist", desc: "Step-by-step protocol for safe, sterile handling", icon: ShieldCheck },
  ],
  tools: [
    { id: "dosing-calculator", label: "Dosing Calculator", desc: "Calculate how many units to draw for your desired dose", icon: Calculator },
    { id: "reconstitution-calculator", label: "Reconstitution Calculator", desc: "Find your concentration after adding BAC water", icon: FlaskConical },
    { id: "cycle-planner", label: "Cycle Planner", desc: "Generate an injection schedule for your protocol", icon: CalendarDays },
  ],
  reference: [
    { id: "peptide-guide", label: "Peptide Quick-Reference", desc: "Compare dosing, mechanisms, and stacking options at a glance", icon: FlaskConical },
    { id: "research", label: "Published Research", desc: "Peer-reviewed studies organized by peptide with PubMed links", icon: FileText },
    { id: "glossary", label: "Glossary", desc: "Peptide terminology explained in plain language", icon: BookOpen },
  ],
  faq: [
    { id: "faq-questions", label: "Frequently Asked Questions", desc: "Quick answers to the most common questions", icon: HelpCircle },
    { id: "storage", label: "Storage & Handling", desc: "How to store and care for your peptides properly", icon: Thermometer },
  ],
};

function SubsectionContent({ id }: { id: string }) {
  switch (id) {
    case "articles": return <ArticlesSection />;
    case "supplies": return <SuppliesGuide />;
    case "safety": return <SafetyChecklist />;
    case "dosing-calculator":
      return (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 flex items-start gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 flex-shrink-0 mt-0.5">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              <strong>IMPORTANT:</strong> These calculators are provided exclusively for educational and research reference purposes. They do not constitute dosing recommendations, medical advice, or instructions for human use.
            </p>
          </div>
          <DosingCalculator />
        </div>
      );
    case "reconstitution-calculator": return <ReconstitutionCalculator />;
    case "cycle-planner": return <CyclePlanner />;
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

      // Hash matches a subsection — open the right tab + subsection
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
        title="Learn & Resources"
        description="Everything you need in one place  -  articles, calculators, reference guides, and safety checklists."
        breadcrumbs={[{ label: "Learn & Resources" }]}
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
                  Research Use Only
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
                  Nothing on this website  -  including articles, calculators,
                  dosing information, glossary entries, FAQs, and any other
                  content  -  constitutes medical, pharmaceutical, or healthcare
                  advice. The information provided is compiled from published
                  research literature for educational purposes only. It should
                  not be used as a substitute for professional medical advice,
                  diagnosis, or treatment. Always consult a qualified healthcare
                  professional before beginning any research protocol or making
                  health-related decisions.
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
                  Dosing references, protocol suggestions, and research data are
                  drawn from third-party published studies and are not guaranteed
                  to be accurate, complete, or current. Use of any product or
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
                  purchase, possession, and use of research peptides in their
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
