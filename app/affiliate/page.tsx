"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Check } from "lucide-react";

const faqs = [
  {
    q: "How do I get paid?",
    a: "Commissions are paid monthly on the 1st via bank transfer (ACH). Minimum payout is $25.",
  },
  {
    q: "How long does the attribution window last?",
    a: "30 days. If a referred researcher places an order within 30 days of clicking your link, you receive the commission.",
  },
  {
    q: "Do referred researchers get a discount?",
    a: "Yes. First-time orders placed through a referral link receive 10% off.",
  },
  {
    q: "Can I refer from any channel?",
    a: "You may share your referral link through professional email, academic networks, industry forums, and direct communication with colleagues. Mass unsolicited outreach and misleading claims about our products are prohibited.",
  },
  {
    q: "What if an order is returned?",
    a: "If an order is refunded, the associated commission is reversed.",
  },
  {
    q: "Is there a minimum number of referrals?",
    a: "No. You earn from your very first successful referral.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#F0F0F0]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-semibold text-[#111111] pr-4">{q}</span>
        <ChevronDown
          className={`h-4 w-4 flex-shrink-0 text-[#6B7280] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-40 pb-5" : "max-h-0"
        }`}
      >
        <p className="text-sm text-[#6B7280] leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function AffiliatePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] leading-[1.1] mb-5">
            Referral Program for Research Professionals
          </h1>
          <p className="text-base sm:text-lg text-[#6B7280] mb-8 max-w-2xl mx-auto">
            Recommend a trusted source of verified research compounds to your
            network. Earn commission on every order placed through your referral
            link.
          </p>
          <Link
            href="/affiliate/apply"
            className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white rounded-full px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-sm sm:text-base hover:opacity-90 transition-all duration-200"
          >
            Apply to Our Referral Program
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="mt-4 text-sm text-[#6B7280]">
            Already a referrer?{" "}
            <Link
              href="/affiliate/dashboard"
              className="text-[#10B981] font-medium hover:underline"
            >
              Sign in to your dashboard
            </Link>
          </p>
        </div>
      </section>

      {/* Program Overview */}
      <section className="bg-[#FAFAFA] py-14 sm:py-18">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-[#F0F0F0] p-6 sm:p-8">
            <p className="text-sm sm:text-base text-[#6B7280] leading-relaxed mb-6">
              Our referral program is designed for laboratory professionals,
              academic researchers, and procurement specialists who want to
              recommend a reliable source of independently tested research
              compounds. Earn 15% on first orders and 10% on all subsequent
              orders from researchers you refer. There are no earning caps, no
              minimum referrals, and payouts are processed monthly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-[#FAFAFA] rounded-lg px-4 py-3 text-center">
                <p className="text-lg font-bold text-[#111111]">15%</p>
                <p className="text-xs text-[#6B7280]">First order commission</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg px-4 py-3 text-center">
                <p className="text-lg font-bold text-[#111111]">10%</p>
                <p className="text-xs text-[#6B7280]">Recurring commission</p>
              </div>
              <div className="bg-[#FAFAFA] rounded-lg px-4 py-3 text-center">
                <p className="text-lg font-bold text-[#111111]">30 days</p>
                <p className="text-xs text-[#6B7280]">Attribution window</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Vertical Timeline */}
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-10">
            How It Works
          </h2>
          <div className="space-y-8">
            {[
              "Submit your application with your professional background and institutional affiliation.",
              "Once approved, you receive a unique referral link and procurement code.",
              "Share your referral link with peer laboratories, academic networks, and independent researchers.",
              "Earn commission on every order placed through your link. Paid monthly via bank transfer.",
            ].map((text, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-[#111111] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  {i < 3 && (
                    <div className="w-px h-full bg-[#F0F0F0] mt-2" />
                  )}
                </div>
                <p className="text-sm text-[#6B7280] leading-relaxed pt-1.5 pb-2">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Refer Purity Lab - Two Column */}
      <section className="bg-[#FAFAFA] py-14 sm:py-18">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                What Makes Us Worth Recommending
              </h2>
            </div>
            <ul className="space-y-3">
              {[
                "Six-panel independent testing on every batch (purity, identity, heavy metals, sterility, endotoxins, appearance)",
                "Full Certificates of Analysis published and searchable by batch number",
                "98%+ purity threshold. Batches that fail are rejected.",
                "No earning caps on referral commissions",
                "Monthly payouts with a $25 minimum threshold",
                "Real-time tracking dashboard to monitor referrals and earnings",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-[#10B981] flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-[#6B7280] leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Earnings Example */}
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-6">
            Example Monthly Earnings
          </h2>
          <div className="bg-[#FAFAFA] rounded-2xl border border-[#F0F0F0] p-6 sm:p-8">
            <p className="text-sm text-[#6B7280] mb-5">
              5 referred researchers placing an average order of $150
            </p>
            <div className="space-y-3 mb-5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6B7280]">First orders: 5 x $150 x 15%</span>
                <span className="font-semibold text-[#111111]">$112.50</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#6B7280]">Returning researchers (3 reorders): 3 x $150 x 10%</span>
                <span className="font-semibold text-[#111111]">$45.00</span>
              </div>
              <div className="border-t border-[#F0F0F0] pt-3 flex justify-between items-center">
                <span className="text-sm font-bold text-[#111111]">Total</span>
                <span className="text-lg font-extrabold text-[#111111]">$157.50/month</span>
              </div>
            </div>
            <p className="text-xs text-[#6B7280]">
              From 5 referrals. Commissions scale with the number of researchers you refer.
            </p>
          </div>
        </div>
      </section>

      {/* Who Should Apply */}
      <section className="bg-[#FAFAFA] py-14 sm:py-18">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-6">
            Who Should Apply
          </h2>
          <ul className="space-y-3">
            {[
              "Independent researchers who source compounds regularly",
              "Laboratory procurement specialists",
              "Academic research coordinators",
              "Scientific educators and lecturers",
              "Research supply resellers",
              "Industry consultants working with research teams",
            ].map((item, i) => (
              <li
                key={i}
                className="bg-white rounded-xl border border-[#F0F0F0] px-5 py-3.5 text-sm text-[#111111]"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-14 sm:py-18">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-8">
            Frequently Asked Questions
          </h2>
          <div className="bg-[#FAFAFA] rounded-2xl px-6">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[#FAFAFA] py-14 sm:py-18">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-3">
            Ready to join?
          </h2>
          <p className="text-sm text-[#6B7280] mb-8">
            Submit your application and start earning from referrals within 24 hours.
          </p>
          <Link
            href="/affiliate/apply"
            className="inline-flex items-center gap-2 bg-[#111111] text-white rounded-full px-10 py-4 font-bold hover:opacity-90 transition-all duration-200"
          >
            Apply Now
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
