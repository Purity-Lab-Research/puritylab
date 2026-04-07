import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import HowItWorks from "@/components/home/HowItWorks";
import Protocols from "@/components/home/Protocols";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyPurityLab from "@/components/home/WhyPurityLab";
import EducationPreview from "@/components/home/EducationPreview";
import CTABanner from "@/components/home/CTABanner";

export const metadata: Metadata = {
  title: "Purity Lab | Research-Grade Peptide Protocols for Athletes",
  description:
    "Every batch third-party tested. 98%+ verified purity. Athlete recovery, fat loss, and performance peptide protocols with published Certificates of Analysis.",
  openGraph: {
    title: "Purity Lab | Research-Grade Peptide Protocols for Athletes",
    description:
      "Every batch third-party tested. 98%+ verified purity. Athlete recovery, fat loss, and performance peptide protocols with published Certificates of Analysis.",
  },
};

export default async function HomePage() {
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*), variants:product_variants(*)")
      .eq("active", true)
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(6);

    if (data) products = data as Product[];
  } catch {
    // Supabase may not be connected yet — fall back to empty array
  }

  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <Protocols />
      <FeaturedProducts products={products} />
      <WhyPurityLab />
      <EducationPreview />
      <CTABanner />
    </>
  );
}
