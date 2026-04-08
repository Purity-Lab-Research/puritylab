import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";
import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata: Metadata = {
  title: "How We Test",
  description:
    "Every batch independently tested by US labs. Learn about our HPLC purity analysis, mass spectrometry identity confirmation, and 98% quality threshold.",
};

/* ─── Data ─── */
const STEPS = [
  {
    number: 1,
    title: "Product Received",
    description:
      "Raw peptides arrive from our manufacturing partner with their in-house Certificate of Analysis.",
    accent: false,
  },
  {
    number: 2,
    title: "Samples Pulled",
    description:
      "Representative samples are pulled from each batch for independent verification.",
    accent: false,
  },
  {
    number: 3,
    title: "Sent to Independent Lab",
    description:
      "Samples ship to a US-based third-party analytical laboratory. Not our lab. Not our supplier's lab.",
    accent: false,
  },
  {
    number: 4,
    title: "HPLC Purity Analysis",
    description:
      "High-Performance Liquid Chromatography measures exact purity percentage of the peptide.",
    accent: false,
  },
  {
    number: 5,
    title: "Mass Spec Identity",
    description:
      "Mass Spectrometry confirms the molecular identity matches what's on the label.",
    accent: false,
  },
  {
    number: 6,
    title: "Results Published",
    description:
      "Test results are published on our CoA Library and linked to the specific batch number.",
    accent: false,
  },
  {
    number: 7,
    title: "Quality Gate",
    description:
      "If purity falls below 98%, the batch is rejected. No exceptions. No second chances.",
    accent: true,
  },
];

const COA_TIPS = [
  {
    number: 1,
    title: "Check the Lab Name",
    description:
      "A legitimate CoA names the testing laboratory. If it just says 'tested' with no lab identified, that's a red flag.",
  },
  {
    number: 2,
    title: "Look for HPLC Results",
    description:
      "High-Performance Liquid Chromatography is the industry standard for purity testing. If a CoA doesn't show HPLC data, it's incomplete.",
  },
  {
    number: 3,
    title: "Verify the Batch Number",
    description:
      "Every CoA should reference a specific batch number that matches the label on your vial. Generic CoAs that don't reference a batch are worthless.",
  },
  {
    number: 4,
    title: "Check the Date",
    description:
      "Testing should be recent and specific to the batch you received. A CoA from two years ago doesn't tell you anything about what's in your vial today.",
  },
  {
    number: 5,
    title: "Purity Percentage Matters",
    description:
      "Research-grade peptides should test at 98% or higher. Anything below 95% is a concern. Below 90% is unacceptable.",
  },
];

export default function HowWeTestPage() {
  return (
    <>
      <PageHeader
        title="How We Test"
        description="Radical transparency starts with independent verification."
        breadcrumbs={[{ label: "How We Test" }]}
      />

      {/* ─── Section 1: Testing Philosophy ─── */}
      <section className="bg-background py-16">
        <ScrollReveal className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading text-3xl font-bold text-primary mb-8">
            Why Testing Matters
          </h2>
          <div className="space-y-5 text-base text-text-secondary leading-relaxed text-left">
            <p>
              Most peptide companies provide a Certificate of Analysis from
              their manufacturer. The problem?{" "}
              <span className="font-semibold text-primary">
                That&apos;s the supplier grading their own homework.
              </span>{" "}
              A manufacturer&apos;s in-house CoA tells you what they want you to
              see, not necessarily what&apos;s in the vial.
            </p>
            <p>
              At Purity Lab,{" "}
              <span className="font-semibold text-primary">
                every batch goes through independent third-party testing
              </span>{" "}
              at a US-based analytical laboratory. We don&apos;t just trust our
              supplier&apos;s word. We verify it. If a batch doesn&apos;t meet
              our{" "}
              <span className="font-semibold text-primary">
                98% purity threshold, it doesn&apos;t ship. Period.
              </span>
            </p>
            <p>
              We publish every test result.{" "}
              <span className="font-semibold text-primary">
                Not behind a login wall. Not as a blurry PDF.
              </span>{" "}
              Right on the product page, linked to the specific batch number on
              your vial. This is what radical transparency looks like.
            </p>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── Section 2: Testing Process ─── */}
      <section className="bg-surface py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-primary">
              From Manufacturer to Your Doorstep
            </h2>
          </div>

          {/* Desktop: horizontal flow */}
          <div className="hidden lg:block">
            <ScrollReveal>
              <div className="grid grid-cols-7 gap-0 relative">
                {/* Connecting line */}
                <div className="absolute top-5 left-[calc(100%/14)] right-[calc(100%/14)] h-0 border-t-2 border-dashed border-[#F0F0F0]" />

                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className="flex flex-col items-center text-center relative z-10"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white mb-4 ${
                        step.accent ? "bg-[#EF4444]" : "bg-[#111111]"
                      }`}
                    >
                      {step.number}
                    </div>
                    <h3 className="text-sm font-bold text-[#111111] mb-1.5 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs text-[#6B7280] leading-relaxed max-w-[140px]">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Mobile/Tablet: vertical timeline */}
          <div className="lg:hidden">
            <div className="relative pl-12">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-[#F0F0F0]" />

              {STEPS.map((step, i) => (
                <ScrollReveal
                  key={step.number}
                  className={`relative pb-10 ${i === STEPS.length - 1 ? "pb-0" : ""}`}
                >
                  <div
                    className={`absolute left-[-32px] w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${
                      step.accent ? "bg-[#EF4444]" : "bg-[#111111]"
                    }`}
                  >
                    {step.number}
                  </div>
                  <h3 className="text-lg font-bold text-[#111111] mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">
                    {step.description}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Section 3: Testing Partners ─── */}
      <section className="bg-background py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-primary">
              Independent Verification
            </h2>
            <p className="mt-2 text-text-secondary">
              Our testing is performed by accredited US analytical laboratories.
            </p>
          </div>

          <ScrollReveal className="max-w-lg mx-auto">
            <div className="bg-surface border border-border rounded-xl p-8 text-center">
              <h3 className="font-heading text-xl font-bold text-primary mb-1">
                [Testing Lab Name]
              </h3>
              <p className="text-text-secondary text-sm mb-4">
                ISO 17025 Accredited
              </p>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Details about our testing partner will be published once our
                first batch is processed. We&apos;re committed to full
                transparency about who tests our products.
              </p>
              <p className="text-xs text-text-secondary italic">
                We&apos;ll update this section with our lab partner&apos;s full
                credentials and accreditation details.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── Section 4: How to Read a CoA ─── */}
      <section className="bg-surface py-16 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-primary">
              How to Read a Certificate of Analysis
            </h2>
            <p className="mt-2 text-text-secondary max-w-xl mx-auto">
              Not all CoAs are created equal. Here&apos;s what separates a real
              test from a rubber stamp.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-4">
            {COA_TIPS.map((tip, i) => (
              <ScrollReveal key={tip.number} delay={i * 0.1}>
                <div className="bg-background border border-border rounded-xl p-6">
                  <span className="font-heading text-2xl font-extrabold text-border block mb-2">
                    {String(tip.number).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-base font-bold text-primary mb-1.5">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="bg-primary rounded-2xl p-10 text-center max-w-2xl mx-auto my-16">
            <h2 className="font-heading text-2xl font-bold text-white mb-3">
              Want to verify your vial?
            </h2>
            <p className="text-white/70 mb-6">
              Look up your batch number in our CoA Library.
            </p>
            <Link
              href="/coa"
              className="inline-block bg-white text-primary rounded-lg px-8 py-3 font-bold hover:bg-white/90 transition-colors"
            >
              Go to CoA Library
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}
