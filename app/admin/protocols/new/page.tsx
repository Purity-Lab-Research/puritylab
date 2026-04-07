import { createAdminClient } from "@/lib/supabase/admin";
import { requireStaffPage } from "@/lib/admin";
import ProtocolForm from "../ProtocolForm";

export default async function NewProtocolPage() {
  await requireStaffPage();
  const supabase = createAdminClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, name, size, price")
    .eq("active", true)
    .order("name");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Protocol</h1>
      <ProtocolForm products={(products ?? []) as { id: string; name: string; size: string; price: number }[]} />
    </div>
  );
}
