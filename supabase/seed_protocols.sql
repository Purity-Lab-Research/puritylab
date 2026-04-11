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
  pid_bpc157         uuid;
  pid_tb500          uuid;
  pid_wolverine      uuid;
  pid_cjc_ipa        uuid;
  pid_ipamorelin     uuid;
  pid_motsc          uuid;
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

  -- BPC-157 (single product with 3 size variants)
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity, badge, size)
  VALUES ('BPC-157', 'bpc-157', '', 'A 15-amino acid synthetic peptide studied in preclinical models for interactions with growth factor signaling and nitric oxide pathways', cat_peptides, 50.00, 45.00, 'tissue_research', 'tier_1', true, false, 100, 'Best Seller', '5mg')
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_bpc157 FROM products WHERE slug = 'bpc-157';

  INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active)
  VALUES
    (pid_bpc157, '5mg',  50.00, 45.00,  100, 10, 0, true),
    (pid_bpc157, '10mg', 55.00, 49.50,  100, 10, 1, true),
    (pid_bpc157, '20mg', 95.00, 85.50,  100, 10, 2, true)
  ON CONFLICT DO NOTHING;

  -- TB-500 (single product with 2 size variants)
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity, size)
  VALUES ('TB-500', 'tb-500', '', 'A 43-amino acid peptide studied for actin sequestration, cell migration, and extracellular matrix interactions in preclinical models', cat_peptides, 65.00, 58.50, 'tissue_research', 'tier_1', true, false, 100, '5mg')
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_tb500 FROM products WHERE slug = 'tb-500';

  INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active)
  VALUES
    (pid_tb500, '5mg',  65.00, 58.50, 100, 10, 0, true),
    (pid_tb500, '10mg', 95.00, 85.50, 100, 10, 1, true)
  ON CONFLICT DO NOTHING;

  -- Wolverine Blend (single product with 2 size variants)
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity, size)
  VALUES ('Wolverine Blend', 'wolverine-blend', '', 'A combined formulation of BPC-157 and TB-500 studied together in published tissue biology research', cat_blends, 85.00, 76.50, 'tissue_research', 'tier_1', true, false, 100, '5/5mg')
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_wolverine FROM products WHERE slug = 'wolverine-blend';

  INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active)
  VALUES
    (pid_wolverine, '5/5mg',   85.00,  76.50, 100, 10, 0, true),
    (pid_wolverine, '10/10mg', 140.00, 126.00, 100, 10, 1, true)
  ON CONFLICT DO NOTHING;

  -- CJC-1295/Ipamorelin Blend 5/5mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity)
  VALUES ('CJC-1295/Ipamorelin Blend 5/5mg', 'cjc-ipa-blend-5-5mg', '', 'A GHRH analog and ghrelin receptor agonist combination studied for growth hormone secretion kinetics and IGF-1 pathway research', cat_blends, 75.00, 67.50, 'gh_research', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_cjc_ipa FROM products WHERE slug = 'cjc-ipa-blend-5-5mg';

  -- Ipamorelin 10mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Ipamorelin 10mg', 'ipamorelin-10mg', '', 'A selective ghrelin receptor agonist studied for pulsatile GH release without cortisol or prolactin elevation in published research', cat_peptides, 55.00, 49.50, 'gh_research', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_ipamorelin FROM products WHERE slug = 'ipamorelin-10mg';

  -- MOTS-C (single product with 2 size variants)
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity, size)
  VALUES ('MOTS-C', 'mots-c', '', 'A mitochondrial-derived peptide studied for AMPK activation and metabolic homeostasis in published research models', cat_peptides, 55.00, 49.50, 'metabolic_research', 'tier_1', true, false, 100, '10mg')
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_motsc FROM products WHERE slug = 'mots-c';

  INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active)
  VALUES
    (pid_motsc, '10mg', 55.00,  49.50,  100, 10, 0, true),
    (pid_motsc, '40mg', 130.00, 117.00, 100, 10, 1, true)
  ON CONFLICT DO NOTHING;

  -- AOD 9604 5mg
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity)
  VALUES ('AOD 9604 5mg', 'aod-9604-5mg', '', 'A modified fragment of human growth hormone (aa 177-191) studied for interactions with lipid metabolism pathways', cat_peptides, 75.00, 67.50, 'metabolic_research', 'tier_1', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_aod9604 FROM products WHERE slug = 'aod-9604-5mg';

  -- Bac Water 10ml
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Bac Water 10ml', 'bac-water-10ml', '', 'USP-grade bacteriostatic water for use as a solvent in laboratory reconstitution of lyophilized compounds', cat_supplies, 15.00, 13.50, 'laboratory_supplies', 'supplies', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_bac_water FROM products WHERE slug = 'bac-water-10ml';

  -- Reconstitution Water 3ml
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Reconstitution Water 3ml', 'reconstitution-water-3ml', '', 'Sterile water for single-use laboratory reconstitution of lyophilized reference compounds', cat_supplies, 10.00, 9.00, 'laboratory_supplies', 'supplies', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_recon_water FROM products WHERE slug = 'reconstitution-water-3ml';

  -- Syringes
  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, goal_category, tier, active, featured, stock_quantity)
  VALUES ('Syringes', 'syringes', '', 'Precision laboratory syringes for accurate measurement and transfer of reconstituted solutions in research settings', cat_supplies, 10.00, 9.00, 'laboratory_supplies', 'supplies', true, false, 100)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO pid_syringes FROM products WHERE slug = 'syringes';

  -- =====================
  -- Insert protocols
  -- =====================

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Tissue Research Configuration', 'recovery', 'Compounds commonly studied together in tissue biology research', '4-6 weeks', 149.00, 165.00, 'MOST POPULAR', '#0097A7', 1)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_recovery FROM protocols WHERE slug = 'recovery';

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Metabolic Research Configuration', 'fat-loss', 'Compounds commonly studied together in metabolic signaling research', '8-12 weeks', 275.00, 305.00, NULL, '#1A2B4A', 2)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_fatloss FROM protocols WHERE slug = 'fat-loss';

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Growth Hormone Research Configuration', 'performance', 'Compounds commonly studied together in growth hormone pathway research', '8-12 weeks', 140.00, 155.00, NULL, '#2E7D32', 3)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_performance FROM protocols WHERE slug = 'performance';

  INSERT INTO protocols (name, slug, tagline, cycle_length, subscription_price, one_time_price, badge, accent_color, sort_order)
  VALUES ('Comprehensive Research Configuration', 'full-recomp', 'A broad set of compounds referenced across multiple research domains', '8-12 weeks', 342.00, 380.00, 'PREMIUM', '#7B1FA2', 4)
  ON CONFLICT (slug) DO NOTHING;
  SELECT id INTO proto_recomp FROM protocols WHERE slug = 'full-recomp';

  -- =====================
  -- Link protocol items
  -- =====================

  -- Recovery: Wolverine Blend + Bac Water + Syringes
  INSERT INTO protocol_items (protocol_id, product_id, sort_order) VALUES
    (proto_recovery, pid_wolverine, 1),
    (proto_recovery, pid_bac_water, 2),
    (proto_recovery, pid_syringes, 3)
  ON CONFLICT (protocol_id, product_id) DO NOTHING;

  -- Fat Loss: MOTS-C + AOD 9604 + CJC/Ipa + Bac Water + Syringes
  INSERT INTO protocol_items (protocol_id, product_id, sort_order) VALUES
    (proto_fatloss, pid_motsc, 1),
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

  -- Full Recomp: BPC-157 + TB-500 + CJC/Ipa + MOTS-C + Bac Water + Syringes
  INSERT INTO protocol_items (protocol_id, product_id, sort_order) VALUES
    (proto_recomp, pid_bpc157, 1),
    (proto_recomp, pid_tb500, 2),
    (proto_recomp, pid_cjc_ipa, 3),
    (proto_recomp, pid_motsc, 4),
    (proto_recomp, pid_bac_water, 5),
    (proto_recomp, pid_syringes, 6)
  ON CONFLICT (protocol_id, product_id) DO NOTHING;

  RAISE NOTICE 'Seed complete: 11 products (4 with variants), 4 protocols, all items linked.';
END $$;
