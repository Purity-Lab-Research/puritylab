"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Protocol } from "@/lib/types";
import { useCart } from "@/hooks/useCart";
import { getSubscriptionPrice } from "@/lib/utils";
import ScrollReveal from "@/components/ui/ScrollReveal";
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Truck,
  Clock,
  ChevronRight,
  Target,
  Calendar,
  Zap,
  CheckCircle2,
  Info,
  ArrowLeftRight,
  X,
} from "lucide-react";

/* ─── Types ─── */

interface SwapProduct {
  id: string;
  name: string;
  slug: string;
  size: string;
  price: number;
  subscription_price: number | null;
  short_description: string;
  images: string[];
  purity: string | null;
  goal_category: string | null;
  active: boolean;
}

interface ProtocolDetailContentProps {
  protocol: Protocol;
  otherProtocols: {
    id: string;
    name: string;
    slug: string;
    tagline: string;
    badge: string | null;
    accent_color: string;
  }[];
  swapProducts: SwapProduct[];
}

/* ─── Constants ─── */

const CARD_COLORS: Record<string, { gradient: string; light: string }> = {
  recovery: {
    gradient: "from-[#F0FDF4] to-[#DCFCE7]",
    light: "bg-[#F0FDF4]",
  },
  "fat-loss": {
    gradient: "from-[#FDF2F8] to-[#FCE7F3]",
    light: "bg-[#FDF2F8]",
  },
  performance: {
    gradient: "from-[#EFF6FF] to-[#DBEAFE]",
    light: "bg-[#EFF6FF]",
  },
  "full-recomp": {
    gradient: "from-[#F5F3FF] to-[#EDE9FE]",
    light: "bg-[#F5F3FF]",
  },
};

const BADGE_STYLES: Record<string, string> = {
  "MOST POPULAR": "bg-[#10B981] text-white",
  PREMIUM: "bg-[#111111] text-white",
};

const CATEGORY_LABELS: Record<string, string> = {
  recovery: "Recovery",
  fat_loss: "Weight Management",
  performance: "Performance",
};

/* ─── Protocol-specific content ─── */

interface ProtocolMeta {
  bestFor: string[];
  howItWorks: string[];
  highlights: { label: string; value: string }[];
}

const PROTOCOL_META: Record<string, ProtocolMeta> = {
  recovery: {
    bestFor: [
      "Soft tissue repair research",
      "Tendon and ligament studies",
      "Inflammation pathway investigation",
      "Angiogenesis and cell migration research",
    ],
    howItWorks: [
      "BPC-157 is a body protection compound studied for its role in tissue repair mechanisms, including angiogenesis (new blood vessel formation) at targeted sites. Published research documents its effects on tendons, ligaments, and mucosal tissue.",
      "TB-500 (Thymosin Beta-4) has been studied for its role in promoting cell migration and modulating inflammatory pathways. Research literature documents its effects on tissue flexibility and structural repair.",
      "The Wolverine Blend combines both compounds in a single vial for streamlined research protocols. Together, they are commonly studied for complementary tissue repair mechanisms.",
    ],
    highlights: [
      { label: "Research Focus", value: "Tissue repair mechanisms" },
      { label: "Compounds", value: "3 included" },
      { label: "Purity", value: "98%+ HPLC verified" },
      { label: "Shipping", value: "Free with subscription" },
    ],
  },
  "fat-loss": {
    bestFor: [
      "Metabolic pathway research",
      "Body composition studies",
      "Energy utilization mechanisms",
      "AMPK activation and lipid metabolism research",
    ],
    howItWorks: [
      "MOTS-C is a mitochondrial-derived peptide that activates AMPK, a key enzyme in cellular energy regulation. Published studies document its effects on metabolic flexibility and energy utilization pathways.",
      "AOD 9604 is a modified fragment (amino acids 177-191) of human growth hormone. It has been studied for its targeted effects on lipid metabolism without impacting blood sugar levels, insulin sensitivity, or IGF-1.",
      "The CJC-1295/Ipamorelin Blend is commonly studied alongside metabolic compounds in published literature. Research documents its role in sustained growth hormone release through two complementary pathways.",
    ],
    highlights: [
      { label: "Research Focus", value: "Metabolic pathways" },
      { label: "Compounds", value: "3 included" },
      { label: "Purity", value: "98%+ HPLC verified" },
      { label: "Shipping", value: "Free with subscription" },
    ],
  },
  performance: {
    bestFor: [
      "Growth hormone releasing pathway research",
      "GH secretagogue mechanism studies",
      "GHRH analog characterization",
      "Ghrelin receptor agonist research",
    ],
    howItWorks: [
      "CJC-1295 is a GHRH (growth hormone releasing hormone) analog that extends the half-life of endogenous GH pulses. Combined with Ipamorelin, a selective ghrelin receptor agonist, it produces sustained GH elevation without the cortisol or prolactin spikes seen with other secretagogues.",
      "The standalone Ipamorelin vial provides additional concentration flexibility. Ipamorelin is one of the most selective GH-releasing peptides available, with a well-documented profile in research literature.",
      "Growth hormone pathway modulation has been linked in published research to connective tissue mechanisms, sleep architecture, and body composition changes in preclinical models.",
    ],
    highlights: [
      { label: "Research Focus", value: "GH pathway modulation" },
      { label: "Compounds", value: "2 included" },
      { label: "Purity", value: "98%+ HPLC verified" },
      { label: "Shipping", value: "Free with subscription" },
    ],
  },
  "full-recomp": {
    bestFor: [
      "Multi-pathway research configurations",
      "Tissue repair and metabolic studies combined",
      "Comprehensive peptide interaction research",
      "Researchers investigating multiple compound classes",
    ],
    howItWorks: [
      "BPC-157 and TB-500 are commonly studied together in published literature for their complementary tissue repair mechanisms. BPC-157 research focuses on angiogenesis while TB-500 research centers on cell migration and inflammatory modulation.",
      "CJC-1295/Ipamorelin is studied for sustained growth hormone pathway modulation. Published research documents its effects on GH release through two complementary receptor pathways.",
      "MOTS-C adds a metabolic research dimension by activating AMPK pathways. Published studies document its effects on cellular energy regulation and mitochondrial function.",
    ],
    highlights: [
      { label: "Research Focus", value: "Multi-pathway study" },
      { label: "Compounds", value: "5+ included" },
      { label: "Purity", value: "98%+ HPLC verified" },
      { label: "Shipping", value: "Free with subscription" },
    ],
  },
};

