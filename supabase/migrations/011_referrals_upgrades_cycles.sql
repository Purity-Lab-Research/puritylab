-- ============================================================
-- Feature 4: Referral credits
-- Feature 5: Stack upgrade prompts (no schema changes needed)
-- Feature 6: Subscription-only products
-- Feature 7: Cycle management premium
-- ============================================================

-- 1. Referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'credited')),
  credit_amount numeric(10,2) DEFAULT 20.00,
  referred_discount_percent integer DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals (referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals (referral_code);

ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'Users read own referrals') THEN
    CREATE POLICY "Users read own referrals" ON referrals FOR SELECT
      USING (referrer_user_id = auth.uid() OR referred_user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referrals' AND policyname = 'Admin manage referrals') THEN
    CREATE POLICY "Admin manage referrals" ON referrals FOR ALL
      USING (public.is_admin());
  END IF;
END $$;

-- 2. Add referral fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
  ADD COLUMN IF NOT EXISTS referral_credits_balance numeric(10,2) DEFAULT 0;

-- 3. Add subscription_only to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subscription_only boolean DEFAULT false;

-- 4. Add cycle management to subscriptions
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS cycle_management boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS cycle_management_fee numeric(10,2) DEFAULT 14.99,
  ADD COLUMN IF NOT EXISTS cycle_phase text DEFAULT 'active' CHECK (cycle_phase IN ('loading', 'active', 'taper', 'off')),
  ADD COLUMN IF NOT EXISTS cycle_week integer DEFAULT 1;
