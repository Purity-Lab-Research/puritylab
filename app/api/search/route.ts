import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";
import { stripHtml } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const rateLimited = await rateLimit(request, { limit: 30, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const q = request.nextUrl.searchParams.get("q")?.trim();
    const ids = request.nextUrl.searchParams.get("ids")?.trim();

    const supabase = await createClient();

    // Fetch by IDs (used by reorder)
    if (ids) {
      const idList = ids.split(",").filter(Boolean).slice(0, 50);
      if (idList.length === 0) return NextResponse.json([]);

      const { data } = await supabase
        .from("products")
        .select("id, name, slug, price, images")
        .in("id", idList);

      return NextResponse.json(data ?? [], {
        headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
      });
    }

    // Text search
    if (!q || q.length < 2) {
      return NextResponse.json([]);
    }

    // Sanitize search input
    const sanitized = stripHtml(q).slice(0, 100);

    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, price, images, category:categories(name)")
      .eq("active", true)
      .ilike("name", `%${sanitized}%`)
      .order("name")
      .limit(6);

    return NextResponse.json(products ?? [], {
      headers: { "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60" },
    });
  } catch (err) {
    logger.error("Search error", { error: String(err) });
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
