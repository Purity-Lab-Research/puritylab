"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const variants = (product.variants?.filter((v) => v.active) ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const hasVariants = variants.length > 0;

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    hasVariants ? variants[0].id : null
  );

  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === selectedVariantId) ?? variants[0]
    : null;

  const activePrice = selectedVariant?.price ?? product.price;
  const activeOriginalPrice = selectedVariant?.original_price ?? product.original_price;
  const activeSize = selectedVariant?.size ?? product.size;

  // Use variant-specific image if available, otherwise product image
  const image =
    selectedVariant?.images?.length
      ? selectedVariant.images[0]
      : product.images?.[0] ?? null;

  const shortDesc = product.short_description;

  // Use variant-level subscription price if available, else product-level
  const activeSubPrice = selectedVariant?.subscription_price ?? product.subscription_price;
  const savingsPercent =
    activeSubPrice && activeSubPrice < activePrice
      ? Math.round(((activePrice - activeSubPrice) / activePrice) * 100)
      : null;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      slug: product.slug,
      price: activePrice,
      subscriptionPrice: activeSubPrice,
      size: activeSize,
      image,
      purchaseType: "one-time",
      deliveryFrequencyWeeks: 4,
    });
  }

  return (
    <div className="group bg-surface border border-border rounded-xl overflow-hidden flex flex-col transition-all hover:border-secondary hover:shadow-md">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative">
        <div className="relative aspect-[5/4] w-full overflow-hidden bg-white">
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-border">
              <ShoppingCart className="h-10 w-10" />
            </div>
          )}
          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-secondary text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {product.badge}
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-heading text-base font-bold text-primary leading-snug hover:text-secondary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-text-secondary mt-0.5">
          {activeSize}
          {product.category?.name && ` · ${product.category.name}`}
        </p>

        {shortDesc && (
          <p className="text-xs text-text-secondary mt-1 line-clamp-2">
            {shortDesc}
          </p>
        )}

        {/* Variant Selector */}
        {hasVariants && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {variants.map((v) => {
              const isSelected = v.id === selectedVariantId;
              const oos = v.stock_quantity <= 0;
              return (
                <button
                  key={v.id}
                  onClick={() => !oos && setSelectedVariantId(v.id)}
                  disabled={oos}
                  className={`rounded-md border px-2 py-1 text-[11px] font-semibold transition-all ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : oos
                        ? "border-border text-text-secondary/40 cursor-not-allowed line-through"
                        : "border-border text-text-secondary hover:border-secondary"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        )}

        {/* Pricing */}
        <div className="mt-3">
          {activeSubPrice ? (
            <>
              <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold block">
                Subscribe
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="font-heading text-lg font-bold text-primary">
                  {formatPrice(activeSubPrice)}
                </span>
                {savingsPercent && (
                  <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded">
                    Save {savingsPercent}%
                  </span>
                )}
              </div>
              <span className="text-sm text-text-secondary line-through">
                {formatPrice(activePrice)}
              </span>
            </>
          ) : (
            <>
              <span className="font-heading text-lg font-bold text-primary">
                {formatPrice(activePrice)}
              </span>
              {activeOriginalPrice && activeOriginalPrice > activePrice && (
                <span className="ml-2 text-sm text-text-secondary line-through">
                  {formatPrice(activeOriginalPrice)}
                </span>
              )}
            </>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={handleAddToCart}
          disabled={selectedVariant ? selectedVariant.stock_quantity <= 0 : product.stock_quantity <= 0}
          className="mt-3 w-full bg-primary text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(selectedVariant ? selectedVariant.stock_quantity <= 0 : product.stock_quantity <= 0)
            ? "Out of Stock"
            : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
