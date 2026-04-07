import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import StackBuilder from "./StackBuilder";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build Your Own Stack",
  description:
    "Create a custom peptide stack tailored to your goals. Pick your peptides, set your delivery schedule, and save 10% with a subscription.",
};

export default async function BuildStackPage() {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select(
        "id, name, slug, size, price, subscription_price, short_description, goal_category, tier, images, active"
      )
      .eq("active", true)
      .order("goal_category", { ascending: true })
      .order("sort_order", { ascending: true });

    if (data) products = data as Product[];
  } catch {
    // fall back to empty
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Page Header */}
      <div className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8">
          <nav className="flex items-center gap-1.5 text-xs text-text-secondary mb-4">
            <Link href="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/protocols"
              className="hover:text-secondary transition-colors"
            >
              Protocols
            </Link>
            <span>/</span>
            <span className="text-text-primary font-medium">
              Build Your Own
            </span>
          </nav>
          <h1 className="font-heading text-4xl font-extrabold text-primary">
            Build Your Own Stack
          </h1>
          <p className="mt-2 text-text-secondary">
            Pick your peptides, set your schedule, save 10% with a subscription.
          </p>
        </div>
      </div>

      <StackBuilder products={products} />
    </div>
  );
}
