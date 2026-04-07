"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "Choose Your Goal",
    description:
      "Pick a pre-built protocol or build a custom stack tailored to your needs.",
  },
  {
    number: "02",
    title: "Subscribe & Save",
    description:
      "Lock in 10% off with a monthly subscription. Pause or cancel anytime.",
  },
  {
    number: "03",
    title: "Track Your Purity",
    description:
      "Every vial ships with a batch number linked to a published Certificate of Analysis.",
  },
];

export default function HowItWorks() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-background py-20">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-[family-name:var(--font-heading)] text-4xl font-extrabold text-primary">
            How It Works
          </h2>
          <p className="mt-3 text-text-secondary">
            From goal to doorstep in three simple steps.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="bg-surface border border-border rounded-xl p-9 flex-1 max-w-[340px] mx-auto md:mx-0"
              style={{
                animationDelay: `${i * 0.15}s`,
              }}
            >
              <span className="font-[family-name:var(--font-heading)] text-5xl font-extrabold text-border block mb-4">
                {step.number}
              </span>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-primary mb-2.5">
                {step.title}
              </h3>
              <p className="font-[family-name:var(--font-body)] text-sm text-text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
