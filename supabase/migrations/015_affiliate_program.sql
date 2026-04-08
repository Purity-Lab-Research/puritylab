-- ============================================================
-- 015: Affiliate Program
-- ============================================================

-- Affiliate applications (public submission)
CREATE TABLE IF NOT EXISTS affiliate_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  website_url text,
  platform text,
  audience_size text,
  promotion_plan text,
  previous_experience boolean DEFAULT false,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Affiliates (approved partners with tracking)
CREATE TABLE IF NOT EXISTS affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  affiliate_code text UNIQUE NOT NULL,
  commission_rate_first numeric(5,2) NOT NULL DEFAULT 15.00,
  commission_rate_recurring numeric(5,2) NOT NULL DEFAULT 10.00,
  cookie_days integer NOT NULL DEFAULT 30,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'paused', 'suspended', 'terminated')),
  total_clicks integer NOT NULL DEFAULT 0,
  total_conversions integer NOT NULL DEFAULT 0,
  total_earnings numeric(10,2) NOT NULL DEFAULT 0,
  pending_balance numeric(10,2) NOT NULL DEFAULT 0,
  paid_balance numeric(10,2) NOT NULL DEFAULT 0,
  payment_method text CHECK (payment_method IN ('ach', 'paypal')),
  payment_email text,
  bank_name text,
  bank_routing text,
  bank_account_last4 text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_affiliates_code ON affiliates(affiliate_code);

-- Affiliate clicks
CREATE TABLE IF NOT EXISTS affiliate_clicks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  referrer_url text,
  landing_page text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_clicks_affiliate ON affiliate_clicks(affiliate_id);
CREATE INDEX idx_affiliate_clicks_created ON affiliate_clicks(created_at);

-- Affiliate conversions
CREATE TABLE IF NOT EXISTS affiliate_conversions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  order_total numeric(10,2) NOT NULL,
  commission_rate numeric(5,2) NOT NULL,
  commission_amount numeric(10,2) NOT NULL,
  is_first_order boolean NOT NULL DEFAULT true,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'paid', 'reversed')),
  approved_at timestamptz,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_conversions_affiliate ON affiliate_conversions(affiliate_id);
CREATE INDEX idx_affiliate_conversions_order ON affiliate_conversions(order_id);

-- Affiliate payouts
CREATE TABLE IF NOT EXISTS affiliate_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id uuid NOT NULL REFERENCES affiliates(id) ON DELETE CASCADE,
  amount numeric(10,2) NOT NULL,
  payment_method text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  period_start date NOT NULL,
  period_end date NOT NULL,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliate_payouts_affiliate ON affiliate_payouts(affiliate_id);

-- Add affiliate columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_id uuid REFERENCES affiliates(id) ON DELETE SET NULL;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS affiliate_code text;

-- ============================================================
-- RLS Policies
-- ============================================================

ALTER TABLE affiliate_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- affiliate_applications: anyone can insert, users can see own, admins full
CREATE POLICY "Anyone can submit affiliate application"
  ON affiliate_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own applications"
  ON affiliate_applications FOR SELECT
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins full access to applications"
  ON affiliate_applications FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- affiliates: users can view own, admins full
CREATE POLICY "Affiliates can view own record"
  ON affiliates FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins full access to affiliates"
  ON affiliates FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- affiliate_clicks: service role inserts, affiliates see own, admins full
CREATE POLICY "Affiliates can view own clicks"
  ON affiliate_clicks FOR SELECT
  USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access to clicks"
  ON affiliate_clicks FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- affiliate_conversions: affiliates see own, admins full
CREATE POLICY "Affiliates can view own conversions"
  ON affiliate_conversions FOR SELECT
  USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access to conversions"
  ON affiliate_conversions FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- affiliate_payouts: affiliates see own, admins full
CREATE POLICY "Affiliates can view own payouts"
  ON affiliate_payouts FOR SELECT
  USING (
    affiliate_id IN (SELECT id FROM affiliates WHERE user_id = auth.uid())
  );

CREATE POLICY "Admins full access to payouts"
  ON affiliate_payouts FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
