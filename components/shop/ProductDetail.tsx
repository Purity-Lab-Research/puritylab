"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { cn, formatPrice, getSubscriptionPrice, getFrequencyDiscount, getAnnualPrice, getAnnualMonthlyPrice } from "@/lib/utils";
import { MAX_QUANTITY } from "@/lib/constants";
import { useCart } from "@/hooks/useCart";
import { getCoaUrl } from "@/lib/coa-url";
import ImageZoom from "@/components/shop/ImageZoom";
import ShareButtons from "@/components/shop/ShareButtons";
import BackInStockForm from "@/components/shop/BackInStockForm";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { trackViewItem } from "@/lib/analytics";
import type { Product, CoaDocument } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
  coaDocuments?: CoaDocument[];
  relatedProducts?: Product[];
}

/* Icons */
function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
  );
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
  );
}

const CATEGORY_GRADIENT: Record<string, string> = {
  recovery: "bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7]",
  fat_loss: "bg-gradient-to-br from-[#FDF2F8] to-[#FCE7F3]",
  performance: "bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE]",
  skin_healing: "bg-gradient-to-br from-[#F5F3FF] to-[#EDE9FE]",
  wellness: "bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7]",
  supplies: "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]",
};

function getStockStatus(qty: number, threshold: number) {
  if (qty <= 0) return { label: "Out of Stock", color: "text-[#EF4444]" };
  if (qty <= threshold) return { label: "Low Stock", color: "text-[#F59E0B]" };
  return { label: "In Stock", color: "text-[#10B981]" };
}

type TabId = "overview" | "dosing" | "stacking" | "coa" | "reviews";

