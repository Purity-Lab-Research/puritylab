-- 027: FDA Compliance Overhaul - Reposition all content for RUO (Research Use Only) framework
-- Updates protocol names, taglines, descriptions, and product short_descriptions
-- Removes syringes and bac water from protocol bundles
-- Updates goal_category values to research-focused categories

-- ============================================================
-- 1. Update protocol names and taglines
-- ============================================================

UPDATE protocols SET
  name = 'Tissue Research Configuration',
  tagline = 'Compounds commonly studied together in tissue biology research',
  description = 'This configuration includes compounds commonly studied together in published peer-reviewed research on connective tissue biology. BPC-157 is a synthetic pentadecapeptide that has been the subject of numerous preclinical publications investigating its interactions with growth factor signaling pathways, nitric oxide systems, and angiogenic processes. TB-500 (Thymosin Beta-4) is a 43-amino acid peptide studied for its role in actin sequestration, cell migration, and extracellular matrix interactions. Published studies have explored the combined effects of these compounds in various in-vitro and preclinical tissue models.'
WHERE slug = 'recovery';

UPDATE protocols SET
  name = 'Metabolic Research Configuration',
  tagline = 'Compounds commonly studied together in metabolic signaling research',
  description = 'This configuration includes compounds commonly studied together in published peer-reviewed research on metabolic signaling pathways. MOTS-C is a mitochondrial-derived peptide studied for its effects on AMPK activation and metabolic homeostasis. AOD 9604 is a modified fragment of human growth hormone (amino acids 177-191) investigated for its interactions with lipid metabolism pathways. The CJC-1295/Ipamorelin combination has been studied for its effects on growth hormone secretion kinetics and downstream IGF-1 signaling. Published research has explored these compounds individually and in combination across multiple metabolic research models.'
WHERE slug = 'fat-loss';

UPDATE protocols SET
  name = 'Growth Hormone Research Configuration',
  tagline = 'Compounds commonly studied together in growth hormone pathway research',
  description = 'This configuration includes compounds commonly studied together in published peer-reviewed research on growth hormone signaling pathways. CJC-1295 is a synthetic GHRH analog studied for its receptor binding affinity and pharmacokinetic profile. Ipamorelin is a selective ghrelin receptor agonist investigated for its GH secretagogue properties with selectivity for GH release over other pituitary hormones. Published research has characterized the complementary mechanisms of GHRH analogs and ghrelin mimetics in growth hormone pathway studies.'
WHERE slug = 'performance';

UPDATE protocols SET
  name = 'Comprehensive Research Configuration',
  tagline = 'A broad set of compounds referenced across multiple research domains',
  description = 'This configuration includes a broad set of compounds referenced across multiple published research domains. It combines compounds studied in tissue biology (BPC-157, TB-500), growth hormone pathway research (CJC-1295/Ipamorelin), and metabolic signaling (MOTS-C). Published literature has explored the molecular interactions and signaling pathways of each compound individually, and this configuration provides researchers with a comprehensive panel of reference standards spanning multiple areas of investigation.'
WHERE slug = 'full-recomp';

-- ============================================================
-- 2. Remove syringes and bacteriostatic water from protocol bundles
-- ============================================================

DELETE FROM protocol_items
WHERE product_id IN (
  SELECT id FROM products WHERE slug IN ('bac-water-10ml', 'reconstitution-water-3ml', 'syringes')
);

-- ============================================================
-- 3. Update product short_descriptions to be research-compliant
-- ============================================================

UPDATE products SET short_description = 'A 15-amino acid synthetic peptide studied in preclinical models for interactions with growth factor signaling and nitric oxide pathways'
WHERE slug = 'bpc-157';

UPDATE products SET short_description = 'A 43-amino acid peptide studied for actin sequestration, cell migration, and extracellular matrix interactions in preclinical models'
WHERE slug = 'tb-500';

