export const SITE_NAME = "Purity Lab";
export const SITE_TAGLINE = "Research-Grade Peptides";
export const LEGAL_ENTITY_NAME = "Purity Lab Research LLC";
export const SITE_DESCRIPTION =
  "Purity Lab Research LLC. Research-grade compounds with six-panel independent testing and published Certificates of Analysis.";

export const CONTACT_EMAIL = "support@puritylabresearch.com";
export const ADMIN_NOTIFICATION_EMAIL = "puritylabresearch@gmail.com";
export const BUSINESS_ADDRESS = "Los Angeles, California";
export const BUSINESS_HOURS = "Mon-Fri: 9:00 AM - 5:00 PM EST";

export const SOCIAL_LINKS = {
  instagram: "https://instagram.com/puritylabresearch",
  tiktok: "https://www.tiktok.com/@puritylabresearch",
  youtube: "https://youtube.com/@puritylabresearch",
};

export const SHIPPING_INFO = {
  processing: "Processed within 1 business day",
  delivery: "3-8 business days",
  domesticOnly: true,
};

export const SHIPPING_COST = 15;
export const TAX_RATE = 0.13;
export const SUBSCRIPTION_DISCOUNTS: Record<number, number> = { 4: 0.15, 6: 0.10, 8: 0.05 };
export const AGE_REQUIREMENT = 18;
export const MAX_QUANTITY = 20;

export const PAYMENT_METHODS = ["Visa", "Mastercard", "Amex"];

export const CATEGORIES = [
  { name: "All", slug: "all" },
  { name: "Peptides", slug: "peptides" },
  { name: "Blends", slug: "blends" },
  { name: "Nasal Sprays", slug: "sprays" },
  { name: "Supplies", slug: "supplies" },
];

export const PROTOCOL_STACKS = [
  { name: "Tissue Research Configuration", slug: "recovery", description: "Compounds commonly studied together in tissue biology research" },
  { name: "Metabolic Research Configuration", slug: "fat-loss", description: "Compounds commonly studied together in metabolic signaling research" },
  { name: "Growth Hormone Research Configuration", slug: "performance", description: "Compounds commonly studied together in growth hormone pathway research" },
  { name: "Comprehensive Research Configuration", slug: "full-recomp", description: "A broad set of compounds referenced across multiple research domains" },
];
