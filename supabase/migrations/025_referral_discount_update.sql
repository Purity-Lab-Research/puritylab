-- ============================================================
-- Update referral system: percentage-based store credit instead of flat $20
-- Referrer gets 10% of referred order as store credit (capped $25)
-- Referred person gets 10% off first order
-- ============================================================

-- Change default credit_amount from $20 to 0 (will be set dynamically based on order)
ALTER TABLE referrals
  ALTER COLUMN credit_amount SET DEFAULT 0;

-- Update referred_discount_percent from 15 to 10
ALTER TABLE referrals
  ALTER COLUMN referred_discount_percent SET DEFAULT 10;

-- Add index for click deduplication queries (ip + code + time)
CREATE INDEX IF NOT EXISTS idx_referral_clicks_dedup
  ON referral_clicks (referral_code, ip_address, created_at DESC);

-- Add index for affiliate click deduplication
CREATE INDEX IF NOT EXISTS idx_affiliate_clicks_dedup
  ON affiliate_clicks (affiliate_id, ip_address, created_at DESC);
