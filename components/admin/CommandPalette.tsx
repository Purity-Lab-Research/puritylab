"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  Settings,
  Ticket,
  Mail,
  Star,
  FileCheck,
  Warehouse,
  Layers,
  UserPlus,
  RefreshCw,
  MessageCircleQuestion,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: LucideIcon;
  category: "pages" | "orders" | "products" | "customers";
}

const pageItems: CommandItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: LayoutDashboard, category: "pages" },
  { id: "orders", label: "Orders", href: "/admin/orders", icon: ShoppingBag, category: "pages" },
  { id: "customers", label: "Customers", href: "/admin/customers", icon: Users, category: "pages" },
  { id: "products", label: "Products", href: "/admin/products", icon: Package, category: "pages" },
  { id: "protocols", label: "Protocols", href: "/admin/protocols", icon: Layers, category: "pages" },
  { id: "inventory", label: "Inventory", href: "/admin/inventory", icon: Warehouse, category: "pages" },
  { id: "coa", label: "COA Documents", href: "/admin/coa", icon: FileCheck, category: "pages" },
  { id: "discounts", label: "Discounts", href: "/admin/discounts", icon: Ticket, category: "pages" },
  { id: "email", label: "Email", href: "/admin/email", icon: Mail, category: "pages" },
  { id: "reviews", label: "Reviews", href: "/admin/reviews", icon: Star, category: "pages" },
  { id: "affiliates", label: "Affiliates", href: "/admin/affiliates", icon: UserPlus, category: "pages" },
  { id: "subscriptions", label: "Subscriptions", href: "/admin/subscriptions", icon: RefreshCw, category: "pages" },
  { id: "faq", label: "FAQ Manager", href: "/admin/faq", icon: MessageCircleQuestion, category: "pages" },
  { id: "compliance", label: "Compliance", href: "/admin/compliance", icon: ShieldCheck, category: "pages" },
  { id: "settings", label: "Settings", href: "/admin/settings", icon: Settings, category: "pages" },
  { id: "new-product", label: "New Product", description: "Create a new product", href: "/admin/products?action=new", icon: Package, category: "pages" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchResults, setSearchResults] = useState<CommandItem[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Listen for Ctrl+K and custom event
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    }
    function handleCustomEvent() {
      setOpen(true);
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-command-palette", handleCustomEvent);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-command-palette", handleCustomEvent);
    };
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setSelectedIndex(0);
      setSearchResults([]);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Search for dynamic results (orders, products, customers)
  const searchDynamic = useCallback(
    async (q: string) => {
      if (q.length < 2) {
        setSearchResults([]);
        return;
      }
      setSearching(true);
      const items: CommandItem[] = [];

      try {
        // Search orders by number
        if (/^\d+$/.test(q) || q.startsWith("#") || q.startsWith("PL-")) {
          const res = await fetch(`/api/admin/orders?search=${encodeURIComponent(q)}&limit=5`);
          if (res.ok) {
            const orders = await res.json();
            for (const o of orders.slice(0, 5)) {
              items.push({
                id: `order-${o.id}`,
                label: `Order ${o.order_number}`,
                description: o.guest_email || undefined,
                href: `/admin/orders/${o.id}`,
                icon: ShoppingBag,
                category: "orders",
              });
            }
          }
        }

        // Search products by name
        const prodRes = await fetch(`/api/admin/products?search=${encodeURIComponent(q)}&limit=5`);
        if (prodRes.ok) {
          const products = await prodRes.json();
          const prodList = Array.isArray(products) ? products : products.products ?? [];
          for (const p of prodList.slice(0, 5)) {
            items.push({
              id: `product-${p.id}`,
              label: p.name,
              description: `$${(p.price / 100).toFixed(2)}`,
              href: `/admin/products/${p.id}`,
              icon: Package,
              category: "products",
            });
          }
        }
      } catch {
        /* ignore */
      }

      setSearchResults(items);
      setSearching(false);
    },
    []
  );

  // Debounced dynamic search
  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => searchDynamic(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchDynamic]);

  // Filter page items
  const filteredPages = query
    ? pageItems.filter(
        (item) =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          (item.description?.toLowerCase().includes(query.toLowerCase()))
      )
    : pageItems.slice(0, 8);

  const allResults = [...filteredPages, ...searchResults];

  function navigate(item: CommandItem) {
    setOpen(false);
    router.push(item.href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, allResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && allResults[selectedIndex]) {
      e.preventDefault();
      navigate(allResults[selectedIndex]);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-command-palette">
        {/* Search input */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, orders, products..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
          <kbd className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {allResults.length === 0 && query ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-gray-400">
                {searching ? "Searching..." : "No results found"}
              </p>
            </div>
          ) : (
            <>
              {/* Page results */}
              {filteredPages.length > 0 && (
                <div>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                    Pages
                  </p>
                  {filteredPages.map((item, i) => {
                    const Icon = item.icon;
                    const globalIndex = i;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                          selectedIndex === globalIndex
                            ? "bg-[#10B981]/5 text-[#111111]"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-gray-400 truncate">{item.description}</p>
                          )}
                        </div>
                        {selectedIndex === globalIndex && (
                          <ArrowRight className="h-3.5 w-3.5 text-[#10B981]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Dynamic search results */}
              {searchResults.length > 0 && (
                <div>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400 mt-1">
                    Search Results
                  </p>
                  {searchResults.map((item, i) => {
                    const Icon = item.icon;
                    const globalIndex = filteredPages.length + i;
                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                          selectedIndex === globalIndex
                            ? "bg-[#10B981]/5 text-[#111111]"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 text-gray-400" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.label}</p>
                          {item.description && (
                            <p className="text-xs text-gray-400 truncate">{item.description}</p>
                          )}
                        </div>
                        {selectedIndex === globalIndex && (
                          <ArrowRight className="h-3.5 w-3.5 text-[#10B981]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 border-t border-gray-100 px-4 py-2 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-gray-100 px-1 py-0.5 font-medium">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-gray-100 px-1 py-0.5 font-medium">↵</kbd> Open
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-gray-100 px-1 py-0.5 font-medium">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
}
