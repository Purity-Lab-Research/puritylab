-- Add purity_percentage and pdf_url columns to coa table if they don't exist
-- The original schema had file_url; the app code expects pdf_url and purity_percentage

ALTER TABLE coa ADD COLUMN IF NOT EXISTS purity_percentage numeric(5,2);
ALTER TABLE coa ADD COLUMN IF NOT EXISTS pdf_url text;

-- Make file_url nullable (it was NOT NULL but we want to allow null pdf_url)
ALTER TABLE coa ALTER COLUMN file_url DROP NOT NULL;

-- Seed CoA placeholder data for all active non-supply peptide products
INSERT INTO coa (id, product_id, purity_percentage, batch_number, test_date, file_url, pdf_url)
SELECT
  gen_random_uuid(),
  p.id,
  CASE
    WHEN p.slug LIKE '%bac-water%' THEN NULL
    WHEN p.slug LIKE '%recon-water%' THEN NULL
    WHEN p.slug LIKE '%syringe%' THEN NULL
    ELSE ROUND((98.5 + (random() * 1.4))::numeric, 2)
  END,
  'PL-2026-' || LPAD(ROW_NUMBER() OVER (ORDER BY p.sort_order)::text, 4, '0'),
  '2026-03-15'::date,
  NULL,
  NULL
FROM products p
WHERE p.active = true
AND (p.goal_category IS NULL OR p.goal_category != 'supplies')
AND NOT EXISTS (
  SELECT 1 FROM coa c WHERE c.product_id = p.id
)
ON CONFLICT DO NOTHING;
