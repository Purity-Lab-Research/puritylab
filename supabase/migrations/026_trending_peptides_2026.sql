-- 026: Add high-demand trending peptides for 2026

-- Retatrutide (GLP-3) - Hottest peptide of 2026
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info, featured)
VALUES (
  gen_random_uuid(),
  'Retatrutide (GLP-3)',
  'retatrutide-glp3',
  'Triple-receptor agonist targeting GLP-1, GIP, and glucagon pathways for advanced metabolic research',
  'Retatrutide is the most talked-about metabolic peptide in 2026. Unlike single-receptor compounds, Retatrutide is a triple agonist that simultaneously activates GLP-1, GIP, and glucagon receptors. This three-pronged mechanism creates a synergistic metabolic effect that has generated extraordinary interest in the research community. Phase 2 clinical trials demonstrated up to 24% body weight reduction, numbers that surpass any single-receptor agonist studied to date. The GLP-1 activation suppresses appetite and regulates insulin. GIP receptor activation enhances the metabolic response beyond what GLP-1 alone achieves. Glucagon receptor activation increases energy expenditure and promotes fat oxidation. For metabolic researchers, Retatrutide represents the cutting edge of multi-receptor peptide therapy. This is the compound that is redefining what is possible in metabolic research.',
  89.00, 'fat_loss', 'single', true, 5, '98%+', 'Hot',
  'Research protocols typically reference 1-12mg weekly in published literature. Start at the lowest concentration and titrate based on study design.',
  '12-24 weeks in published protocols',
  'Add 2ml bacteriostatic water to the vial. Swirl gently until fully dissolved. Do not shake.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Semaglutide - Most searched peptide overall
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info, featured)
VALUES (
  gen_random_uuid(),
  'Semaglutide',
  'semaglutide',
  'GLP-1 receptor agonist for metabolic and appetite regulation research',
  'Semaglutide is the most widely recognized peptide compound in the world. As a GLP-1 receptor agonist, it has been extensively studied for its effects on metabolic regulation, appetite suppression, and body composition. It is one of the few peptides with full FDA approval for specific medical indications, backed by large-scale Phase 3 and Phase 4 clinical trial programs involving thousands of participants. In research settings, Semaglutide has demonstrated significant effects on glucose metabolism, insulin sensitivity, and energy balance. Its long half-life allows for once-weekly research protocols, making it one of the most practical compounds for extended metabolic studies. Published trials have shown average weight reductions of 15-17% over 68-week study periods. For metabolic researchers, Semaglutide remains the gold standard reference compound against which newer peptides are compared.',
  79.00, 'fat_loss', 'single', true, 6, '98%+', 'Best Seller',
  'Published research protocols reference 0.25-2.4mg weekly with gradual titration over 16-20 weeks.',
  '16-52 weeks in published protocols',
  'Add 2ml bacteriostatic water to the vial. Swirl gently until fully dissolved. Do not shake.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.',
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Tirzepatide - #2 weight loss peptide
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'Tirzepatide',
  'tirzepatide',
  'Dual GLP-1/GIP receptor agonist for metabolic flexibility and body composition research',
  'Tirzepatide is a dual-action incretin mimetic that targets both GLP-1 and GIP receptors simultaneously. This dual mechanism produces metabolic effects that exceed what either receptor alone can achieve. In landmark clinical trials, participants receiving Tirzepatide lost significantly more weight than those on single-receptor GLP-1 agonists, with studies showing approximately 4-12 additional pounds of weight reduction compared to Semaglutide. The GIP receptor activation enhances insulin secretion in a glucose-dependent manner while the GLP-1 component provides appetite regulation and glycemic control. Tirzepatide has received FDA approval for specific medical indications and represents one of the most rigorously studied peptide compounds in the metabolic space. For researchers studying multi-receptor metabolic signaling, Tirzepatide provides a well-documented reference compound with an extensive clinical evidence base.',
  99.00, 'fat_loss', 'single', true, 7, '98%+', NULL,
  'Published protocols reference 2.5-15mg weekly with titration over 20 weeks.',
  '20-52 weeks in published protocols',
  'Add 2ml bacteriostatic water to the vial. Swirl gently until fully dissolved. Do not shake.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.'
)
ON CONFLICT (slug) DO NOTHING;

