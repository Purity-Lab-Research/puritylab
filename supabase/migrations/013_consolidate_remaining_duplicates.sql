-- ============================================================
-- Consolidate remaining duplicate products into variants
--
-- TB-500:       5mg, 10mg       → 1 product, 2 variants
-- 5-Amino-1MQ: 5mg, 50mg       → 1 product, 2 variants
-- DSIP:         5mg, 15mg       → 1 product, 2 variants
-- GHK-Cu:       50mg, 100mg    → 1 product, 2 variants
-- Glutathione:  600mg, 1500mg  → 1 product, 2 variants
-- NAD+:         500mg, 1000mg  → 1 product, 2 variants
-- ============================================================

DO $$
DECLARE
  pid_parent uuid;
  pid_child  uuid;
BEGIN

  -- =====================
  -- TB-500
  -- =====================
  SELECT id INTO pid_parent FROM products WHERE slug = 'tb-500-5mg';
  SELECT id INTO pid_child  FROM products WHERE slug = 'tb-500-10mg';

  IF pid_parent IS NOT NULL THEN
    UPDATE products SET name = 'TB-500', slug = 'tb-500', size = '5mg' WHERE id = pid_parent;
    DELETE FROM product_variants WHERE product_id = pid_parent;
    INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_parent, '5mg',  65.00, 58.50, 100, 10, 0, true, COALESCE((SELECT images FROM products WHERE id = pid_parent), '{}')),
      (pid_parent, '10mg', 95.00, 85.50, 100, 10, 1, true, COALESCE((SELECT images FROM products WHERE id = pid_child), '{}'));
    IF pid_child IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_parent WHERE product_id = pid_child
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_parent);
      DELETE FROM protocol_items WHERE product_id = pid_child;
      UPDATE products SET active = false WHERE id = pid_child;
    END IF;
  END IF;

  -- =====================
  -- 5-Amino-1MQ
  -- =====================
  SELECT id INTO pid_parent FROM products WHERE slug = '5-amino-1mq-5mg';
  SELECT id INTO pid_child  FROM products WHERE slug = '5-amino-1mq-50mg';

  IF pid_parent IS NOT NULL THEN
    UPDATE products SET name = '5-Amino-1MQ', slug = '5-amino-1mq', size = '5mg' WHERE id = pid_parent;
    DELETE FROM product_variants WHERE product_id = pid_parent;
    INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_parent, '5mg',  50.00,  45.00,  100, 10, 0, true, COALESCE((SELECT images FROM products WHERE id = pid_parent), '{}')),
      (pid_parent, '50mg', 140.00, 126.00, 100, 10, 1, true, COALESCE((SELECT images FROM products WHERE id = pid_child), '{}'));
    IF pid_child IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_parent WHERE product_id = pid_child
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_parent);
      DELETE FROM protocol_items WHERE product_id = pid_child;
      UPDATE products SET active = false WHERE id = pid_child;
    END IF;
  END IF;

  -- =====================
  -- DSIP
  -- =====================
  SELECT id INTO pid_parent FROM products WHERE slug = 'dsip-5mg';
  SELECT id INTO pid_child  FROM products WHERE slug = 'dsip-15mg';

  IF pid_parent IS NOT NULL THEN
    UPDATE products SET name = 'DSIP', slug = 'dsip', size = '5mg' WHERE id = pid_parent;
    DELETE FROM product_variants WHERE product_id = pid_parent;
    INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_parent, '5mg',  45.00, 40.50, 100, 10, 0, true, COALESCE((SELECT images FROM products WHERE id = pid_parent), '{}')),
      (pid_parent, '15mg', 80.00, 72.00, 100, 10, 1, true, COALESCE((SELECT images FROM products WHERE id = pid_child), '{}'));
    IF pid_child IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_parent WHERE product_id = pid_child
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_parent);
      DELETE FROM protocol_items WHERE product_id = pid_child;
      UPDATE products SET active = false WHERE id = pid_child;
    END IF;
  END IF;

  -- =====================
  -- GHK-Cu
  -- =====================
  SELECT id INTO pid_parent FROM products WHERE slug = 'ghk-cu-50mg';
  SELECT id INTO pid_child  FROM products WHERE slug = 'ghk-cu-100mg';

  IF pid_parent IS NOT NULL THEN
    UPDATE products SET name = 'GHK-Cu', slug = 'ghk-cu', size = '50mg' WHERE id = pid_parent;
    DELETE FROM product_variants WHERE product_id = pid_parent;
    INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_parent, '50mg',  45.00, 40.50, 100, 10, 0, true, COALESCE((SELECT images FROM products WHERE id = pid_parent), '{}')),
      (pid_parent, '100mg', 70.00, 63.00, 100, 10, 1, true, COALESCE((SELECT images FROM products WHERE id = pid_child), '{}'));
    IF pid_child IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_parent WHERE product_id = pid_child
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_parent);
      DELETE FROM protocol_items WHERE product_id = pid_child;
      UPDATE products SET active = false WHERE id = pid_child;
    END IF;
  END IF;

  -- =====================
  -- Glutathione
  -- =====================
  SELECT id INTO pid_parent FROM products WHERE slug = 'glutathione-600mg';
  SELECT id INTO pid_child  FROM products WHERE slug = 'glutathione-1500mg';

  IF pid_parent IS NOT NULL THEN
    UPDATE products SET name = 'Glutathione', slug = 'glutathione', size = '600mg' WHERE id = pid_parent;
    DELETE FROM product_variants WHERE product_id = pid_parent;
    INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_parent, '600mg',  55.00,  49.50,  100, 10, 0, true, COALESCE((SELECT images FROM products WHERE id = pid_parent), '{}')),
      (pid_parent, '1500mg', 120.00, 108.00, 100, 10, 1, true, COALESCE((SELECT images FROM products WHERE id = pid_child), '{}'));
    IF pid_child IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_parent WHERE product_id = pid_child
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_parent);
      DELETE FROM protocol_items WHERE product_id = pid_child;
      UPDATE products SET active = false WHERE id = pid_child;
    END IF;
  END IF;

  -- =====================
  -- NAD+
  -- =====================
  SELECT id INTO pid_parent FROM products WHERE slug = 'nad-500mg';
  SELECT id INTO pid_child  FROM products WHERE slug = 'nad-1000mg';

  IF pid_parent IS NOT NULL THEN
    UPDATE products SET name = 'NAD+', slug = 'nad', size = '500mg' WHERE id = pid_parent;
    DELETE FROM product_variants WHERE product_id = pid_parent;
    INSERT INTO product_variants (product_id, size, price, subscription_price, stock_quantity, low_stock_threshold, sort_order, active, images)
    VALUES
      (pid_parent, '500mg',  55.00,  49.50,  100, 10, 0, true, COALESCE((SELECT images FROM products WHERE id = pid_parent), '{}')),
      (pid_parent, '1000mg', 150.00, 135.00, 100, 10, 1, true, COALESCE((SELECT images FROM products WHERE id = pid_child), '{}'));
    IF pid_child IS NOT NULL THEN
      UPDATE protocol_items SET product_id = pid_parent WHERE product_id = pid_child
        AND NOT EXISTS (SELECT 1 FROM protocol_items pi2 WHERE pi2.protocol_id = protocol_items.protocol_id AND pi2.product_id = pid_parent);
      DELETE FROM protocol_items WHERE product_id = pid_child;
      UPDATE products SET active = false WHERE id = pid_child;
    END IF;
  END IF;

  RAISE NOTICE 'Consolidation complete: TB-500, 5-Amino-1MQ, DSIP, GHK-Cu, Glutathione, NAD+ now have variants.';
END $$;
