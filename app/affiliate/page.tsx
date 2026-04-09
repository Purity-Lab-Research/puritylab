"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  Repeat,
  Clock,
  Zap,
  BarChart3,
  Cookie,
  Wallet,
  Headphones,
  TrendingUp,
  ChevronDown,
  Users,
  Dumbbell,
  PenLine,
  Building2,
  Brain,
  FlaskConical,
  Heart,
} from "lucide-react";

const stats = [
  { value: "15%", label: "First Order Commission" },
  { value: "10%", label: "Lifetime Recurring" },
  { value: "$0", label: "Cost to Join" },
  { value: "24hr", label: "Approval Time" },
];

const steps = [
  {
    number: "01",
    title: "Apply",
    description:
      "Fill out a quick application. Most are approved within 24 hours.",
  },
  {
    number: "02",
    title: "Get Your Link",
    description:
      "Receive a unique referral link and discount code for your audience.",
  },
  {
    number: "03",
    title: "Share",
    description:
      "Promote Purity Lab through your content, social media, or community.",
  },
  {
    number: "04",
    title: "Earn",
    description:
      "Get 15% on first orders and 10% on every reorder. Paid monthly.",
  },
];

const differentiators = [
  {
    icon: TrendingUp,
    title: "No Earning Caps",
    description:
      "There is no limit on how much you can earn. Top affiliates earn $5,000+ monthly.",
  },
  {
    icon: Repeat,
    title: "Lifetime Commissions",
    description:
      "Once someone buys through your link, you earn on every future order they place. Forever.",
  },
  {
    icon: BarChart3,
    title: "Real-Time Dashboard",
    description:
      "Track clicks, conversions, and earnings in real time from your affiliate dashboard.",
  },
  {
    icon: Cookie,
    title: "30-Day Cookie",
    description:
      "Your referral cookie lasts 30 days. If they come back within a month, you still get credit.",
  },
  {
    icon: Wallet,
    title: "Monthly Payouts",
    description:
      "Commissions are paid on the 1st of every month via bank transfer. $25 minimum payout.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    description:
      "Questions? Our affiliate team responds within 24 hours.",
  },
];

const audiences = [
  { icon: Dumbbell, label: "Fitness influencers and content creators" },
  { icon: PenLine, label: "Health and wellness bloggers" },
  { icon: Building2, label: "Gym owners and personal trainers" },
  { icon: Brain, label: "Biohacking community leaders" },
  { icon: FlaskConical, label: "Peptide researchers and educators" },
  {
    icon: Heart,
    label:
      "Anyone with an engaged audience interested in performance and recovery",
  },
];

const faqs = [
  {
    q: "How do I get paid?",
    a: "Commissions are paid monthly on the 1st via bank transfer (ACH). Minimum payout is $25. You can view your balance and payout history in your affiliate dashboard.",
  },
  {
    q: "How long does the cookie last?",
    a: "30 days. If someone clicks your link and purchases within 30 days, you receive the commission.",
  },
  {
    q: "Do my referrals get a discount?",
    a: "Yes. Every new customer who uses your referral link or code gets 10% off their first order.",
  },
  {
    q: "Is there a minimum number of sales?",
    a: "No. You earn commissions from your very first referral.",
  },
  {
    q: "Can I promote on any platform?",
    a: "Yes. Social media, YouTube, blogs, email newsletters, podcasts, forums. The only restriction is no spam, misleading claims, or paid search ads bidding on \"Purity Lab\" branded terms.",
  },
  {
    q: "What if a customer returns a product?",
    a: "If an order is refunded, the associated commission is reversed.",
  },
];

