"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, getSubscriptionPrice } from "@/lib/utils";

interface SubItem {
  id: string;
  quantity: number;
  product?: {
    name: string;
    size: string;
    price: number;
  } | null;
}

interface Subscription {
  id: string;
  status: string;
  plan_name: string | null;
  protocol_id: string | null;
  delivery_frequency_weeks: number;
  next_delivery_date: string | null;
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

interface Props {
  subscription: Subscription;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-[#D1FAE5] text-[#10B981]",
    paused: "bg-[#FEF3C7] text-[#F59E0B]",
    cancelled: "bg-[#FEE2E2] text-[#EF4444]",
    inactive: "bg-[#F0F0F0] text-[#6B7280]",
  };
  return (
    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${styles[status] ?? styles.inactive}`}>
      {status}
    </span>
  );
}

function CyclePhaseBadge({ phase }: { phase: string }) {
  const styles: Record<string, string> = {
    loading: "bg-[#DBEAFE] text-[#3B82F6]",
    active: "bg-[#D1FAE5] text-[#10B981]",
    taper: "bg-[#FEF3C7] text-[#F59E0B]",
    off: "bg-[#F0F0F0] text-[#6B7280]",
  };
  const labels: Record<string, string> = {
    loading: "ramping up",
    active: "active",
    taper: "reducing",
    off: "paused",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${styles[phase] ?? styles.active}`}>
      {labels[phase] ?? phase}
    </span>
  );
}

// Upgrade path mapping
const UPGRADE_MAP: Record<string, { target: string; label: string }> = {
  recovery: { target: "full-recomp", label: "Upgrade to Comprehensive Configuration" },
  performance: { target: "full-recomp", label: "Add metabolic compounds. Upgrade to Comprehensive" },
  "fat-loss": { target: "full-recomp", label: "Add tissue research compounds. Upgrade to Comprehensive" },
};

