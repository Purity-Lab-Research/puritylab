"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Copy, Check, Users, Gift, ArrowUpRight } from "lucide-react";

interface Referral {
  id: string;
  referral_code: string;
  status: string;
  credit_amount: number;
  created_at: string;
  completed_at: string | null;
}

interface ReferralData {
  referralCode: string;
  referralLink: string;
  balance: number;
  totalEarned: number;
  referralCount: number;
  completedCount: number;
  referrals: Referral[];
  isAffiliate: boolean;
  affiliateApplicationStatus: string | null;
}

export default function ReferralSection() {
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/account/referrals")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function copyLink() {
    if (!data) return;
    navigator.clipboard.writeText(data.referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="bg-white border border-[#E5E7EB]/60 rounded-2xl p-6 animate-pulse">
        <div className="h-5 w-40 bg-[#F3F4F6] rounded mb-4" />
        <div className="h-10 w-full bg-[#F3F4F6] rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-white border border-[#E5E7EB]/60 rounded-2xl overflow-hidden">
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#111111]">Refer & Earn</h2>
          {data.isAffiliate ? (
            <Link
              href="/affiliate/dashboard"
              className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
            >
              Affiliate Dashboard <ArrowUpRight className="h-3 w-3" />
            </Link>
          ) : data.affiliateApplicationStatus === "pending" ? (
            <span className="text-xs font-semibold text-[#D97706] flex items-center gap-1">
              Application Pending
            </span>
          ) : !data.affiliateApplicationStatus || data.affiliateApplicationStatus === "rejected" ? (
            <Link
              href="/affiliate/apply"
              className="text-xs font-semibold text-[#10B981] hover:underline flex items-center gap-1"
            >
              Become an Affiliate <ArrowUpRight className="h-3 w-3" />
            </Link>
          ) : null}
        </div>

        {/* Referral link */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 bg-[#F7F7F8] rounded-xl px-4 py-3 text-sm font-mono text-[#6B7280] truncate select-all">
            {data.referralLink}
          </div>
          <button
            onClick={copyLink}
            className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              copied
                ? "bg-[#10B981] text-white"
                : "bg-[#111111] text-white hover:bg-black"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy
              </>
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-[#F7F7F8] rounded-xl p-3.5 text-center">
            <p className="text-xs text-[#9CA3AF] mb-1">Referrals</p>
            <p className="text-lg font-extrabold text-[#111111]">
              {data.referralCount}
            </p>
          </div>
          <div className="bg-[#F7F7F8] rounded-xl p-3.5 text-center">
            <p className="text-xs text-[#9CA3AF] mb-1">Earned</p>
            <p className="text-lg font-extrabold text-[#111111]">
              {formatPrice(data.totalEarned)}
            </p>
          </div>
          <div className="bg-[#F7F7F8] rounded-xl p-3.5 text-center">
            <p className="text-xs text-[#9CA3AF] mb-1">Balance</p>
            <p className="text-lg font-extrabold text-[#10B981]">
              {formatPrice(data.balance)}
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-[#F7F7F8] rounded-xl p-4 flex gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center shrink-0 mt-0.5">
            <Gift className="h-4 w-4 text-[#10B981]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#111111] mb-0.5">
              How it works
            </p>
            <p className="text-[11px] text-[#9CA3AF] leading-relaxed">
              Share your link &mdash; they get 15% off their first month, you
              get $20 off your next shipment. Credits apply automatically.
            </p>
          </div>
        </div>
      </div>

      {/* History */}
      {data.referrals.length > 0 && (
        <div className="border-t border-[#F3F4F6] px-5 sm:px-6 py-4">
          <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wider mb-3">
            History
          </p>
          <div className="space-y-2.5">
            {data.referrals.slice(0, 5).map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#F7F7F8] flex items-center justify-center">
                    <Users className="h-3 w-3 text-[#9CA3AF]" />
                  </div>
                  <span className="text-[#6B7280]">
                    {new Date(ref.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    ref.status === "completed" || ref.status === "credited"
                      ? "text-[#10B981]"
                      : "text-[#9CA3AF]"
                  }`}
                >
                  {ref.status === "pending"
                    ? "Pending"
                    : `+${formatPrice(ref.credit_amount)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
