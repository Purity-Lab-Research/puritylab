import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffPage } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import CleanupOrdersButton from "@/components/admin/CleanupOrdersButton";
import ExportOrdersButton from "@/components/admin/ExportOrdersButton";
import AdminBadge, { statusVariant } from "@/components/admin/ui/AdminBadge";
import type { Order, OrderItem } from "@/lib/types";
import OrdersClientView from "./OrdersClientView";

export default async function AdminOrdersPage() {
  await requireStaffPage();
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .neq("status", "pending")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as (Order & { order_items: OrderItem[] })[];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{orders.length} total orders</p>
        </div>
        <div className="flex items-center gap-2">
          <ExportOrdersButton />
          <CleanupOrdersButton />
        </div>
      </div>

      <OrdersClientView orders={orders} />
    </div>
  );
}
