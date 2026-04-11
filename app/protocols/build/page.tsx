import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import StackBuilder from "./StackBuilder";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build a Custom Configuration",
  description:
    "Create a custom research compound configuration. Select your compounds, set your delivery schedule, and save up to 15% with a subscription.",
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
    <div className="bg-[#FAFAFA] min-h-screen">
      {/* Page Header */}
      <div className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-8">
          <nav className="flex items-center gap-1.5 text-xs text-[#6B7280] mb-4">
            <Link href="/" className="hover:text-[#111111] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/protocols"
              className="hover:text-[#111111] transition-colors"
            >
              Research Configurations
            </Link>
            <span>/</span>
            <span className="text-[#111111] font-medium">
              Custom Build
            </span>
          </nav>
          <h1 className="text-4xl font-extrabold text-[#111111]">
            Build a Custom Configuration
          </h1>
          <p className="mt-2 text-[#6B7280]">
            Select your research compounds, set your delivery schedule, and save up to 15% with a subscription.
          </p>
        </div>
      </div>

      <StackBuilder products={products} />
    </div>
  );
}
