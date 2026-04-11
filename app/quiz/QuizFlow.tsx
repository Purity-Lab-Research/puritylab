"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type { Protocol } from "@/lib/types";

/* ---- Types ---- */
type ResearchArea =
  | "tissue_biology"
  | "metabolic_signaling"
  | "growth_hormone"
  | "neuropeptide"
  | "cellular_longevity"
  | null;
type Experience = "first_time" | "some" | "advanced" | null;
type Budget = "under_150" | "150_300" | "300_plus" | null;

interface QuizFlowProps {
  protocols: Protocol[];
}

/* ---- Step data ---- */
const RESEARCH_AREAS = [
  {
    value: "tissue_biology" as const,
    title: "Tissue biology",
    subtitle: "Connective tissue remodeling, wound closure models, extracellular matrix studies",
  },
  {
    value: "metabolic_signaling" as const,
    title: "Metabolic signaling",
    subtitle: "Mitochondrial bioenergetics, lipid metabolism pathways, AMPK activation",
  },
  {
    value: "growth_hormone" as const,
    title: "Growth hormone pathways",
    subtitle: "GH secretagogue receptor signaling, IGF-1 axis, GHRH analogs",
  },
  {
    value: "neuropeptide" as const,
    title: "Neuropeptide research",
    subtitle: "CNS peptide signaling, neurotrophic factors, receptor binding assays",
  },
  {
    value: "cellular_longevity" as const,
    title: "Cellular longevity",
    subtitle: "Telomere biology, senescence markers, oxidative stress resistance",
  },
];

const EXPERIENCES = [
  {
    value: "first_time" as const,
    title: "New to peptide research",
    subtitle: "Setting up initial studies with research peptides",
  },
  {
    value: "some" as const,
    title: "Some experience",
    subtitle: "Have completed one or two research projects with peptides",
  },
  {
    value: "advanced" as const,
    title: "Experienced researcher",
    subtitle: "Familiar with reconstitution, storage protocols, and assay design",
  },
];

const BUDGETS = [
  {
    value: "under_150" as const,
    title: "Under $150/month",
    subtitle: "Starting with a focused reference compound set",
  },
  {
    value: "150_300" as const,
    title: "$150 to $300/month",
    subtitle: "Building a broader compound library",
  },
  {
    value: "300_plus" as const,
    title: "$300+/month",
    subtitle: "Comprehensive compound panel for multi-pathway studies",
  },
];

const FOCUS_AREAS = [
  "In vitro cell culture",
  "Receptor binding assays",
  "Signal transduction mapping",
  "Protein folding studies",
  "Bioavailability profiling",
  "Comparative analog research",
];

/* ---- Recommendation map ---- */
function getRecommendedSlug(area: ResearchArea, budget: Budget): string {
  if (area === "tissue_biology") return "recovery";
  if (area === "metabolic_signaling") {
    if (budget === "under_150") return "performance";
    return "fat-loss";
  }
  if (area === "growth_hormone") return "performance";
  if (area === "neuropeptide") {
    if (budget === "under_150") return "performance";
    return "fat-loss";
  }
  // cellular_longevity or fallback
  if (budget === "under_150") return "performance";
  if (budget === "150_300") return "fat-loss";
  return "full-recomp";
}

function getReasonText(
  area: ResearchArea,
  budget: Budget,
  focuses: Set<string>,
  protocol: Protocol
): string {
  const focusList = Array.from(focuses);
  const focusStr =
    focusList.length > 0
      ? focusList.slice(0, 2).join(" and ").toLowerCase()
      : "";

  const budgetLabel =
    budget === "under_150"
      ? "under $150/month"
      : budget === "150_300"
        ? "$150 to $300/month"
        : "$300+/month";

  if (area === "tissue_biology") {
    return `Based on your interest in tissue biology${focusStr ? `, particularly ${focusStr}` : ""}, the ${protocol.name} contains compounds frequently cited in published literature on connective tissue remodeling and extracellular matrix studies. At $${protocol.subscription_price ?? "TBD"}/month with a subscription, it aligns with your ${budgetLabel} budget.`;
  }
  if (area === "metabolic_signaling") {
    if (protocol.slug === "performance") {
      return `For metabolic signaling research at a ${budgetLabel} budget, the ${protocol.name} provides a focused starting point. These compounds appear regularly in peer-reviewed studies on GH secretagogue receptor activity and downstream metabolic pathways${focusStr ? `, making them relevant to ${focusStr}` : ""}.`;
    }
    return `Based on your focus on metabolic signaling${focusStr ? ` and interest in ${focusStr}` : ""}, the ${protocol.name} includes compounds commonly referenced in published literature on mitochondrial bioenergetics and lipid metabolism pathways. At $${protocol.subscription_price ?? "TBD"}/month, it fits your ${budgetLabel} budget.`;
  }
  if (area === "growth_hormone") {
    return `For growth hormone pathway research${focusStr ? ` with a focus on ${focusStr}` : ""}, the ${protocol.name} includes GH secretagogue analogs widely referenced in published studies on the GH/IGF-1 axis. At $${protocol.subscription_price ?? "TBD"}/month, it provides an efficient compound set for your ${budgetLabel} budget.`;
  }
  if (area === "neuropeptide") {
    return `Based on your interest in neuropeptide research${focusStr ? `, particularly ${focusStr}` : ""}, the ${protocol.name} includes compounds frequently cited in CNS peptide signaling literature. At $${protocol.subscription_price ?? "TBD"}/month, it fits within your ${budgetLabel} budget.`;
  }
  // cellular_longevity
  if (protocol.slug === "full-recomp") {
    return `For cellular longevity research at a ${budgetLabel} budget, the ${protocol.name} provides the broadest compound panel. These peptides appear across published studies on senescence markers, oxidative stress resistance, and mitochondrial function${focusStr ? `, directly relevant to ${focusStr}` : ""}. A comprehensive set for multi-pathway investigation.`;
  }
  if (protocol.slug === "fat-loss") {
    return `For cellular longevity studies at a ${budgetLabel} budget, the ${protocol.name} offers broad pathway coverage. The included compounds are commonly referenced in literature on mitochondrial bioenergetics and cellular stress response${focusStr ? `, relevant to ${focusStr}` : ""}.`;
  }
  return `The ${protocol.name} is a well-rounded compound set for your ${budgetLabel} budget. These peptides are referenced across multiple research domains including cellular signaling and metabolic pathways${focusStr ? `, directly relevant to ${focusStr}` : ""}.`;
}

