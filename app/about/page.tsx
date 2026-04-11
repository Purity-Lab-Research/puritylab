import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  FlaskConical,
  ShieldCheck,
  Eye,
  Thermometer,
  Users,
  Heart,
  ArrowRight,
  Package,
  Microscope,
  ClipboardCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Purity Lab",
  description:
    "We don't just sell peptides. We prove what's in them. Our mission is to bring radical transparency and research-grade quality to the peptide industry.",
};

/* ─── Data ─── */

const VALUES = [
  {
    title: "Radical Transparency",
    description:
      "Every batch is independently tested and every Certificate of Analysis is published publicly. No hidden results, no blurry PDFs, no login walls.",
    icon: Eye,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    title: "Research-Grade Purity",
    description:
      "We hold every product to a 98%+ purity threshold verified by HPLC analysis. Batches that fall short are rejected. No exceptions.",
    icon: FlaskConical,
    iconBg: "bg-[#10B981]/10",
    iconColor: "text-[#10B981]",
  },
  {
    title: "Independent Verification",
    description:
      "We don't grade our own homework. Every batch ships to an independent US-based analytical lab for third-party testing.",
    icon: ShieldCheck,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "Temperature-Safe Packaging",
    description:
      "Peptides are temperature-sensitive. All products are stored and shipped under conditions designed to preserve compound integrity.",
    icon: Thermometer,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
  },
  {
    title: "Responsive Support",
    description:
      "Have a question about a product, a CoA, or your order? Our support team is available by email and responds within one business day.",
    icon: Users,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-500",
  },
  {
    title: "Built for Researchers",
    description:
      "Our product catalog is organized around real research applications and supported by detailed documentation. Not generic product pages.",
    icon: Heart,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
  },
];

const PROCESS = [
  {
    number: "01",
    title: "Source",
    description:
      "We partner with cGMP-certified manufacturers who meet our strict quality requirements before a single vial enters our supply chain.",
    icon: Package,
  },
  {
    number: "02",
    title: "Test",
    description:
      "Every batch is sent to an independent US analytical laboratory for HPLC purity analysis and mass spectrometry identity confirmation.",
    icon: Microscope,
  },
  {
    number: "03",
    title: "Verify",
    description:
      "Results must meet our 98%+ purity threshold. Any batch that falls below is rejected and never reaches our inventory.",
    icon: ClipboardCheck,
  },
  {
    number: "04",
    title: "Ship",
    description:
      "Approved products are stored under proper conditions and shipped with care to preserve compound integrity.",
    icon: Thermometer,
  },
];

const STATS = [
  { value: "98%+", label: "Purity Threshold" },
  { value: "100%", label: "Batches Tested" },
  { value: "1-Day", label: "Order Processing" },
  { value: "24/7", label: "CoA Access" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Purity Lab"
        description="Research-grade peptides backed by radical transparency."
        breadcrumbs={[{ label: "About" }]}
      />

      {/* ─── Section 1: Our Story ─── */}
      <section className="bg-white py-16 sm:py-20">
        <ScrollReveal className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
              Why We Started Purity Lab
            </h2>
          </div>
          <div className="space-y-5 text-base text-[#6B7280] leading-relaxed">
            <p>
              The peptide industry has a trust problem. Too many companies sell
              products backed by nothing more than their own word. In-house
              certificates, vague purity claims, and test results you can never
              actually verify.
            </p>
            <p>
              <span className="font-semibold text-[#111111]">
                We built Purity Lab to fix that.
              </span>{" "}
              Every product we sell goes through independent third-party testing
              at a US-based analytical laboratory. Every Certificate of Analysis
              is published publicly, linked to the specific batch number on your
              vial. No login walls. No blurry PDFs. No trust-me marketing.
            </p>
            <p>
              We believe that if a company is confident in their product, they
              should have no problem proving it. That&apos;s not a bold claim.
              It should be the bare minimum.{" "}
              <span className="font-semibold text-[#111111]">
                We just happen to be one of the few companies that actually does
                it.
              </span>
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 2: Stats Bar ─── */}
      <section className="bg-gradient-to-br from-[#F0FDF4] via-[#EFF6FF] to-[#F5F3FF] py-12 sm:py-14 border-y border-[#F0F0F0]">
        <ScrollReveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#E5E7EB]">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-[#6B7280] font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 3: Our Values ─── */}
      <section className="bg-[#FAFAFA] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
              What We Stand For
            </h2>
            <p className="mt-3 text-[#6B7280] max-w-xl mx-auto">
              These aren&apos;t slogans on a wall. They&apos;re the standards
              that govern every decision we make.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.08}>
                <div className="bg-white rounded-2xl p-7 hover:-translate-y-1 hover:shadow-md transition-all duration-300 flex flex-col h-full">
                  <div
                    className={`w-11 h-11 rounded-xl ${value.iconBg} flex items-center justify-center mb-4`}
                  >
                    <value.icon
                      className={`h-5 w-5 ${value.iconColor}`}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-base font-bold text-[#111111] mb-1.5">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 4: Our Process ─── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
              From Source to Doorstep
            </h2>
            <p className="mt-3 text-[#6B7280] max-w-xl mx-auto">
              Every vial goes through a four-stage pipeline before it reaches
              you.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS.map((step, i) => (
              <ScrollReveal key={step.number} delay={i * 0.1}>
                <div className="relative bg-[#FAFAFA] rounded-2xl p-7 h-full">
                  <span className="text-5xl font-extrabold text-[#F0F0F0] block mb-3 leading-none">
                    {step.number}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-[#111111] flex items-center justify-center mb-4">
                    <step.icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Section 5: The Standard ─── */}
      <section className="bg-[#FAFAFA] py-16 sm:py-20 border-t border-[#F0F0F0]">
        <ScrollReveal className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-6">
            The Standard We Hold
          </h2>
          <div className="space-y-5 text-base text-[#6B7280] leading-relaxed text-left">
            <p>
              We don&apos;t believe transparency should be a differentiator. It
              should be the default. But in an industry where most companies
              won&apos;t even show you a real test result, we&apos;ve made it our
              entire identity.
            </p>
            <p>
              Every product in our catalog has a published Certificate of
              Analysis from an independent lab. Every product listing is built
              around real research documentation, not upselling. Orders are
              processed within one business day.
            </p>
            <p className="font-semibold text-[#111111]">
              If you&apos;ve been burned by peptide companies that cut corners,
              hide test results, or make claims they can&apos;t back up, you&apos;re
              in the right place.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 6: CTA ─── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="bg-gradient-to-br from-[#F0FDF4] via-[#ECFDF5] to-[#F0FDF4] rounded-2xl px-8 sm:px-16 lg:px-24 py-10 sm:py-12 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111] mb-4">
                Ready to see the difference?
              </h2>
              <p className="text-sm sm:text-base text-[#6B7280] max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
                Browse our catalog, check the CoA on any product, and see for
                yourself what research-grade quality looks like.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white rounded-full px-9 py-3.5 font-bold hover:bg-black hover:scale-[1.02] transition-all duration-200"
                >
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/coa"
                  className="inline-flex items-center justify-center gap-2 bg-white text-[#111111] border border-[#111111] rounded-full px-9 py-3.5 font-bold hover:bg-gray-50 hover:scale-[1.02] transition-all duration-200"
                >
                  View CoA Library
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
