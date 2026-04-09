import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  const timestamp = Date.now();

  // Check database connectivity
  try {
    const db = createAdminClient();
    const { error } = await db.from("products").select("id").limit(1);
    if (error) throw error;
  } catch {
    return NextResponse.json(
      { status: "degraded", timestamp, database: "unreachable" },
      { status: 503 }
    );
  }

  return NextResponse.json({ status: "ok", timestamp });
}
