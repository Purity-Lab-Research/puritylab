import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/admin";
import { verifyCsrf } from "@/lib/csrf";
import { writeAuditLog } from "@/lib/audit";
import { z } from "zod";

const ProtocolItemSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
  sort_order: z.number().int().default(0),
});

const ProtocolSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  tagline: z.string().min(1),
  description: z.string().default(""),
  cycle_length: z.string().min(1),
  subscription_price: z.number().positive(),
  one_time_price: z.number().positive(),
  badge: z.string().nullable().optional(),
  accent_color: z.string().default("#0097A7"),
  sort_order: z.number().int().default(0),
  active: z.boolean().default(true),
  items: z.array(ProtocolItemSchema).default([]),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("protocols")
    .select("*, items:protocol_items(*, product:products(name, size))")
    .order("sort_order", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  try {
    const body = await request.json();
    const parsed = ProtocolSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, ...protocolData } = parsed.data;
    const supabase = createAdminClient();

    const { data: protocol, error } = await supabase
      .from("protocols")
      .insert(protocolData)
      .select("id")
      .single();

    if (error || !protocol) {
      return NextResponse.json(
        { error: error?.message ?? "Failed to create protocol" },
        { status: 500 }
      );
    }

    if (items.length > 0) {
      const itemRows = items.map((item) => ({
        protocol_id: protocol.id,
        product_id: item.product_id,
        quantity: item.quantity,
        sort_order: item.sort_order,
      }));

      await supabase.from("protocol_items").insert(itemRows);
    }

    await writeAuditLog({
      admin_id: admin.id,
      action: "protocol.create",
      entity_type: "protocol",
      entity_id: protocol.id,
      details: { name: protocolData.name },
    });

    return NextResponse.json({ id: protocol.id }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  try {
    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: "Missing protocol ID" }, { status: 400 });
    }

    const parsed = ProtocolSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { items, ...protocolData } = parsed.data;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("protocols")
      .update(protocolData)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Replace items
    await supabase.from("protocol_items").delete().eq("protocol_id", id);

    if (items.length > 0) {
      const itemRows = items.map((item) => ({
        protocol_id: id,
        product_id: item.product_id,
        quantity: item.quantity,
        sort_order: item.sort_order,
      }));

      await supabase.from("protocol_items").insert(itemRows);
    }

    await writeAuditLog({
      admin_id: admin.id,
      action: "protocol.update",
      entity_type: "protocol",
      entity_id: id,
      details: { name: protocolData.name },
    });

    return NextResponse.json({ id });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const csrfError = verifyCsrf(request);
  if (csrfError) return csrfError;

  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "Missing protocol ID" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get name for audit log
    const { data: protocol } = await supabase
      .from("protocols")
      .select("name")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("protocols").delete().eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await writeAuditLog({
      admin_id: admin.id,
      action: "protocol.delete",
      entity_type: "protocol",
      entity_id: id,
      details: { name: protocol?.name },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
