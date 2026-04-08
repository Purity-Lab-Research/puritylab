import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import AccountNav from "./AccountNav";
import { LayoutDashboard, ShoppingBag, RefreshCw, MapPin, LogOut } from "lucide-react";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/account");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single<Profile>();

  const displayName = profile?.full_name || user.email || "User";
  const displayEmail = user.email || "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const links = [
    { href: "/account", label: "Overview", icon: "LayoutDashboard" },
    { href: "/account/orders", label: "Orders", icon: "ShoppingBag" },
    { href: "/account/subscriptions", label: "Subscriptions", icon: "RefreshCw" },
    { href: "/account/addresses", label: "Addresses", icon: "MapPin" },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
    ShoppingBag: <ShoppingBag className="h-4 w-4" />,
    RefreshCw: <RefreshCw className="h-4 w-4" />,
    MapPin: <MapPin className="h-4 w-4" />,
  };

  return (
    <div className="bg-[#F7F7F8] min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile header */}
        <div className="md:hidden mb-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-[#111111] flex items-center justify-center">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111111]">{displayName}</p>
              <p className="text-xs text-[#9CA3AF]">{displayEmail}</p>
            </div>
          </div>
          <AccountNav links={links} />
        </div>

        <div className="flex gap-10">
          {/* Desktop sidebar */}
          <aside className="hidden md:block w-60 shrink-0">
            <div className="sticky top-28">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-full bg-[#111111] flex items-center justify-center">
                  <span className="text-sm font-bold text-white">{initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111111] truncate">{displayName}</p>
                  <p className="text-xs text-[#9CA3AF] truncate">{displayEmail}</p>
                </div>
              </div>

              <nav className="space-y-0.5">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[#6B7280] transition-all duration-150 hover:bg-white hover:text-[#111111] hover:shadow-sm"
                  >
                    <span className="text-[#9CA3AF]">{iconMap[link.icon]}</span>
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-[#E5E7EB]">
                <form action="/api/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-[#9CA3AF] hover:text-[#EF4444] transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
