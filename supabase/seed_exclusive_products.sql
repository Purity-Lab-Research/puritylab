-- Subscription-exclusive products
DO $$
DECLARE
  cat_blends uuid;
BEGIN
  SELECT id INTO cat_blends FROM categories WHERE slug = 'blends';

  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity, subscription_only)
  VALUES (
    'Performance Elite Blend',
    'performance-elite-blend',
    'Triple-compound performance stack combining CJC-1295, Ipamorelin, and MOTS-C in a single vial for maximum growth hormone and metabolic support.',
    'Triple-compound performance stack. Exclusive to subscribers.',
    cat_blends, 150.00, 127.50, '5/5/10mg', 'performance', 'tier_2', true, false, 100, true
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity, subscription_only)
  VALUES (
    'Total Recovery Blend',
    'total-recovery-blend',
    'Maximum recovery blend combining BPC-157, TB-500, and GHK-Cu for comprehensive tissue repair, joint recovery, and skin healing.',
    'Maximum recovery with tissue repair and skin healing. Exclusive to subscribers.',
    cat_blends, 180.00, 153.00, '10/10/25mg', 'recovery', 'tier_2', true, false, 100, true
  ) ON CONFLICT (slug) DO NOTHING;

  RAISE NOTICE 'Seed complete: 2 subscription-exclusive products.';
END $$;
