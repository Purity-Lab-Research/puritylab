"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

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
      <div className="bg-surface border border-border rounded-xl p-6 animate-pulse">
        <div className="h-5 w-40 bg-border rounded mb-4" />
        <div className="h-10 w-full bg-border rounded" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="font-heading text-lg font-bold text-primary mb-4">Refer a Friend</h2>

      {/* Referral link */}
      <div className="flex items-center gap-2 mb-4">
        <input
          type="text"
          readOnly
          value={data.referralLink}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-mono text-text-primary select-all"
        />
        <button
          onClick={copyLink}
          className="bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-primary-hover transition-colors whitespace-nowrap"
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-background rounded-lg p-3 text-center">
          <p className="text-xs text-text-secondary">Referrals</p>
          <p className="font-heading text-lg font-bold text-primary">{data.referralCount}</p>
        </div>
        <div className="bg-background rounded-lg p-3 text-center">
          <p className="text-xs text-text-secondary">Earned</p>
          <p className="font-heading text-lg font-bold text-primary">{formatPrice(data.totalEarned)}</p>
        </div>
        <div className="bg-background rounded-lg p-3 text-center">
          <p className="text-xs text-text-secondary">Balance</p>
          <p className="font-heading text-lg font-bold text-success">{formatPrice(data.balance)}</p>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-secondary/5 border border-secondary/10 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-primary mb-1">How it works</p>
        <p className="text-[10px] text-text-secondary leading-relaxed">
          Share your link. When someone subscribes using your link, you get $20 off your next shipment and they get 15% off their first month. Referral credits are applied automatically at checkout.
        </p>
      </div>

      {/* Affiliate program upsell */}
      <div className="bg-[#10B981]/5 border border-[#10B981]/10 rounded-lg p-4 mb-4">
        <p className="text-xs font-semibold text-[#111111] mb-1">Want to earn more?</p>
        <p className="text-[10px] text-[#6B7280] leading-relaxed mb-2">
          Earn 15% on first orders and 10% on every reorder with our Affiliate Program. No caps, no limits.
        </p>
        <Link
          href="/affiliate"
          className="text-xs font-semibold text-[#10B981] hover:underline"
        >
          Apply to our Affiliate Program
        </Link>
      </div>

      {/* History */}
      {data.referrals.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-primary mb-2">History</p>
          <div className="space-y-1.5">
            {data.referrals.slice(0, 5).map((ref) => (
              <div key={ref.id} className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">
                  {new Date(ref.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <span className={`font-semibold ${ref.status === "completed" || ref.status === "credited" ? "text-success" : "text-text-secondary"}`}>
                  {ref.status === "pending" ? "Pending" : `+${formatPrice(ref.credit_amount)}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
