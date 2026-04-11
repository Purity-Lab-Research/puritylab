import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/server";
import type { Product, Protocol } from "@/lib/types";
import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import SocialProof from "@/components/home/SocialProof";
import HowItWorks from "@/components/home/HowItWorks";
import Protocols from "@/components/home/Protocols";
import WhyPurityLab from "@/components/home/WhyPurityLab";

const QualitySection = dynamic(() => import("@/components/home/QualitySection"));
// EducationPreview hidden for compliance review
// const EducationPreview = dynamic(() => import("@/components/home/EducationPreview"));

export const metadata: Metadata = {
  title: "Purity Lab | Research-Grade Peptides with Published CoAs",
  description:
    "Every batch third-party tested. 98%+ verified purity. Research-grade peptides and reference compounds with published Certificates of Analysis. For in-vitro laboratory research only.",
  openGraph: {
    title: "Purity Lab | Research-Grade Peptides with Published CoAs",
    description:
      "Every batch third-party tested. 98%+ verified purity. Research-grade peptides and reference compounds with published Certificates of Analysis. For in-vitro laboratory research only.",
  },
};

export const revalidate = 60;

export default async function HomePage() {
  let products: Product[] = [];
  let protocols: Protocol[] = [];

  try {
    const supabase = await createClient();

    const [productsRes, protocolsRes] = await Promise.all([
      supabase
        .from("products")
        .select("*, category:categories(*), variants:product_variants(*)")
        .eq("active", true)
        .eq("featured", true)
        .order("sort_order", { ascending: true })
        .limit(12),
      supabase
        .from("protocols")
        .select("*, items:protocol_items(*, product:products(name, slug))")
        .eq("active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (productsRes.data) products = productsRes.data as Product[];
    if (protocolsRes.data) protocols = protocolsRes.data as Protocol[];
  } catch {
    // Supabase may not be connected yet - fall back to empty arrays
  }

  return (
    <>
      <Hero />
      <TrustStrip />
      <FeaturedProducts products={products} />
      <SocialProof />
      <HowItWorks />
      <Protocols protocols={protocols} />
      <WhyPurityLab />
      <QualitySection />
      {/* EducationPreview hidden for compliance review */}
    </>
  );
}
