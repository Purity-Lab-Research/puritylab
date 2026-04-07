-- ============================================================
-- Protocols, Stacks & Enhanced Subscriptions
-- Adds: protocols, protocol_items, subscription_items tables
--       + new columns on products and subscriptions
-- ============================================================

-- =============
-- 1. protocols
-- =============
CREATE TABLE protocols (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tagline text NOT NULL,
  description text DEFAULT '',
  cycle_length text NOT NULL,
  subscription_price numeric(10,2) NOT NULL,
  one_time_price numeric(10,2) NOT NULL,
  badge text,
  accent_color text DEFAULT '#0097A7',
  sort_order integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_protocols_active_sort ON protocols (active, sort_order);

-- updated_at trigger (reuses existing function)
CREATE TRIGGER protocols_updated_at
  BEFORE UPDATE ON protocols
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active protocols"
  ON protocols FOR SELECT
  USING (active = true);

CREATE POLICY "Admin manage protocols"
  ON protocols FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- =================
-- 2. protocol_items
-- =================
CREATE TABLE protocol_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  protocol_id uuid NOT NULL REFERENCES protocols(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer DEFAULT 1,
  sort_order integer DEFAULT 0,
  UNIQUE (protocol_id, product_id)
);

CREATE INDEX idx_protocol_items_protocol ON protocol_items (protocol_id, sort_order);

-- RLS
ALTER TABLE protocol_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read protocol items"
  ON protocol_items FOR SELECT
  USING (true);

CREATE POLICY "Admin manage protocol items"
  ON protocol_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- ================================
-- 3. New columns on products table
-- ================================
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS subscription_price numeric(10,2),
  ADD COLUMN IF NOT EXISTS short_description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS goal_category text,
  ADD COLUMN IF NOT EXISTS tier text DEFAULT 'tier_1',
  ADD COLUMN IF NOT EXISTS dosage_info text DEFAULT '',
  ADD COLUMN IF NOT EXISTS cycle_length text DEFAULT '',
  ADD COLUMN IF NOT EXISTS storage_info text DEFAULT '',
  ADD COLUMN IF NOT EXISTS reconstitution_info text DEFAULT '';

CREATE INDEX idx_products_goal_category ON products (goal_category) WHERE goal_category IS NOT NULL;
CREATE INDEX idx_products_tier ON products (tier);

-- ======================================
-- 4. New columns on subscriptions table
-- ======================================
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS protocol_id uuid REFERENCES protocols(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS delivery_frequency_weeks integer DEFAULT 4,
  ADD COLUMN IF NOT EXISTS next_delivery_date timestamptz,
  ADD COLUMN IF NOT EXISTS paused_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;

CREATE INDEX idx_subscriptions_protocol ON subscriptions (protocol_id) WHERE protocol_id IS NOT NULL;
CREATE INDEX idx_subscriptions_next_delivery ON subscriptions (next_delivery_date) WHERE status = 'active';

-- ======================
-- 5. subscription_items
-- ======================
CREATE TABLE subscription_items (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id uuid NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id uuid REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity integer DEFAULT 1,
  UNIQUE (subscription_id, product_id)
);

CREATE INDEX idx_subscription_items_sub ON subscription_items (subscription_id);

-- RLS
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own subscription items"
  ON subscription_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM subscriptions
      WHERE subscriptions.id = subscription_items.subscription_id
        AND subscriptions.user_id = auth.uid()
    )
  );

CREATE POLICY "Admin manage subscription items"
  ON subscription_items FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
