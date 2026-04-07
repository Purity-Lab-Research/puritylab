import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffPage } from "@/lib/admin";
import { formatPrice } from "@/lib/utils";
import ProtocolActions from "./ProtocolActions";

interface ProtocolRow {
  id: string;
  name: string;
  slug: string;
  subscription_price: number;
  one_time_price: number;
  badge: string | null;
  sort_order: number;
  active: boolean;
  items?: { id: string }[];
}

export default async function AdminProtocolsPage() {
  await requireStaffPage();
  const supabase = createAdminClient();

  const { data: protocols } = await supabase
    .from("protocols")
    .select("*, items:protocol_items(id)")
    .order("sort_order", { ascending: true });

  const rows = (protocols ?? []) as ProtocolRow[];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Protocols</h1>
        <Link
          href="/admin/protocols/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          + Add Protocol
        </Link>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50/50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Slug</th>
                <th className="px-5 py-3 text-right font-medium">Sub Price</th>
                <th className="px-5 py-3 text-right font-medium">One-Time</th>
                <th className="px-5 py-3 font-medium">Badge</th>
                <th className="px-5 py-3 text-center font-medium">Items</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((protocol) => (
                <tr key={protocol.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3 font-medium text-gray-900">
                    {protocol.name}
                  </td>
                  <td className="px-5 py-3 text-gray-500 font-mono text-xs">
                    {protocol.slug}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-900">
                    {formatPrice(protocol.subscription_price)}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-500">
                    {formatPrice(protocol.one_time_price)}
                  </td>
                  <td className="px-5 py-3">
                    {protocol.badge ? (
                      <span className="inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                        {protocol.badge}
                      </span>
                    ) : (
                      <span className="text-gray-300">-</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center text-gray-600">
                    {protocol.items?.length ?? 0}
                  </td>
                  <td className="px-5 py-3">
                    <ProtocolActions protocolId={protocol.id} active={protocol.active} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/protocols/${protocol.id}`}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                    No protocols yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
