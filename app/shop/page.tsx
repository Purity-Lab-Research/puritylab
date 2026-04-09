import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import ShopContent from "@/components/shop/ShopContent";
import type { Product } from "@/lib/types";

export const metadata = {
  title: "Shop All Products",
  description:
    "Browse research peptides by goal. Recovery, fat loss, performance protocols and supplies. Every batch third-party tested.",
};

export const revalidate = 60;

export default async function ShopPage() {
  const supabase = await createClient();

  let products: Product[] = [];

  try {
    const { data } = await supabase
      .from("products")
      .select(
        "*, category:categories(*), variants:product_variants(*)"
      )
      .eq("active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    products = (data as Product[]) ?? [];
  } catch {
    products = [];
  }

  return (
    <>
      <PageHeader
        title="Shop All Products"
        description="Research peptides organized by goal. Every batch third-party tested."
        breadcrumbs={[{ label: "Shop" }]}
      />

      <ShopContent products={products} />
    </>
  );
}
