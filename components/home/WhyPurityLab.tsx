"use client";

import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { Package, BadgePercent, Truck, Users, FlaskConical, ShieldCheck } from "lucide-react";

const reasons = [
  {
    title: "Always in Stock",
    description: "Popular peptides are always available. No backorders, no waiting.",
    icon: Package,
    iconBg: "bg-[#10B981]/10",
    iconColor: "text-[#10B981]",
  },
  {
    title: "Volume Discounts",
    description: "Subscribe and save up to 15%. Larger orders get better pricing.",
    icon: BadgePercent,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    title: "Cold Chain Shipping",
    description: "Temperature-controlled packaging to protect peptide integrity in transit.",
    icon: Truck,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Community Access",
    description: "Every purchase unlocks access to our private community of researchers.",
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "99%+ Purity",
    description: "Every batch independently tested with full Certificates of Analysis published.",
    icon: FlaskConical,
    iconBg: "bg-[#10B981]/10",
    iconColor: "text-[#10B981]",
  },
  {
    title: "Shipment Protection",
    description: "Every order insured. If anything arrives damaged, we replace it free.",
    icon: ShieldCheck,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

export default function WhyPurityLab() {
  const animRef = useScrollAnimation();

  return (
    <section className="bg-[#F0FDF4] py-16 sm:py-20">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            Why Purity Lab
          </h2>
          <p className="mt-3 text-[#6B7280]">
            We don&apos;t just sell peptides. We prove what&apos;s in them.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="bg-white rounded-2xl p-7 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col h-full"
            >
              <div className={`w-11 h-11 rounded-xl ${reason.iconBg} flex items-center justify-center mb-4`}>
                <reason.icon className={`h-5 w-5 ${reason.iconColor}`} strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-[#111111] mb-1.5">
                {reason.title}
              </h3>
              <p className="text-sm text-[#6B7280] leading-relaxed">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
