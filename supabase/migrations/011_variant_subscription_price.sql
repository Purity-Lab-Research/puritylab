-- ============================================================
-- Add subscription_price to product_variants
-- ============================================================

ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS subscription_price numeric(10,2) DEFAULT NULL;
