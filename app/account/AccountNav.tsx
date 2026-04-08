"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AccountNavProps {
  links: { href: string; label: string; icon: string }[];
}

export default function AccountNav({ links }: AccountNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all duration-150 ${
            isActive(link.href)
              ? "bg-[#111111] text-white font-semibold shadow-sm"
              : "bg-white text-[#6B7280] hover:bg-white hover:text-[#111111] hover:shadow-sm"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