-- Epitalon - Top anti-aging peptide
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'Epitalon',
  'epitalon',
  'Tetrapeptide studied for telomerase activation and cellular longevity research',
  'Epitalon (also known as Epithalon or Epithalone) is a synthetic tetrapeptide consisting of four amino acids (Ala-Glu-Asp-Gly) that has generated significant interest in the longevity research community. Originally developed at the St. Petersburg Institute of Bioregulation and Gerontology, Epitalon has been studied for its potential role in activating telomerase, the enzyme responsible for maintaining telomere length. Telomere shortening is one of the hallmarks of cellular aging, and compounds that influence telomerase activity are of major interest to longevity researchers. Preclinical studies have reported effects on pineal gland function, melatonin production, and circadian rhythm regulation. While the evidence base is still developing and independent replication is needed, Epitalon remains one of the most discussed compounds in the anti-aging peptide category. For researchers investigating cellular senescence and telomere biology, Epitalon provides an accessible research tool.',
  65.00, 'wellness', 'single', true, 13, '98%+', NULL,
  'Published research protocols reference 5-10mg daily for 10-20 day cycles.',
  '10-20 day cycles, often repeated every 4-6 months in research literature',
  'Add 2ml bacteriostatic water to the vial. Swirl gently until fully dissolved. Do not shake.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.'
)
ON CONFLICT (slug) DO NOTHING;

-- Thymosin Alpha-1 - Immune modulation
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'Thymosin Alpha-1',
  'thymosin-alpha-1',
  'Immune-modulating peptide studied for T-cell activation and immune system optimization',
  'Thymosin Alpha-1 (Ta1) is a naturally occurring 28-amino acid peptide originally isolated from the thymus gland. It plays a critical role in immune system regulation, particularly in the maturation and activation of T-cells. Thymosin Alpha-1 has been approved in over 35 countries for the treatment of chronic hepatitis B and C and as an immune system adjuvant. In research settings, it has been studied extensively for its effects on dendritic cell maturation, T-helper cell differentiation, antibody production, and natural killer cell activity. The peptide works by modulating the immune response rather than simply stimulating it, making it of particular interest to researchers studying immune homeostasis. Published research spans oncology, infectious disease, and immunodeficiency, with a clinical evidence base that is among the strongest of any research peptide.',
  85.00, 'wellness', 'single', true, 14, '98%+', NULL,
  'Published research protocols reference 1.6mg administered twice weekly.',
  '4-12 weeks in published protocols, with some studies extending to 6 months',
  'Add 1ml bacteriostatic water to the vial. Swirl gently until fully dissolved.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.'
)
ON CONFLICT (slug) DO NOTHING;

-- SS-31 (Elamipretide) - Mitochondrial peptide
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'SS-31 (Elamipretide)',
  'ss-31-elamipretide',
  'Mitochondrial-targeted peptide for cellular energy and oxidative stress research',
  'SS-31, also known as Elamipretide or Bendavia, is a synthetic tetrapeptide that selectively targets the inner mitochondrial membrane. Unlike most peptides that act on cell surface receptors, SS-31 concentrates within mitochondria where it interacts with cardiolipin, a phospholipid essential for electron transport chain function and ATP production. This unique mechanism of action makes SS-31 one of the most targeted mitochondrial therapeutics in development. In preclinical studies, SS-31 has demonstrated effects on reducing mitochondrial reactive oxygen species, restoring mitochondrial membrane potential, and improving ATP synthesis efficiency. Clinical trials have explored its potential in heart failure, age-related mitochondrial dysfunction, and skeletal muscle performance. For researchers studying mitochondrial biology, bioenergetics, and cellular aging, SS-31 provides a precision tool that complements broader mitochondrial peptides like MOTS-C.',
  95.00, 'wellness', 'single', true, 15, '98%+', 'New',
  'Published research protocols reference 0.25mg/kg administered daily in clinical trial settings.',
  '4-12 weeks in published clinical trials',
  'Add 1ml bacteriostatic water to the vial. Swirl gently until fully dissolved.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.'
)
ON CONFLICT (slug) DO NOTHING;

