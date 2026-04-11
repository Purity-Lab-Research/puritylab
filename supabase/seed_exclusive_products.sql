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
    'A triple-compound formulation combining CJC-1295 (GHRH analog), Ipamorelin (ghrelin receptor agonist), and MOTS-C (mitochondrial-derived peptide) in a single vial. Published research has investigated these compounds for their roles in GH secretion kinetics, AMPK pathway activation, and metabolic signaling. This formulation is intended for in-vitro laboratory research only.',
    'A triple-compound formulation combining CJC-1295, Ipamorelin, and MOTS-C for multi-pathway growth hormone and metabolic signaling research',
    cat_blends, 150.00, 127.50, '5/5/10mg', 'gh_research', 'tier_2', true, false, 100, true
  ) ON CONFLICT (slug) DO NOTHING;

  INSERT INTO products (name, slug, description, short_description, category_id, price, subscription_price, size, goal_category, tier, active, featured, stock_quantity, subscription_only)
  VALUES (
    'Total Recovery Blend',
    'total-recovery-blend',
    'A triple-compound formulation combining BPC-157 (synthetic pentadecapeptide), TB-500 (Thymosin Beta-4), and GHK-Cu (copper peptide complex) in a single vial. Published research has investigated these compounds for their interactions with growth factor signaling, cell migration pathways, and extracellular matrix remodeling. This formulation is intended for in-vitro laboratory research only.',
    'A triple-compound formulation combining BPC-157, TB-500, and GHK-Cu for multi-pathway tissue biology research',
    cat_blends, 180.00, 153.00, '10/10/25mg', 'tissue_research', 'tier_2', true, false, 100, true
  ) ON CONFLICT (slug) DO NOTHING;

  RAISE NOTICE 'Seed complete: 2 subscription-exclusive products.';
END $$;
