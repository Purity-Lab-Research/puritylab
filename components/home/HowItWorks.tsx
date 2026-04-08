"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Target, RefreshCw, ShieldCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your Goal",
    description:
      "Pick a pre-built protocol or build a custom stack tailored to your needs.",
    icon: Target,
  },
  {
    number: "02",
    title: "Subscribe & Save",
    description:
      "Save up to 15% with a monthly subscription. Pause or cancel anytime.",
    icon: RefreshCw,
  },
  {
    number: "03",
    title: "Track Your Purity",
    description:
      "Every vial ships with a batch number linked to a published Certificate of Analysis.",
    icon: ShieldCheck,
  },
];

export default function HowItWorks() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-white py-16 sm:py-20">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            How It Works
          </h2>
          <p className="mt-3 text-[#6B7280]">
            From goal to doorstep in three simple steps.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-6">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="bg-[#FAFAFA] rounded-2xl p-8 flex-1 max-w-[340px] mx-auto md:mx-0"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl font-extrabold text-[#F0F0F0]">
                  {step.number}
                </span>
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                  <step.icon className="h-5 w-5 text-[#10B981]" strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#111111] mb-2.5">
                {step.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
