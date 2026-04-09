import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { scanAndGenerateNotifications } from "@/lib/notifications";
import { verifyCsrf } from "@/lib/csrf";

/**
 * GET /api/admin/notifications
 * Fetches notifications. Runs a background scan to generate new ones.
 * Query params:
 *   unread_only=true  — only unread
 *   limit=50          — max items (default 50)
 */
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = createAdminClient();
  const { searchParams } = new URL(req.url);
  const unreadOnly = searchParams.get("unread_only") === "true";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  // Fire off scan in background (don't await — it runs async)
  scanAndGenerateNotifications().catch(() => {});

  let query = db
    .from("admin_notifications")
    .select("*")
    .eq("dismissed", false)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (unreadOnly) {
    query = query.eq("is_read", false);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also return unread count
  const { count } = await db
    .from("admin_notifications")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false)
    .eq("dismissed", false);

  return NextResponse.json({ notifications: data ?? [], unread_count: count ?? 0 });
}

/**
 * PUT /api/admin/notifications
 * Update notification(s): mark as read, mark all read, or dismiss.
 * Body:
 *   { action: "read", id: "uuid" }            — mark one as read
 *   { action: "read_all" }                     — mark all as read
 *   { action: "dismiss", id: "uuid" }          — dismiss one
 *   { action: "dismiss_all" }                  — dismiss all
 */
export async function PUT(req: NextRequest) {
  const csrfError = verifyCsrf(req);
  if (csrfError) return csrfError;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { action, id } = body;
  const db = createAdminClient();

  switch (action) {
    case "read": {
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      await db.from("admin_notifications").update({ is_read: true }).eq("id", id);
      break;
    }
    case "read_all": {
      await db
        .from("admin_notifications")
        .update({ is_read: true })
        .eq("is_read", false)
        .eq("dismissed", false);
      break;
    }
    case "dismiss": {
      if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
      await db.from("admin_notifications").update({ dismissed: true }).eq("id", id);
      break;
    }
    case "dismiss_all": {
      await db
        .from("admin_notifications")
        .update({ dismissed: true })
        .eq("dismissed", false);
      break;
    }
    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
