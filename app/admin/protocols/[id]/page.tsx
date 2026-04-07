import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffPage } from "@/lib/admin";
import ProtocolForm from "../ProtocolForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProtocolPage({ params }: PageProps) {
  await requireStaffPage();
  const { id } = await params;
  const supabase = createAdminClient();

  const [protocolRes, productsRes] = await Promise.all([
    supabase
      .from("protocols")
      .select("*, items:protocol_items(product_id, quantity, sort_order, product:products(id, name, size, price))")
      .eq("id", id)
      .single(),
    supabase
      .from("products")
      .select("id, name, size, price")
      .eq("active", true)
      .order("name"),
  ]);

  if (!protocolRes.data) notFound();

  const protocol = protocolRes.data;
  const products = (productsRes.data ?? []) as { id: string; name: string; size: string; price: number }[];

  const initial = {
    id: protocol.id,
    name: protocol.name,
    slug: protocol.slug,
    tagline: protocol.tagline,
    description: protocol.description ?? "",
    cycle_length: protocol.cycle_length,
    subscription_price: protocol.subscription_price,
    one_time_price: protocol.one_time_price,
    badge: protocol.badge ?? "",
    accent_color: protocol.accent_color ?? "#0097A7",
    sort_order: protocol.sort_order ?? 0,
    active: protocol.active ?? true,
    items: (protocol.items ?? []).map((item: { product_id: string; quantity: number; sort_order: number; product: { id: string; name: string; size: string; price: number } | null }) => ({
      product_id: item.product_id,
      product: item.product,
      quantity: item.quantity,
      sort_order: item.sort_order,
    })),
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Edit: {protocol.name}
      </h1>
      <ProtocolForm initial={initial} products={products} />
    </div>
  );
}
