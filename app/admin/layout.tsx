import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { AdminSidebarProvider } from "@/components/admin/AdminSidebarContext";
import { AdminToastProvider } from "@/components/admin/ui/AdminToast";
import AdminSidebarShell from "@/components/admin/AdminSidebarShell";
import AdminMainContent from "@/components/admin/AdminMainContent";
import type { Profile } from "@/lib/types";
import type { StaffRole } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const adminSupabase = createAdminClient();
  const { data: profile } = await adminSupabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  if (!profile || (profile.role !== "admin" && profile.role !== "fulfillment")) {
    redirect("/");
  }

  const role = profile.role as StaffRole;
  const displayName = profile.full_name || user.email || "Admin";

  return (
    <AdminSidebarProvider>
      <AdminToastProvider>
        <div className="flex h-screen">
          <AdminSidebarShell role={role} />
          <AdminMainContent
            userName={displayName}
            userEmail={user.email}
          >
            {children}
          </AdminMainContent>
        </div>
      </AdminToastProvider>
    </AdminSidebarProvider>
  );
}
