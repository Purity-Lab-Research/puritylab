"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

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
  status: string;
  plan_name: string | null;
  protocol_id: string | null;
  delivery_frequency_weeks: number;
  next_delivery_date: string | null;
  paused_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  protocol?: { name: string } | null;
  items?: SubItem[];
}

interface Props {
  subscription: Subscription;
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-success/10 text-success",
    paused: "bg-warning/10 text-warning",
    cancelled: "bg-error/10 text-error",
    inactive: "bg-border text-text-secondary",
  };
  return (
    <span
      className={`text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider ${styles[status] ?? styles.inactive}`}
    >
      {status}
    </span>
  );
}

export default function SubscriptionCard({ subscription: sub }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const subTotal = (sub.items ?? []).reduce((sum, item) => {
    const price =
      item.product?.subscription_price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  async function handleAction(action: "pause" | "resume" | "cancel") {
    setLoading(action);
    try {
      const res = await fetch("/api/account/subscriptions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId: sub.id, action }),
      });
      if (res.ok) {
        router.refresh();
      } else {
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

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-heading text-lg font-bold text-primary">
            {sub.protocol?.name ?? sub.plan_name ?? "Custom Stack"}
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Started{" "}
            {new Date(sub.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <StatusBadge status={sub.status} />
      </div>

      {/* Items */}
      {sub.items && sub.items.length > 0 && (
        <div className="mb-4">
          <ul className="space-y-1.5">
            {sub.items.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-1.5 text-text-secondary">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-success flex-shrink-0"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  {item.product?.name ?? "Product"}
                  {item.product?.size && (
                    <span className="text-xs text-text-secondary">
                      ({item.product.size})
                    </span>
                  )}
                  {item.quantity > 1 && (
                    <span className="text-xs text-text-secondary">
                      x{item.quantity}
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-secondary">
                  {formatPrice(
                    (item.product?.subscription_price ??
                      item.product?.price ??
                      0) * item.quantity
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <span className="text-sm font-semibold text-primary">
              Per delivery
            </span>
            <span className="font-heading text-lg font-bold text-primary">
              {formatPrice(subTotal)}
            </span>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-1.5 text-xs text-text-secondary mb-5">
        <p>
          Delivery: Every {sub.delivery_frequency_weeks} weeks
        </p>
        {sub.status === "active" && sub.next_delivery_date && (
          <p>
            Next delivery:{" "}
            <span className="font-semibold text-primary">
              {new Date(sub.next_delivery_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </p>
        )}
        {sub.status === "paused" && sub.paused_at && (
          <p>
            Paused on:{" "}
            {new Date(sub.paused_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
        {sub.status === "cancelled" && sub.cancelled_at && (
          <p>
            Cancelled on:{" "}
            {new Date(sub.cancelled_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {sub.status === "active" && (
          <>
            <button
              onClick={() => handleAction("pause")}
              disabled={loading !== null}
              className="bg-warning/10 text-warning text-xs font-semibold px-4 py-2 rounded-lg hover:bg-warning/20 transition-colors disabled:opacity-50"
            >
              {loading === "pause" ? "Pausing..." : "Pause Subscription"}
            </button>
            {!confirmCancel ? (
              <button
                onClick={() => setConfirmCancel(true)}
                className="bg-error/10 text-error text-xs font-semibold px-4 py-2 rounded-lg hover:bg-error/20 transition-colors"
              >
                Cancel Subscription
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Are you sure?</span>
                <button
                  onClick={() => handleAction("cancel")}
                  disabled={loading !== null}
                  className="bg-error text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
                >
                  {loading === "cancel" ? "Cancelling..." : "Yes, cancel"}
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="text-xs text-text-secondary hover:text-text-primary"
                >
                  No, keep it
                </button>
              </div>
            )}
          </>
        )}

        {sub.status === "paused" && (
          <>
            <button
              onClick={() => handleAction("resume")}
              disabled={loading !== null}
              className="bg-success/10 text-success text-xs font-semibold px-4 py-2 rounded-lg hover:bg-success/20 transition-colors disabled:opacity-50"
            >
              {loading === "resume" ? "Resuming..." : "Resume Subscription"}
            </button>
            {!confirmCancel ? (
              <button
                onClick={() => setConfirmCancel(true)}
                className="bg-error/10 text-error text-xs font-semibold px-4 py-2 rounded-lg hover:bg-error/20 transition-colors"
              >
                Cancel Subscription
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Are you sure?</span>
                <button
                  onClick={() => handleAction("cancel")}
                  disabled={loading !== null}
                  className="bg-error text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-error/90 transition-colors disabled:opacity-50"
                >
                  {loading === "cancel" ? "Cancelling..." : "Yes, cancel"}
                </button>
                <button
                  onClick={() => setConfirmCancel(false)}
                  className="text-xs text-text-secondary hover:text-text-primary"
                >
                  No, keep it
                </button>
              </div>
            )}
          </>
        )}

        {sub.status === "cancelled" && (
          <Link
            href="/protocols"
            className="bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
          >
            Resubscribe
          </Link>
        )}
      </div>
    </div>
  );
}
