"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import type { Protocol } from "@/lib/types";

/* ─── Types ─── */
type Goal = "recovery" | "fat_loss" | "performance" | "multiple" | null;
type Experience = "first_time" | "some" | "advanced" | null;
type Budget = "under_150" | "150_300" | "300_plus" | null;

interface QuizFlowProps {
  protocols: Protocol[];
}

/* ─── Step data ─── */
const GOALS = [
  {
    value: "recovery" as const,
    title: "Recover from injury",
    subtitle: "Healing, joint repair, post-surgery recovery",
  },
  {
    value: "fat_loss" as const,
    title: "Lose fat",
    subtitle: "Body composition, stubborn fat, metabolic support",
  },
  {
    value: "performance" as const,
    title: "Build muscle & performance",
    subtitle: "Growth hormone, lean mass, endurance",
  },
  {
    value: "multiple" as const,
    title: "Multiple goals",
    subtitle: "I want a comprehensive protocol",
  },
];

const EXPERIENCES = [
  {
    value: "first_time" as const,
    title: "First time",
    subtitle: "Never used research peptides before",
  },
  {
    value: "some" as const,
    title: "Some experience",
    subtitle: "I've run a cycle or two",
  },
  {
    value: "advanced" as const,
    title: "Advanced",
    subtitle: "I'm familiar with protocols, dosing, and reconstitution",
  },
];

const BUDGETS = [
  {
    value: "under_150" as const,
    title: "Under $150/month",
    subtitle: "Looking for an effective entry point",
  },
  {
    value: "150_300" as const,
    title: "$150 – $300/month",
    subtitle: "Ready to invest in a full protocol",
  },
  {
    value: "300_plus" as const,
    title: "$300+/month",
    subtitle: "I want the most comprehensive stack available",
  },
];

const FOCUS_AREAS = [
  "Joint & tendon recovery",
  "Post-surgery healing",
  "Stubborn belly fat",
  "Overall body composition",
  "Sleep & recovery",
  "Energy & endurance",
];

/* ─── Recommendation map ─── */
function getRecommendedSlug(goal: Goal, budget: Budget): string {
  if (goal === "recovery") return "recovery";
  if (goal === "fat_loss") {
    if (budget === "under_150") return "performance";
    return "fat-loss";
  }
  if (goal === "performance") return "performance";
  // multiple goals
  if (budget === "under_150") return "performance";
  if (budget === "150_300") return "fat-loss";
  return "full-recomp";
}

function getReasonText(
  goal: Goal,
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
        ? "$150–$300/month"
        : "$300+/month";

  if (goal === "recovery") {
    return `Based on your focus on injury recovery${focusStr ? ` - specifically ${focusStr}` : ""} - the ${protocol.name} gives you the essential BPC-157 and TB500 combination that athletes rely on for soft tissue healing. At $${protocol.subscription_price}/month with a subscription, it fits well within your ${budgetLabel} budget.`;
  }
  if (goal === "fat_loss") {
    if (protocol.slug === "performance") {
      return `For fat loss on a budget ${budgetLabel}, the ${protocol.name} is the smartest entry point. CJC-1295/Ipamorelin supports growth hormone release which aids both body composition and metabolic function${focusStr ? `, making it a strong match for your interest in ${focusStr}` : ""}.`;
    }
    return `Based on your fat loss goals${focusStr ? ` and focus on ${focusStr}` : ""}, the ${protocol.name} combines MOTS-C and AOD 9604 - two peptides specifically studied for metabolic optimization and targeted fat reduction. At $${protocol.subscription_price}/month, it fits your ${budgetLabel} budget.`;
  }
  if (goal === "performance") {
    return `For muscle and performance goals${focusStr ? ` with a focus on ${focusStr}` : ""}, the ${protocol.name} delivers clean growth hormone support through CJC-1295/Ipamorelin without cortisol or prolactin spikes. At $${protocol.subscription_price}/month, it's an efficient stack for your ${budgetLabel} budget.`;
  }
  // multiple
  if (protocol.slug === "full-recomp") {
    return `With multiple goals and a ${budgetLabel} budget, the ${protocol.name} is the all-in-one answer. It covers recovery (BPC-157 + TB500), metabolic support (MOTS-C), and growth hormone optimization (CJC/Ipa)${focusStr ? ` - addressing your interest in ${focusStr}` : ""}. Everything you need in one monthly shipment.`;
  }
  if (protocol.slug === "fat-loss") {
    return `For multiple goals at a ${budgetLabel} budget, the ${protocol.name} offers the widest coverage. MOTS-C handles metabolic function, AOD 9604 targets fat, and CJC/Ipa supports growth hormone${focusStr ? ` - a strong match for ${focusStr}` : ""}.`;
  }
  return `The ${protocol.name} is the best multi-goal value at your ${budgetLabel} budget. Growth hormone support through CJC/Ipa aids recovery, body composition, and performance simultaneously${focusStr ? ` - directly relevant to your interest in ${focusStr}` : ""}.`;
}

