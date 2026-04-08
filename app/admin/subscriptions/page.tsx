"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
  XCircle,
  X,
  Pause,
  Play,
  Ban,
  RotateCcw,
  Users,
  DollarSign,
  TrendingUp,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
interface SubItem {
  id: string;
  quantity: number;
  product?: {
    name: string;
    size: string;
    price: number;
    subscription_price: number | null;
  } | null;
}

interface Subscription {
  id: string;
  user_id: string;
  user_email: string | null;
  user_name: string | null;
  status: "active" | "paused" | "cancelled" | "inactive";
  plan_name: string | null;
  protocol_id: string | null;
  stripe_subscription_id: string | null;
  delivery_frequency_weeks: number;
  next_delivery_date: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  paused_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  cycle_management: boolean;
  cycle_management_fee: number;
  cycle_phase: string | null;
  cycle_week: number | null;
  protocol?: { name: string; slug: string } | null;
  items?: SubItem[];
}

type SortField =
  | "user_name"
  | "user_email"
  | "status"
  | "plan_name"
  | "created_at"
  | "next_delivery_date"
  | "mrr";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "active" | "paused" | "cancelled" | "inactive";

type ToastType = "success" | "error";
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function formatPrice(cents: number) {
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents);
  return `${formatted} USD`;
}

function formatDate(iso: string | null) {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getSubMrr(sub: Subscription): number {
  if (sub.status !== "active") return 0;
  let total = 0;
  for (const item of sub.items ?? []) {
    const price = item.product?.subscription_price ?? item.product?.price ?? 0;
    total += price * item.quantity;
  }
  if (sub.cycle_management) total += sub.cycle_management_fee ?? 0;
  // Normalize to monthly: delivery_frequency_weeks -> monthly factor
  const weeksPerMonth = 4.33;
  const deliveriesPerMonth = weeksPerMonth / (sub.delivery_frequency_weeks || 4);
  return Math.round(total * deliveriesPerMonth * 100) / 100;
}

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const diff = new Date(iso).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const statusConfig: Record<
  string,
  { bg: string; text: string; dot: string; label: string }
> = {
  active: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    label: "Active",
  },
  paused: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
    label: "Paused",
  },
  cancelled: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    label: "Cancelled",
  },
  inactive: {
    bg: "bg-gray-50",
    text: "text-gray-600",
    dot: "bg-gray-400",
    label: "Inactive",
  },
};

const cyclePhaseConfig: Record<string, { bg: string; label: string }> = {
  loading: { bg: "bg-blue-100 text-blue-700", label: "Loading" },
  active: { bg: "bg-green-100 text-green-700", label: "Active" },
  taper: { bg: "bg-amber-100 text-amber-700", label: "Taper" },
  off: { bg: "bg-gray-100 text-gray-600", label: "Off" },
};

