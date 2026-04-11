"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  FlaskConical,
  Atom,
  ShieldCheck,
  Microscope,
  AlertTriangle,
  Eye,
  ArrowRight,
} from "lucide-react";

const tests = [
  {
    icon: FlaskConical,
    label: "Purity",
    title: "HPLC Purity Analysis",
    description:
      "High-performance liquid chromatography measures the exact purity of each batch. Our minimum threshold is 98%. Anything below is rejected.",
    iconColor: "text-[#10B981]",
  },
  {
    icon: Atom,
    label: "Identity",
    title: "Mass Spectrometry",
    description:
      "Confirms the molecular weight matches the labeled compound. This verifies you are receiving the correct peptide, not a substitute.",
    iconColor: "text-[#3B82F6]",
  },
  {
    icon: ShieldCheck,
    label: "Metals",
    title: "Heavy Metals Screening",
    description:
      "ICP-MS analysis screens for lead, mercury, arsenic, and cadmium. Most suppliers skip this test entirely.",
    iconColor: "text-[#D97706]",
  },
  {
    icon: Microscope,
    label: "Sterility",
    title: "Sterility Testing",
    description:
      "Incubation-based testing confirms the absence of bacterial and fungal contamination in every batch.",
    iconColor: "text-[#8B5CF6]",
  },
  {
    icon: AlertTriangle,
    label: "Endotoxins",
    title: "Endotoxin Testing (LAL)",
    description:
      "The Limulus Amebocyte Lysate method detects bacterial endotoxins that can persist even after sterilization.",
    iconColor: "text-[#EC4899]",
  },
  {
    icon: Eye,
    label: "Visual",
    title: "Visual Inspection",
    description:
      "Every vial is checked for powder color, consistency, particulate matter, and dissolution behavior.",
    iconColor: "text-[#14B8A6]",
  },
];

export default function QualitySection() {
  const [active, setActive] = useState(0);
  const animRef = useScrollAnimation();
  const current = tests[active];

  return (
    <section className="bg-[#FAFAFA] py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Text content */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-2">
              Six Tests. Zero Shortcuts.
            </h2>
            <p className="text-[#6B7280] mb-6 text-sm">
              Every batch passes a six-panel independent testing protocol before it ships.
            </p>

            {/* Tab row */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {tests.map((test, i) => (
                <button
                  key={test.label}
                  onClick={() => setActive(i)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                    active === i
                      ? "bg-[#111111] text-white"
                      : "bg-white border border-[#F0F0F0] text-[#6B7280] hover:border-[#111111] hover:text-[#111111]"
                  }`}
                >
                  <test.icon className={`h-3.5 w-3.5 ${active === i ? "text-white" : test.iconColor}`} />
                  {test.label}
                </button>
              ))}
            </div>

            {/* Active test detail */}
            <div className="bg-white rounded-2xl border border-[#F0F0F0] p-5">
              <div className="flex items-center gap-2 mb-2">
                <current.icon className={`h-4 w-4 ${current.iconColor}`} />
                <h3 className="text-sm font-bold text-[#111111]">
                  {current.title}
                </h3>
              </div>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {current.description}
              </p>
            </div>

            {/* Stats row + CTA */}
            <div className="flex items-center gap-5 mt-5">
              <Link
                href="/coa"
                className="inline-flex items-center gap-1.5 bg-[#111111] text-white rounded-full px-5 py-2.5 text-sm font-semibold hover:bg-black transition-colors"
              >
                View CoA Library
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <span className="text-xs text-[#6B7280]">
                Full results published for every batch
              </span>
            </div>
          </div>

          {/* Right: Product image */}
          <div className="flex items-center justify-center">
            <div className="relative w-full">
              <div className="aspect-[3/2] rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#F0FDF4] via-white to-[#EFF6FF] shadow-lg">
                <Image
                  src="/images/imagesection.jpg"
                  alt="Purity Lab research peptide vials"
                  fill
                  className="object-cover rounded-[3rem]"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 left-5 right-5 sm:left-8 sm:right-8">
                <div className="bg-white rounded-2xl px-5 py-3.5 border border-[#F0F0F0] shadow-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                      <FlaskConical className="h-3.5 w-3.5 text-[#10B981]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#111111]">98%+ Verified</p>
                      <p className="text-[10px] text-[#6B7280]">Six-panel tested</p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {tests.map((_, j) => (
                      <div
                        key={j}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                          j <= active ? "bg-[#10B981]" : "bg-[#E5E7EB]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
