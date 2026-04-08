"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  DollarSign,
  MousePointerClick,
  Users,
  TrendingUp,
} from "lucide-react";

interface AffiliateDetail {
  id: string;
  affiliate_code: string;
  status: string;
  commission_rate_first: number;
  commission_rate_recurring: number;
  total_clicks: number;
  total_conversions: number;
  total_earnings: number;
  pending_balance: number;
  paid_balance: number;
  payment_method: string | null;
  payment_email: string | null;
  bank_name: string | null;
  bank_account_last4: string | null;
  created_at: string;
  profiles: { full_name: string | null; email: string } | null;
}

interface Conversion {
  id: string;
  order_total: number;
  commission_rate: number;
  commission_amount: number;
  is_first_order: boolean;
  status: string;
  created_at: string;
}

export default function AdminAffiliateDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [affiliate, setAffiliate] = useState<AffiliateDetail | null>(null);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [rateFirst, setRateFirst] = useState("");
  const [rateRecurring, setRateRecurring] = useState("");
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMsg, setPayoutMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [affRes, convRes] = await Promise.all([
          fetch(`/api/admin/affiliates?id=${id}`).then((r) => r.json()),
          fetch(`/api/affiliate/dashboard?affiliateId=${id}`).then((r) => r.json()).catch(() => ({ conversions: [] })),
        ]);

        // Find the affiliate from the list
        const aff = affRes.affiliates?.find((a: AffiliateDetail) => a.id === id);
        if (aff) {
          setAffiliate(aff);
          setStatus(aff.status);
          setRateFirst(String(aff.commission_rate_first));
          setRateRecurring(String(aff.commission_rate_recurring));
        }
        setConversions(convRes.conversions || []);
      } catch {
        // handled
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/admin/affiliates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId: id,
          status,
          commissionRateFirst: Number(rateFirst),
          commissionRateRecurring: Number(rateRecurring),
        }),
      });
      // Refresh
      if (affiliate) {
        setAffiliate({
          ...affiliate,
          status,
          commission_rate_first: Number(rateFirst),
          commission_rate_recurring: Number(rateRecurring),
        });
      }
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  }

  async function handlePayout() {
    const amount = Number(payoutAmount);
    if (!amount || amount <= 0) return;

    try {
      const res = await fetch("/api/admin/affiliates/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          affiliateId: id,
          amount,
        }),
      });
      if (res.ok) {
        setPayoutMsg(`Payout of $${amount.toFixed(2)} created.`);
        setPayoutAmount("");
        if (affiliate) {
          setAffiliate({
            ...affiliate,
            pending_balance: Math.max(0, Number(affiliate.pending_balance) - amount),
            paid_balance: Number(affiliate.paid_balance) + amount,
          });
        }
      }
    } catch {
      setPayoutMsg("Failed to create payout.");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B7280]" />
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="text-center py-20">
        <p className="text-[#6B7280]">Affiliate not found.</p>
        <Link href="/admin/affiliates" className="text-[#10B981] hover:underline mt-4 inline-block">
          Back to Affiliates
        </Link>
      </div>
    );
  }

  const convRate =
    affiliate.total_clicks > 0
      ? ((affiliate.total_conversions / affiliate.total_clicks) * 100).toFixed(1)
      : "0.0";

  return (
    <div>
      <Link
        href="/admin/affiliates"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Affiliates
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">
            {affiliate.profiles?.full_name || "Affiliate"}
          </h1>
          <p className="text-sm text-[#6B7280]">
            {affiliate.profiles?.email} | Code: {affiliate.affiliate_code}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            affiliate.status === "active"
              ? "bg-green-50 text-green-700"
              : affiliate.status === "paused"
                ? "bg-yellow-50 text-yellow-700"
                : "bg-red-50 text-red-700"
          }`}
        >
          {affiliate.status}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <MousePointerClick className="h-5 w-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-[#111111]">{affiliate.total_clicks}</p>
          <p className="text-xs text-[#6B7280]">Clicks</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <Users className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-[#111111]">{affiliate.total_conversions}</p>
          <p className="text-xs text-[#6B7280]">Conversions</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <TrendingUp className="h-5 w-5 text-purple-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-[#111111]">{convRate}%</p>
          <p className="text-xs text-[#6B7280]">Conv. Rate</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <DollarSign className="h-5 w-5 text-emerald-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-[#10B981]">
            ${Number(affiliate.total_earnings).toFixed(2)}
          </p>
          <p className="text-xs text-[#6B7280]">Total Earnings</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <DollarSign className="h-5 w-5 text-amber-500 mx-auto mb-1" />
          <p className="text-xl font-bold text-amber-600">
            ${Number(affiliate.pending_balance).toFixed(2)}
          </p>
          <p className="text-xs text-[#6B7280]">Pending</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#111111]">Affiliate Settings</h3>
          <div>
            <label className="block text-xs font-medium text-[#6B7280] mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2 text-sm"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">
                First Order Rate (%)
              </label>
              <input
                type="number"
                value={rateFirst}
                onChange={(e) => setRateFirst(e.target.value)}
                className="w-full rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B7280] mb-1">
                Recurring Rate (%)
              </label>
              <input
                type="number"
                value={rateRecurring}
                onChange={(e) => setRateRecurring(e.target.value)}
                className="w-full rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#111111] text-white rounded-lg px-5 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Manual Payout */}
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-4">
          <h3 className="text-sm font-semibold text-[#111111]">Manual Payout</h3>
          <p className="text-xs text-[#6B7280]">
            Pending balance: ${Number(affiliate.pending_balance).toFixed(2)} |
            Paid to date: ${Number(affiliate.paid_balance).toFixed(2)}
          </p>
          <div className="flex gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Amount"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              className="flex-1 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2 text-sm"
            />
            <button
              onClick={handlePayout}
              className="bg-[#10B981] text-white rounded-lg px-5 py-2 text-sm font-medium hover:bg-[#059669]"
            >
              Process Payout
            </button>
          </div>
          {payoutMsg && (
            <p className="text-sm text-[#10B981]">{payoutMsg}</p>
          )}

          <div className="pt-3 border-t border-[#F0F0F0]">
            <h4 className="text-xs font-semibold text-[#6B7280] mb-2">Payment Info</h4>
            <p className="text-sm text-[#111111]">
              Method: {affiliate.payment_method || "Not set"}<br/>
              {affiliate.payment_method === "paypal" && <>PayPal: {affiliate.payment_email || "N/A"}<br/></>}
              {affiliate.payment_method === "ach" && (
                <>
                  Bank: {affiliate.bank_name || "N/A"}<br/>
                  Account: ****{affiliate.bank_account_last4 || "N/A"}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Conversion History */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 mt-6">
        <h3 className="text-sm font-semibold text-[#111111] mb-4">Conversion History</h3>
        {conversions.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-6">No conversions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Date</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Order Total</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Rate</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Commission</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Type</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Status</th>
                </tr>
              </thead>
              <tbody>
                {conversions.map((c) => (
                  <tr key={c.id} className="border-t border-[#F0F0F0]">
                    <td className="py-2 px-3 text-[#6B7280]">
                      {new Date(c.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2 px-3 text-[#111111]">${Number(c.order_total).toFixed(2)}</td>
                    <td className="py-2 px-3 text-[#6B7280]">{c.commission_rate}%</td>
                    <td className="py-2 px-3 text-[#10B981] font-semibold">
                      ${Number(c.commission_amount).toFixed(2)}
                    </td>
                    <td className="py-2 px-3 text-[#6B7280]">
                      {c.is_first_order ? "First" : "Recurring"}
                    </td>
                    <td className="py-2 px-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          c.status === "paid"
                            ? "bg-green-50 text-green-700"
                            : c.status === "pending"
                              ? "bg-yellow-50 text-yellow-700"
                              : c.status === "reversed"
                                ? "bg-red-50 text-red-700"
                                : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
