"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice, getSubscriptionPrice } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { ShoppingCart, ArrowRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

const CATEGORY_GRADIENT: Record<string, string> = {
  recovery: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]",
  fat_loss: "bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]",
  performance: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]",
  skin_healing: "bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]",
  wellness: "bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]",
  supplies: "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]",
};

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
  const activeSize = selectedVariant?.size ?? product.size;

  const image =
    selectedVariant?.images?.length
      ? selectedVariant.images[0]
      : product.images?.[0] ?? null;

  const shortDesc = product.short_description;

  const activeSubPrice = getSubscriptionPrice(activePrice);
  const savingsPercent = Math.round(((activePrice - activeSubPrice) / activePrice) * 100);

  const goalCat = product.goal_category ?? product.category?.slug ?? "";
  const bgClass = CATEGORY_GRADIENT[goalCat] ?? "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]";

  function handleAddToCart() {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      slug: product.slug,
      price: activePrice,
      subscriptionPrice: activeSubPrice ?? null,
      size: activeSize,
      image,
      purchaseType: product.subscription_only ? "subscription" : "one-time",
      deliveryFrequencyWeeks: 4,
      billingCycle: "monthly",
    });
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="block relative">
        <div className={`relative aspect-[5/4] w-full overflow-hidden ${bgClass}`}>
          {image ? (
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain p-4"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-300">
              <ShoppingCart className="h-10 w-10" />
            </div>
          )}
          {/* Badge */}
          {product.subscription_only ? (
            <span className="absolute top-3 left-3 bg-[#F59E0B] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Subscribers Only
            </span>
          ) : product.badge ? (
            <span className="absolute top-3 left-3 bg-[#10B981] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              {product.badge}
            </span>
          ) : null}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-base font-bold text-[#111111] leading-snug hover:text-[#10B981] transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#6B7280] mt-0.5">
          {activeSize}
          {product.category?.name && ` · ${product.category.name}`}
        </p>

        {shortDesc && (
          <p className="text-xs text-[#6B7280] mt-1 line-clamp-2">
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
                  className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    isSelected
                      ? "border-[#111111] bg-[#111111]/5 text-[#111111]"
                      : oos
                        ? "border-[#F0F0F0] text-[#9CA3AF] cursor-not-allowed line-through"
                        : "border-[#F0F0F0] text-[#6B7280] hover:border-[#111111]"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
        )}

        {/* Pricing */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-[#111111]">
              From {formatPrice(activeSubPrice)}/mo
            </span>
            {savingsPercent > 0 && (
              <span className="bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold px-2 py-0.5 rounded-full">
                Save {savingsPercent}%
              </span>
            )}
          </div>
          <span className="text-sm text-[#9CA3AF] line-through">
            {formatPrice(activePrice)}
          </span>
        </div>

        {/* View button */}
        <Link
          href={`/shop/${product.slug}`}
          className="mt-3 w-full bg-[#111111] text-white rounded-full py-2.5 text-sm font-semibold hover:bg-black hover:scale-[1.01] transition-all text-center inline-flex items-center justify-center gap-2"
        >
          View
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
