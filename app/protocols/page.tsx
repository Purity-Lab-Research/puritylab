import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Protocol } from "@/lib/types";
import ProtocolsPageContent from "./ProtocolsPageContent";

export const metadata: Metadata = {
  title: "Protocols",
  description:
    "Complete peptide stacks designed for specific goals. Recovery, fat loss, performance, and full recomp protocols with 10% subscription savings.",
};

export const revalidate = 60;

export default async function ProtocolsPage() {
  let protocols: Protocol[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("protocols")
      .select("*, items:protocol_items(*, product:products(name, slug))")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (data) protocols = data as Protocol[];
  } catch {
    // fall back to empty
  }

  return <ProtocolsPageContent protocols={protocols} />;
}
