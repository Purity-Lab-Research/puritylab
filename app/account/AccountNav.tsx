"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AccountNavProps {
  links: { href: string; label: string }[];
}

export default function AccountNav({ links }: AccountNavProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href);
  }

  return (
    <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
            isActive(link.href)
              ? "bg-[#1A2B4A] text-white font-semibold border-l-[3px] border-white/40"
              : "text-gray-700 border-l-[3px] border-transparent hover:border-[#1A2B4A] hover:bg-[#1A2B4A]/5 hover:text-[#1A2B4A] hover:translate-x-1 hover:shadow-sm"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