export default function SubscriptionCard({ subscription: sub }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [showUpgradeConfirm, setShowUpgradeConfirm] = useState(false);
  const [cycleLoading, setCycleLoading] = useState(false);

  const subTotal = (sub.items ?? []).reduce((sum, item) => {
    const basePrice = item.product?.price ?? 0;
    const price = getSubscriptionPrice(basePrice, sub.delivery_frequency_weeks);
    return sum + price * item.quantity;
  }, 0);

  const protocolSlug = sub.protocol?.slug;
  const upgradeTarget = protocolSlug ? UPGRADE_MAP[protocolSlug] : null;
  const isFullRecomp = protocolSlug === "full-recomp";

  async function handleAction(action: "pause" | "resume" | "cancel") {
    setLoading(action);
    try {
      const res = await fetch("/api/account/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: sub.id, action }),
      });
      if (res.ok) router.refresh();
      else {
        const data = await res.json();
        alert(data.error || "Something went wrong");
      }
    } catch {
      alert("Failed to update subscription");
    } finally {
      setLoading(null);
      setConfirmCancel(false);
    }
  }

  async function handleUpgrade() {
    if (!upgradeTarget) return;
    setLoading("upgrade");
    try {
      const res = await fetch("/api/account/subscriptions/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: sub.id, targetProtocolSlug: upgradeTarget.target }),
      });
      if (res.ok) {
        router.refresh();
        setShowUpgradeConfirm(false);
      } else {
        const data = await res.json();
        alert(data.error || "Upgrade failed");
      }
    } catch {
      alert("Failed to upgrade");
    } finally {
      setLoading(null);
    }
  }

  async function handleCycleToggle() {
    setCycleLoading(true);
    try {
      const res = await fetch("/api/account/subscriptions/cycle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: sub.id,
          action: sub.cycle_management ? "disable" : "enable",
        }),
      });
      if (res.ok) router.refresh();
      else alert("Failed to update cycle management");
    } catch {
      alert("Something went wrong");
    } finally {
      setCycleLoading(false);
    }
  }

  return (
    <div className="bg-white border border-[#F0F0F0] rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-primary">
            {sub.protocol?.name ?? sub.plan_name ?? "Custom Configuration"}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Started {new Date(sub.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
        <StatusBadge status={sub.status} />
      </div>

      {/* Items */}
      {sub.items && sub.items.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-1.5">
            {sub.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-success flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                  {item.product?.name ?? "Product"}
                  {item.product?.size && <span className="text-xs text-text-secondary">({item.product.size})</span>}
                  {item.quantity > 1 && <span className="text-xs text-text-secondary">x{item.quantity}</span>}
                </div>
                <span className="text-xs text-text-secondary">
                  {formatPrice(getSubscriptionPrice(item.product?.price ?? 0, sub.delivery_frequency_weeks) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F0F0F0]">
            <span className="text-sm font-semibold text-primary">Per delivery</span>
            <span className="font-heading text-lg font-bold text-primary">{formatPrice(subTotal)}</span>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-1.5 text-xs text-text-secondary mb-5">
        <p>Delivery: Every {sub.delivery_frequency_weeks} weeks</p>
        {sub.status === "active" && sub.next_delivery_date && (
          <p>Next delivery: <span className="font-semibold text-primary">{new Date(sub.next_delivery_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span></p>
        )}
        {sub.status === "paused" && sub.paused_at && (
          <p>Paused on: {new Date(sub.paused_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        )}
        {sub.status === "cancelled" && sub.cancelled_at && (
          <p>Cancelled on: {new Date(sub.cancelled_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        )}
      </div>

      {/* Cycle Management */}
      {sub.status === "active" && (
        <div className="border-t border-[#F0F0F0] pt-4 mb-4">
          {sub.cycle_management ? (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-primary">Smart Delivery Management</span>
                {sub.cycle_phase && <CyclePhaseBadge phase={sub.cycle_phase} />}
              </div>
              {/* Progress bar */}
              <div className="h-2 bg-border rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-secondary rounded-full transition-all"
                  style={{ width: `${((sub.cycle_week ?? 1) / 8) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-text-secondary mb-2">Week {sub.cycle_week ?? 1} of 8</p>
              <button onClick={handleCycleToggle} disabled={cycleLoading} className="text-[10px] text-text-secondary hover:text-error transition-colors">
                {cycleLoading ? "Updating..." : "Disable Smart Delivery"}
              </button>
            </div>
          ) : (
            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
              <p className="text-xs font-semibold text-primary mb-1">Smart Delivery Management: {formatPrice(sub.cycle_management_fee ?? 14.99)}/mo</p>
              <p className="text-[10px] text-text-secondary mb-3">
                Automatic shipment adjustments based on your research schedule. Receive full shipments during active research periods, reduce frequency when needed, or skip during breaks.
              </p>
              <button onClick={handleCycleToggle} disabled={cycleLoading} className="bg-secondary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-secondary-hover transition-colors disabled:opacity-50">
                {cycleLoading ? "Enabling..." : "Enable Smart Delivery"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Prompt */}
      {sub.status === "active" && upgradeTarget && !isFullRecomp && (
        <div className="border-t border-[#F0F0F0] pt-4 mb-4">
          <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
            <p className="text-xs font-semibold text-primary mb-2">{upgradeTarget.label}</p>
            {!showUpgradeConfirm ? (
              <button onClick={() => setShowUpgradeConfirm(true)} className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
                Upgrade
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-[10px] text-text-secondary">Changes take effect on your next billing cycle.</p>
                <div className="flex gap-2">
                  <button onClick={handleUpgrade} disabled={loading === "upgrade"} className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50">
                    {loading === "upgrade" ? "Upgrading..." : "Confirm Upgrade"}
                  </button>
                  <button onClick={() => setShowUpgradeConfirm(false)} className="text-xs text-text-secondary hover:text-text-primary">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {sub.status === "active" && isFullRecomp && (
        <div className="border-t border-[#F0F0F0] pt-4 mb-4">
          <p className="text-xs text-success font-semibold">You are on our most comprehensive configuration.</p>
        </div>
      )}

      {sub.status === "active" && !sub.protocol_id && (
        <div className="border-t border-[#F0F0F0] pt-4 mb-4">
          <Link href="/protocols" className="text-xs text-secondary font-semibold hover:underline">
            Explore our research configurations
          </Link>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 border-t border-[#F0F0F0] pt-4">
        {sub.status === "active" && (
          <>
            <button onClick={() => handleAction("pause")} disabled={loading !== null} className="bg-warning/10 text-warning text-xs font-semibold px-4 py-2 rounded-lg hover:bg-warning/20 transition-colors disabled:opacity-50">
              {loading === "pause" ? "Pausing..." : "Pause Subscription"}
            </button>
            {!confirmCancel ? (
              <button onClick={() => setConfirmCancel(true)} className="bg-error/10 text-error text-xs font-semibold px-4 py-2 rounded-lg hover:bg-error/20 transition-colors">
                Cancel Subscription
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Are you sure?</span>
                <button onClick={() => handleAction("cancel")} disabled={loading !== null} className="bg-error text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50">
                  {loading === "cancel" ? "Cancelling..." : "Yes, cancel"}
                </button>
                <button onClick={() => setConfirmCancel(false)} className="text-xs text-text-secondary hover:text-text-primary">No, keep it</button>
              </div>
            )}
          </>
        )}

        {sub.status === "paused" && (
          <>
            <button onClick={() => handleAction("resume")} disabled={loading !== null} className="bg-success/10 text-success text-xs font-semibold px-4 py-2 rounded-lg hover:bg-success/20 transition-colors disabled:opacity-50">
              {loading === "resume" ? "Resuming..." : "Resume Subscription"}
            </button>
            {!confirmCancel ? (
              <button onClick={() => setConfirmCancel(true)} className="bg-error/10 text-error text-xs font-semibold px-4 py-2 rounded-lg hover:bg-error/20 transition-colors">
                Cancel Subscription
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Are you sure?</span>
                <button onClick={() => handleAction("cancel")} disabled={loading !== null} className="bg-error text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50">
                  {loading === "cancel" ? "Cancelling..." : "Yes, cancel"}
                </button>
                <button onClick={() => setConfirmCancel(false)} className="text-xs text-text-secondary hover:text-text-primary">No, keep it</button>
              </div>
            )}
          </>
        )}

        {sub.status === "cancelled" && (
          <Link href="/protocols" className="bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors">
            Resubscribe
          </Link>
        )}
      </div>
    </div>
  );
}
