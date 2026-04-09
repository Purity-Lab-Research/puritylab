-- ============================================================
-- Track clicks on basic referral links (separate from affiliate clicks)
-- Also handle creating referral records on signup
-- ============================================================

-- 1. Referral clicks table
CREATE TABLE IF NOT EXISTS referral_clicks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  referral_code text NOT NULL,
  referrer_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ip_address text,
  user_agent text,
  landing_page text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referral_clicks_code ON referral_clicks (referral_code);
CREATE INDEX IF NOT EXISTS idx_referral_clicks_referrer ON referral_clicks (referrer_user_id);

ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referral_clicks' AND policyname = 'Users read own referral clicks') THEN
    CREATE POLICY "Users read own referral clicks" ON referral_clicks FOR SELECT
      USING (referrer_user_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'referral_clicks' AND policyname = 'Service role manage referral clicks') THEN
    CREATE POLICY "Service role manage referral clicks" ON referral_clicks FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

-- 2. Add referred_by_code to profiles so we know who referred a user
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referred_by_code text;
