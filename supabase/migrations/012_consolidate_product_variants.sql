-- ============================================================
-- Consolidate duplicate products into single products with variants
--
-- Products consolidated:
--   BPC-157:        5mg, 10mg, 20mg  → 1 product, 3 variants
--   TB500:          5mg, 10mg        → 1 product, 2 variants
--   Wolverine Blend: 5/5mg, 10/10mg → 1 product, 2 variants
--   MOTS-C:         10mg, 40mg      → 1 product, 2 variants
--
-- The lowest-priced product becomes the "parent".
-- Duplicates are deactivated (not deleted) to preserve order history.
-- Protocol items are re-pointed to the parent product.
-- ============================================================

DO $$
DECLARE
  -- BPC-157
  pid_bpc_5   uuid;
  pid_bpc_10  uuid;
  pid_bpc_20  uuid;
  -- TB500
  pid_tb_5    uuid;
  pid_tb_10   uuid;
  -- Wolverine
  pid_wol_5   uuid;
  pid_wol_10  uuid;
  -- MOTS-C
  pid_mot_10  uuid;
  pid_mot_40  uuid;
BEGIN

  -- =====================
  -- BPC-157: keep 5mg slug, consolidate 10mg & 20mg
  -- =====================
  SELECT id INTO pid_bpc_5  FROM products WHERE slug = 'bpc-157-5mg';
  SELECT id INTO pid_bpc_10 FROM products WHERE slug = 'bpc-157-10mg';
  SELECT id INTO pid_bpc_20 FROM products WHERE slug = 'bpc-157-20mg';

  IF pid_bpc_5 IS NOT NULL THEN
    -- Rename parent to generic name / slug
    UPDATE products SET
      name = 'BPC-157',
      slug = 'bpc-157',
      size = '5mg',
      short_description = 'Accelerates soft tissue repair and joint recovery',
      badge = 'Best Seller'
    WHERE id = pid_bpc_5;

    -- Delete any existing variants on the parent (to avoid duplicates on re-run)
    DELETE FROM product_variants WHERE product_id = pid_bpc_5;

    -- Insert variants
    INSERT INTO product_variants (product_id, size, price, original_price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_bpc_5, '5mg',  50.00, NULL, 45.00,  100, 10, 0, true,
        COALESCE((SELECT images FROM products WHERE id = pid_bpc_5), '{}')),
      (pid_bpc_5, '10mg', 55.00, NULL, 49.50,  100, 10, 1, true,
        COALESCE((SELECT images FROM products WHERE id = pid_bpc_10), '{}')),
      (pid_bpc_5, '20mg', 95.00, NULL, 85.50,  100, 10, 2, true,
        COALESCE((SELECT images FROM products WHERE id = pid_bpc_20), '{}'));

    -- Re-point protocol_items from duplicates to parent
    IF pid_bpc_10 IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_bpc_5 WHERE product_id = pid_bpc_10
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_bpc_5);
      DELETE FROM protocol_items WHERE product_id = pid_bpc_10;
    END IF;
    IF pid_bpc_20 IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_bpc_5 WHERE product_id = pid_bpc_20
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_bpc_5);
      DELETE FROM protocol_items WHERE product_id = pid_bpc_20;
    END IF;

    -- Deactivate duplicates
    UPDATE products SET active = false WHERE id IN (pid_bpc_10, pid_bpc_20) AND id IS NOT NULL;
  END IF;

  -- =====================
  -- TB500: keep 5mg slug, consolidate 10mg
  -- =====================
  SELECT id INTO pid_tb_5  FROM products WHERE slug = 'tb500-5mg';
  SELECT id INTO pid_tb_10 FROM products WHERE slug = 'tb500-10mg';

  IF pid_tb_5 IS NOT NULL THEN
    UPDATE products SET
      name = 'TB-500',
      slug = 'tb-500',
      size = '5mg',
      short_description = 'Promotes flexibility and reduces inflammation'
    WHERE id = pid_tb_5;

    DELETE FROM product_variants WHERE product_id = pid_tb_5;

    INSERT INTO product_variants (product_id, size, price, original_price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_tb_5, '5mg',  65.00, NULL, 58.50,  100, 10, 0, true,
        COALESCE((SELECT images FROM products WHERE id = pid_tb_5), '{}')),
      (pid_tb_5, '10mg', 95.00, NULL, 85.50,  100, 10, 1, true,
        COALESCE((SELECT images FROM products WHERE id = pid_tb_10), '{}'));

    IF pid_tb_10 IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_tb_5 WHERE product_id = pid_tb_10
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_tb_5);
      DELETE FROM protocol_items WHERE product_id = pid_tb_10;
      UPDATE products SET active = false WHERE id = pid_tb_10;
    END IF;
  END IF;

  -- =====================
  -- Wolverine Blend: keep 5/5mg slug, consolidate 10/10mg
  -- =====================
  SELECT id INTO pid_wol_5  FROM products WHERE slug = 'wolverine-blend-5-5mg';
  SELECT id INTO pid_wol_10 FROM products WHERE slug = 'wolverine-blend-10-10mg';

  IF pid_wol_5 IS NOT NULL THEN
    UPDATE products SET
      name = 'Wolverine Blend',
      slug = 'wolverine-blend',
      size = '5/5mg',
      short_description = 'BPC-157 and TB500 combined for complete recovery support'
    WHERE id = pid_wol_5;

    DELETE FROM product_variants WHERE product_id = pid_wol_5;

    INSERT INTO product_variants (product_id, size, price, original_price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_wol_5, '5/5mg',   85.00, NULL,  76.50, 100, 10, 0, true,
        COALESCE((SELECT images FROM products WHERE id = pid_wol_5), '{}')),
      (pid_wol_5, '10/10mg', 140.00, NULL, 126.00, 100, 10, 1, true,
        COALESCE((SELECT images FROM products WHERE id = pid_wol_10), '{}'));

    IF pid_wol_10 IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_wol_5 WHERE product_id = pid_wol_10
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_wol_5);
      DELETE FROM protocol_items WHERE product_id = pid_wol_10;
      UPDATE products SET active = false WHERE id = pid_wol_10;
    END IF;
  END IF;

  -- =====================
  -- MOTS-C: keep 10mg slug, consolidate 40mg
  -- =====================
  SELECT id INTO pid_mot_10 FROM products WHERE slug = 'mots-c-10mg';
  SELECT id INTO pid_mot_40 FROM products WHERE slug = 'mots-c-40mg';

  IF pid_mot_10 IS NOT NULL THEN
    UPDATE products SET
      name = 'MOTS-C',
      slug = 'mots-c',
      size = '10mg',
      short_description = 'Metabolic optimization and endurance enhancement'
    WHERE id = pid_mot_10;

    DELETE FROM product_variants WHERE product_id = pid_mot_10;

    INSERT INTO product_variants (product_id, size, price, original_price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_mot_10, '10mg', 55.00,  NULL, 49.50,  100, 10, 0, true,
        COALESCE((SELECT images FROM products WHERE id = pid_mot_10), '{}')),
      (pid_mot_10, '40mg', 130.00, NULL, 117.00, 100, 10, 1, true,
        COALESCE((SELECT images FROM products WHERE id = pid_mot_40), '{}'));

    IF pid_mot_40 IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_mot_10 WHERE product_id = pid_mot_40
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_mot_10);
      DELETE FROM protocol_items WHERE product_id = pid_mot_40;
      UPDATE products SET active = false WHERE id = pid_mot_40;
    END IF;
  END IF;

  RAISE NOTICE 'Product consolidation complete: BPC-157, TB-500, Wolverine Blend, MOTS-C now have variants.';
END $$;