UPDATE products SET short_description = 'A combined formulation of BPC-157 and TB-500 studied together in published tissue biology research'
WHERE slug = 'wolverine-blend';

UPDATE products SET short_description = 'A GHRH analog and ghrelin receptor agonist combination studied for growth hormone secretion kinetics and IGF-1 pathway research'
WHERE slug = 'cjc-ipa-blend-5-5mg';

UPDATE products SET short_description = 'A selective ghrelin receptor agonist studied for pulsatile GH release without cortisol or prolactin elevation in published research'
WHERE slug = 'ipamorelin-10mg';

UPDATE products SET short_description = 'A mitochondrial-derived peptide studied for AMPK activation and metabolic homeostasis in published research models'
WHERE slug = 'mots-c';

UPDATE products SET short_description = 'A modified fragment of human growth hormone (aa 177-191) studied for interactions with lipid metabolism pathways'
WHERE slug = 'aod-9604-5mg';

UPDATE products SET short_description = 'USP-grade bacteriostatic water for use as a solvent in laboratory reconstitution of lyophilized compounds'
WHERE slug = 'bac-water-10ml';

UPDATE products SET short_description = 'Sterile water for single-use laboratory reconstitution of lyophilized reference compounds'
WHERE slug = 'reconstitution-water-3ml';

UPDATE products SET short_description = 'Precision laboratory syringes for accurate measurement and transfer of reconstituted solutions in research settings'
WHERE slug = 'syringes';

-- Subscription-exclusive products
UPDATE products SET
  short_description = 'A triple-compound formulation combining CJC-1295, Ipamorelin, and MOTS-C for multi-pathway growth hormone and metabolic signaling research',
  description = 'A triple-compound formulation combining CJC-1295 (GHRH analog), Ipamorelin (ghrelin receptor agonist), and MOTS-C (mitochondrial-derived peptide) in a single vial. Published research has investigated these compounds for their roles in GH secretion kinetics, AMPK pathway activation, and metabolic signaling. This formulation is intended for in-vitro laboratory research only.'
WHERE slug = 'performance-elite-blend';

UPDATE products SET
  short_description = 'A triple-compound formulation combining BPC-157, TB-500, and GHK-Cu for multi-pathway tissue biology research',
  description = 'A triple-compound formulation combining BPC-157 (synthetic pentadecapeptide), TB-500 (Thymosin Beta-4), and GHK-Cu (copper peptide complex) in a single vial. Published research has investigated these compounds for their interactions with growth factor signaling, cell migration pathways, and extracellular matrix remodeling. This formulation is intended for in-vitro laboratory research only.'
WHERE slug = 'total-recovery-blend';

-- Trending peptides from migration 026
UPDATE products SET short_description = 'A synthetic triple agonist targeting GLP-1, GIP, and glucagon receptors, studied in published research for multi-receptor metabolic signaling'
WHERE slug = 'retatrutide-glp3';

UPDATE products SET short_description = 'A synthetic GLP-1 receptor analog with modified amino acid sequence studied extensively in clinical trial programs for receptor binding affinity and pharmacokinetic profiling'
WHERE slug = 'semaglutide';

UPDATE products SET short_description = 'A dual-action incretin mimetic targeting GLP-1 and GIP receptors, studied in published clinical trials for dual-receptor metabolic signaling'
WHERE slug = 'tirzepatide';

UPDATE products SET short_description = 'A synthetic tetrapeptide (Ala-Glu-Asp-Gly) studied for telomerase activity and telomere length in published preclinical models'
WHERE slug = 'epitalon';

UPDATE products SET short_description = 'A 28-amino acid peptide studied for T-cell maturation, dendritic cell activation, and immune modulation in published research'
WHERE slug = 'thymosin-alpha-1';

UPDATE products SET short_description = 'A synthetic tetrapeptide targeting the inner mitochondrial membrane, studied for cardiolipin interactions and electron transport chain function'
WHERE slug = 'ss-31-elamipretide';