-- CJC-1295 with DAC - GH secretagogue variant
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'CJC-1295 with DAC',
  'cjc-1295-dac',
  'Long-acting growth hormone releasing hormone analog with Drug Affinity Complex for sustained GH elevation research',
  'CJC-1295 with DAC (Drug Affinity Complex) is a modified growth hormone releasing hormone (GHRH) analog that features an extended half-life compared to the no-DAC version. The DAC modification allows the peptide to bind to albumin in the bloodstream, extending its active duration from hours to approximately 6-8 days. This means a single administration can produce sustained growth hormone elevation throughout the week, unlike the pulsatile release pattern seen with the no-DAC version. In research settings, CJC-1295 with DAC has been studied for its effects on sustained GH and IGF-1 elevation, body composition changes, sleep quality improvement, and recovery markers. The extended half-life makes it practical for research protocols requiring less frequent administration. Some researchers prefer the DAC version for baseline GH elevation studies, while others prefer the no-DAC version for studying natural pulsatile GH release patterns. Both versions are valuable research tools with distinct pharmacokinetic profiles.',
  95.00, 'performance', 'single', true, 8, '98%+', NULL,
  'Published protocols reference 1-2mg administered once or twice weekly due to extended half-life.',
  '8-12 weeks in published protocols',
  'Add 2ml bacteriostatic water to the vial. Swirl gently until fully dissolved. Do not shake.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.'
)
ON CONFLICT (slug) DO NOTHING;

-- Kisspeptin-10 - Hormonal research
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'Kisspeptin-10',
  'kisspeptin-10',
  'Hypothalamic neuropeptide studied for reproductive hormone signaling and LH/FSH regulation',
  'Kisspeptin-10 is a truncated form of the kisspeptin neuropeptide family that plays a central role in the regulation of reproductive hormones. It acts on the kisspeptin receptor (KISS1R) in the hypothalamus to stimulate the release of gonadotropin-releasing hormone (GnRH), which in turn triggers the release of luteinizing hormone (LH) and follicle-stimulating hormone (FSH). This makes Kisspeptin-10 a critical research tool for studying the hypothalamic-pituitary-gonadal (HPG) axis. In published research, Kisspeptin-10 has been studied for its effects on testosterone production, ovulation induction, and the restoration of hormonal signaling in models of hypogonadism. Unlike direct testosterone or estrogen administration, Kisspeptin works upstream by activating the body''s own hormone production cascade. For researchers studying reproductive endocrinology, fertility, and hormonal regulation, Kisspeptin-10 provides a targeted tool for investigating the master switch of reproductive signaling.',
  75.00, 'wellness', 'single', true, 16, '98%+', NULL,
  'Published research protocols reference 0.3-1.0nmol/kg administered intravenously or subcutaneously in clinical settings.',
  'Acute dosing studies, not typically cycled. Research protocols vary significantly.',
  'Add 1ml bacteriostatic water to the vial. Swirl gently until fully dissolved.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 14 days.'
)
ON CONFLICT (slug) DO NOTHING;

-- Cagrilintide - Amylin analog, trending in 2026
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'Cagrilintide',
  'cagrilintide',
  'Long-acting amylin analog studied for appetite regulation and metabolic signaling research',
  'Cagrilintide is a long-acting analog of amylin, a peptide hormone co-secreted with insulin from pancreatic beta cells. Amylin plays a complementary role to GLP-1 in regulating appetite, gastric emptying, and post-meal glucose levels. What makes Cagrilintide particularly relevant in 2026 is its role in combination research with GLP-1 agonists. The CagriSema combination (Cagrilintide plus Semaglutide) has shown enhanced metabolic effects beyond what either compound achieves alone, with published trial data demonstrating some of the most significant body composition changes seen in peptide research. As a standalone compound, Cagrilintide modulates hunger signaling through amylin receptors in the brainstem, providing a mechanistically distinct approach to appetite research compared to GLP-1 agonists. For researchers studying metabolic peptide combinations, receptor crosstalk, and next-generation approaches to body composition research, Cagrilintide is an essential reference compound.',
  89.00, 'fat_loss', 'single', true, 8, '98%+', 'New',
  'Published research protocols reference 1.0-4.5mg weekly with dose titration.',
  '16-68 weeks in published trial protocols',
  'Add 2ml bacteriostatic water to the vial. Swirl gently until fully dissolved. Do not shake.',
  'Store lyophilized powder at -20C for long-term storage. After reconstitution, store at 2-8C and use within 30 days.'
)
ON CONFLICT (slug) DO NOTHING;