export default function ProductDetail({ product, coaDocuments = [], relatedProducts = [] }: ProductDetailProps) {
  const { addItem, openCart } = useCart();
  const { addViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [purchaseMode, setPurchaseMode] = useState<"subscribe" | "one-time">("subscribe");
  const [deliveryWeeks, setDeliveryWeeks] = useState(4);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileAccordion, setMobileAccordion] = useState<TabId | null>(null);

  useEffect(() => {
    addViewed(product.id);
    trackViewItem({
      item_id: product.id,
      item_name: product.name,
      item_category: product.goal_category ?? product.category?.slug,
      price: product.price,
    });
  }, [product.id, product.name, product.price, product.goal_category, product.category?.slug, addViewed]);

  // Variants
  const variants = (product.variants?.filter((v) => v.active) ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const hasVariants = variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    hasVariants ? variants[0].id : null
  );
  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === selectedVariantId) ?? variants[0]
    : null;

  const mainImages = product.images?.length ? product.images : [];
  const variantImages = selectedVariant?.images?.length ? selectedVariant.images : [];
  // Always lead with main product images, then append any variant-specific images (deduplicated)
  const images = variantImages.length
    ? [...mainImages, ...variantImages.filter((vi) => !mainImages.includes(vi))]
    : mainImages;
  const hasImages = images.length > 0;

  const activeStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const activeLowThreshold = selectedVariant?.low_stock_threshold ?? product.low_stock_threshold;
  const stockStatus = getStockStatus(activeStock, activeLowThreshold);
  const isOutOfStock = activeStock <= 0;

  const regularPrice = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.original_price ?? product.original_price;
  const subPrice = getSubscriptionPrice(regularPrice, deliveryWeeks);
  const annualTotal = getAnnualPrice(regularPrice);
  const annualMonthly = getAnnualMonthlyPrice(regularPrice);
  const shortDesc = product.short_description;
  const displaySize = selectedVariant?.size ?? product.size;

  const displayPrice = purchaseMode === "subscribe"
    ? (billingCycle === "annual" ? annualTotal : subPrice)
    : regularPrice;
  const savings = purchaseMode === "subscribe"
    ? (billingCycle === "annual"
      ? (getSubscriptionPrice(regularPrice, 4) * 12 - annualTotal)
      : regularPrice - subPrice)
    : 0;

  const goalCat = product.goal_category ?? product.category?.slug ?? "";
  const placeholderBg = CATEGORY_GRADIENT[goalCat] ?? "bg-gradient-to-br from-[#F9FAFB] to-[#F3F4F6]";

  const dosageInfo = product.dosage_info || "";
  const cycleLength = product.cycle_length || "";
  const storageInfo = product.storage_info || "";
  const reconstitutionInfo = product.reconstitution_info || "";
  const hasDosing = dosageInfo || cycleLength || storageInfo || reconstitutionInfo;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? null,
      name: product.name,
      slug: product.slug,
      price: regularPrice,
      subscriptionPrice: purchaseMode === "subscribe" ? subPrice : null,
      size: displaySize,
      image: hasImages ? images[0] : null,
      purchaseType: purchaseMode === "subscribe" ? "subscription" : "one-time",
      deliveryFrequencyWeeks: billingCycle === "annual" ? 4 : deliveryWeeks,
      billingCycle: purchaseMode === "subscribe" ? billingCycle : "monthly",
      quantity,
    });
    openCart();
  };

  const incrementQty = () => setQuantity((q) => Math.min(q + 1, MAX_QUANTITY));
  const decrementQty = () => setQuantity((q) => Math.max(q - 1, 1));

  // Swipe support
  const touchStartX = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && mainImage < images.length - 1) setMainImage((i) => i + 1);
      else if (diff < 0 && mainImage > 0) setMainImage((i) => i - 1);
    }
  }, [mainImage, images.length]);

  function toggleMobileAccordion(tab: TabId) {
    setMobileAccordion(mobileAccordion === tab ? null : tab);
  }

  /* Tab content renderers */
  function renderOverview() {
    return (
      <div className="space-y-4">
        {product.description && (
          <div
            className="prose prose-sm max-w-none text-[#6B7280] leading-[1.8] prose-headings:text-[#111111] prose-a:text-[#10B981]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
          />
        )}
        {product.research_description && (
          <div className="rounded-2xl border border-[#10B981]/20 bg-[#10B981]/5 p-5 mt-4">
            <h4 className="text-sm font-bold text-[#111111] mb-2">Research Description</h4>
            <div
              className="prose prose-sm max-w-none text-[#6B7280] leading-[1.8] prose-headings:text-[#111111] prose-a:text-[#10B981]"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.research_description) }}
            />
          </div>
        )}
      </div>
    );
  }

  function renderDosing() {
    if (!hasDosing) {
      return <p className="text-sm text-[#6B7280]">Dosing information coming soon.</p>;
    }
    const sections = [
      { title: "Recommended Dosage", content: dosageInfo },
      { title: "Cycle Length", content: cycleLength },
      { title: "Reconstitution", content: reconstitutionInfo },
      { title: "Storage", content: storageInfo },
    ].filter((s) => s.content);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map((s) => (
          <div key={s.title} className="bg-[#FAFAFA] rounded-2xl p-5">
            <h4 className="text-sm font-bold text-[#111111] mb-1.5">{s.title}</h4>
            <p className="text-sm text-[#6B7280] leading-relaxed">{s.content}</p>
          </div>
        ))}
      </div>
    );
  }

  function renderStacking() {
    const stackProducts = relatedProducts.length > 0 ? relatedProducts.slice(0, 4) : [];
    if (stackProducts.length === 0) {
      return <p className="text-sm text-[#6B7280]">Stacking suggestions coming soon.</p>;
    }
    return (
      <div>
        <h4 className="text-sm font-bold text-[#111111] mb-4">Pairs well with</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stackProducts.map((rp) => (
            <Link
              key={rp.id}
              href={`/shop/${rp.slug}`}
              className="flex items-center gap-3 border border-[#F0F0F0] rounded-2xl p-3 hover:shadow-md transition-all"
            >
              {rp.images?.[0] ? (
                <div className="relative w-12 h-12 flex-shrink-0 rounded-xl overflow-hidden bg-[#FAFAFA] border border-[#F0F0F0]">
                  <Image src={rp.images[0]} alt={rp.name} fill className="object-contain p-0.5" sizes="48px" />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 rounded-xl bg-[#FAFAFA] border border-[#F0F0F0]" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#111111] truncate">{rp.name}</p>
                <p className="text-xs text-[#6B7280]">{formatPrice(rp.price)}</p>
              </div>
              <span className="text-xs font-semibold text-[#111111] bg-[#FAFAFA] rounded-full px-3 py-1.5 flex-shrink-0">
                View
              </span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  function renderCoa() {
    if (coaDocuments.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="text-sm text-[#6B7280] mb-2">
            Certificate of Analysis will be available once the first batch is tested.
          </p>
          <Link href="/coa" className="text-sm text-[#10B981] font-semibold hover:underline">
            Browse CoA Library
          </Link>
        </div>
      );
    }
    const latest = coaDocuments[0];
    return (
      <div>
        <div className="flex items-center gap-4 mb-4">
          <span className={`text-5xl font-extrabold ${latest.purity_percentage >= 98 ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
            {latest.purity_percentage}%
          </span>
          <div>
            <p className="text-xs text-[#6B7280] uppercase tracking-wider">Verified Purity</p>
            <p className="font-mono text-sm text-[#111111]">{latest.batch_number}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-[#6B7280] border-t border-[#F0F0F0] pt-3">
          {latest.test_date && (
            <p>Tested: {new Date(latest.test_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          )}
          <p>Methodology: HPLC Purity Analysis + Mass Spectrometry ID</p>
        </div>
        {latest.pdf_url ? (
          <a
            href={getCoaUrl(latest.pdf_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-[#10B981] font-semibold text-sm hover:underline"
          >
            Download Full CoA
          </a>
        ) : (
          <p className="mt-4 text-xs text-[#6B7280] italic">
            Full PDF report available soon
          </p>
        )}
        {coaDocuments.length > 1 && (
          <div className="mt-4 border-t border-[#F0F0F0] pt-3">
            <p className="text-xs text-[#6B7280] mb-2">Previous batches:</p>
            {coaDocuments.slice(1).map((coa) => (
              <div key={coa.id} className="flex items-center justify-between text-xs py-1">
                <span className="font-mono text-[#6B7280]">{coa.batch_number}</span>
                <span className={`font-semibold ${coa.purity_percentage >= 98 ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                  {coa.purity_percentage}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const TABS: { id: TabId; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "dosing", label: "Dosing Protocol" },
    { id: "stacking", label: "Stacking Suggestions" },
    { id: "coa", label: "Certificate of Analysis" },
    { id: "reviews", label: "Reviews" },
  ];

  const tabContent: Record<TabId, () => React.ReactNode> = {
    overview: renderOverview,
    dosing: renderDosing,
    stacking: renderStacking,
    coa: renderCoa,
    reviews: () => null,
  };

  return (
    <div>
      {/* Back to shop */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-6 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back to All Products
      </Link>

      {/* Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* LEFT - Gallery */}
        <div>
          {hasImages ? (
            <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <ImageZoom src={images[mainImage]} alt={product.name} priority />
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === mainImage ? "w-4 bg-[#111111]" : "w-1.5 bg-[#F0F0F0]"}`} />
                  ))}
                </div>
              )}
              {product.badge && (
                <span className="absolute left-3 top-3 z-10 bg-[#10B981] text-white text-[10px] font-bold px-2.5 py-1 rounded-full pointer-events-none">
                  {product.badge}
                </span>
              )}
            </div>
          ) : (
            /* Colored placeholder with vial icon */
            <div className={`aspect-square w-full rounded-2xl ${placeholderBg} flex flex-col items-center justify-center`}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-[#111111]/20 mb-3">
                <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
                <path d="M8.5 2h7" />
                <path d="M7 16h10" />
              </svg>
              <p className="text-sm font-semibold text-[#111111]/30">{product.name}</p>
            </div>
          )}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
                    mainImage === i ? "border-[#111111] ring-1 ring-[#111111]/20" : "border-transparent hover:border-[#F0F0F0]"
                  )}
                >
                  <Image src={img} alt={`${product.name} ${i + 1}`} fill className="object-contain p-1" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT - Product Info */}
        <div>
          <h1 className="text-3xl font-extrabold text-[#111111]">{product.name}</h1>
          <p className="text-base text-[#6B7280] mt-1">{displaySize}</p>
          {shortDesc && <p className="text-base text-[#6B7280] mt-2 leading-relaxed">{shortDesc}</p>}

          {/* Stock + Purity badges */}
          <div className="flex items-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1 text-xs font-semibold ${stockStatus.color} bg-[#10B981]/10 px-2.5 py-1 rounded-full`}>
              <CheckIcon className="text-[#10B981]" />
              {stockStatus.label}
            </span>
            {product.purity && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6B7280] bg-[#FAFAFA] px-2.5 py-1 rounded-full">
                98%+ Purity
              </span>
            )}
          </div>

          {/* Subscription-only banner */}
          {product.subscription_only && (
            <div className="mt-4 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-[#F59E0B]">
                This product is exclusive to subscribers. Subscribe to any frequency to access.
              </p>
            </div>
          )}

          {/* Variant Selector */}
          {hasVariants && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-[#111111] uppercase tracking-wider mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const oos = v.stock_quantity <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => !oos && setSelectedVariantId(v.id)}
                      disabled={oos}
                      className={cn(
                        "rounded-full border px-4 py-2.5 text-sm font-semibold transition-all",
                        isSelected
                          ? "bg-[#111111] text-white border-[#111111]"
                          : oos
                            ? "border-[#F0F0F0] bg-[#FAFAFA] text-[#9CA3AF] cursor-not-allowed line-through"
                            : "border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                      )}
                    >
                      {v.size} <span className="ml-1 text-xs font-normal opacity-70">{formatPrice(v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Toggle */}
          <div className="mt-6">
            {!product.subscription_only ? (
            <div className="flex gap-2">
              <button
                onClick={() => setPurchaseMode("subscribe")}
                className={cn(
                  "flex-1 px-5 py-3 text-sm font-semibold rounded-full transition-all",
                  purchaseMode === "subscribe"
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                )}
              >
                Subscribe &amp; Save
              </button>
              <button
                onClick={() => setPurchaseMode("one-time")}
                className={cn(
                  "flex-1 px-5 py-3 text-sm font-semibold rounded-full transition-all",
                  purchaseMode === "one-time"
                    ? "bg-[#111111] text-white"
                    : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                )}
              >
                One-time Purchase
              </button>
            </div>
            ) : (
              <p className="text-xs font-semibold text-[#F59E0B] mb-1">Subscription exclusive</p>
            )}

            <div className="mt-4">
              <span className="text-4xl font-extrabold text-[#111111]">
                {formatPrice(displayPrice)}
              </span>

              {purchaseMode === "subscribe" ? (
                <div className="mt-3 space-y-3">
                  {savings > 0 && (
                    <p className="text-sm text-[#10B981] font-semibold">
                      {billingCycle === "annual"
                        ? `Save ${formatPrice(savings)} vs monthly (2 months free)`
                        : `Save ${formatPrice(savings)} (${getFrequencyDiscount(deliveryWeeks)}% off)`}
                    </p>
                  )}

                  {/* Billing cycle toggle */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setBillingCycle("monthly")}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-semibold rounded-full transition-all",
                        billingCycle === "monthly"
                          ? "bg-[#111111] text-white"
                          : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                      )}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setBillingCycle("annual")}
                      className={cn(
                        "flex-1 px-3 py-2 text-xs font-semibold rounded-full transition-all",
                        billingCycle === "annual"
                          ? "bg-[#111111] text-white"
                          : "bg-white border border-[#F0F0F0] text-[#111111] hover:border-[#111111]"
                      )}
                    >
                      Annual (2 months free)
                    </button>
                  </div>

                  {billingCycle === "annual" ? (
                    <p className="text-xs text-[#6B7280]">
                      {formatPrice(annualTotal)}/year, ships every 4 weeks.
                      Effective: {formatPrice(annualMonthly)}/mo
                    </p>
                  ) : (
                    <div>
                      <label className="text-xs text-[#6B7280] block mb-1">Delivery frequency</label>
                      <select
                        value={deliveryWeeks}
                        onChange={(e) => setDeliveryWeeks(Number(e.target.value))}
                        className="rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-sm text-[#111111] focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 outline-none"
                      >
                        <option value={4}>Every 4 weeks (Save 15%)</option>
                        <option value={6}>Every 6 weeks (Save 10%)</option>
                        <option value={8}>Every 8 weeks (Save 5%)</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    {["Free shipping on subscriptions", "Pause or cancel anytime", "Full CoA with every shipment"].map((b) => (
                      <div key={b} className="flex items-center gap-2 text-sm text-[#6B7280]">
                        <CheckIcon className="text-[#10B981] flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                originalPrice && originalPrice > regularPrice && (
                  <span className="ml-2 text-lg text-[#9CA3AF] line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm font-medium text-[#111111]">Qty</span>
            <div className="flex items-center rounded-full border border-[#F0F0F0]">
              <button onClick={decrementQty} disabled={quantity <= 1} className="flex h-10 w-10 items-center justify-center text-[#6B7280] hover:text-[#111111] disabled:opacity-40 transition-colors" aria-label="Decrease">
                <MinusIcon />
              </button>
              <input
                type="number"
                min={1}
                max={MAX_QUANTITY}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  if (!isNaN(val)) setQuantity(Math.max(1, Math.min(val, MAX_QUANTITY)));
                }}
                className="h-10 w-12 border-x border-[#F0F0F0] bg-transparent text-center text-sm font-medium text-[#111111] outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Quantity"
              />
              <button onClick={incrementQty} disabled={quantity >= MAX_QUANTITY} className="flex h-10 w-10 items-center justify-center text-[#6B7280] hover:text-[#111111] disabled:opacity-40 transition-colors" aria-label="Increase">
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="mt-5 w-full bg-[#111111] text-white rounded-full py-4 text-lg font-bold hover:bg-black hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock
              ? "Out of Stock"
              : purchaseMode === "subscribe"
                ? "Subscribe & Save"
                : "Add to Cart"}
          </button>

          {isOutOfStock && <BackInStockForm productId={product.id} productName={product.name} />}

          {/* Trust Badges */}
          <div className="mt-5 flex items-center justify-center gap-5 py-3 border-t border-[#F0F0F0]">
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-[#10B981]"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
              Third-Party Tested
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-[#10B981]"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /></svg>
              98%+ Purity
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="text-[#10B981]"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
              Cold Chain Shipping
            </div>
          </div>

          <p className="mt-2 text-[10px] text-[#9CA3AF] text-center leading-tight">
            For research use only. Not for human consumption.
          </p>

          <div className="mt-3">
            <ShareButtons
              url={typeof window !== "undefined" ? window.location.href : `https://puritylabresearch.com/shop/${product.slug}`}
              title={product.name}
            />
          </div>
        </div>
      </div>

      {/* Research Use Disclaimer */}
      <div className="mt-10 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600 flex-shrink-0 mt-0.5">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" x2="12" y1="9" y2="13" />
          <line x1="12" x2="12.01" y1="17" y2="17" />
        </svg>
        <p className="text-[11px] text-amber-800 leading-relaxed">
          <strong>Research Use Only:</strong> This product is sold exclusively for in-vitro laboratory research and educational purposes. It is not intended for human or animal consumption by any route of administration. No information on this page constitutes medical advice or a recommendation for human use. Dosing, cycle, and protocol information is derived from published research literature and provided for educational context only. By purchasing this product, you confirm you are 21+ and will use it for lawful research purposes only.
        </p>
      </div>

      {/* Tabs Section */}
      <div className="mt-10">
        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <div className="flex gap-2 mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-2.5 rounded-full text-sm font-semibold transition-all",
                  activeTab === tab.id
                    ? "bg-[#111111] text-white"
                    : "text-[#6B7280] hover:text-[#111111] hover:bg-[#FAFAFA]"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="py-4">
            {activeTab !== "reviews" && tabContent[activeTab]()}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-2">
          {TABS.filter((t) => t.id !== "reviews").map((tab) => (
            <div key={tab.id} className="border border-[#F0F0F0] rounded-2xl overflow-hidden">
              <button
                onClick={() => toggleMobileAccordion(tab.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="text-sm font-semibold text-[#111111]">{tab.label}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-[#6B7280] transition-transform ${mobileAccordion === tab.id ? "rotate-180" : ""}`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              {mobileAccordion === tab.id && (
                <div className="px-5 pb-5">{tabContent[tab.id]()}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