UPDATE products SET short_description = 'A modified GHRH analog with Drug Affinity Complex studied for extended-duration GH elevation and albumin binding kinetics'
WHERE slug = 'cjc-1295-dac';

UPDATE products SET short_description = 'A truncated kisspeptin neuropeptide studied for GnRH release, KISS1R binding, and hypothalamic-pituitary-gonadal axis signaling'
WHERE slug = 'kisspeptin-10';

UPDATE products SET short_description = 'A long-acting amylin analog studied for amylin receptor binding and appetite signaling pathways in published research'
WHERE slug = 'cagrilintide';

UPDATE products SET short_description = 'A stabilized oral formulation of BPC-157 studied for gastrointestinal mucosal interactions and oral peptide bioavailability'
WHERE slug = 'bpc-157-oral';

-- ============================================================
-- 4. Update goal_category values to research-focused categories
-- ============================================================

UPDATE products SET goal_category = 'tissue_research' WHERE goal_category = 'recovery';
UPDATE products SET goal_category = 'metabolic_research' WHERE goal_category = 'fat_loss';
UPDATE products SET goal_category = 'gh_research' WHERE goal_category = 'performance';
UPDATE products SET goal_category = 'dermal_research' WHERE goal_category = 'skin';
UPDATE products SET goal_category = 'general_research' WHERE goal_category = 'wellness';
UPDATE products SET goal_category = 'laboratory_supplies' WHERE goal_category = 'supplies';

-- ============================================================
-- 5. Remove dosage_info, cycle_length from product descriptions
--    (Set to NULL so UI does not display them)
-- ============================================================

UPDATE products SET dosage_info = NULL, cycle_length = NULL;

-- ============================================================
-- 6. Update product descriptions to remove therapeutic claims
--    for the 026 trending peptides that had long descriptions
-- ============================================================

UPDATE products SET description = 'Retatrutide is a synthetic peptide that simultaneously targets three receptors: GLP-1, GIP, and glucagon. This triple-receptor mechanism has been the subject of Phase 2 clinical trial programs investigating multi-receptor metabolic signaling. Published research has characterized its binding affinity profiles across all three receptor subtypes, pharmacokinetic properties, and downstream signaling cascades. For researchers studying incretin biology and multi-receptor agonism, Retatrutide represents one of the most structurally complex compounds in this class.'
WHERE slug = 'retatrutide-glp3';

UPDATE products SET description = 'Semaglutide is a synthetic analog of glucagon-like peptide-1 (GLP-1) with a modified amino acid sequence that extends its half-life through albumin binding. It has been extensively studied in large-scale clinical trial programs investigating GLP-1 receptor binding affinity, pharmacokinetic profiles, and downstream signaling cascades in metabolic research models. Its extended half-life allows for once-weekly research protocols, making it one of the most practical compounds for extended pharmacokinetic studies. Semaglutide remains the gold-standard reference compound against which newer GLP-1 receptor agonists are compared in published literature.'
WHERE slug = 'semaglutide';

UPDATE products SET description = 'Tirzepatide is a dual-action incretin mimetic that targets both GLP-1 and GIP receptors simultaneously. Published clinical trial programs have investigated its dual-receptor binding kinetics, comparative pharmacology versus single-receptor agonists, and downstream metabolic signaling effects. The GIP receptor component provides a mechanistically distinct signaling pathway compared to GLP-1-only compounds, and published research has characterized the additive effects of dual-receptor activation. Tirzepatide has received FDA approval for specific medical indications and represents one of the most rigorously studied dual-receptor peptide compounds.'
WHERE slug = 'tirzepatide';

UPDATE products SET description = 'Epitalon (also known as Epithalon or Epithalone) is a synthetic tetrapeptide consisting of four amino acids (Ala-Glu-Asp-Gly). Originally developed at the St. Petersburg Institute of Bioregulation and Gerontology, Epitalon has been studied in published research for its potential role in telomerase activation, the enzyme responsible for maintaining telomere length. Preclinical studies have reported effects on pineal gland function and melatonin production. While the evidence base is still developing and independent replication is needed, Epitalon remains one of the most referenced compounds in cellular senescence and telomere biology research.'
WHERE slug = 'epitalon';