/* ------------------------------------------------------------------ */
/*  Toast                                                              */
/* ------------------------------------------------------------------ */
function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[60] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium shadow-lg ${
            t.type === "success"
              ? "border-green-200 bg-green-50 text-green-800"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {t.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <XCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-2 shrink-0 rounded p-0.5 hover:bg-black/5"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sortable header                                                    */
/* ------------------------------------------------------------------ */
function SortHeader({
  label,
  field,
  current,
  dir,
  onSort,
  className,
}: {
  label: string;
  field: SortField;
  current: SortField;
  dir: SortDir;
  onSort: (f: SortField) => void;
  className?: string;
}) {
  const active = current === field;
  return (
    <th
      className={`cursor-pointer select-none px-4 py-3 ${className ?? ""}`}
      onClick={() => onSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {active &&
          (dir === "asc" ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          ))}
      </span>
    </th>
  );
}

/* ------------------------------------------------------------------ */
/*  Expanded detail row                                                */
/* ------------------------------------------------------------------ */
function SubscriptionDetail({ sub }: { sub: Subscription }) {
  const days = daysUntil(sub.next_delivery_date);

  return (
    <tr>
      <td colSpan={8} className="bg-gray-50/50 px-4 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Items */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Subscription Items
            </h4>
            {(sub.items ?? []).length > 0 ? (
              <ul className="space-y-2">
                {sub.items!.map((item) => (
                  <li key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">
                      {item.product?.name ?? "Unknown"}{" "}
                      <span className="text-gray-400">({item.product?.size})</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      x{item.quantity} &middot;{" "}
                      {formatPrice(
                        item.product?.subscription_price ?? item.product?.price ?? 0
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400">No items</p>
            )}
          </div>

          {/* Delivery info */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Delivery Schedule
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Frequency</span>
                <span className="font-medium text-gray-900">
                  Every {sub.delivery_frequency_weeks} weeks
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Next Delivery</span>
                <span className="font-medium text-gray-900">
                  {sub.next_delivery_date ? (
                    <>
                      {formatDate(sub.next_delivery_date)}
                      {days !== null && days >= 0 && (
                        <span className="ml-1 text-xs text-gray-400">
                          ({days}d)
                        </span>
                      )}
                      {days !== null && days < 0 && (
                        <span className="ml-1 text-xs text-red-500">
                          (overdue)
                        </span>
                      )}
                    </>
                  ) : (
                    "\u2014"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Started</span>
                <span className="font-medium text-gray-900">
                  {formatDate(sub.created_at)}
                </span>
              </div>
              {sub.paused_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Paused</span>
                  <span className="font-medium text-amber-600">
                    {formatDate(sub.paused_at)}
                  </span>
                </div>
              )}
              {sub.cancelled_at && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Cancelled</span>
                  <span className="font-medium text-red-600">
                    {formatDate(sub.cancelled_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cycle Management */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Cycle Management
            </h4>
            {sub.cycle_management ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    <Zap className="h-3 w-3" /> Enabled
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(sub.cycle_management_fee)}/mo
                  </span>
                </div>
                {sub.cycle_phase && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phase</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        cyclePhaseConfig[sub.cycle_phase]?.bg ?? "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {cyclePhaseConfig[sub.cycle_phase]?.label ?? sub.cycle_phase}
                    </span>
                  </div>
                )}
                {sub.cycle_week !== null && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Week</span>
                    <span className="font-medium text-gray-900">
                      Week {sub.cycle_week}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Not enabled</p>
            )}
            {sub.stripe_subscription_id && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Stripe ID</span>
                  <span className="font-mono text-xs text-gray-500">
                    {sub.stripe_subscription_id.slice(0, 20)}...
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  let toastId = 0;

  function addToast(type: ToastType, message: string) {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  /* ---------- Load ---------- */
  async function loadSubscriptions() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/subscriptions");
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Failed to load (${res.status})`);
      }
      const data = await res.json();
      setSubscriptions(data);
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscriptions();
  }, []);

  /* ---------- Actions ---------- */
  async function handleAction(
    sub: Subscription,
    action: "pause" | "resume" | "cancel" | "activate"
  ) {
    setActionLoading(sub.id);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: sub.id, action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Action failed");
      }

      // Update local state
      const statusMap: Record<string, string> = {
        pause: "paused",
        resume: "active",
        cancel: "cancelled",
        activate: "active",
      };
      setSubscriptions((prev) =>
        prev.map((s) =>
          s.id === sub.id
            ? {
                ...s,
                status: statusMap[action] as Subscription["status"],
                paused_at: action === "pause" ? new Date().toISOString() : s.paused_at,
                cancelled_at: action === "cancel" ? new Date().toISOString() : s.cancelled_at,
              }
            : s
        )
      );
      const label = sub.user_name || sub.user_email || "Subscription";
      addToast("success", `${label} \u2014 ${action}d successfully`);
    } catch (err) {
      addToast("error", err instanceof Error ? err.message : "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  /* ---------- Sort ---------- */
  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(
        field === "created_at" || field === "next_delivery_date" || field === "mrr"
          ? "desc"
          : "asc"
      );
    }
  }

  /* ---------- Filtered + sorted ---------- */
  const filtered = useMemo(() => {
    let list = subscriptions;

    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (s) =>
          (s.user_email?.toLowerCase().includes(q) ?? false) ||
          (s.user_name?.toLowerCase().includes(q) ?? false) ||
          (s.plan_name?.toLowerCase().includes(q) ?? false) ||
          (s.protocol?.name?.toLowerCase().includes(q) ?? false) ||
          s.id.toLowerCase().includes(q)
      );
    }

    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "user_name":
          cmp = (a.user_name ?? "").localeCompare(b.user_name ?? "");
          break;
        case "user_email":
          cmp = (a.user_email ?? "").localeCompare(b.user_email ?? "");
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "plan_name": {
          const an = a.protocol?.name ?? a.plan_name ?? "";
          const bn = b.protocol?.name ?? b.plan_name ?? "";
          cmp = an.localeCompare(bn);
          break;
        }
        case "created_at":
          cmp =
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime();
          break;
        case "next_delivery_date":
          cmp =
            new Date(a.next_delivery_date ?? 0).getTime() -
            new Date(b.next_delivery_date ?? 0).getTime();
          break;
        case "mrr":
          cmp = getSubMrr(a) - getSubMrr(b);
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return sorted;
  }, [subscriptions, search, sortField, sortDir, statusFilter]);

  /* ---------- Stats ---------- */
  const totalSubs = subscriptions.length;
  const activeSubs = subscriptions.filter((s) => s.status === "active").length;
  const pausedSubs = subscriptions.filter((s) => s.status === "paused").length;
  const cancelledSubs = subscriptions.filter((s) => s.status === "cancelled").length;
  const totalMrr = subscriptions.reduce((sum, s) => sum + getSubMrr(s), 0);
  const cycleManaged = subscriptions.filter((s) => s.cycle_management && s.status === "active").length;
  const uniqueUsers = new Set(subscriptions.map((s) => s.user_id)).size;

  // Upcoming deliveries (next 7 days)
  const upcomingDeliveries = subscriptions.filter((s) => {
    const days = daysUntil(s.next_delivery_date);
    return days !== null && days >= 0 && days <= 7;
  }).length;

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Subscriptions</h1>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 animate-pulse rounded-xl border border-gray-200 bg-gray-50"
              />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
        </div>
      </div>
    );
  }

  /* ---------- Error ---------- */
  if (loadError) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Subscriptions</h1>
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <XCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
          <p className="text-sm font-medium text-red-800">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------- Render ---------- */
  return (
    <div>
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <button
          onClick={loadSubscriptions}
          className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <RefreshCw className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{activeSubs}</p>
              <p className="text-xs text-gray-400">
                of {totalSubs} total
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Est. MRR</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(totalMrr)}</p>
              <p className="text-xs text-gray-400">Monthly recurring</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-50 p-2 text-violet-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{uniqueUsers}</p>
              <p className="text-xs text-gray-400">Unique users</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingDeliveries}</p>
              <p className="text-xs text-gray-400">Deliveries in 7 days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Paused</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700">
              <Pause className="h-3 w-3" /> {pausedSubs}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Cancelled</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">
              <Ban className="h-3 w-3" /> {cancelledSubs}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Cycle Managed</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <Zap className="h-3 w-3" /> {cycleManaged}
            </span>
          </div>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Churn Rate</span>
            <span className="text-xs font-semibold text-gray-700">
              {totalSubs > 0
                ? `${Math.round((cancelledSubs / totalSubs) * 100)}%`
                : "0%"}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by user, email, or protocol..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#10B981] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {(["all", "active", "paused", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "bg-[#111111] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && (
                <span className="ml-1 opacity-60">
                  {s === "active"
                    ? activeSubs
                    : s === "paused"
                      ? pausedSubs
                      : cancelledSubs}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="w-8 px-2 py-3" />
              <SortHeader
                label="Customer"
                field="user_name"
                current={sortField}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Protocol / Plan"
                field="plan_name"
                current={sortField}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Status"
                field="status"
                current={sortField}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Est. MRR"
                field="mrr"
                current={sortField}
                dir={sortDir}
                onSort={handleSort}
                className="text-right"
              />
              <SortHeader
                label="Next Delivery"
                field="next_delivery_date"
                current={sortField}
                dir={sortDir}
                onSort={handleSort}
              />
              <SortHeader
                label="Created"
                field="created_at"
                current={sortField}
                dir={sortDir}
                onSort={handleSort}
              />
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((sub) => {
              const cfg = statusConfig[sub.status] ?? statusConfig.inactive;
              const mrr = getSubMrr(sub);
              const isExpanded = expandedId === sub.id;
              const days = daysUntil(sub.next_delivery_date);

              return (
                <Fragment key={sub.id}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                      isExpanded ? "bg-gray-50/50" : ""
                    }`}
                    onClick={() =>
                      setExpandedId(isExpanded ? null : sub.id)
                    }
                  >
                    <td className="px-2 py-3 text-center">
                      <ChevronRight
                        className={`h-4 w-4 text-gray-400 transition-transform ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">
                          {sub.user_name || "\u2014"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {sub.user_email || "No email"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {sub.protocol ? (
                          <>
                            <Layers className="h-3.5 w-3.5 text-teal-500" />
                            <span className="font-medium text-gray-900">
                              {sub.protocol.name}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-600">
                            {sub.plan_name || "Custom Stack"}
                          </span>
                        )}
                        {sub.cycle_management && (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            <Zap className="mr-0.5 h-2.5 w-2.5" />
                            Cycle
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.text}`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`}
                        />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-gray-900">
                      {sub.status === "active" ? formatPrice(mrr) : "\u2014"}
                    </td>
                    <td className="px-4 py-3">
                      {sub.next_delivery_date ? (
                        <div>
                          <p className="text-gray-700">
                            {formatDate(sub.next_delivery_date)}
                          </p>
                          {days !== null && days >= 0 && days <= 3 && (
                            <p className="text-[10px] font-medium text-amber-600">
                              In {days} day{days !== 1 ? "s" : ""}
                            </p>
                          )}
                          {days !== null && days < 0 && (
                            <p className="text-[10px] font-medium text-red-600">
                              Overdue
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">\u2014</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {formatDate(sub.created_at)}
                    </td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        {sub.status === "active" && (
                          <>
                            <button
                              onClick={() => handleAction(sub, "pause")}
                              disabled={actionLoading === sub.id}
                              title="Pause"
                              className="rounded-lg p-1.5 text-amber-600 hover:bg-amber-50 transition-colors disabled:opacity-50"
                            >
                              <Pause className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction(sub, "cancel")}
                              disabled={actionLoading === sub.id}
                              title="Cancel"
                              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {sub.status === "paused" && (
                          <>
                            <button
                              onClick={() => handleAction(sub, "resume")}
                              disabled={actionLoading === sub.id}
                              title="Resume"
                              className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                            >
                              <Play className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleAction(sub, "cancel")}
                              disabled={actionLoading === sub.id}
                              title="Cancel"
                              className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {sub.status === "cancelled" && (
                          <button
                            onClick={() => handleAction(sub, "activate")}
                            disabled={actionLoading === sub.id}
                            title="Reactivate"
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {isExpanded && <SubscriptionDetail sub={sub} />}
                </Fragment>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                  {search || statusFilter !== "all"
                    ? "No subscriptions match your filters."
                    : "No subscriptions yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <p className="mt-3 text-right text-xs text-gray-400">
        Showing {filtered.length} of {totalSubs} subscription
        {totalSubs !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

