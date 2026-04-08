"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

const labelMap: Record<string, string> = {
  admin: "Dashboard",
  orders: "Orders",
  customers: "Customers",
  affiliates: "Affiliates",
  email: "Email",
  subscriptions: "Subscriptions",
  products: "Products",
  protocols: "Protocols",
  inventory: "Inventory",
  coa: "COA Documents",
  reviews: "Reviews",
  discounts: "Discounts",
  faq: "FAQ Manager",
  compliance: "Compliance",
  settings: "Settings",
  inbox: "Inbox",
  analytics: "Analytics",
  categories: "Categories",
  new: "New",
  applications: "Applications",
  payouts: "Payouts",
};

export default function AdminBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items from path segments
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = labelMap[segment] || (segment.length > 20 ? "Detail" : segment);
    const isLast = index === segments.length - 1;
    return { label, href, isLast };
  });

  // Skip the first "admin" segment in display since we always show a home icon
  const displayCrumbs = crumbs.slice(1);

  return (
    <nav className="flex items-center gap-1.5 text-sm">
      <Link
        href="/admin"
        className="flex items-center gap-1 text-gray-400 hover:text-[#111111] transition-colors"
      >
        <Home className="h-3.5 w-3.5" />
      </Link>
      {displayCrumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3 text-gray-300" />
          {crumb.isLast ? (
            <span className="font-medium text-[#111111]">{crumb.label}</span>
          ) : (
            <Link
              href={crumb.href}
              className="text-gray-400 hover:text-[#111111] transition-colors"
            >
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
