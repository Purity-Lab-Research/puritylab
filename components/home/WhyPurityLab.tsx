"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const reasons = [
  {
    title: "Radical Transparency",
    description:
      "We publish every CoA, every batch, every time. Enter your batch number and see exactly what\u2019s in your vial.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="m9 15 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Built for Athletes",
    description:
      "Protocols designed around recovery, performance, and body composition. Not a random catalog of chemicals.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "No Mystery Sourcing",
    description:
      "We tell you where it\u2019s tested, how it\u2019s tested, and what the results are. If a batch doesn\u2019t meet 98%+ purity, it doesn\u2019t ship.",
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
        <path d="M8.5 2h7" />
      </svg>
    ),
  },
];

export default function WhyPurityLab() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-background py-20 border-t border-border">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-4xl font-extrabold text-primary">
            Why Purity Lab
          </h2>
          <p className="mt-3 text-text-secondary">
            We don&apos;t just sell peptides. We prove what&apos;s in them.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-surface border border-border rounded-xl p-9 flex-1 max-w-[340px] mx-auto md:mx-0"
            >
              <div className="w-12 h-12 rounded-[10px] bg-secondary/10 flex items-center justify-center mb-5 text-secondary">
                {reason.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-primary mb-2.5">
                {reason.title}
              </h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