/* ─── Icons ─── */
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

/* ─── Main Component ─── */
export default function QuizFlow({ protocols }: QuizFlowProps) {
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<Goal>(null);
  const [experience, setExperience] = useState<Experience>(null);
  const [budget, setBudget] = useState<Budget>(null);
  const [focuses, setFocuses] = useState<Set<string>>(new Set());
  const [transitioning, setTransitioning] = useState(false);

  const totalSteps = 4;
  const progress = step <= totalSteps ? ((step - 1) / totalSteps) * 100 : 100;

  const recommended = useMemo(() => {
    if (!goal || !budget) return null;
    const slug = getRecommendedSlug(goal, budget);
    return protocols.find((p) => p.slug === slug) ?? protocols[0] ?? null;
  }, [goal, budget, protocols]);

  const reasonText = useMemo(() => {
    if (!recommended || !goal || !budget) return "";
    return getReasonText(goal, budget, focuses, recommended);
  }, [recommended, goal, budget, focuses]);

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

  function toggleFocus(area: string) {
    setFocuses((prev) => {
      const next = new Set(prev);
      if (next.has(area)) next.delete(area);
      else next.add(area);
      return next;
    });
  }

  function handleGoal(g: Goal) {
    setGoal(g);
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-heading text-xs font-bold text-white tracking-tight">
                PL
              </span>
            </div>
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
          {/* ─── Step 1: Goal ─── */}
          {step === 1 && (
            <div>
              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                What&apos;s your primary goal?
              </h1>
              <p className="text-text-secondary mb-8">
                We&apos;ll recommend a protocol based on your answers.
              </p>
              <div className="space-y-3">
                {GOALS.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => handleGoal(g.value)}
                    className={`w-full text-left border rounded-xl p-5 transition-all ${
                      goal === g.value
                        ? "border-secondary bg-secondary/5"
                        : "border-border hover:border-secondary hover:bg-secondary/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {g.title}
                        </p>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {g.subtitle}
                        </p>
                      </div>
                      {goal === g.value && <CheckIcon />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ─── Step 2: Experience ─── */}
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
                What&apos;s your experience with peptides?
              </h1>
              <p className="text-text-secondary mb-8">
                This helps us calibrate the right starting point.
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

          {/* ─── Step 3: Budget ─── */}
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
                What&apos;s your monthly budget?
              </h1>
              <p className="text-text-secondary mb-8">
                We&apos;ll match you with a protocol that fits.
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

          {/* ─── Step 4: Focus Areas ─── */}
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
                Any specific focus areas?
              </h1>
              <p className="text-text-secondary mb-8">
                Select all that apply. This helps us fine-tune your
                recommendation.
              </p>
              <div className="flex flex-wrap gap-2.5 mb-10">
                {FOCUS_AREAS.map((area) => (
                  <button
                    key={area}
                    onClick={() => toggleFocus(area)}
                    className={`border rounded-full px-5 py-2.5 text-sm transition-all ${
                      focuses.has(area)
                        ? "bg-secondary text-white border-secondary"
                        : "border-border text-text-primary hover:border-secondary"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
              <button
                onClick={handleSubmit}
                disabled={focuses.size === 0}
                className="bg-primary text-white rounded-lg px-8 py-3 font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                See My Protocol
              </button>
            </div>
          )}

          {/* ─── Results ─── */}
          {step === 5 && recommended && (
            <div className="text-center">
              <h1 className="font-heading text-3xl font-bold text-primary mb-2">
                Your Recommended Protocol
              </h1>
              <p className="text-text-secondary mb-10">
                Based on your goals and experience level
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
                      Recommended cycle: {recommended.cycle_length}
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
                    One-time: ${recommended.one_time_price} - Save $
                    {(
                      recommended.one_time_price -
                      recommended.subscription_price
                    ).toFixed(0)}
                    /mo with subscription
                  </p>
                </div>
              </div>

              {/* Why we recommend this */}
              <div className="max-w-md mx-auto mt-8 bg-surface border border-border rounded-xl p-6 text-left">
                <h4 className="font-heading text-sm font-bold text-primary mb-2">
                  Why we recommend this
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
                  Subscribe to This Protocol
                </Link>
                <Link
                  href="/protocols/build"
                  className="flex-1 border border-border text-primary text-center rounded-lg py-3 font-medium hover:border-primary transition-colors"
                >
                  Customize This Stack
                </Link>
              </div>

              <Link
                href="/protocols"
                className="inline-block mt-6 text-sm text-text-secondary hover:text-secondary transition-colors"
              >
                Or explore all protocols
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
