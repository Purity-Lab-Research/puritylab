import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Protocol } from "@/lib/types";
import QuizFlow from "./QuizFlow";

export const metadata: Metadata = {
  title: "Find My Protocol | Purity Lab",
  description:
    "Take our 60-second quiz to find the right peptide protocol for your goals. Personalized recommendations based on your experience and budget.",
};

export default async function QuizPage() {
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

  return <QuizFlow protocols={protocols} />;
}
