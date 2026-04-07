-- ============================================================
-- Seed: Purity Lab Products & Protocols
-- Run AFTER migration 009_protocols_and_stacks.sql
-- Safe to re-run: uses ON CONFLICT DO NOTHING
-- ============================================================

DO $$
DECLARE
  cat_peptides uuid;
  cat_blends   uuid;
  cat_supplies uuid;

  -- product IDs
  pid_bpc157_5       uuid;
  pid_bpc157_10      uuid;
  pid_bpc157_20      uuid;
  pid_tb500_5        uuid;
  pid_tb500_10       uuid;
  pid_wolverine_5_5  uuid;
  pid_wolverine_10_10 uuid;
  pid_cjc_ipa        uuid;
  pid_ipamorelin     uuid;
  pid_motsc_10       uuid;
  pid_motsc_40       uuid;
  pid_aod9604        uuid;
  pid_bac_water      uuid;
  pid_recon_water    uuid;
  pid_syringes       uuid;

  -- protocol IDs
  proto_recovery     uuid;
  proto_fatloss      uuid;
  proto_performance  uuid;
  proto_recomp       uuid;
BEGIN
  -- Look up category IDs
  SELECT id INTO cat_peptides FROM categories WHERE slug = 'peptides';
  SELECT id INTO cat_blends   FROM categories WHERE slug = 'blends';
  SELECT id INTO cat_supplies FROM categories WHERE slug = 'supplies';

  -- =====================
  -- Insert products
  -- =====================

  -- BPC-157 5mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('BPC-157 5mg', 'bpc-157-5mg', '', 'Accelerates soft tissue repair and joint recovery', cat_peptides, 50.00, 45.00, '5mg', 'recovery', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_bpc157_5 FROM products WHERE slug = 'bpc-157-5mg';

  -- BPC-157 10mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('BPC-157 10mg', 'bpc-157-10mg', '', 'Enhanced dose for faster tissue and ligament healing', cat_peptides, 55.00, 49.50, '10mg', 'recovery', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_bpc157_10 FROM products WHERE slug = 'bpc-157-10mg';

  -- BPC-157 20mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('BPC-157 20mg', 'bpc-157-20mg', '', 'Maximum dose for serious injury recovery protocols', cat_peptides, 95.00, 85.50, '20mg', 'recovery', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_bpc157_20 FROM products WHERE slug = 'bpc-157-20mg';

  -- TB500 5mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('TB500 5mg', 'tb500-5mg', '', 'Promotes flexibility and reduces inflammation', cat_peptides, 65.00, 58.50, '5mg', 'recovery', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_tb500_5 FROM products WHERE slug = 'tb500-5mg';

  -- TB500 10mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('TB500 10mg', 'tb500-10mg', '', 'Full dose for accelerated tissue and muscle repair', cat_peptides, 95.00, 85.50, '10mg', 'recovery', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_tb500_10 FROM products WHERE slug = 'tb500-10mg';

  -- Wolverine Blend 5/5mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Wolverine Blend 5/5mg', 'wolverine-blend-5-5mg', '', 'BPC-157 and TB500 combined for complete recovery support', cat_blends, 85.00, 76.50, '5/5mg', 'recovery', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_wolverine_5_5 FROM products WHERE slug = 'wolverine-blend-5-5mg';

  -- Wolverine Blend 10/10mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Wolverine Blend 10/10mg', 'wolverine-blend-10-10mg', '', 'Full-strength recovery blend for athletes', cat_blends, 140.00, 126.00, '10/10mg', 'recovery', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_wolverine_10_10 FROM products WHERE slug = 'wolverine-blend-10-10mg';

  -- CJC-1295/Ipamorelin Blend 5/5mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('CJC-1295/Ipamorelin Blend 5/5mg', 'cjc-ipa-blend-5-5mg', '', 'Growth hormone support for recovery and body composition', cat_blends, 75.00, 67.50, '5/5mg', 'performance', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_cjc_ipa FROM products WHERE slug = 'cjc-ipa-blend-5-5mg';

  -- Ipamorelin 10mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Ipamorelin 10mg', 'ipamorelin-10mg', '', 'Clean growth hormone release without cortisol or prolactin spikes', cat_peptides, 55.00, 49.50, '10mg', 'performance', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_ipamorelin FROM products WHERE slug = 'ipamorelin-10mg';

  -- MOTS-C 10mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('MOTS-C 10mg', 'mots-c-10mg', '', 'Metabolic optimization and endurance enhancement', cat_peptides, 55.00, 49.50, '10mg', 'fat_loss', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_motsc_10 FROM products WHERE slug = 'mots-c-10mg';

  -- MOTS-C 40mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('MOTS-C 40mg', 'mots-c-40mg', '', 'Full dose metabolic peptide for fat loss and energy', cat_peptides, 130.00, 117.00, '40mg', 'fat_loss', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_motsc_40 FROM products WHERE slug = 'mots-c-40mg';

  -- AOD 9604 5mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('AOD 9604 5mg', 'aod-9604-5mg', '', 'Targets fat reduction without affecting blood sugar or growth', cat_peptides, 75.00, 67.50, '5mg', 'fat_loss', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_aod9604 FROM products WHERE slug = 'aod-9604-5mg';

  -- Bac Water 10ml
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Bac Water 10ml', 'bac-water-10ml', '', 'Bacteriostatic water for peptide reconstitution', cat_supplies, 15.00, 13.50, '10ml', 'supplies', 'supplies', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_bac_water FROM products WHERE slug = 'bac-water-10ml';

  -- Reconstitution Water 3ml
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Reconstitution Water 3ml', 'reconstitution-water-3ml', '', 'Sterile water for single-use reconstitution', cat_supplies, 10.00, 9.00, '3ml', 'supplies', 'supplies', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_recon_water FROM products WHERE slug = 'reconstitution-water-3ml';

  -- Syringes
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Syringes', 'syringes', '', 'Insulin syringes for subcutaneous injection', cat_supplies, 10.00, 9.00, '10pk', 'supplies', 'supplies', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_syringes FROM products WHERE slug = 'syringes';

  -- =====================
  -- Insert protocols
  -- =====================

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Recovery Protocol', 'recovery', 'Accelerate tissue repair and reduce downtime', '4-6 weeks', 149.00, 165.00, 'MOST POPULAR', '#0097A7', 1)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_recovery FROM protocols WHERE slug = 'recovery';

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Fat Loss Protocol', 'fat-loss', 'Target stubborn fat while preserving lean muscle', '8-12 weeks', 275.00, 305.00, NULL, '#1A2B4A', 2)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_fatloss FROM protocols WHERE slug = 'fat-loss';

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Performance Protocol', 'performance', 'Optimize growth hormone for recovery and lean mass', '8-12 weeks', 140.00, 155.00, NULL, '#0097A7', 3)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_performance FROM protocols WHERE slug = 'performance';

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Full Recomp Protocol', 'full-recomp', 'The complete athlete optimization stack', '8-12 weeks', 342.00, 380.00, 'PREMIUM', '#142238', 4)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_recomp FROM protocols WHERE slug = 'full-recomp';

  -- =====================
  -- Link protocol items
  -- =====================

  -- Recovery: Wolverine Blend 10/10mg + Bac Water + Syringes
  INSERT INTO protocol_items (protocol_id, product_id, sort_order) VALUES
    (proto_recovery, pid_wolverine_10_10, 1),
    (proto_recovery, pid_bac_water, 2),
    (proto_recovery, pid_syringes, 3)
  ON CONFLICT (protocol_id, product_id) DO NOTHING;

  -- Fat Loss: MOTS-C 40mg + AOD 9604 + CJC/Ipa + Bac Water + Syringes
  INSERT INTO protocol_items (protocol_id, product_id, sort_order) VALUES
    (proto_fatloss, pid_motsc_40, 1),
    (proto_fatloss, pid_aod9604, 2),
    (proto_fatloss, pid_cjc_ipa, 3),
    (proto_fatloss, pid_bac_water, 4),
    (proto_fatloss, pid_syringes, 5)
  ON CONFLICT (protocol_id, product_id) DO NOTHING;

  -- Performance: CJC/Ipa + Ipamorelin + Bac Water + Syringes
  INSERT INTO protocol_items (protocol_id, product_id, sort_order) VALUES
    (proto_performance, pid_cjc_ipa, 1),
    (proto_performance, pid_ipamorelin, 2),
    (proto_performance, pid_bac_water, 3),
    (proto_performance, pid_syringes, 4)
  ON CONFLICT (protocol_id, product_id) DO NOTHING;

  -- Full Recomp: BPC-157 10mg + TB500 10mg + CJC/Ipa + MOTS-C 40mg + Bac Water + Syringes
  INSERT INTO protocol_items (protocol_id, product_id, sort_order) VALUES
    (proto_recomp, pid_bpc157_10, 1),
    (proto_recomp, pid_tb500_10, 2),
    (proto_recomp, pid_cjc_ipa, 3),
    (proto_recomp, pid_motsc_40, 4),
    (proto_recomp, pid_bac_water, 5),
    (proto_recomp, pid_syringes, 6)
  ON CONFLICT (protocol_id, product_id) DO NOTHING;

  RAISE NOTICE 'Seed complete: 15 products, 4 protocols, all items linked.';
END $$;
