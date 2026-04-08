"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

interface Payout {
  id: string;
  amount: number;
  payment_method: string | null;
  status: string;
  period_start: string;
  period_end: string;
  created_at: string;
  affiliates: {
    affiliate_code: string;
    profiles: { full_name: string | null; email: string } | null;
  } | null;
}

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const url = filter
      ? `/api/admin/affiliates/payouts?status=${filter}`
      : "/api/admin/affiliates/payouts";
    fetch(url)
      .then((r) => r.json())
      .then((d) => setPayouts(d.payouts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  async function updateStatus(payoutId: string, newStatus: string) {
    setUpdating(payoutId);
    try {
      await fetch("/api/admin/affiliates/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-status",
          payoutId,
          status: newStatus,
        }),
      });
      setPayouts((prev) =>
        prev.map((p) =>
          p.id === payoutId ? { ...p, status: newStatus } : p
        )
      );
    } catch {
      // handled
    } finally {
      setUpdating(null);
    }
  }

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
        <h1 className="text-2xl font-bold text-[#111111]">Affiliate Payouts</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-[#6B7280]" />
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
          {payouts.length === 0 ? (
            <p className="text-sm text-[#6B7280] text-center py-12">
              No payouts found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#FAFAFA]">
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">
                      Affiliate
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">
                      Amount
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">
                      Period
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">
                      Method
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">
                      Created
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((p) => (
                    <tr
                      key={p.id}
                      className="border-t border-[#F0F0F0] hover:bg-[#FAFAFA]"
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#111111]">
                          {p.affiliates?.profiles?.full_name || "N/A"}
                        </p>
                        <p className="text-xs text-[#6B7280]">
                          {p.affiliates?.affiliate_code}
                        </p>
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#111111]">
                        ${Number(p.amount).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] text-xs">
                        {new Date(p.period_start).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        -{" "}
                        {new Date(p.period_end).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] text-xs uppercase">
                        {p.payment_method || "N/A"}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            p.status === "completed"
                              ? "bg-green-50 text-green-700"
                              : p.status === "pending"
                                ? "bg-yellow-50 text-yellow-700"
                                : p.status === "processing"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-red-50 text-red-700"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] text-xs">
                        {new Date(p.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        {p.status === "pending" && (
                          <button
                            onClick={() => updateStatus(p.id, "processing")}
                            disabled={updating === p.id}
                            className="text-xs font-medium text-blue-600 hover:underline disabled:opacity-50"
                          >
                            {updating === p.id ? "..." : "Process"}
                          </button>
                        )}
                        {p.status === "processing" && (
                          <button
                            onClick={() => updateStatus(p.id, "completed")}
                            disabled={updating === p.id}
                            className="text-xs font-medium text-green-600 hover:underline disabled:opacity-50"
                          >
                            {updating === p.id ? "..." : "Mark Complete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
