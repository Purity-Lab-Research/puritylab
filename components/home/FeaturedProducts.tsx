"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, getSubscriptionPrice } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { ShoppingCart, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface FeaturedProductsProps {
  products: Product[];
}

const CATEGORY_GRADIENT: Record<string, string> = {
  recovery: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]",
  fat_loss: "bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]",
  performance: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]",
  skin_healing: "bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]",
  wellness: "bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]",
  supplies: "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]",
};

const BADGE_MAP: Record<string, { text: string; className: string }> = {
  "bpc-157-5mg": { text: "Most Popular", className: "bg-[#10B981] text-white" },
  semaglutide: { text: "New", className: "bg-[#111111] text-white" },
  "retatrutide-glp3": { text: "New", className: "bg-[#111111] text-white" },
};

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const animRef = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (products.length === 0) return null;

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 270;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-12 sm:py-14">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#111111]">
              Featured Products
            </h2>
            <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#6B7280]">
              Individual peptides for researchers who know exactly what they need.
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => scroll("left")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#111111] text-white flex items-center justify-center hover:bg-black transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory scroll-smooth touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {products.map((product) => {
            const goalCat = product.goal_category ?? product.category?.slug ?? "";
            const bgClass = CATEGORY_GRADIENT[goalCat] ?? "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]";
            const image = product.images?.[0] ?? null;
            const subPrice = getSubscriptionPrice(product.price);
            const badge = BADGE_MAP[product.slug] ?? (product.badge ? { text: product.badge, className: "bg-[#10B981] text-white" } : null);

            return (
              <div
                key={product.id}
                className="group flex-shrink-0 w-[160px] sm:w-[220px] md:w-[250px] snap-start flex flex-col"
              >
                <Link href={`/shop/${product.slug}`} className="block flex-1 flex flex-col">
                  <div className={`${bgClass} rounded-2xl aspect-square flex items-center justify-center overflow-hidden mb-3 transition-shadow group-hover:shadow-md relative`}>
                    {badge && (
                      <span className={`absolute top-2 left-2 z-10 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${badge.className}`}>
                        {badge.text}
                      </span>
                    )}
                    {image ? (
                      <div className="relative w-full h-full p-4">
                        <Image
                          src={image}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="250px"
                        />
                      </div>
                    ) : (
                      <ShoppingCart className="h-10 w-10 text-gray-300" />
                    )}
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#111111] leading-snug group-hover:text-[#10B981] transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                    From {formatPrice(subPrice)}/mo
                  </p>
                  <p className="text-[10px] sm:text-xs text-[#10B981] font-medium mt-0.5 mb-3">
                    Free shipping on subscriptions
                  </p>
                </Link>
                <Link
                  href={`/shop/${product.slug}`}
                  className="mt-auto pt-3 w-full bg-[#111111] text-white rounded-full py-2.5 text-sm font-semibold hover:bg-black hover:scale-[1.01] transition-all text-center inline-flex items-center justify-center gap-1.5"
                >
                  View
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-[#111111] font-semibold text-sm"
          >
            View All Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
