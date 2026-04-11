import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Protocol } from "@/lib/types";
import type { Metadata } from "next";
import ProtocolDetailContent from "./ProtocolDetailContent";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* Prevent this route from matching the "build" path which has its own page */
const RESERVED_SLUGS = ["build"];

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug)) return { title: "Build a Custom Configuration" };

  const supabase = await createClient();
  const { data: protocol } = await supabase
    .from("protocols")
    .select("name, tagline, description")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!protocol) return { title: "Research Configuration Not Found" };

  return {
    title: `${protocol.name} Research Configuration`,
    description:
      protocol.tagline ||
      protocol.description?.slice(0, 160) ||
      `${protocol.name} research configuration. Third-party tested with 98%+ purity.`,
  };
}

export default async function ProtocolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug)) notFound();

  const supabase = await createClient();

  const { data: protocol } = await supabase
    .from("protocols")
    .select(
      "*, items:protocol_items(*, product:products(id, name, slug, price, size, short_description, images, purity, active, subscription_price, goal_category))"
    )
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!protocol) notFound();

  /* Fetch other active configurations for the "Other Configurations" section */
  const { data: otherProtocols } = await supabase
    .from("protocols")
    .select("id, name, slug, tagline, badge, accent_color")
    .eq("active", true)
    .neq("slug", slug)
    .order("sort_order", { ascending: true });

  /* Fetch all active non-supply products for swapping */
  const { data: swapProducts } = await supabase
    .from("products")
    .select("id, name, slug, size, price, subscription_price, short_description, images, purity, goal_category, active")
    .eq("active", true)
    .neq("goal_category", "laboratory_supplies")
    .order("goal_category", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <ProtocolDetailContent
      protocol={protocol as Protocol}
      otherProtocols={otherProtocols ?? []}
      swapProducts={swapProducts ?? []}
    />
  );
}
