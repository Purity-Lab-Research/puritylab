import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SubscriptionCard from "./SubscriptionCard";

export const metadata: Metadata = {
  title: "Subscriptions",
  description: "Manage your peptide subscription deliveries.",
};

interface SubItem {
  id: string;
  quantity: number;
  product?: { name: string; size: string; price: number; subscription_price: number | null } | null;
}

interface SubRow {
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

export default async function SubscriptionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select(
      "*, protocol:protocols(name, slug), items:subscription_items(id, quantity, product:products(name, size, price))"
    )
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<SubRow[]>();

  const subs = subscriptions ?? [];
  const active = subs.filter((s) => s.status === "active");
  const paused = subs.filter((s) => s.status === "paused");
  const cancelled = subs.filter((s) => s.status === "cancelled");
  const grouped = [...active, ...paused, ...cancelled];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-[#111111] tracking-tight">
          Subscriptions
        </h1>
        <Link
          href="/protocols"
          className="text-sm text-[#10B981] font-semibold hover:underline"
        >
          Browse Configurations
        </Link>
      </div>

      {grouped.length > 0 ? (
        <div className="space-y-4">
          {grouped.map((sub) => (
            <SubscriptionCard key={sub.id} subscription={sub} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-12 text-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-secondary mx-auto mb-4"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          <h2 className="font-heading text-lg font-bold text-primary mb-2">
            No subscriptions yet
          </h2>
          <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">
            Set up a scheduled reorder for research compounds with discounted pricing.
            Pause or cancel anytime.
          </p>
          <Link
            href="/protocols"
            className="inline-block bg-primary text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors"
          >
            Browse Configurations
          </Link>
        </div>
      )}
    </div>
  );
}