UPDATE products SET description = 'Thymosin Alpha-1 (Ta1) is a naturally occurring 28-amino acid peptide originally isolated from the thymus gland. It has been approved in over 35 countries for specific medical indications and has been studied extensively in published research for its effects on dendritic cell maturation, T-cell differentiation, antibody production, and natural killer cell activity. The peptide modulates immune signaling rather than simply stimulating it, making it of particular interest to researchers studying immune homeostasis. Published research spans oncology, infectious disease, and immunodeficiency models.'
WHERE slug = 'thymosin-alpha-1';

UPDATE products SET description = 'SS-31, also known as Elamipretide or Bendavia, is a synthetic tetrapeptide that selectively targets the inner mitochondrial membrane. Unlike most peptides that act on cell surface receptors, SS-31 concentrates within mitochondria where it interacts with cardiolipin, a phospholipid essential for electron transport chain function and ATP production. In preclinical studies, SS-31 has demonstrated effects on mitochondrial reactive oxygen species, mitochondrial membrane potential, and ATP synthesis efficiency. Clinical trials have explored its pharmacological profile in cardiac and skeletal muscle research models.'
WHERE slug = 'ss-31-elamipretide';

UPDATE products SET description = 'CJC-1295 with DAC (Drug Affinity Complex) is a modified growth hormone releasing hormone (GHRH) analog that features an extended half-life compared to the no-DAC version. The DAC modification allows the peptide to bind to albumin in the bloodstream, extending its active duration. Published research has characterized its pharmacokinetic profile, GH and IGF-1 elevation patterns, and receptor binding kinetics. Some researchers prefer the DAC version for sustained GH elevation studies, while others prefer the no-DAC version for studying pulsatile GH release patterns. Both versions are valuable reference compounds with distinct pharmacokinetic profiles.'
WHERE slug = 'cjc-1295-dac';

UPDATE products SET description = 'Kisspeptin-10 is a truncated form of the kisspeptin neuropeptide family that acts on the kisspeptin receptor (KISS1R) in the hypothalamus. Published research has investigated its role in stimulating the release of gonadotropin-releasing hormone (GnRH), which in turn triggers LH and FSH signaling. This makes Kisspeptin-10 a reference compound for studying the hypothalamic-pituitary-gonadal (HPG) axis. Unlike direct hormone administration, Kisspeptin works upstream by activating endogenous hormone production cascades, making it of interest to researchers studying reproductive endocrinology signaling pathways.'
WHERE slug = 'kisspeptin-10';

UPDATE products SET description = 'Cagrilintide is a long-acting analog of amylin, a peptide hormone co-secreted with insulin from pancreatic beta cells. Published research has investigated its amylin receptor binding properties and its role in combination studies with GLP-1 agonists. The CagriSema combination (Cagrilintide plus Semaglutide) has been studied in published clinical trials for enhanced dual-pathway metabolic signaling. As a standalone compound, Cagrilintide modulates signaling through amylin receptors in the brainstem, providing a mechanistically distinct approach compared to GLP-1 receptor agonists.'
WHERE slug = 'cagrilintide';

UPDATE products SET description = 'BPC-157 Oral is a stabilized formulation of Body Protection Compound-157 designed for oral administration in research settings. While injectable BPC-157 remains the standard for targeted research applications, the oral formulation has gained interest for gastrointestinal research. The compound was originally isolated from human gastric juice, making the oral route a natural area of investigation. Published preclinical studies have explored oral BPC-157 for its interactions with gut mucosal signaling pathways and oral peptide bioavailability. The oral formulation eliminates the need for reconstitution, providing an accessible format for a broader range of research protocols.'
WHERE slug = 'bpc-157-oral';
