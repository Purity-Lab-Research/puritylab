import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PageHeader from "@/components/ui/PageHeader";
import CoaLibrary from "@/components/coa/CoaLibrary";

export const metadata: Metadata = {
  title: "CoA Library",
  description:
    "Every product batch is independently tested. Look up your batch number or browse all Certificates of Analysis.",
};

interface CoaRow {
  id: string;
  batch_number: string;
  purity_percentage: number;
  pdf_url: string | null;
  test_date: string | null;
  created_at: string;
  product_id: string;
}

interface ProductWithCoas {
  id: string;
  name: string;
  slug: string;
  size: string;
  coas: CoaRow[];
}

export const revalidate = 60;

export default async function CoaPage() {
  let productCoas: ProductWithCoas[] = [];

  try {
    const supabase = await createClient();

    // Fetch all CoA documents with their product info
    const { data: coas } = await supabase
      .from("coa")
      .select("id, batch_number, purity_percentage, pdf_url, test_date, created_at, product_id")
      .order("test_date", { ascending: false });

    // Fetch products that have CoAs
    if (coas && coas.length > 0) {
      const productIds = [...new Set(coas.map((c: CoaRow) => c.product_id))];
      const { data: products } = await supabase
        .from("products")
        .select("id, name, slug, size")
        .in("id", productIds);

      if (products) {
        productCoas = products.map((product) => ({
          ...product,
          coas: coas.filter((c: CoaRow) => c.product_id === product.id),
        }));
        // Sort by product name
        productCoas.sort((a, b) => a.name.localeCompare(b.name));
      }
    }
  } catch {
    productCoas = [];
  }

  return (
    <>
      <PageHeader
        title="CoA Library"
        description="Every product, every batch, independently verified."
        breadcrumbs={[{ label: "CoA Library" }]}
      />
      <CoaLibrary productCoas={productCoas} />
    </>
  );
}
