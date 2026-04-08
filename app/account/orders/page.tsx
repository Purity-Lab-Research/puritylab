import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/lib/types";
import { ShoppingBag } from "lucide-react";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .or(`user_id.eq.${user!.id},guest_email.eq.${user!.email}`)
    .neq("status", "pending")
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  const statusColors: Record<string, string> = {
    pending: "bg-[#FEF3C7] text-[#F59E0B]",
    processing: "bg-[#DBEAFE] text-[#3B82F6]",
    shipped: "bg-[#EDE9FE] text-[#8B5CF6]",
    delivered: "bg-[#D1FAE5] text-[#10B981]",
    cancelled: "bg-[#FEE2E2] text-[#EF4444]",
    refunded: "bg-[#F0F0F0] text-[#6B7280]",
  };

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-[#111111] mb-6">
        Order History
      </h1>

      {orders && orders.length > 0 ? (
        <div className="bg-white border border-[#F0F0F0] rounded-2xl overflow-hidden">
          {/* Desktop table */}
          <table className="w-full hidden sm:table">
            <thead>
              <tr className="border-b border-[#F0F0F0] text-left text-xs font-semibold text-[#6B7280] uppercase tracking-wider">
                <th className="px-5 py-3">Order</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-4 text-sm font-semibold text-[#111111]">
                    #{order.order_number}
                  </td>
                  <td className="px-5 py-4 text-sm text-[#6B7280]">
                    {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                        statusColors[order.status] || "bg-[#F0F0F0] text-[#6B7280]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-[#111111] text-right">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="text-sm text-[#10B981] hover:underline font-semibold"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile list */}
          <div className="sm:hidden divide-y divide-[#F0F0F0]">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-[#FAFAFA] transition-colors"
              >
                <div>
                  <p className="text-sm font-semibold text-[#111111]">
                    #{order.order_number}
                  </p>
                  <p className="text-xs text-[#6B7280]">
                    {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                      statusColors[order.status] || "bg-[#F0F0F0] text-[#6B7280]"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-[#111111]">${order.total.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-[#FAFAFA] flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="h-6 w-6 text-[#9CA3AF]" />
          </div>
          <p className="text-[#6B7280] mb-3">No orders yet.</p>
          <Link href="/shop" className="text-[#10B981] font-semibold hover:underline">
            Browse our products
          </Link>
        </div>
      )}
    </div>
  );
}
