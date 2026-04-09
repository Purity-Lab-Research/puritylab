-- Performance indexes for frequently queried columns
-- These complement existing indexes found in prior migrations

-- Composite index: active products filtered by goal category (common shop filter)
CREATE INDEX IF NOT EXISTS idx_products_active_goal
  ON products (active, goal_category)
  WHERE active = true;

-- Composite index: active products sorted by sort_order (shop page default)
CREATE INDEX IF NOT EXISTS idx_products_active_sort
  ON products (active, sort_order)
  WHERE active = true;

-- Orders: affiliate_id for affiliate dashboard lookups
CREATE INDEX IF NOT EXISTS idx_orders_affiliate
  ON orders (affiliate_id)
  WHERE affiliate_id IS NOT NULL;

-- Orders: created_at for time-range analytics queries
CREATE INDEX IF NOT EXISTS idx_orders_created_at
  ON orders (created_at DESC);

-- Subscriptions: user_id + status composite for account page
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status
  ON subscriptions (user_id, status);

-- COA: product_id + batch_number for CoA lookups
CREATE INDEX IF NOT EXISTS idx_coa_product_batch
  ON coa (product_id, batch_number);

-- Affiliate clicks: created_at for time-range dashboard queries
-- (idx_affiliate_clicks_created already exists, but ensure descending order)
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_created_desc
  ON affiliate_clicks (created_at DESC);

-- Affiliate conversions: affiliate_id + status for payout calculations
CREATE INDEX IF NOT EXISTS idx_affiliate_conversions_affiliate_status
  ON affiliate_conversions (affiliate_id, status);

-- Profiles: referral_code for lookup during affiliate/referral click tracking
-- Only create if the column exists (added in a later migration)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'referral_code'
  ) THEN
    CREATE INDEX IF NOT EXISTS idx_profiles_referral_code
      ON profiles (referral_code)
      WHERE referral_code IS NOT NULL;
  END IF;
END $$;

-- Product reviews: product_id + approved for public review queries
CREATE INDEX IF NOT EXISTS idx_reviews_product_approved
  ON product_reviews (product_id, approved)
  WHERE approved = true;

-- Back in stock: product_id + notified for admin notification sends
CREATE INDEX IF NOT EXISTS idx_back_in_stock_product_notified
  ON back_in_stock_requests (product_id, notified)
  WHERE notified = false;

-- Discounts: code + active for validation lookups
CREATE INDEX IF NOT EXISTS idx_discounts_code_active
  ON discounts (code, active)
  WHERE active = true;