/* ---- Icons ---- */
function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-secondary"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowLeft() {
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
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function CheckmarkSmall() {
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
      className="text-success flex-shrink-0 mt-0.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ---- Main Component ---- */
export default function QuizFlow({ protocols }: QuizFlowProps) {
  const [step, setStep] = useState(1);
  const [area, setArea] = useState<ResearchArea>(null);
  const [experience, setExperience] = useState<Experience>(null);
  const [budget, setBudget] = useState<Budget>(null);
  const [focuses, setFocuses] = useState<Set<string>>(new Set());
  const [transitioning, setTransitioning] = useState(false);

  const totalSteps = 4;
  const progress = step <= totalSteps ? ((step - 1) / totalSteps) * 100 : 100;

  const recommended = useMemo(() => {
    if (!area || !budget) return null;
    const slug = getRecommendedSlug(area, budget);
    return protocols.find((p) => p.slug === slug) ?? protocols[0] ?? null;
  }, [area, budget, protocols]);

  const reasonText = useMemo(() => {
    if (!recommended || !area || !budget) return "";
    return getReasonText(area, budget, focuses, recommended);
  }, [recommended, area, budget, focuses]);

  const advanceStep = useCallback(
    (nextStep: number) => {
      setTransitioning(true);
      setTimeout(() => {
        setStep(nextStep);
        setTransitioning(false);
      }, 300);
    },
    []
  );

  const goBack = useCallback(() => {
    if (step > 1) advanceStep(step - 1);
  }, [step, advanceStep]);

  function toggleFocus(focusArea: string) {
    setFocuses((prev) => {
      const next = new Set(prev);
      if (next.has(focusArea)) next.delete(focusArea);
      else next.add(focusArea);
      return next;
    });
  }

  function handleArea(a: ResearchArea) {
    setArea(a);
    setTimeout(() => advanceStep(2), 300);
  }

  function handleExperience(e: Experience) {
    setExperience(e);
    setTimeout(() => advanceStep(3), 300);
  }

  function handleBudget(b: Budget) {
    setBudget(b);
    setTimeout(() => advanceStep(4), 300);
  }

  function handleSubmit() {
    advanceStep(5);
  }

  const showResults = step === 5;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar: Logo + Progress */}
      <div className="sticky top-0 z-10 bg-background">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <img src="/images/logo.svg" alt="Purity Lab" width={32} height={32} className="h-8 w-8" />
          </Link>
          {!showResults && (
            <span className="text-xs text-text-secondary">
              Step {step} of {totalSteps}
            </span>
          )}
        </div>
        {!showResults && (
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="h-1 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div
          className={`w-full max-w-2xl transition-all duration-400 ${
            transitioning
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }`}
        >
          {/* ---- Step 1: Research Area ---- */}
          {step === 1 && (
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                What area of research are you focused on?
              </h1>
              <p className="text-text-secondary mb-8">
                We will suggest reference compounds commonly cited in published
                literature for your field of study.
              </p>
              <div className="space-y-3">
                {RESEARCH_AREAS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => handleArea(r.value)}
                    className={`w-full text-left border rounded-xl p-5 transition-all ${
                      area === r.value
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary hover:bg-secondary/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {r.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {r.subtitle}
                        </p>
                      </div>
                      {area === r.value && <CheckIcon />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Step 2: Experience ---- */}
          {step === 2 && (
            <div>
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
              >
                <ArrowLeft />
                Back
              </button>
              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                What is your experience with research peptides?
              </h1>
              <p className="text-text-secondary mb-8">
                This helps us suggest an appropriate compound set for your lab.
              </p>
              <div className="space-y-3">
                {EXPERIENCES.map((e) => (
                  <button
                    key={e.value}
                    onClick={() => handleExperience(e.value)}
                    className={`w-full text-left border rounded-xl p-5 transition-all ${
                      experience === e.value
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary hover:bg-secondary/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {e.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {e.subtitle}
                        </p>
                      </div>
                      {experience === e.value && <CheckIcon />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Step 3: Budget ---- */}
          {step === 3 && (
            <div>
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
              >
                <ArrowLeft />
                Back
              </button>
              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                What is your monthly research budget?
              </h1>
              <p className="text-text-secondary mb-8">
                We will match you with a compound set that fits your lab budget.
              </p>
              <div className="space-y-3">
                {BUDGETS.map((b) => (
                  <button
                    key={b.value}
                    onClick={() => handleBudget(b.value)}
                    className={`w-full text-left border rounded-xl p-5 transition-all ${
                      budget === b.value
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary hover:bg-secondary/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {b.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {b.subtitle}
                        </p>
                      </div>
                      {budget === b.value && <CheckIcon />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ---- Step 4: Focus Areas ---- */}
          {step === 4 && (
            <div>
              <button
                onClick={goBack}
                className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary mb-6 transition-colors"
              >
                <ArrowLeft />
                Back
              </button>
              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                Any specific methodologies of interest?
              </h1>
              <p className="text-text-secondary mb-8">
                Select all that apply. This helps us refine the compound
                suggestion for your research.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-10">
                {FOCUS_AREAS.map((focusArea) => (
                  <button
                    key={focusArea}
                    onClick={() => toggleFocus(focusArea)}
                    className={`border rounded-full px-5 py-2.5 text-sm transition-all ${
                      focuses.has(focusArea)
                        ? "bg-secondary text-white border-secondary"
                        : "border-border text-text-primary hover:border-secondary"
                    }`}
                  >
                    {focusArea}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={focuses.size === 0}
                className="bg-primary text-white rounded-lg px-8 py-3 font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                View Suggested Compounds
              </button>
            </div>
          )}

          {/* ---- Results ---- */}
          {step === 5 && recommended && (
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                Suggested Compound Set
              </h1>
              <p className="text-text-secondary mb-10">
                Based on your research interest, these compounds are commonly
                referenced in published literature on this topic.
              </p>

              {/* Protocol card */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden max-w-md mx-auto text-left relative">
                {/* Badge */}
                {recommended.badge && (
                  <span
                    className={`absolute top-4 right-4 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded ${
                      recommended.badge === "PREMIUM"
                        ? "bg-primary text-white"
                        : "bg-secondary text-white"
                    }`}
                  >
                    {recommended.badge}
                  </span>
                )}

                {/* Top */}
                <div className="p-8 pb-0">
                  <div
                    className="w-1 h-8 rounded mb-4"
                    style={{ backgroundColor: recommended.accent_color }}
                  />
                  <h3 className="font-heading text-2xl font-bold text-primary">
                    {recommended.name}
                  </h3>
                  <p className="text-sm text-text-secondary mt-1">
                    {recommended.tagline}
                  </p>
                </div>

                {/* Items */}
                <div className="px-8">
                  <div className="border-t border-border pt-4 mt-5">
                    <ul className="space-y-2.5">
                      {recommended.items
                        ?.sort((a, b) => a.sort_order - b.sort_order)
                        .map((item) => (
                          <li
                            key={item.id}
                            className="flex items-start gap-2 text-sm text-text-primary"
                          >
                            <CheckmarkSmall />
                            {item.product?.name ?? "Unknown product"}
                          </li>
                        ))}
                    </ul>
                    <p className="text-xs text-text-secondary mt-3">
                      For laboratory research use only. Not for human consumption.
                    </p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="p-8 border-t border-border mt-5">
                  <div className="mb-2">
                    <span className="font-heading text-3xl font-extrabold text-primary">
                      ${recommended.subscription_price}
                    </span>
                    <span className="text-xs text-text-secondary ml-1">
                      /month
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    One-time: ${recommended.one_time_price}. Save up to 15% with subscription.
                  </p>
                </div>
              </div>

              {/* Why this compound set */}
              <div className="max-w-md mx-auto mt-8 bg-surface border border-border rounded-xl p-6 text-left">
                <h4 className="font-heading text-sm font-bold text-primary mb-2">
                  Why this compound set
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {reasonText}
                </p>
              </div>

              {/* CTAs */}
              <div className="max-w-md mx-auto mt-8 flex flex-col sm:flex-row gap-3">
                <Link
                  href="#"
                  className="flex-1 bg-primary text-white text-center rounded-lg py-3 font-semibold hover:bg-primary-hover transition-colors"
                >
                  Order This Compound Set
                </Link>
                <Link
                  href="/protocols/build"
                  className="flex-1 border border-border text-primary text-center rounded-lg py-3 font-medium hover:border-primary transition-colors"
                >
                  Customize Compounds
                </Link>
              </div>

              <Link
                href="/protocols"
                className="inline-block mt-6 text-sm text-text-secondary hover:text-secondary transition-colors"
              >
                Or browse all compound sets
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
