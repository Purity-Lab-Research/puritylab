import { requireAdminPage } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Users, DollarSign, TrendingUp, CreditCard } from "lucide-react";

export const metadata = { title: "Affiliates" };

export default async function AdminAffiliatesPage() {
  await requireAdminPage();
  const supabase = createAdminClient();

  const [affiliatesRes, pendingAppsRes] = await Promise.all([
    supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false }),
    supabase
      .from("affiliate_applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  // Fetch profile info for each affiliate
  const affiliateUserIds = (affiliatesRes.data || []).map((a: { user_id: string }) => a.user_id);
  const { data: profilesData } = affiliateUserIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", affiliateUserIds)
    : { data: [] };

  const profileMap = new Map(
    (profilesData || []).map((p: { id: string; full_name: string | null; email: string }) => [p.id, p])
  );

  const affiliates = (affiliatesRes.data || []) as Array<{
    id: string;
    user_id: string;
    affiliate_code: string;
    status: string;
    total_clicks: number;
    total_conversions: number;
    total_earnings: number;
    pending_balance: number;
    paid_balance: number;
    commission_rate_first: number;
    commission_rate_recurring: number;
    created_at: string;
  }>;

  const totalActive = affiliates.filter((a) => a.status === "active").length;
  const totalCommissionsPaid = affiliates.reduce(
    (sum, a) => sum + Number(a.paid_balance || 0),
    0
  );
  const totalPending = affiliates.reduce(
    (sum, a) => sum + Number(a.pending_balance || 0),
    0
  );
  const pendingApps = pendingAppsRes.count || 0;

  const stats = [
    { label: "Total Affiliates", value: String(affiliates.length), icon: Users, color: "text-blue-600 bg-blue-50" },
    { label: "Active", value: String(totalActive), icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
    { label: "Commissions Paid", value: formatPrice(totalCommissionsPaid), icon: DollarSign, color: "text-emerald-600 bg-emerald-50" },
    { label: "Pending Payouts", value: formatPrice(totalPending), icon: CreditCard, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#111111]">Affiliates</h1>
        <div className="flex gap-3">
          {pendingApps > 0 && (
            <Link
              href="/admin/affiliates/applications"
              className="inline-flex items-center gap-2 bg-amber-50 text-amber-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-amber-100 transition-colors"
            >
              {pendingApps} Pending Application{pendingApps > 1 ? "s" : ""}
            </Link>
          )}
          <Link
            href="/admin/affiliates/applications"
            className="bg-[#111111] text-white rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-all"
          >
            Applications
          </Link>
          <Link
            href="/admin/affiliates/payouts"
            className="bg-white text-[#111111] border border-[#F0F0F0] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#FAFAFA] transition-all"
          >
            Payouts
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#F0F0F0] p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[#6B7280]">{s.label}</p>
                <p className="text-lg font-bold text-[#111111]">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
        {affiliates.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-12">
            No affiliates yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Code</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Status</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Clicks</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Conv.</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Rate</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Earnings</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Pending</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Joined</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]"></th>
                </tr>
              </thead>
              <tbody>
                {affiliates.map((a) => {
                  const profile = profileMap.get(a.user_id) as { full_name: string | null; email: string } | undefined;
                  const convRate =
                    a.total_clicks > 0
                      ? ((a.total_conversions / a.total_clicks) * 100).toFixed(1)
                      : "0.0";
                  return (
                    <tr key={a.id} className="border-t border-[#F0F0F0] hover:bg-[#FAFAFA]">
                      <td className="py-3 px-4">
                        <p className="font-medium text-[#111111]">
                          {profile?.full_name || "N/A"}
                        </p>
                        <p className="text-xs text-[#6B7280]">{profile?.email}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-xs text-[#111111]">
                        {a.affiliate_code}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            a.status === "active"
                              ? "bg-green-50 text-green-700"
                              : a.status === "paused"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-red-50 text-red-700"
                          }`}
                        >
                          {a.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#6B7280]">{a.total_clicks}</td>
                      <td className="py-3 px-4 text-[#6B7280]">{a.total_conversions}</td>
                      <td className="py-3 px-4 text-[#6B7280]">{convRate}%</td>
                      <td className="py-3 px-4 text-[#10B981] font-semibold">
                        {formatPrice(Number(a.total_earnings))}
                      </td>
                      <td className="py-3 px-4 text-amber-600 font-medium">
                        {formatPrice(Number(a.pending_balance))}
                      </td>
                      <td className="py-3 px-4 text-[#6B7280] text-xs">
                        {new Date(a.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4">
                        <Link
                          href={`/admin/affiliates/${a.id}`}
                          className="text-sm text-[#10B981] hover:underline font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
