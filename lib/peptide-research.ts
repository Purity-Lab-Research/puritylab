export interface PeptideStudy {
  title: string;
  journal: string;
  year: number;
  pmid: string;
}

export interface PeptideEntry {
  name: string;
  category: string;
  mechanism: string;
  typicalDose: string;
  frequency: string;
  cycleLength: string;
  stacksWith: string;
  bestFor: string;
  productSlugs: { label: string; slug: string }[];
  studies: PeptideStudy[];
}

/*
 * All PMIDs verified against PubMed as of April 2026.
 * Each links to: https://pubmed.ncbi.nlm.nih.gov/{PMID}/
 */
export const PEPTIDE_DATA: PeptideEntry[] = [
  {
    name: "BPC-157",
    category: "Recovery",
    mechanism: "Angiogenesis, VEGF/EGF upregulation, nitric oxide modulation",
    typicalDose: "250-500 mcg/day",
    frequency: "Daily (SubQ)",
    cycleLength: "4-6 weeks",
    stacksWith: "TB500",
    bestFor: "Soft tissue repair, tendon/ligament healing, gut health",
    productSlugs: [
      { label: "BPC-157", slug: "bpc-157" },
      { label: "Wolverine Blend", slug: "wolverine-blend" },
    ],
    studies: [
      { title: "Stable gastric pentadecapeptide BPC 157: novel therapy in gastrointestinal tract", journal: "Curr Pharm Des", year: 2011, pmid: "21548867" },
      { title: "Pentadecapeptide BPC 157 enhances the growth hormone receptor expression in tendon fibroblasts", journal: "Molecules", year: 2014, pmid: "25415472" },
      { title: "Gastric pentadecapeptide BPC 157 accelerates healing of transected rat Achilles tendon and in vitro stimulates tendocytes growth", journal: "J Orthop Res", year: 2003, pmid: "14554208" },
      { title: "Stable gastric pentadecapeptide BPC 157 in trials for inflammatory bowel disease (PL-10, PLD-116, PL14736, Pliva, Croatia)", journal: "Inflammopharmacology", year: 2006, pmid: "17186181" },
      { title: "Stable gastric pentadecapeptide BPC 157 and striated, smooth, and heart muscle", journal: "Biomedicines", year: 2022, pmid: "36551977" },
    ],
  },
  {
    name: "TB500",
    category: "Recovery",
    mechanism: "Actin upregulation, cell migration, systemic healing",
    typicalDose: "2-5 mg twice/week",
    frequency: "2x/week (SubQ)",
    cycleLength: "4-6 weeks",
    stacksWith: "BPC-157",
    bestFor: "Systemic recovery, flexibility, inflammation reduction",
    productSlugs: [
      { label: "TB-500", slug: "tb-500" },
      { label: "Wolverine Blend", slug: "wolverine-blend" },
    ],
    studies: [
      { title: "Thymosin beta4 accelerates wound healing", journal: "J Invest Dermatol", year: 1999, pmid: "10469335" },
      { title: "Thymosin beta4 activates integrin-linked kinase and promotes cardiac cell migration, survival and cardiac repair", journal: "Nature", year: 2004, pmid: "15565145" },
      { title: "Thymosin beta4 induces adult epicardial progenitor mobilization and neovascularization", journal: "Nature", year: 2007, pmid: "17108969" },
      { title: "Thymosin beta4 promotes dermal healing", journal: "Vitam Horm", year: 2016, pmid: "27450738" },
    ],
  },
  {
    name: "CJC-1295 (no DAC)",
    category: "GH Secretagogue",
    mechanism: "GHRH receptor agonist, sustained GH elevation",
    typicalDose: "100-300 mcg/day",
    frequency: "Daily before bed (SubQ)",
    cycleLength: "8-12 weeks",
    stacksWith: "Ipamorelin",
    bestFor: "GH optimization, body composition, sleep quality",
    productSlugs: [
      { label: "CJC/Ipa Blend", slug: "cjc-ipa-blend-5-5mg" },
    ],
    studies: [
      { title: "Prolonged stimulation of growth hormone (GH) and insulin-like growth factor I secretion by CJC-1295, a long-acting analog of GH-releasing hormone, in healthy adults", journal: "J Clin Endocrinol Metab", year: 2006, pmid: "16352683" },
      { title: "Once-daily administration of CJC-1295, a long-acting growth hormone-releasing hormone (GHRH) analog, normalizes growth in the GHRH knockout mouse", journal: "Am J Physiol Endocrinol Metab", year: 2006, pmid: "16822960" },
      { title: "Growth hormone-releasing factor enhances sleep in rats and rabbits", journal: "Am J Physiol", year: 1988, pmid: "3136672" },
    ],
  },
  {
    name: "Ipamorelin",
    category: "GH Secretagogue",
    mechanism: "Selective ghrelin receptor agonist, GH pulse release",
    typicalDose: "100-300 mcg/day",
    frequency: "Daily before bed (SubQ)",
    cycleLength: "8-12 weeks",
    stacksWith: "CJC-1295",
    bestFor: "Clean GH release (no cortisol/prolactin spike), recovery",
    productSlugs: [
      { label: "Ipamorelin 10mg", slug: "ipamorelin-10mg" },
      { label: "CJC/Ipa Blend", slug: "cjc-ipa-blend-5-5mg" },
    ],
    studies: [
      { title: "Ipamorelin, the first selective growth hormone secretagogue", journal: "Eur J Endocrinol", year: 1998, pmid: "9849822" },
      { title: "Pharmacokinetic-pharmacodynamic modeling of ipamorelin, a growth hormone releasing peptide, in human volunteers", journal: "Pharm Res", year: 1999, pmid: "10496658" },
      { title: "Ipamorelin, a new growth-hormone-releasing peptide, induces longitudinal bone growth in rats", journal: "Growth Horm IGF Res", year: 1999, pmid: "10373343" },
    ],
  },
  {
    name: "MOTS-C",
    category: "Metabolic",
    mechanism: "AMPK activation, mitochondrial function, insulin sensitivity",
    typicalDose: "5-10 mg, 3-5x/week",
    frequency: "3-5x/week (SubQ)",
    cycleLength: "4-8 weeks",
    stacksWith: "AOD 9604",
    bestFor: "Metabolic optimization, endurance, insulin sensitivity",
    productSlugs: [
      { label: "MOTS-C", slug: "mots-c" },
    ],
    studies: [
      { title: "The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis and reduces obesity and insulin resistance", journal: "Cell Metab", year: 2015, pmid: "25738459" },
      { title: "MOTS-c is an exercise-induced mitochondrial-encoded regulator of age-dependent physical decline and muscle homeostasis", journal: "Nat Commun", year: 2021, pmid: "33473109" },
      { title: "MOTS-c peptide regulates adipose homeostasis to prevent ovariectomy-induced metabolic dysfunction", journal: "J Mol Med", year: 2019, pmid: "30725119" },
      { title: "MOTS-c interacts synergistically with exercise intervention to regulate PGC-1alpha expression, attenuate insulin resistance and enhance glucose metabolism in mice via AMPK signaling pathway", journal: "Biochim Biophys Acta Mol Basis Dis", year: 2021, pmid: "33722744" },
    ],
  },
  {
    name: "AOD 9604",
    category: "Metabolic",
    mechanism: "GH fragment (aa 177-191), lipolysis stimulation",
    typicalDose: "250-500 mcg/day",
    frequency: "Daily (SubQ)",
    cycleLength: "8-12 weeks",
    stacksWith: "MOTS-C, CJC/Ipa",
    bestFor: "Fat reduction without GH side effects",
    productSlugs: [
      { label: "AOD 9604 5mg", slug: "aod-9604-5mg" },
    ],
    studies: [
      { title: "Metabolic studies of a synthetic lipolytic domain (AOD9604) of human growth hormone", journal: "Horm Res", year: 2000, pmid: "11146367" },
      { title: "The effects of human GH and its lipolytic fragment (AOD9604) on lipid metabolism following chronic treatment in obese mice and beta(3)-AR knock-out mice", journal: "Endocrinology", year: 2001, pmid: "11713213" },
      { title: "Increase of fat oxidation and weight loss in obese mice caused by chronic treatment with human growth hormone or a modified C-terminal fragment", journal: "Int J Obes", year: 2001, pmid: "11673763" },
    ],
  },
  {
    name: "GHK-Cu",
    category: "Skin / Anti-aging",
    mechanism: "Copper peptide complex, collagen synthesis, antioxidant",
    typicalDose: "1-2 mg/day",
    frequency: "Daily (SubQ or topical)",
    cycleLength: "4-8 weeks",
    stacksWith: "BPC-157",
    bestFor: "Skin rejuvenation, wound healing, hair growth",
    productSlugs: [],
    studies: [
      { title: "The human tri-peptide GHK and tissue remodeling", journal: "J Biomater Sci Polym Ed", year: 2008, pmid: "18644225" },
      { title: "GHK peptide as a natural modulator of multiple cellular pathways in skin regeneration", journal: "Biomed Res Int", year: 2015, pmid: "26236730" },
      { title: "Effect of GLY-HIS-LYS and its copper complex on TGF-beta secretion in normal human dermal fibroblasts", journal: "Acta Pol Pharm", year: 2014, pmid: "25745767" },
    ],
  },
  {
    name: "PT-141",
    category: "Sexual Health",
    mechanism: "Melanocortin receptor agonist (MC4R)",
    typicalDose: "1-2 mg as needed",
    frequency: "As needed, 45 min prior (SubQ)",
    cycleLength: "As needed",
    stacksWith: " - ",
    bestFor: "Sexual dysfunction research in both males and females",
    productSlugs: [],
    studies: [
      { title: "Melanocortin receptor agonists in the treatment of male and female sexual dysfunctions", journal: "Expert Opin Investig Drugs", year: 2014, pmid: "25096243" },
      { title: "Bremelanotide: first approval", journal: "Drugs", year: 2019, pmid: "31429064" },
      { title: "Melanocortin receptor agonists, penile erection, and sexual motivation: human studies with Melanotan II", journal: "Int J Impot Res", year: 2000, pmid: "11035391" },
    ],
  },
  {
    name: "Selank",
    category: "Cognitive",
    mechanism: "Tuftsin analogue, GABA modulation, BDNF upregulation",
    typicalDose: "250-500 mcg/day",
    frequency: "Daily (intranasal or SubQ)",
    cycleLength: "2-4 weeks",
    stacksWith: "Semax",
    bestFor: "Anxiety, cognitive enhancement, focus",
    productSlugs: [],
    studies: [
      { title: "Peptide Selank enhances the effect of diazepam in reducing anxiety in unpredictable chronic mild stress conditions in rats", journal: "Behav Neurol", year: 2017, pmid: "28280289" },
      { title: "Intranasal administration of the peptide Selank regulates BDNF expression in the rat hippocampus in vivo", journal: "Dokl Biol Sci", year: 2008, pmid: "18841804" },
      { title: "Selank, peptide analogue of tuftsin, protects against ethanol-induced memory impairment by regulating BDNF content in the hippocampus and prefrontal cortex in rats", journal: "Bull Exp Biol Med", year: 2019, pmid: "31625062" },
    ],
  },
  {
    name: "Semax",
    category: "Cognitive",
    mechanism: "ACTH(4-10) analogue, BDNF/NGF upregulation",
    typicalDose: "200-600 mcg/day",
    frequency: "Daily (intranasal)",
    cycleLength: "2-4 weeks",
    stacksWith: "Selank",
    bestFor: "Cognitive performance, neuroprotection, memory",
    productSlugs: [],
    studies: [
      { title: "Semax, an analog of ACTH(4-10) with cognitive effects, regulates BDNF and trkB expression in the rat hippocampus", journal: "Brain Res", year: 2006, pmid: "16996037" },
      { title: "Novel synthetic analogue of ACTH 4-10 (Semax) but not glycine prevents the enhanced nitric oxide generation in cerebral cortex of rats with incomplete global ischemia", journal: "Brain Res", year: 2001, pmid: "11245825" },
      { title: "Formation of spatial memory in rats with ischemic lesions to the prefrontal cortex; effects of a synthetic analog of ACTH(4-7)", journal: "Neurosci Behav Physiol", year: 2009, pmid: "19779827" },
    ],
  },
  {
    name: "Epithalon",
    category: "Anti-aging",
    mechanism: "Telomerase activation, pineal gland regulation",
    typicalDose: "5-10 mg/day",
    frequency: "Daily for 10-20 days (SubQ)",
    cycleLength: "10-20 day cycles, 2-3x/year",
    stacksWith: "GHK-Cu",
    bestFor: "Telomere maintenance, circadian rhythm, longevity research",
    productSlugs: [],
    studies: [
      { title: "Epithalon peptide induces telomerase activity and telomere elongation in human somatic cells", journal: "Bull Exp Biol Med", year: 2003, pmid: "12937682" },
      { title: "Peptide regulation of aging: 35-year research experience", journal: "Bull Exp Biol Med", year: 2009, pmid: "19902107" },
      { title: "Effect of epitalon on the lifespan increase in Drosophila melanogaster", journal: "Mech Ageing Dev", year: 2000, pmid: "11087911" },
    ],
  },
  {
    name: "Thymosin Alpha-1",
    category: "Immune",
    mechanism: "T-cell maturation, dendritic cell activation, immune modulation",
    typicalDose: "1.6 mg, 2-3x/week",
    frequency: "2-3x/week (SubQ)",
    cycleLength: "4-8 weeks",
    stacksWith: "BPC-157",
    bestFor: "Immune enhancement, chronic infection support",
    productSlugs: [],
    studies: [
      { title: "Thymosin alpha 1: a comprehensive review of the literature", journal: "World J Virol", year: 2020, pmid: "33362999" },
      { title: "From lab to bedside: emerging clinical applications of thymosin alpha 1", journal: "Expert Opin Biol Ther", year: 2009, pmid: "19392576" },
      { title: "Thymosin alpha 1 continues to show promise as an enhancer for vaccine response", journal: "Ann N Y Acad Sci", year: 2012, pmid: "23050813" },
    ],
  },
];
