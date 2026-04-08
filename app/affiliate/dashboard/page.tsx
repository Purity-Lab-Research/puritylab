"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  MousePointerClick,
  Users,
  Copy,
  Check,
  ExternalLink,
  Download,
  ArrowLeft,
  Loader2,
  BarChart3,
  LinkIcon,
  CreditCard,
  BookOpen,
  Settings,
  AlertTriangle,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface AffiliateData {
  affiliate: {
    id: string;
    affiliateCode: string;
    status: string;
    commissionRateFirst: number;
    commissionRateRecurring: number;
    totalEarnings: number;
    pendingBalance: number;
    paidBalance: number;
    totalClicks: number;
    totalConversions: number;
  };
  stats: {
    clicks30d: number;
    conversions30d: number;
    conversionRate: string;
    thisMonthEarnings: number;
  };
  conversions: {
    id: string;
    order_id: string;
    order_total: number;
    commission_rate: number;
    commission_amount: number;
    is_first_order: boolean;
    status: string;
    created_at: string;
  }[];
  chartData: { date: string; earnings: number }[];
}

interface LinksData {
  affiliateCode: string;
  referralLink: string;
  discountCode: string;
  shareLinks: { twitter: string; email: string };
  shareTexts: string[];
}

interface Payout {
  id: string;
  amount: number;
  payment_method: string;
  status: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

interface PaymentSettings {
  paymentMethod: string | null;
  paymentEmail: string | null;
  bankName: string | null;
  bankAccountLast4: string | null;
}

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "links", label: "Links", icon: LinkIcon },
  { id: "conversions", label: "Conversions", icon: TrendingUp },
  { id: "payouts", label: "Payouts", icon: CreditCard },
  { id: "resources", label: "Resources", icon: BookOpen },
  { id: "settings", label: "Settings", icon: Settings },
];

