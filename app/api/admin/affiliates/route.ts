import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";

export async function GET(request: NextRequest) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient();
    const { data: affiliates, error } = await supabase
      .from("affiliates")
      .select("*, profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ affiliates: affiliates || [] });
  } catch (err) {
    console.error("Admin affiliates GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { affiliateId, status, commissionRateFirst, commissionRateRecurring } = body;

    if (!affiliateId) {
      return NextResponse.json({ error: "Missing affiliateId" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const updates: Record<string, unknown> = {};

    if (status) updates.status = status;
    if (commissionRateFirst !== undefined) updates.commission_rate_first = commissionRateFirst;
    if (commissionRateRecurring !== undefined) updates.commission_rate_recurring = commissionRateRecurring;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    const { error } = await supabase
      .from("affiliates")
      .update(updates)
      .eq("id", affiliateId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin affiliates PUT error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
