"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { cn, formatPrice } from "@/lib/utils";
import { MAX_QUANTITY } from "@/lib/constants";
import { useCart } from "@/hooks/useCart";
import { getCoaUrl } from "@/lib/coa-url";
import ImageZoom from "@/components/shop/ImageZoom";
import ShareButtons from "@/components/shop/ShareButtons";
import BackInStockForm from "@/components/shop/BackInStockForm";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import type { Product, CoaDocument } from "@/lib/types";

interface ProductDetailProps {
  product: Product;
  coaDocuments?: CoaDocument[];
  relatedProducts?: Product[];
}

/* ─── Icons ─── */
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

function ShieldIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
  );
}

function FlaskIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /></svg>
  );
}

function TruckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-secondary"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
  );
}

function getStockStatus(qty: number, threshold: number) {
  if (qty <= 0) return { label: "Out of Stock", color: "text-error" };
  if (qty <= threshold) return { label: "Low Stock", color: "text-warning" };
  return { label: "In Stock", color: "text-success" };
}

type TabId = "overview" | "dosing" | "stacking" | "coa" | "reviews";

export default function ProductDetail({ product, coaDocuments = [], relatedProducts = [] }: ProductDetailProps) {
  const { addItem, openCart } = useCart();
  const { addViewed } = useRecentlyViewed();
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [purchaseMode, setPurchaseMode] = useState<"subscribe" | "one-time">("subscribe");
  const [deliveryWeeks, setDeliveryWeeks] = useState(4);
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [mobileAccordion, setMobileAccordion] = useState<TabId | null>(null);

  useEffect(() => {
    addViewed(product.id);
  }, [product.id, addViewed]);

  // Variants
  const variants = (product.variants?.filter((v) => v.active) ?? []).sort((a, b) => a.sort_order - b.sort_order);
  const hasVariants = variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    hasVariants ? variants[0].id : null
  );
  const selectedVariant = hasVariants
    ? variants.find((v) => v.id === selectedVariantId) ?? variants[0]
    : null;

  const variantImages = selectedVariant?.images?.length ? selectedVariant.images : null;
  const images = variantImages ?? (product.images?.length ? product.images : []);
  const hasImages = images.length > 0;

  const activeStock = selectedVariant?.stock_quantity ?? product.stock_quantity;
  const activeLowThreshold = selectedVariant?.low_stock_threshold ?? product.low_stock_threshold;
  const stockStatus = getStockStatus(activeStock, activeLowThreshold);
  const isOutOfStock = activeStock <= 0;

  const regularPrice = selectedVariant?.price ?? product.price;
  const originalPrice = selectedVariant?.original_price ?? product.original_price;
  const subPrice = selectedVariant?.subscription_price ?? product.subscription_price;
  const shortDesc = product.short_description;
  const displaySize = selectedVariant?.size ?? product.size;

  const displayPrice = purchaseMode === "subscribe" && subPrice ? subPrice : regularPrice;
  const savings = subPrice ? regularPrice - subPrice : 0;

  // Product detail fields
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
      subscriptionPrice: subPrice,
      size: displaySize,
      image: hasImages ? images[0] : null,
      purchaseType: purchaseMode === "subscribe" ? "subscription" : "one-time",
      deliveryFrequencyWeeks: deliveryWeeks,
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

  /* ─── Tab content renderers ─── */
  function renderOverview() {
    return (
      <div className="space-y-4">
        {product.description && (
          <div
            className="prose prose-sm max-w-none text-text-secondary prose-headings:text-primary prose-a:text-secondary"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }}
          />
        )}
        {product.research_description && (
          <div className="rounded-xl border border-secondary/20 bg-secondary/5 p-5 mt-4">
            <h4 className="font-heading text-sm font-bold text-primary mb-2">Research Description</h4>
            <div
              className="prose prose-sm max-w-none text-text-secondary prose-headings:text-primary prose-a:text-secondary"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.research_description) }}
            />
          </div>
        )}
      </div>
    );
  }

  function renderDosing() {
    if (!hasDosing) {
      return <p className="text-sm text-text-secondary">Dosing information coming soon.</p>;
    }
    return (
      <div className="space-y-5">
        {dosageInfo && (
          <div>
            <h4 className="font-heading text-sm font-bold text-primary mb-1">Recommended Dosage</h4>
            <p className="text-sm text-text-secondary">{dosageInfo}</p>
          </div>
        )}
        {cycleLength && (
          <div>
            <h4 className="font-heading text-sm font-bold text-primary mb-1">Cycle Length</h4>
            <p className="text-sm text-text-secondary">{cycleLength}</p>
          </div>
        )}
        {reconstitutionInfo && (
          <div>
            <h4 className="font-heading text-sm font-bold text-primary mb-1">Reconstitution</h4>
            <p className="text-sm text-text-secondary">{reconstitutionInfo}</p>
          </div>
        )}
        {storageInfo && (
          <div>
            <h4 className="font-heading text-sm font-bold text-primary mb-1">Storage</h4>
            <p className="text-sm text-text-secondary">{storageInfo}</p>
          </div>
        )}
      </div>
    );
  }

  function renderStacking() {
    const stackProducts = relatedProducts.length > 0 ? relatedProducts.slice(0, 4) : [];
    if (stackProducts.length === 0) {
      return <p className="text-sm text-text-secondary">Stacking suggestions coming soon.</p>;
    }
    return (
      <div>
        <h4 className="font-heading text-sm font-bold text-primary mb-4">Pairs well with</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {stackProducts.map((rp) => (
            <Link
              key={rp.id}
              href={`/shop/${rp.slug}`}
              className="flex items-center gap-3 border border-border rounded-lg p-3 hover:border-secondary transition-colors"
            >
              {rp.images?.[0] ? (
                <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-white border border-border">
                  <Image src={rp.images[0]} alt={rp.name} fill className="object-contain p-0.5" sizes="48px" />
                </div>
              ) : (
                <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-background border border-border" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-primary truncate">{rp.name}</p>
                <p className="text-xs text-text-secondary">{formatPrice(rp.price)}</p>
              </div>
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
          <p className="text-sm text-text-secondary mb-2">
            Certificate of Analysis will be available once the first batch is tested.
          </p>
          <Link href="/coa" className="text-sm text-secondary font-semibold hover:underline">
            Browse CoA Library
          </Link>
        </div>
      );
    }
    const latest = coaDocuments[0];
    return (
      <div>
        <div className="flex items-center gap-4 mb-4">
          <span className={`font-heading text-4xl font-extrabold ${latest.purity_percentage >= 98 ? "text-success" : "text-warning"}`}>
            {latest.purity_percentage}%
          </span>
          <div>
            <p className="text-xs text-text-secondary uppercase tracking-wider">Verified Purity</p>
            <p className="font-mono text-xs text-text-secondary">{latest.batch_number}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm text-text-secondary border-t border-border pt-3">
          {latest.test_date && (
            <p>Tested: {new Date(latest.test_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
          )}
          <p>Methodology: HPLC Purity Analysis + Mass Spectrometry ID</p>
        </div>
        {latest.pdf_url && (
          <a
            href={getCoaUrl(latest.pdf_url)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-secondary font-semibold text-sm hover:underline"
          >
            Download Full CoA
          </a>
        )}
        {coaDocuments.length > 1 && (
          <div className="mt-4 border-t border-border pt-3">
            <p className="text-xs text-text-secondary mb-2">Previous batches:</p>
            {coaDocuments.slice(1).map((coa) => (
              <div key={coa.id} className="flex items-center justify-between text-xs py-1">
                <span className="font-mono text-text-secondary">{coa.batch_number}</span>
                <span className={`font-semibold ${coa.purity_percentage >= 98 ? "text-success" : "text-warning"}`}>
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
    reviews: () => null, // Reviews rendered externally
  };

  return (
    <div>
      {/* Back to shop */}
      <Link
        href="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-secondary mb-6 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>
        Back to All Products
      </Link>

      {/* ─── Top Section ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
        {/* LEFT - Gallery */}
        <div>
          {hasImages ? (
            <div className="relative" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <ImageZoom src={images[mainImage]} alt={product.name} priority />
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === mainImage ? "w-4 bg-primary" : "w-1.5 bg-border"}`} />
                  ))}
                </div>
              )}
              {product.badge && (
                <span className="absolute left-3 top-3 z-10 bg-secondary text-white text-[10px] font-bold px-2.5 py-1 rounded pointer-events-none">
                  {product.badge}
                </span>
              )}
            </div>
          ) : (
            <div className="aspect-square w-full rounded-xl bg-surface border border-border flex items-center justify-center text-text-secondary text-sm">
              No image available
            </div>
          )}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={cn(
                    "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition",
                    mainImage === i ? "border-primary ring-1 ring-primary/20" : "border-transparent hover:border-border"
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
          <h1 className="font-heading text-2xl font-bold text-primary">{product.name}</h1>
          <p className="text-sm text-text-secondary mt-1">{displaySize}</p>
          {shortDesc && <p className="text-base text-text-secondary mt-2">{shortDesc}</p>}

          {/* Stock + Purity */}
          <div className="flex items-center gap-3 mt-3">
            <span className={`text-xs font-semibold ${stockStatus.color}`}>{stockStatus.label}</span>
            {product.purity && (
              <span className="text-xs text-text-secondary">{product.purity} Purity</span>
            )}
          </div>

          {/* Variant Selector */}
          {hasVariants && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Size</p>
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
                        "rounded-lg border-2 px-4 py-2.5 text-sm font-semibold transition-all",
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : oos
                            ? "border-border bg-background text-text-secondary/40 cursor-not-allowed line-through"
                            : "border-border text-text-primary hover:border-secondary"
                      )}
                    >
                      {v.size} <span className="ml-1 text-xs font-normal">{formatPrice(v.price)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pricing Toggle */}
          <div className="mt-6">
            <div className="flex rounded-lg overflow-hidden border border-border">
              <button
                onClick={() => setPurchaseMode("subscribe")}
                className={cn(
                  "flex-1 px-5 py-3 text-sm font-semibold transition-colors",
                  purchaseMode === "subscribe"
                    ? "bg-primary text-white"
                    : "bg-background text-text-secondary hover:text-text-primary"
                )}
              >
                Subscribe &amp; Save
              </button>
              <button
                onClick={() => setPurchaseMode("one-time")}
                className={cn(
                  "flex-1 px-5 py-3 text-sm font-semibold transition-colors border-l border-border",
                  purchaseMode === "one-time"
                    ? "bg-primary text-white"
                    : "bg-background text-text-secondary hover:text-text-primary"
                )}
              >
                One-time Purchase
              </button>
            </div>

            <div className="mt-4">
              <span className="font-heading text-3xl font-extrabold text-primary">
                {formatPrice(displayPrice)}
              </span>

              {purchaseMode === "subscribe" && subPrice ? (
                <div className="mt-2 space-y-3">
                  {savings > 0 && (
                    <p className="text-sm text-success font-semibold">
                      Save {formatPrice(savings)} per order
                    </p>
                  )}
                  <div>
                    <label className="text-xs text-text-secondary block mb-1">Deliver every</label>
                    <select
                      value={deliveryWeeks}
                      onChange={(e) => setDeliveryWeeks(Number(e.target.value))}
                      className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-secondary focus:ring-1 focus:ring-secondary/20 outline-none"
                    >
                      <option value={4}>4 weeks</option>
                      <option value={6}>6 weeks</option>
                      <option value={8}>8 weeks</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    {["Free shipping on subscriptions", "Pause or cancel anytime", "Full CoA with every shipment"].map((b) => (
                      <div key={b} className="flex items-center gap-2 text-xs text-text-secondary">
                        <CheckIcon className="text-success flex-shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                originalPrice && originalPrice > regularPrice && (
                  <span className="ml-2 text-lg text-text-secondary line-through">
                    {formatPrice(originalPrice)}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5 flex items-center gap-3">
            <span className="text-sm font-medium text-text-primary">Qty</span>
            <div className="flex items-center rounded-lg border border-border">
              <button onClick={decrementQty} disabled={quantity <= 1} className="flex h-10 w-10 items-center justify-center text-text-secondary hover:text-primary disabled:opacity-40 transition-colors" aria-label="Decrease">
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
                className="h-10 w-12 border-x border-border bg-transparent text-center text-sm font-medium text-text-primary outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                aria-label="Quantity"
              />
              <button onClick={incrementQty} disabled={quantity >= MAX_QUANTITY} className="flex h-10 w-10 items-center justify-center text-text-secondary hover:text-primary disabled:opacity-40 transition-colors" aria-label="Increase">
                <PlusIcon />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="mt-5 w-full bg-primary text-white rounded-xl py-4 text-base font-bold hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isOutOfStock
              ? "Out of Stock"
              : purchaseMode === "subscribe"
                ? "Subscribe & Save"
                : "Add to Cart"}
          </button>

          {isOutOfStock && <BackInStockForm productId={product.id} productName={product.name} />}

          {/* Trust Badges */}
          <div className="mt-5 flex items-center justify-center gap-6 py-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <ShieldIcon /> Third-Party Tested
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <FlaskIcon /> 98%+ Purity
            </div>
            <div className="flex items-center gap-1.5 text-xs text-text-secondary">
              <TruckIcon /> Same-Day Shipping
            </div>
          </div>

          <p className="mt-3 text-[10px] text-text-secondary text-center leading-tight">
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

      {/* ─── Tabs Section ─── */}
      <div className="mt-14">
        {/* Desktop Tabs */}
        <div className="hidden md:block">
          <div className="flex border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-5 py-3 font-heading text-sm font-semibold transition-colors",
                  activeTab === tab.id
                    ? "border-b-2 border-primary text-primary"
                    : "text-text-secondary hover:text-primary"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="py-8">
            {activeTab !== "reviews" && tabContent[activeTab]()}
          </div>
        </div>

        {/* Mobile Accordion */}
        <div className="md:hidden space-y-2">
          {TABS.filter((t) => t.id !== "reviews").map((tab) => (
            <div key={tab.id} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => toggleMobileAccordion(tab.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-heading text-sm font-semibold text-primary">{tab.label}</span>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className={`text-text-secondary transition-transform ${mobileAccordion === tab.id ? "rotate-180" : ""}`}
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
