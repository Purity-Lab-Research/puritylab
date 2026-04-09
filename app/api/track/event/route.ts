export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { rateLimit } from "@/lib/rate-limit";
import { z } from "zod";
import { stripHtml } from "@/lib/validation";

const eventSchema = z.object({
  event_name: z.string().min(1).max(100).transform(stripHtml),
  properties: z.record(z.string(), z.unknown()).optional().default({}),
  page_path: z.string().max(500).nullable().optional(),
});

export async function POST(req: NextRequest) {
  const rateLimited = await rateLimit(req, { limit: 60, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  try {
    const body = await req.json();
    const parsed = eventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid event data" }, { status: 400 });
    }

    const supabase = createAdminClient();
    await supabase.from("site_events").insert({
      event_name: parsed.data.event_name,
      properties: parsed.data.properties,
      page_path: parsed.data.page_path ?? null,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
