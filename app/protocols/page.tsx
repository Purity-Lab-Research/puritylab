import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Protocol } from "@/lib/types";
import ProtocolsPageContent from "./ProtocolsPageContent";

export const metadata: Metadata = {
  title: "Research Configurations",
  description:
    "Pre-configured compound sets commonly studied together in published peer-reviewed research. Every product third-party tested with full CoA.",
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