function roundPrice(price: number): number {
  return Math.round(price);
}

/* ─── Component ─── */

export default function ProtocolDetailContent({
  protocol,
  otherProtocols,
  swapProducts,
}: ProtocolDetailContentProps) {
  const { addItem, openCart } = useCart();

  const colors = CARD_COLORS[protocol.slug] ?? {
    gradient: "from-[#F9FAFB] to-[#F3F4F6]",
    light: "bg-[#F9FAFB]",
  };

  const meta = PROTOCOL_META[protocol.slug];

  const originalItems = useMemo(
    () => (protocol.items ?? []).sort((a, b) => a.sort_order - b.sort_order),
    [protocol.items]
  );

  // Track swaps: maps original item id -> replacement product (or null if not swapped)
  const [swaps, setSwaps] = useState<Record<string, SwapProduct | null>>({});
  // Which item is currently showing the swap picker
  const [swappingItemId, setSwappingItemId] = useState<string | null>(null);

  // Build the effective items list with swaps applied
  const effectiveItems = useMemo(() => {
    return originalItems.map((item) => {
      const replacement = swaps[item.id];
      if (replacement) {
        return {
          ...item,
          product: {
            ...item.product!,
            id: replacement.id,
            name: replacement.name,
            slug: replacement.slug,
            size: replacement.size,
            price: replacement.price,
            subscription_price: replacement.subscription_price,
            short_description: replacement.short_description,
            images: replacement.images,
            purity: replacement.purity,
            goal_category: replacement.goal_category,
          },
        };
      }
      return item;
    });
  }, [originalItems, swaps]);

  const peptideItems = effectiveItems.filter(
    (i) => i.product?.goal_category !== "laboratory_supplies"
  );
  const supplyItems = effectiveItems.filter(
    (i) => i.product?.goal_category === "laboratory_supplies"
  );

  // Dynamic pricing
  const oneTimeTotal = effectiveItems.reduce(
    (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0
  );
  const subTotal = effectiveItems.reduce(
    (sum, item) =>
      sum + getSubscriptionPrice(item.product?.price ?? 0) * item.quantity,
    0
  );
  const displaySub = roundPrice(subTotal);
  const displayOneTime = roundPrice(oneTimeTotal);
  const savingsPercent = roundPrice(
    displayOneTime - displaySub > 0
      ? ((displayOneTime - displaySub) / displayOneTime) * 100
      : 15
  );

  const hasSwaps = Object.values(swaps).some((v) => v !== null);

  // Products available for swap (exclude ones already in the current build)
  const currentProductIds = new Set(
    effectiveItems.map((i) => i.product?.id).filter(Boolean)
  );

  // Group swap products by category
  const swapProductsByCategory = useMemo(() => {
    const groups: Record<string, SwapProduct[]> = {};
    for (const p of swapProducts) {
      if (currentProductIds.has(p.id)) continue;
      const cat = p.goal_category ?? "other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    }
    return groups;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [swapProducts, swaps]);

  function handleSwap(itemId: string, product: SwapProduct) {
    setSwaps((prev) => ({ ...prev, [itemId]: product }));
    setSwappingItemId(null);
  }

  function handleResetSwap(itemId: string) {
    setSwaps((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  }

  function handleResetAll() {
    setSwaps({});
  }

  function addProtocolToCart(purchaseType: "one-time" | "subscription") {
    for (const item of effectiveItems) {
      if (!item.product) continue;
      addItem({
        productId: item.product.id,
        variantId: null,
        name: item.product.name,
        slug: item.product.slug,
        price: item.product.price,
        subscriptionPrice: getSubscriptionPrice(item.product.price),
        size: item.product.size,
        image: item.product.images?.[0] ?? null,
        quantity: item.quantity,
        purchaseType,
        deliveryFrequencyWeeks: purchaseType === "subscription" ? 4 : 0,
        billingCycle: "monthly",
      });
    }
    openCart();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ─── Page Header ─── */}
      <div className="bg-[#FAFAFA] border-b border-[#F0F0F0]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-24 pb-8">
          <nav className="flex items-center gap-1 text-sm text-[#6B7280] mb-3">
            <Link href="/" className="hover:text-[#111111] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]/40" />
            <Link
              href="/protocols"
              className="hover:text-[#111111] transition-colors"
            >
              Research Configurations
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-[#6B7280]/40" />
            <span className="text-[#111111]">{protocol.name}</span>
          </nav>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
              {protocol.name} Research Configuration
            </h1>
            {protocol.badge && (
              <span
                className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full ${
                  BADGE_STYLES[protocol.badge] ?? "bg-[#10B981] text-white"
                }`}
              >
                {protocol.badge}
              </span>
            )}
          </div>
          <p className="mt-2 max-w-2xl text-base text-[#6B7280]">
            {protocol.tagline}
          </p>
        </div>
      </div>

      {/* ─── Quick Stats Bar ─── */}
      {meta && (
        <div className="border-b border-[#F0F0F0]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#F0F0F0] py-5">
                {meta.highlights.map((h) => (
                  <div key={h.label} className="text-center px-4">
                    <p className="text-xs text-[#6B7280] mb-0.5">{h.label}</p>
                    <p className="text-sm font-bold text-[#111111]">
                      {h.value}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-14">
          {/* Left: Configuration Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Overview */}
            {protocol.description && (
              <ScrollReveal>
                <div>
                  <h2 className="text-xl font-bold text-[#111111] mb-4">
                    Overview
                  </h2>
                  <p className="text-base text-[#6B7280] leading-relaxed">
                    {protocol.description}
                  </p>
                </div>
              </ScrollReveal>
            )}

            {/* Best For */}
            {meta && (
              <ScrollReveal>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-[#111111]" />
                    <h2 className="text-xl font-bold text-[#111111]">
                      Research Applications
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {meta.bestFor.map((item) => (
                      <div
                        key={item}
                        className="flex items-start gap-3 bg-[#FAFAFA] rounded-xl p-4"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[#111111]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* How It Works */}
            {meta && (
              <ScrollReveal>
                <div>
                  <div className="flex items-center gap-2 mb-5">
                    <Zap className="w-5 h-5 text-[#111111]" />
                    <h2 className="text-xl font-bold text-[#111111]">
                      Published Research
                    </h2>
                  </div>
                  <div className="space-y-4">
                    {meta.howItWorks.map((paragraph, i) => (
                      <div
                        key={i}
                        className="flex gap-4 bg-[#FAFAFA] rounded-xl p-5"
                      >
                        <span className="text-2xl font-extrabold text-[#F0F0F0] leading-none flex-shrink-0 mt-0.5">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <p className="text-sm text-[#6B7280] leading-relaxed">
                          {paragraph}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* What's Included (with swap) */}
            <ScrollReveal>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-[#111111]" />
                    <h2 className="text-xl font-bold text-[#111111]">
                      What&apos;s Included
                    </h2>
                  </div>
                  {hasSwaps && (
                    <button
                      onClick={handleResetAll}
                      className="text-xs text-[#6B7280] hover:text-[#111111] transition-colors underline"
                    >
                      Reset to default
                    </button>
                  )}
                </div>

                {/* Peptide items */}
                <div className="space-y-4">
                  {peptideItems.map((item) => {
                    const product = item.product;
                    if (!product) return null;
                    const img = product.images?.[0];
                    const isSwapped = !!swaps[item.id];
                    const isPickerOpen = swappingItemId === item.id;

                    return (
                      <div key={item.id}>
                        <div
                          className={`bg-[#FAFAFA] rounded-xl p-5 transition-shadow ${
                            isSwapped
                              ? "ring-1 ring-[#10B981]/30"
                              : ""
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Product image */}
                            <div className="w-16 h-16 rounded-lg bg-white border border-[#F0F0F0] flex-shrink-0 overflow-hidden">
                              {img ? (
                                <Image
                                  src={img}
                                  alt={product.name}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <FlaskConical className="w-6 h-6 text-[#D1D5DB]" />
                                </div>
                              )}
                            </div>

                            {/* Product info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Link
                                    href={`/shop/${product.slug}`}
                                    className="text-sm font-bold text-[#111111] hover:underline truncate"
                                  >
                                    {product.name}
                                  </Link>
                                  {isSwapped && (
                                    <span className="text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 rounded-full px-2 py-0.5 flex-shrink-0">
                                      Swapped
                                    </span>
                                  )}
                                  {item.quantity > 1 && (
                                    <span className="text-xs text-[#6B7280] bg-white rounded-full px-2 py-0.5 border border-[#F0F0F0] flex-shrink-0">
                                      x{item.quantity}
                                    </span>
                                  )}
                                </div>
                                <span className="text-sm font-bold text-[#111111] flex-shrink-0">
                                  ${roundPrice(product.price)}
                                </span>
                              </div>
                              <p className="text-xs text-[#6B7280] mb-1">
                                {product.size}
                                {product.purity &&
                                  ` · ${product.purity} purity`}
                              </p>
                              {product.short_description && (
                                <p className="text-sm text-[#6B7280] leading-relaxed">
                                  {product.short_description}
                                </p>
                              )}

                              {/* Swap / Reset buttons */}
                              <div className="mt-3 flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    setSwappingItemId(
                                      isPickerOpen ? null : item.id
                                    )
                                  }
                                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#111111] transition-colors"
                                >
                                  <ArrowLeftRight className="w-3.5 h-3.5" />
                                  {isPickerOpen ? "Cancel" : "Swap"}
                                </button>
                                {isSwapped && (
                                  <button
                                    onClick={() => handleResetSwap(item.id)}
                                    className="inline-flex items-center gap-1 text-xs font-medium text-[#6B7280] hover:text-[#111111] transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                    Undo
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Swap picker */}
                        {isPickerOpen && (
                          <div className="mt-2 bg-white border border-[#F0F0F0] rounded-xl p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm font-bold text-[#111111]">
                                Choose a replacement
                              </p>
                              <button
                                onClick={() => setSwappingItemId(null)}
                                className="p-1 hover:bg-[#FAFAFA] rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4 text-[#6B7280]" />
                              </button>
                            </div>

                            <div className="max-h-72 overflow-y-auto space-y-4">
                              {Object.entries(swapProductsByCategory).map(
                                ([cat, products]) => (
                                  <div key={cat}>
                                    <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                                      {CATEGORY_LABELS[cat] ?? cat}
                                    </p>
                                    <div className="space-y-1.5">
                                      {products.map((sp) => {
                                        const spImg = sp.images?.[0];
                                        const priceDiff =
                                          sp.price - (product?.price ?? 0);

                                        return (
                                          <button
                                            key={sp.id}
                                            onClick={() =>
                                              handleSwap(item.id, sp)
                                            }
                                            className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-[#FAFAFA] transition-colors text-left"
                                          >
                                            <div className="w-10 h-10 rounded-lg bg-[#FAFAFA] border border-[#F0F0F0] flex-shrink-0 overflow-hidden">
                                              {spImg ? (
                                                <Image
                                                  src={spImg}
                                                  alt={sp.name}
                                                  width={40}
                                                  height={40}
                                                  className="w-full h-full object-cover"
                                                />
                                              ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                  <FlaskConical className="w-4 h-4 text-[#D1D5DB]" />
                                                </div>
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-sm font-semibold text-[#111111] truncate">
                                                {sp.name}
                                              </p>
                                              <p className="text-xs text-[#6B7280]">
                                                {sp.size}
                                                {sp.purity &&
                                                  ` · ${sp.purity}`}
                                              </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                              <p className="text-sm font-bold text-[#111111]">
                                                ${roundPrice(sp.price)}
                                              </p>
                                              {priceDiff !== 0 && (
                                                <p
                                                  className={`text-[10px] font-semibold ${
                                                    priceDiff > 0
                                                      ? "text-[#EF4444]"
                                                      : "text-[#10B981]"
                                                  }`}
                                                >
                                                  {priceDiff > 0 ? "+" : ""}$
                                                  {roundPrice(
                                                    Math.abs(priceDiff)
                                                  )}
                                                </p>
                                              )}
                                            </div>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )
                              )}

                              {Object.keys(swapProductsByCategory).length ===
                                0 && (
                                <p className="text-sm text-[#6B7280] text-center py-4">
                                  All available products are already in this
                                  configuration.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            </ScrollReveal>

            {/* Reorder Info */}
            <ScrollReveal>
              <div className="flex items-start gap-4 bg-gradient-to-br from-[#F0FDF4] via-[#EFF6FF] to-[#F5F3FF] rounded-xl p-5">
                <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 text-[#111111]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111111] mb-1">
                    Scheduled Reorder Available
                  </h3>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    Subscribe to receive your research compounds on a recurring
                    schedule. You can pause, skip, or cancel anytime from your
                    account. Every product ships with a published Certificate of
                    Analysis from an independent US lab.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Guarantees */}
            <ScrollReveal>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  {
                    icon: ShieldCheck,
                    label: "Third-Party Tested",
                    desc: "Independent US lab",
                    color: "text-[#10B981]",
                    bg: "bg-[#10B981]/10",
                  },
                  {
                    icon: FlaskConical,
                    label: "98%+ Purity",
                    desc: "HPLC verified",
                    color: "text-blue-500",
                    bg: "bg-blue-50",
                  },
                  {
                    icon: Truck,
                    label: "Cold Chain",
                    desc: "Temperature controlled",
                    color: "text-purple-500",
                    bg: "bg-purple-50",
                  },
                  {
                    icon: Clock,
                    label: "Same-Day",
                    desc: "Order processing",
                    color: "text-amber-500",
                    bg: "bg-amber-50",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex flex-col items-center text-center p-4 rounded-xl bg-[#FAFAFA]"
                  >
                    <div
                      className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center mb-2`}
                    >
                      <item.icon
                        className={`w-4 h-4 ${item.color}`}
                        strokeWidth={2}
                      />
                    </div>
                    <span className="text-xs font-semibold text-[#111111]">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-[#6B7280] mt-0.5">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* Right: Sticky Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-5">
              <ScrollReveal>
                <div className="rounded-2xl border border-[#F0F0F0] overflow-hidden">
                  {/* Colored top */}
                  <div
                    className={`bg-gradient-to-br ${colors.gradient} px-6 py-5`}
                  >
                    <h3 className="text-lg font-bold text-[#111111]">
                      {protocol.name} Configuration
                    </h3>
                    <p className="text-xs text-[#111111]/60 mt-0.5">
                      {peptideItems.length}{" "}
                      compound{peptideItems.length !== 1 ? "s" : ""} included
                    </p>
                    {hasSwaps && (
                      <p className="text-[10px] font-semibold text-[#10B981] mt-1">
                        Customized
                      </p>
                    )}
                  </div>

                  <div className="p-6 space-y-5">
                    {/* Subscription price */}
                    <div>
                      <p className="text-xs font-semibold text-[#10B981] uppercase tracking-wider mb-1">
                        Scheduled Reorder ({savingsPercent}% off)
                      </p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-4xl font-extrabold text-[#111111]">
                          ${displaySub}
                        </span>
                        <span className="text-sm text-[#6B7280]">/mo</span>
                      </div>
                      <p className="text-xs text-[#9CA3AF] line-through mt-0.5">
                        ${displayOneTime} one-time
                      </p>
                    </div>

                    {/* Items summary */}
                    <div className="space-y-1.5">
                      {peptideItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="text-[#10B981] flex-shrink-0"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span className="text-xs text-[#111111] truncate">
                              {item.product?.name ?? "Unknown"}
                              {item.quantity > 1 && ` (x${item.quantity})`}
                            </span>
                          </div>
                          <span className="text-xs text-[#6B7280] flex-shrink-0">
                            ${roundPrice(item.product?.price ?? 0)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Benefits */}
                    <div className="text-[10px] text-[#6B7280] space-y-1 border-t border-[#F0F0F0] pt-4">
                      <p>Free shipping on all subscriptions</p>
                      <p>Cancel or pause anytime</p>
                      <p>Full CoA published for every batch</p>
                    </div>

                    {/* Buttons */}
                    <div className="space-y-2">
                      <button
                        onClick={() => addProtocolToCart("subscription")}
                        className="block w-full bg-[#111111] text-white text-center rounded-full py-3 text-sm font-semibold hover:bg-black hover:scale-[1.01] transition-all"
                      >
                        Scheduled Reorder
                      </button>
                      <button
                        onClick={() => addProtocolToCart("one-time")}
                        className="block w-full text-[#6B7280] text-center text-xs font-medium hover:text-[#111111] transition-colors py-1.5"
                      >
                        or buy once for ${displayOneTime}
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollReveal>

              {/* Quick links */}
              <ScrollReveal delay={0.1}>
                <div className="rounded-xl border border-[#F0F0F0] p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="w-4 h-4 text-[#6B7280]" />
                    <span className="text-xs font-semibold text-[#111111]">
                      Learn More
                    </span>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/how-we-test"
                      className="flex items-center justify-between text-xs text-[#6B7280] hover:text-[#111111] transition-colors"
                    >
                      How We Test
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/coa"
                      className="flex items-center justify-between text-xs text-[#6B7280] hover:text-[#111111] transition-colors"
                    >
                      CoA Library
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/learn/how-to-reconstitute"
                      className="flex items-center justify-between text-xs text-[#6B7280] hover:text-[#111111] transition-colors"
                    >
                      Reconstitution Guide
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                    <Link
                      href="/faq"
                      className="flex items-center justify-between text-xs text-[#6B7280] hover:text-[#111111] transition-colors"
                    >
                      FAQ
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Other Protocols ─── */}
      {otherProtocols.length > 0 && (
        <section className="bg-[#FAFAFA] border-t border-[#F0F0F0] py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ScrollReveal className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111]">
                Other Research Configurations
              </h2>
              <p className="mt-2 text-[#6B7280]">
                Explore our other compound configurations commonly studied together in published literature.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {otherProtocols.map((other) => {
                const otherColors = CARD_COLORS[other.slug] ?? {
                  gradient: "from-[#F9FAFB] to-[#F3F4F6]",
                  light: "bg-[#F9FAFB]",
                };
                return (
                  <ScrollReveal key={other.id}>
                    <Link
                      href={`/protocols/${other.slug}`}
                      className="block bg-white rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-md transition-all duration-300"
                    >
                      <div
                        className={`bg-gradient-to-br ${otherColors.gradient} px-6 py-5`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-base font-bold text-[#111111]">
                            {other.name}
                          </h3>
                          {other.badge && (
                            <span
                              className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                BADGE_STYLES[other.badge] ??
                                "bg-[#10B981] text-white"
                              }`}
                            >
                              {other.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#111111]/60 mt-1">
                          {other.tagline}
                        </p>
                      </div>
                      <div className="px-6 py-4 flex items-center justify-between">
                        <span className="text-sm font-semibold text-[#111111]">
                          View Configuration
                        </span>
                        <ArrowRight className="w-4 h-4 text-[#111111]" />
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/protocols/build"
                className="inline-flex items-center gap-1.5 text-[#111111] font-semibold hover:underline"
              >
                Or build a custom configuration
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ─── Disclaimer ─── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-xs text-[#6B7280] max-w-3xl mx-auto text-center">
          All protocols represent common research configurations documented in
          published scientific literature. They do not constitute medical
          treatment plans, therapeutic recommendations, or dosing instructions
          for human use. All products are for in-vitro laboratory research only.
        </p>
      </div>
    </div>
  );
}
