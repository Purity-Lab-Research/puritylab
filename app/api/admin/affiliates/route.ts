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

    // Fetch affiliates (no FK join to profiles since user_id references auth.users)
    const { data: affiliates, error } = await supabase
      .from("affiliates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch profiles separately and merge
    const userIds = (affiliates || []).map((a) => a.user_id);
    const [profilesRes, usersRes, appsRes] = await Promise.all([
      userIds.length > 0
        ? supabase.from("profiles").select("id, full_name, email").in("id", userIds)
        : Promise.resolve({ data: [] }),
      userIds.length > 0
        ? supabase.auth.admin.listUsers()
        : Promise.resolve({ data: { users: [] } }),
      supabase.from("affiliate_applications").select("name, email").eq("status", "approved"),
    ]);

    const profileMap = new Map((profilesRes.data || []).map((p) => [p.id, p]));
    const authMap = new Map((usersRes.data?.users || []).map((u) => [u.id, u]));
    const appMap = new Map((appsRes.data || []).map((a) => [a.email, a.name]));

    const enriched = (affiliates || []).map((a) => {
      const profile = profileMap.get(a.user_id);
      const authUser = authMap.get(a.user_id);
      const email = profile?.email || authUser?.email || "";
      const name = profile?.full_name || appMap.get(email) || authUser?.user_metadata?.full_name || null;
      return { ...a, profiles: { full_name: name, email } };
    });

    return NextResponse.json({ affiliates: enriched });
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
