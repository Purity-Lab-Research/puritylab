"use client";

import Link from "next/link";
import type { Product } from "@/lib/types";
import ProductCard from "@/components/shop/ProductCard";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface FeaturedProductsProps {
  products: Product[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  const animRef = useScrollAnimation();

  if (products.length === 0) return null;

  return (
    <section className="bg-background py-20 border-t border-border">
      <div ref={animRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="font-heading text-4xl font-extrabold text-primary">
            Featured Products
          </h2>
          <p className="mt-3 text-text-secondary">
            Individual peptides for researchers who know exactly what they need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 text-secondary font-semibold hover:underline"
          >
            View All Products
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
