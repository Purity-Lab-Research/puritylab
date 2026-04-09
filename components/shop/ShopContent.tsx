"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "@/components/shop/ProductCard";
import { trackSearch } from "@/lib/analytics";
import type { Product } from "@/lib/types";
import { SearchX } from "lucide-react";

type SortOption = "popular" | "price-asc" | "price-desc" | "newest";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Popular" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
];

const GOAL_FILTERS = [
  { value: "all", label: "All" },
  { value: "recovery", label: "Recovery" },
  { value: "fat_loss", label: "Fat Loss" },
  { value: "performance", label: "Performance" },
  { value: "supplies", label: "Supplies" },
];

const TYPE_FILTERS = [
  { value: "all", label: "All" },
  { value: "single", label: "Single Peptides" },
  { value: "blend", label: "Blends" },
  { value: "supplies", label: "Supplies" },
  { value: "exclusive", label: "Subscriber Exclusives" },
];

function getEffectivePrice(product: Product): number {
  if (product.variants && product.variants.length > 0) {
    return Math.min(...product.variants.map((v) => v.price));
  }
  return product.price;
}

interface ShopContentProps {
  products: Product[];
}

export default function ShopContent({ products }: ShopContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchQuery = searchParams.get("q")?.trim().toLowerCase() ?? "";
  const [goalFilter, setGoalFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (searchQuery) trackSearch(searchQuery);
  }, [searchQuery]);

  const clearAllFilters = useCallback(() => {
    setGoalFilter("all");
    setTypeFilter("all");
    setSortBy("popular");
    setPriceMin("");
    setPriceMax("");
    if (searchQuery) {
      router.replace("/shop", { scroll: false });
    }
  }, [searchQuery, router]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (goalFilter !== "all") count++;
    if (typeFilter !== "all") count++;
    if (sortBy !== "popular") count++;
    if (priceMin) count++;
    if (priceMax) count++;
    if (searchQuery) count++;
    return count;
  }, [goalFilter, typeFilter, sortBy, priceMin, priceMax, searchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.description?.toLowerCase().includes(searchQuery) ||
          p.short_description?.toLowerCase().includes(searchQuery)
      );
    }

    if (goalFilter !== "all") {
      filtered = filtered.filter((p) => p.goal_category === goalFilter);
    }

    if (typeFilter === "single") {
      filtered = filtered.filter(
        (p) =>
          !p.name.toLowerCase().includes("blend") &&
          !p.name.toLowerCase().includes("wolverine") &&
          p.goal_category !== "supplies"
      );
    } else if (typeFilter === "blend") {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes("blend") ||
          p.name.toLowerCase().includes("wolverine")
      );
    } else if (typeFilter === "supplies") {
      filtered = filtered.filter((p) => p.goal_category === "supplies");
    } else if (typeFilter === "exclusive") {
      filtered = filtered.filter((p) => p.subscription_only);
    }

    const min = priceMin ? parseFloat(priceMin) : null;
    const max = priceMax ? parseFloat(priceMax) : null;
    if (min !== null && !isNaN(min)) {
      filtered = filtered.filter((p) => getEffectivePrice(p) >= min);
    }
    if (max !== null && !isNaN(max)) {
      filtered = filtered.filter((p) => getEffectivePrice(p) <= max);
    }

    const sorted = [...filtered];
    switch (sortBy) {
      case "popular":
        sorted.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        break;
      case "price-asc":
        sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
        break;
      case "price-desc":
        sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
        break;
      case "newest":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return sorted;
  }, [products, searchQuery, goalFilter, typeFilter, priceMin, priceMax, sortBy]);

  function renderFilters() {
    return (
      <>
        {/* Goal */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
            Goal
          </h3>
          <div className="flex flex-wrap gap-2">
            {GOAL_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setGoalFilter(f.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  goalFilter === f.value
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Type */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
            Type
          </h3>
          <div className="flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  typeFilter === f.value
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
            Sort By
          </h3>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="w-full rounded-lg border border-[#F0F0F0] bg-white px-3 py-2.5 text-sm text-[#111111] focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 outline-none"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider mb-3">
            Price Range
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                min="0"
                className="w-full rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <span className="text-[#9CA3AF] text-xs">to</span>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                min="0"
                className="w-full rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm text-[#111111] placeholder:text-[#9CA3AF] focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>

        {/* Clear */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-[#6B7280] hover:text-[#EF4444] transition-colors"
          >
            Clear all filters ({activeFilterCount})
          </button>
        )}
      </>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Search Banner */}
      {searchQuery && (
        <div className="mb-6 flex items-center justify-between rounded-xl bg-[#10B981]/5 border border-[#10B981]/20 px-4 py-3">
          <p className="text-sm text-[#6B7280]">
            Results for{" "}
            <span className="font-semibold text-[#111111]">
              &quot;{searchQuery}&quot;
            </span>
            <span className="ml-1 text-[#6B7280]">
              ({filteredProducts.length} found)
            </span>
          </p>
          <button
            onClick={() => router.replace("/shop", { scroll: false })}
            className="text-xs font-medium text-[#6B7280] hover:text-[#EF4444] transition-colors"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <div className="sticky top-24">{renderFilters()}</div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter toggle + results count */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="inline-flex items-center gap-2 border border-[#F0F0F0] rounded-full px-4 py-2 text-sm font-medium text-[#111111] hover:border-[#111111] transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-[#111111] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <span className="text-sm text-[#6B7280]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Desktop results count */}
          <div className="hidden lg:flex items-center justify-between mb-6">
            <span className="text-sm text-[#6B7280]">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[#FAFAFA] flex items-center justify-center mx-auto mb-4">
                <SearchX className="h-7 w-7 text-[#9CA3AF]" />
              </div>
              <p className="text-[#111111] font-semibold mb-1">
                No products match your filters
              </p>
              <p className="text-sm text-[#6B7280] mb-4">
                Try adjusting your selection.
              </p>
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#111111] font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          mobileFiltersOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileFiltersOpen(false)}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[300px] bg-white p-6 overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out ${
            mobileFiltersOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#111111]">
              Filters
            </h2>
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#FAFAFA] transition-colors"
              aria-label="Close filters"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          {renderFilters()}
        </div>
      </div>
    </section>
  );
}