-- BPC-157 Oral (capsule form) - Growing demand for oral route
INSERT INTO products (id, name, slug, short_description, description, price, goal_category, tier, active, sort_order, purity, badge, dosage_info, cycle_length, reconstitution_info, storage_info)
VALUES (
  gen_random_uuid(),
  'BPC-157 Oral',
  'bpc-157-oral',
  'Oral-stable BPC-157 formulation for gastrointestinal and systemic research applications',
  'BPC-157 Oral is a stabilized formulation of Body Protection Compound-157 designed for oral administration in research settings. While injectable BPC-157 remains the standard for targeted tissue repair research, oral BPC-157 has gained significant interest for gastrointestinal research applications. The compound was originally isolated from human gastric juice, making the oral route a natural area of investigation. Published preclinical studies have explored oral BPC-157 for its effects on gut mucosal integrity, gastric ulcer models, inflammatory bowel models, and gut-brain axis signaling. The oral formulation eliminates the need for reconstitution and injection, making it accessible for a broader range of research protocols. Some researchers use oral and injectable BPC-157 in combination, targeting both systemic and local gastrointestinal effects simultaneously. For researchers studying gut health, mucosal healing, and oral peptide bioavailability, this formulation provides a practical research tool.',
  55.00, 'recovery', 'single', true, 4, '98%+', 'New',
  'Published protocols reference 250-500mcg taken orally, typically on an empty stomach.',
  '4-8 weeks in published protocols',
  'No reconstitution needed. Oral capsule form.',
  'Store in a cool, dry place away from direct sunlight. Keep sealed until use.'
)
ON CONFLICT (slug) DO NOTHING;

-- Seed CoA placeholder data for all new products
INSERT INTO coa (id, product_id, purity_percentage, batch_number, test_date, file_url, pdf_url)
SELECT
  gen_random_uuid(),
  p.id,
  ROUND((98.5 + (random() * 1.4))::numeric, 2),
  'PL-2026-' || LPAD((100 + ROW_NUMBER() OVER (ORDER BY p.created_at DESC))::text, 4, '0'),
  '2026-03-20'::date,
  NULL,
  NULL
FROM products p
WHERE p.slug IN ('retatrutide-glp3', 'semaglutide', 'tirzepatide', 'epitalon', 'thymosin-alpha-1', 'ss-31-elamipretide', 'cjc-1295-dac', 'kisspeptin-10', 'cagrilintide', 'bpc-157-oral')
AND NOT EXISTS (SELECT 1 FROM coa c WHERE c.product_id = p.id)
ON CONFLICT DO NOTHING;

-- Add related products for stacking suggestions
-- Retatrutide stacks with Semaglutide and MOTS-C
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'retatrutide-glp3' AND p2.slug IN ('semaglutide', 'mots-c-10mg', 'cjc-1295-ipamorelin-blend')
ON CONFLICT DO NOTHING;

-- Semaglutide stacks with MOTS-C and Cagrilintide
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'semaglutide' AND p2.slug IN ('mots-c-10mg', 'cagrilintide', 'retatrutide-glp3')
ON CONFLICT DO NOTHING;

-- Tirzepatide stacks with MOTS-C and AOD
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'tirzepatide' AND p2.slug IN ('mots-c-10mg', 'aod-9604-5mg', 'cagrilintide')
ON CONFLICT DO NOTHING;

-- Epitalon stacks with GHK-Cu and NAD+
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'epitalon' AND p2.slug IN ('ghk-cu-50mg', 'nad-500mg', 'ss-31-elamipretide')
ON CONFLICT DO NOTHING;

-- SS-31 stacks with MOTS-C and NAD+
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'ss-31-elamipretide' AND p2.slug IN ('mots-c-10mg', 'nad-500mg', 'epitalon')
ON CONFLICT DO NOTHING;

-- Thymosin Alpha-1 stacks with BPC-157 and TB-500
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'thymosin-alpha-1' AND p2.slug IN ('bpc-157-5mg', 'tb-500-5mg', 'ss-31-elamipretide')
ON CONFLICT DO NOTHING;

-- CJC-1295 DAC stacks with Ipamorelin and Tesamorelin
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'cjc-1295-dac' AND p2.slug IN ('ipamorelin-5mg', 'tesamorelin-10mg')
ON CONFLICT DO NOTHING;

-- Cagrilintide stacks with Semaglutide (CagriSema combo)
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'cagrilintide' AND p2.slug IN ('semaglutide', 'retatrutide-glp3', 'mots-c-10mg')
ON CONFLICT DO NOTHING;

-- BPC-157 Oral stacks with injectable BPC-157 and TB-500
INSERT INTO related_products (id, product_id, related_product_id)
SELECT gen_random_uuid(), p1.id, p2.id
FROM products p1, products p2
WHERE p1.slug = 'bpc-157-oral' AND p2.slug IN ('bpc-157-5mg', 'tb-500-5mg', 'wolverine-blend-10-10mg')
ON CONFLICT DO NOTHING;