function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-[#10B981] hover:text-[#059669] transition-colors"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label || (copied ? "Copied!" : "Copy")}
    </button>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color = "text-[#10B981]",
}: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-[#6B7280]">{label}</span>
        <div className={`w-9 h-9 rounded-lg bg-[#FAFAFA] flex items-center justify-center`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[#111111]">{value}</p>
    </div>
  );
}

function OverviewTab({ data }: { data: AffiliateData }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Earnings"
          value={`$${Number(data.affiliate.totalEarnings).toFixed(2)}`}
          icon={DollarSign}
        />
        <StatCard
          label="Pending Balance"
          value={`$${Number(data.affiliate.pendingBalance).toFixed(2)}`}
          icon={CreditCard}
          color="text-amber-500"
        />
        <StatCard
          label="This Month"
          value={`$${data.stats.thisMonthEarnings.toFixed(2)}`}
          icon={TrendingUp}
        />
        <StatCard
          label="Total Referrals"
          value={String(data.affiliate.totalConversions)}
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <p className="text-xs text-[#6B7280]">Clicks (30d)</p>
          <p className="text-xl font-bold text-[#111111]">{data.stats.clicks30d}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <p className="text-xs text-[#6B7280]">Conversions (30d)</p>
          <p className="text-xl font-bold text-[#111111]">{data.stats.conversions30d}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#F0F0F0] p-4 text-center">
          <p className="text-xs text-[#6B7280]">Conversion Rate</p>
          <p className="text-xl font-bold text-[#111111]">{data.stats.conversionRate}%</p>
        </div>
      </div>

      {/* Earnings chart */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-4">Earnings (Last 30 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickFormatter={(v: string) => {
                  const d = new Date(v);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#6B7280" }}
                tickFormatter={(v: number) => `$${v}`}
              />
              <Tooltip
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Earnings"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#10B981" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent conversions */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-4">Recent Conversions</h3>
        {data.conversions.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-6">
            No conversions yet. Share your link to start earning!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F0F0F0]">
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Date</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Order Total</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Rate</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Commission</th>
                  <th className="text-left py-2 px-3 text-xs font-semibold text-[#6B7280]">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.conversions.slice(0, 10).map((c) => (
                  <tr key={c.id} className="border-b border-[#F0F0F0] last:border-0">
                    <td className="py-2.5 px-3 text-[#6B7280]">
                      {new Date(c.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 px-3 text-[#111111] font-medium">
                      ${Number(c.order_total).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-[#6B7280]">
                      {c.commission_rate}%
                    </td>
                    <td className="py-2.5 px-3 text-[#10B981] font-semibold">
                      ${Number(c.commission_amount).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={c.status} />
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

function LinksTab({ links }: { links: LinksData | null }) {
  if (!links) return <p className="text-sm text-[#6B7280]">Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Affiliate link */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-3">Your Affiliate Link</h3>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={links.referralLink}
            className="flex-1 rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5 text-sm font-mono text-[#111111] select-all"
          />
          <CopyButton text={links.referralLink} label="Copy Link" />
        </div>
      </div>

      {/* Discount code */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-3">Your Discount Code</h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#111111] bg-[#FAFAFA] px-4 py-2 rounded-lg border border-[#F0F0F0]">
            {links.discountCode}
          </span>
          <CopyButton text={links.discountCode} label="Copy Code" />
        </div>
        <p className="text-xs text-[#6B7280] mt-2">
          Customers enter this code for 10% off their first order.
        </p>
      </div>

      {/* Share links */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-3">Share</h3>
        <div className="flex gap-3">
          <a
            href={links.shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAFAFA] px-4 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F0F0F0] transition-colors"
          >
            Twitter/X
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
          <a
            href={links.shareLinks.email}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#FAFAFA] px-4 py-2.5 text-sm font-medium text-[#111111] hover:bg-[#F0F0F0] transition-colors"
          >
            Email
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Share text suggestions */}
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-3">Suggested Share Text</h3>
        <div className="space-y-3">
          {links.shareTexts.map((text, i) => (
            <div key={i} className="bg-[#FAFAFA] rounded-lg p-3 flex items-start justify-between gap-3">
              <p className="text-sm text-[#6B7280] flex-1">{text}</p>
              <CopyButton text={text} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConversionsTab({ data }: { data: AffiliateData }) {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered =
    statusFilter === "all"
      ? data.conversions
      : data.conversions.filter((c) => c.status === statusFilter);

  function exportCSV() {
    const headers = "Date,Order Total,Commission Rate,Commission Amount,First Order,Status\n";
    const rows = filtered
      .map(
        (c) =>
          `${new Date(c.created_at).toLocaleDateString()},${c.order_total},${c.commission_rate}%,${c.commission_amount},${c.is_first_order ? "Yes" : "No"},${c.status}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "affiliate-conversions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm text-[#111111]"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="paid">Paid</option>
          <option value="reversed">Reversed</option>
        </select>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#10B981] hover:text-[#059669]"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-8">No conversions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Order Total</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Rate</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Commission</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-t border-[#F0F0F0]">
                    <td className="py-3 px-4 text-[#6B7280]">
                      {new Date(c.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-[#111111] font-medium">
                      ${Number(c.order_total).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[#6B7280]">{c.commission_rate}%</td>
                    <td className="py-3 px-4 text-[#10B981] font-semibold">
                      ${Number(c.commission_amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[#6B7280]">
                      {c.is_first_order ? "First Order" : "Recurring"}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={c.status} />
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

function PayoutsTab() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/affiliate/payouts")
      .then((r) => r.json())
      .then((d) => setPayouts(d.payouts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-[#6B7280]" />
      </div>
    );
  }

  // Get next payout date (1st of next month)
  const now = new Date();
  const nextPayout = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return (
    <div className="space-y-4">
      <div className="bg-[#F0FDF4] rounded-xl p-4 flex items-center gap-3">
        <CreditCard className="h-5 w-5 text-[#10B981]" />
        <p className="text-sm text-[#111111]">
          Next payout:{" "}
          <span className="font-semibold">
            {nextPayout.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </p>
      </div>

      <div className="bg-white rounded-xl border border-[#F0F0F0] overflow-hidden">
        {payouts.length === 0 ? (
          <p className="text-sm text-[#6B7280] text-center py-8">
            No payouts yet. Keep sharing your link!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#FAFAFA]">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Period</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-[#6B7280]">Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-t border-[#F0F0F0]">
                    <td className="py-3 px-4 text-[#6B7280]">
                      {new Date(p.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-[#111111] font-semibold">
                      ${Number(p.amount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-[#6B7280]">
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
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
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

function ResourcesTab() {
  const contentIdeas = [
    "\"Why I trust Purity Lab for my research peptides\" (personal story)",
    "\"How to verify peptide purity with CoAs\" (educational)",
    "\"My peptide research stack breakdown\" (protocol walkthrough)",
    "\"Purity Lab unboxing and first impressions\" (review)",
    "\"Comparing peptide suppliers: what to look for\" (guide)",
    "\"CoA deep dive: reading third-party lab results\" (educational)",
    "\"Top 5 peptides for research in 2026\" (listicle)",
    "\"How cold chain shipping preserves peptide integrity\" (explainer)",
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-3">Brand Guidelines</h3>
        <ul className="text-sm text-[#6B7280] space-y-2">
          <li>Use our official logo and product images only.</li>
          <li>Always reference products as &quot;for research use only.&quot;</li>
          <li>Do not make health claims or imply therapeutic benefits.</li>
          <li>Maintain a professional, educational tone in all content.</li>
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-3">Content Ideas</h3>
        <ul className="space-y-2">
          {contentIdeas.map((idea, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-[#6B7280]">
              <span className="text-[#10B981] font-bold mt-0.5">{i + 1}.</span>
              {idea}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-3">Product Images</h3>
        <p className="text-sm text-[#6B7280]">
          Product images for marketing use will be available soon. In the meantime, you can use screenshots from the product pages on our website.
        </p>
      </div>

      <div className="bg-red-50 rounded-xl border border-red-100 p-5">
        <h3 className="text-sm font-semibold text-red-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Prohibited Activities
        </h3>
        <ul className="text-sm text-red-700 space-y-1.5">
          <li>No spam or unsolicited messages.</li>
          <li>No misleading health or medical claims.</li>
          <li>No bidding on &quot;Purity Lab&quot; branded keywords in paid search.</li>
          <li>No fake reviews or testimonials.</li>
          <li>No misrepresenting your relationship with Purity Lab.</li>
        </ul>
      </div>
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    paymentMethod: "ach" as string,
    paymentEmail: "",
    bankName: "",
    bankAccountLast4: "",
  });

  useEffect(() => {
    fetch("/api/affiliate/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setForm({
          paymentMethod: data.paymentMethod || "ach",
          paymentEmail: data.paymentEmail || "",
          bankName: data.bankName || "",
          bankAccountLast4: data.bankAccountLast4 || "",
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/affiliate/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // handled
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-[#6B7280]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5 space-y-4">
        <h3 className="text-sm font-semibold text-[#111111]">Payment Settings</h3>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Payment Method
          </label>
          <select
            value={form.paymentMethod}
            onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
            className="w-full rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5 text-sm"
          >
            <option value="ach">ACH Bank Transfer</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>

        {form.paymentMethod === "paypal" && (
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1.5">
              PayPal Email
            </label>
            <input
              type="email"
              value={form.paymentEmail}
              onChange={(e) => setForm({ ...form, paymentEmail: e.target.value })}
              className="w-full rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5 text-sm"
              placeholder="paypal@example.com"
            />
          </div>
        )}

        {form.paymentMethod === "ach" && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">
                Bank Name
              </label>
              <input
                type="text"
                value={form.bankName}
                onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                className="w-full rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5 text-sm"
                placeholder="Bank of America"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">
                Account Last 4 Digits
              </label>
              <input
                type="text"
                maxLength={4}
                value={form.bankAccountLast4}
                onChange={(e) =>
                  setForm({ ...form, bankAccountLast4: e.target.value.replace(/\D/g, "") })
                }
                className="w-full rounded-lg border border-[#F0F0F0] bg-[#FAFAFA] px-3 py-2.5 text-sm"
                placeholder="1234"
              />
            </div>
          </>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#111111] text-white rounded-lg px-6 py-2.5 text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#F0F0F0] p-5">
        <h3 className="text-sm font-semibold text-[#111111] mb-2">Affiliate Terms</h3>
        <p className="text-sm text-[#6B7280] mb-3">
          View the complete affiliate program terms and conditions.
        </p>
        <Link
          href="/policies/affiliate-terms"
          className="text-sm font-medium text-[#10B981] hover:underline"
          target="_blank"
        >
          View Terms
        </Link>
      </div>

      <div className="bg-red-50 rounded-xl border border-red-100 p-5">
        <h3 className="text-sm font-semibold text-red-800 mb-2">Deactivate Account</h3>
        <p className="text-sm text-red-700 mb-3">
          Deactivating your affiliate account will stop all tracking and future commissions. This cannot be undone.
        </p>
        <button className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors">
          Deactivate My Affiliate Account
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700",
    approved: "bg-blue-50 text-blue-700",
    paid: "bg-green-50 text-green-700",
    completed: "bg-green-50 text-green-700",
    reversed: "bg-red-50 text-red-700",
    failed: "bg-red-50 text-red-700",
    processing: "bg-blue-50 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        colors[status] || "bg-gray-50 text-gray-700"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default function AffiliateDashboardPage() {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [links, setLinks] = useState<LinksData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    Promise.all([
      fetch("/api/affiliate/dashboard").then((r) => r.json()),
      fetch("/api/affiliate/links").then((r) => r.json()),
    ])
      .then(([dashData, linksData]) => {
        if (dashData.error) {
          setError(dashData.error);
          return;
        }
        setData(dashData);
        setLinks(linksData.error ? null : linksData);
      })
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#6B7280]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-20 px-4">
        <p className="text-[#6B7280] mb-4">{error}</p>
        <Link
          href="/affiliate"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#10B981] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Affiliate Program
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <section className="bg-[#FAFAFA] min-h-screen">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/affiliate"
              className="inline-flex items-center gap-1 text-sm text-[#6B7280] hover:text-[#111111] mb-2 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Affiliate Program
            </Link>
            <h1 className="text-2xl font-extrabold text-[#111111]">
              Affiliate Dashboard
            </h1>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              data.affiliate.status === "active"
                ? "bg-green-50 text-green-700"
                : "bg-yellow-50 text-yellow-700"
            }`}
          >
            {data.affiliate.status.charAt(0).toUpperCase() +
              data.affiliate.status.slice(1)}
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#111111] text-white"
                    : "bg-white text-[#6B7280] hover:text-[#111111] border border-[#F0F0F0]"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && <OverviewTab data={data} />}
        {activeTab === "links" && <LinksTab links={links} />}
        {activeTab === "conversions" && <ConversionsTab data={data} />}
        {activeTab === "payouts" && <PayoutsTab />}
        {activeTab === "resources" && <ResourcesTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </section>
  );
}