function EarningsCalculator() {
  const [referrals, setReferrals] = useState(10);
  const [aov, setAov] = useState(200);

  const earnings = useMemo(() => {
    const firstOrder = referrals * aov * 0.15;
    const recurring = referrals * 0.6 * aov * 0.1;
    const annual = firstOrder + recurring * 12;
    return { firstOrder, recurring, annual };
  }, [referrals, aov]);

  const barMax = Math.max(earnings.firstOrder, earnings.recurring * 12, 1);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] text-center mb-4">
          Earnings Calculator
        </h2>
        <p className="text-center text-[#6B7280] mb-10 max-w-lg mx-auto">
          See how much you could earn based on your audience.
        </p>

        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">
                Monthly referrals: {referrals}
              </label>
              <input
                type="range"
                min={1}
                max={100}
                value={referrals}
                onChange={(e) => setReferrals(Number(e.target.value))}
                className="w-full accent-[#10B981]"
              />
              <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                <span>1</span>
                <span>100</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">
                Average order value: ${aov}
              </label>
              <input
                type="range"
                min={50}
                max={500}
                step={10}
                value={aov}
                onChange={(e) => setAov(Number(e.target.value))}
                className="w-full accent-[#10B981]"
              />
              <div className="flex justify-between text-xs text-[#6B7280] mt-1">
                <span>$50</span>
                <span>$500</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-[#FAFAFA] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#6B7280]">First order earnings</span>
                <span className="text-lg font-bold text-[#111111]">
                  ${earnings.firstOrder.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="h-3 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full transition-all duration-300"
                  style={{ width: `${(earnings.firstOrder / barMax) * 100}%` }}
                />
              </div>
            </div>
            <div className="bg-[#FAFAFA] rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-[#6B7280]">
                  Recurring monthly earnings
                </span>
                <span className="text-lg font-bold text-[#111111]">
                  ${earnings.recurring.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  /mo
                </span>
              </div>
              <div className="h-3 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981]/70 rounded-full transition-all duration-300"
                  style={{
                    width: `${(earnings.recurring * 12 / barMax) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="bg-[#F0FDF4] border border-[#10B981]/20 rounded-xl p-5 text-center">
              <p className="text-sm text-[#6B7280] mb-1">Projected annual earnings</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-[#10B981]">
                ${earnings.annual.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-[#6B7280]/60 mt-1">
                Based on 60% customer retention rate
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
      <section className="bg-white py-14 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side */}
            <div>
              <span className="inline-flex items-center rounded-full bg-[#10B981]/10 px-4 py-1.5 text-xs font-semibold text-[#10B981] mb-6">
                EARN WHILE YOU SHARE
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-[#111111] leading-[1.1] mb-5">
                Turn Your Audience Into Income
              </h1>
              <p className="text-base sm:text-lg text-[#6B7280] mb-8 max-w-lg">
                Recommend research peptides you believe in. Earn 15% on every
                first order and 10% on every reorder. No caps, no limits, no
                expiration.
              </p>
              <Link
                href="/affiliate/apply"
                className="inline-flex items-center justify-center gap-2 bg-[#111111] text-white rounded-full px-8 sm:px-10 py-3.5 sm:py-4 font-semibold text-sm sm:text-base hover:opacity-90 transition-all duration-200 w-full sm:w-auto"
              >
                Apply Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <p className="mt-4 text-sm text-[#6B7280]">
                Already an affiliate?{" "}
                <Link
                  href="/affiliate/dashboard"
                  className="text-[#10B981] font-medium hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>

            {/* Right side - Stats preview card */}
            <div className="bg-[#FAFAFA] rounded-2xl p-5 sm:p-8 border border-[#F0F0F0]">
              <p className="text-sm font-semibold text-[#6B7280] uppercase tracking-wider mb-5 sm:mb-6">
                Affiliate Overview
              </p>
              <div className="space-y-4 sm:space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#10B981]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#111111] font-medium">
                      First Order Commission
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                    15%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                      <Repeat className="h-4 w-4 sm:h-5 sm:w-5 text-[#10B981]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#111111] font-medium">
                      Recurring Commission
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                    10%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-[#10B981]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#111111] font-medium">
                      Cookie Duration
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                    30 days
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-[#10B981]" />
                    </div>
                    <span className="text-xs sm:text-sm text-[#111111] font-medium">
                      Approval Time
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-extrabold text-[#111111]">
                    24hr
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="bg-[#FAFAFA] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-5xl font-extrabold text-[#111111]">
                  {s.value}
                </p>
                <p className="text-xs sm:text-sm text-[#6B7280] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="bg-[#FAFAFA] rounded-2xl p-7">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F0F0F0] block mb-3">
                  {step.number}
                </span>
                <h3 className="text-lg font-bold text-[#111111] mb-1.5">
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

      {/* What makes our program different */}
      <section className="bg-[#F0FDF4] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] text-center mb-12">
            What Makes Our Program Different
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {differentiators.map((d) => (
              <div key={d.title} className="bg-white rounded-2xl p-7">
                <div className="w-11 h-11 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-4">
                  <d.icon className="h-5 w-5 text-[#10B981]" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-[#111111] mb-1.5">
                  {d.title}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                  {d.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings calculator */}
      <EarningsCalculator />

      {/* Commission breakdown */}
      <section className="bg-[#FAFAFA] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] text-center mb-10">
            Commission Breakdown
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#F0F0F0]">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#10B981] mb-2">15%</p>
              <p className="text-base font-bold text-[#111111] mb-2">
                First Order
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                Earn on every new customer's first purchase. Your referrals also
                get 10% off their first order, making it easy to convert.
              </p>
              <div className="bg-[#FAFAFA] rounded-lg px-4 py-3">
                <p className="text-xs text-[#6B7280]">Example</p>
                <p className="text-sm font-semibold text-[#111111]">
                  Customer spends $200, you earn $30
                </p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-[#F0F0F0]">
              <p className="text-3xl sm:text-4xl font-extrabold text-[#10B981] mb-2">10%</p>
              <p className="text-base font-bold text-[#111111] mb-2">
                Lifetime Recurring
              </p>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-4">
                Earn on every future order from your referrals. As long as they
                keep buying, you keep earning.
              </p>
              <div className="bg-[#FAFAFA] rounded-lg px-4 py-3">
                <p className="text-xs text-[#6B7280]">Example</p>
                <p className="text-sm font-semibold text-[#111111]">
                  10 active customers ordering monthly = $200/month passive
                  income
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who should apply */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] text-center mb-10">
            Who Should Apply
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {audiences.map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-3 bg-[#FAFAFA] rounded-xl px-5 py-4"
              >
                <a.icon className="h-5 w-5 text-[#10B981] flex-shrink-0" />
                <span className="text-sm text-[#111111] font-medium">
                  {a.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FAFAFA] py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl px-6">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#F0FDF4] border border-[#10B981]/20 rounded-2xl p-7 sm:p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              Ready to start earning?
            </h2>
            <p className="text-[#6B7280] mb-8 max-w-md mx-auto">
              Join hundreds of affiliates earning passive income with Purity
              Lab.
            </p>
            <Link
              href="/affiliate/apply"
              className="inline-flex items-center gap-2 bg-[#10B981] text-white rounded-full px-10 py-4 font-bold hover:bg-[#059669] transition-all duration-200"
            >
              Apply Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
