export interface Article {
  slug: string;
  title: string;
  tag: string;
  category: "getting-started" | "by-goal" | "deep-dives" | "trust-safety";
  readTime: string;
  excerpt: string;
  content: string;
  relatedProductSlugs: string[];
  relatedArticleSlugs: string[];
}

const DISCLAIMER =
  "IMPORTANT DISCLAIMER: This article is provided for educational and informational purposes only. All information is compiled from published peer-reviewed research and is intended to provide context for laboratory researchers. Nothing in this article constitutes medical, pharmaceutical, therapeutic, diagnostic, or healthcare advice of any kind. This article does not recommend, suggest, or endorse the use of any product for human or animal consumption. All products referenced are for in-vitro laboratory research only. Dosing information, protocols, cycle recommendations, and stacking suggestions referenced herein are drawn from published research studies and are provided solely as educational context for researchers. They do not constitute instructions or recommendations for human use. Purity Lab, its owners, employees, and affiliates assume no liability for any actions taken based on the information in this article. Always consult a qualified, licensed healthcare professional before making any health-related decisions. Use of any product in a manner inconsistent with its labeled research purpose is strictly prohibited and done entirely at the user's own risk.";

export const articles: Article[] = [
  // ─── Getting Started ───
  {
    slug: "getting-started",
    title: "New to Peptides? The Complete Beginner's Guide",
    tag: "Beginner",
    category: "getting-started",
    readTime: "8 min read",
    excerpt:
      "Everything you need to know before your first peptide purchase. What they are, how they work, and the terminology you'll encounter.",
    content: `Peptides are short chains of amino acids, typically between 2 and 50, linked together by peptide bonds. They occur naturally in every living organism. Your body produces hundreds of them to regulate everything from immune function to tissue repair to hormone release. Research peptides are synthetic versions of these naturally occurring compounds, manufactured to extremely high purity standards for use in scientific study.

Athletes and biohackers have become increasingly interested in peptides because of the growing body of research around their potential applications. BPC-157, for instance, has been studied extensively for its role in accelerating soft tissue healing. CJC-1295 and Ipamorelin are studied for their ability to stimulate natural growth hormone release. MOTS-C is being researched for its effects on metabolism and endurance. The range of studied applications is broad and growing.

Before diving in, it's important to understand the legal and ethical framework. Research peptides are sold strictly for in-vitro laboratory research. They are not approved for human consumption, self-administration, or therapeutic use. By purchasing research peptides, you are confirming that you are 18 or older and that products will be handled by qualified researchers. This is a legal requirement, not a suggestion.

Here's some terminology you'll encounter. "Lyophilized" means freeze-dried, peptides ship as a dry powder in a vial. "Reconstitution" is the process of adding bacteriostatic water to that powder to create an injectable solution. "Subcutaneous" (SubQ) refers to injection into the fatty layer just beneath the skin, which is the most common administration route in research. "Intramuscular" (IM) means injection into muscle tissue. "mcg" stands for micrograms, most peptide doses are measured in micrograms, not milligrams.

What should you expect when you receive your first order? You'll get sealed vials containing a white or off-white lyophilized powder. You'll need bacteriostatic water and insulin syringes to reconstitute and measure doses. The powder is stable at room temperature during shipping, but once reconstituted, the solution should be refrigerated at 2-8°C and used within 30 days. Always handle vials with clean hands and swab rubber stoppers with alcohol before each use.

${DISCLAIMER}`,
    relatedProductSlugs: ["bpc-157-5mg", "bac-water-10ml", "syringes"],
    relatedArticleSlugs: ["how-to-reconstitute", "how-to-read-coa"],
  },
  {
    slug: "how-to-reconstitute",
    title: "How to Reconstitute & Dose Peptides",
    tag: "Guide",
    category: "getting-started",
    readTime: "5 min read",
    excerpt:
      "Step-by-step guide to reconstituting lyophilized peptides with bacteriostatic water and calculating accurate doses.",
    content: `Reconstitution is the process of dissolving lyophilized (freeze-dried) peptide powder into a liquid solution so it can be accurately measured and used in research. The standard solvent is bacteriostatic water (BAC water), which is sterile water containing 0.9% benzyl alcohol as a preservative. This preservative is what allows the reconstituted solution to remain stable for up to 30 days in the refrigerator, compared to sterile water which has no preservative and must be used immediately.

Here's the step-by-step process. First, gather your supplies: the peptide vial, a vial of bacteriostatic water, an insulin syringe (typically 1ml/29 gauge), and alcohol swabs. Swab the rubber stopper of both the peptide vial and the BAC water vial with alcohol and let them air dry for a few seconds. Draw your desired amount of BAC water into the syringe, a common amount is 1ml or 2ml depending on the concentration you want.

Insert the needle into the peptide vial through the rubber stopper. Here's the critical part: do not spray the water directly onto the powder. Instead, aim the needle at the inside wall of the vial and let the water trickle down slowly. This prevents damaging the peptide's molecular structure. Once all the water is in the vial, do not shake it. Gently roll the vial between your palms or swirl it in small circles until the powder is fully dissolved. This usually takes 1-3 minutes. The solution should be clear with no visible particles.

Now for dosing math. If you have a 5mg vial and you add 1ml of BAC water, every 0.1ml (10 units on an insulin syringe) contains 500mcg (0.5mg) of peptide. If you add 2ml, every 0.1ml contains 250mcg. The formula is: dose per unit = (total peptide in mcg) / (total water in units). So for a 10mg vial reconstituted with 2ml: 10,000mcg / 200 units = 50mcg per unit. To get a 250mcg dose, you'd draw 5 units.

After reconstitution, store the vial upright in the refrigerator at 2-8°C. Never freeze a reconstituted peptide. Use within 28-30 days. Always swab the stopper before each draw, and use a fresh syringe every time. If the solution becomes cloudy, discolored, or shows floating particles, discard it.

${DISCLAIMER}`,
    relatedProductSlugs: [
      "bac-water-10ml",
      "syringes",
      "bpc-157-5mg",
    ],
    relatedArticleSlugs: ["getting-started", "bpc-157-guide"],
  },
  {
    slug: "how-to-read-coa",
    title: "How to Read a Certificate of Analysis",
    tag: "Trust",
    category: "trust-safety",
    readTime: "4 min read",
    excerpt:
      "Not all CoAs are legitimate. Learn to identify the key fields that separate real third-party testing from manufacturer rubber stamps.",
    content: `A Certificate of Analysis (CoA) is a document issued by an analytical laboratory that confirms the identity and purity of a specific product batch. In the peptide industry, CoAs are your only objective proof of what's actually in a vial. The problem is that not all CoAs are created equal, and some companies exploit this by providing misleading or incomplete documents.

The first thing to check is the testing laboratory's name. A legitimate CoA will clearly identify the independent lab that performed the analysis. If the document just says "tested" without naming the lab, or if the lab name matches the peptide manufacturer, that's a red flag. Independent third-party testing means the lab has no financial incentive to produce favorable results. At Purity Lab, our CoAs name the testing laboratory because we want you to know exactly who verified what's in your vial.

Next, look for HPLC (High-Performance Liquid Chromatography) results. HPLC is the industry standard method for measuring peptide purity. The report should show a specific purity percentage, research-grade peptides should test at 98% or higher. The HPLC chromatogram (the graph showing peaks) should have one dominant peak representing the target peptide and minimal impurity peaks. If a CoA doesn't include HPLC data, it's incomplete at best.

Mass Spectrometry (MS) results confirm molecular identity. The observed molecular weight should match the known molecular weight of the peptide within a narrow margin. This confirms that the substance is actually the peptide it claims to be, not a different compound or a degraded fragment. A CoA with purity data but no identity confirmation is only half the picture.

Always verify that the batch number on the CoA matches the batch number on your product label. A generic CoA without a specific batch reference is essentially worthless, it might represent a completely different production run. Also check the test date. Testing should be recent and specific to your batch. A CoA from two years ago tells you nothing about the product you're holding now.

${DISCLAIMER}`,
    relatedProductSlugs: [],
    relatedArticleSlugs: ["spotting-fake-peptides", "getting-started"],
  },

  // ─── By Goal ───
  {
    slug: "peptides-for-recovery",
    title: "The Complete Guide to Peptides for Injury Recovery",
    tag: "Recovery",
    category: "by-goal",
    readTime: "7 min read",
    excerpt:
      "How BPC-157 and TB500 are studied for soft tissue repair, joint recovery, and accelerated healing from injuries and surgery.",
    content: `Recovery peptides are the most widely studied and commonly used category in the research peptide space. Two compounds dominate the conversation: BPC-157 (Body Protection Compound-157) and TB500 (a synthetic fragment of Thymosin Beta-4). Both have been subjects of extensive research for their roles in tissue repair, and they work through different but complementary mechanisms.

BPC-157 is a pentadecapeptide, a chain of 15 amino acids, originally isolated from human gastric juice. Research has focused on its ability to accelerate the healing of a wide range of tissues, including tendons, ligaments, muscles, and even the gastrointestinal tract. Studies have shown it promotes angiogenesis (the formation of new blood vessels), which is critical for delivering nutrients and oxygen to damaged tissue. It's been studied in the context of tendon-to-bone healing, muscle tears, and inflammatory conditions. Common research dosing ranges from 250-500mcg per day administered subcutaneously near the injury site.

TB500 is a synthetic version of a naturally occurring 43-amino acid peptide called Thymosin Beta-4. Its primary studied mechanism involves upregulating actin, a cell-building protein that plays a crucial role in cell migration, wound healing, and the formation of new blood vessels. Research suggests TB500 promotes systemic healing, meaning its effects aren't limited to the injection site. It's commonly studied for flexibility, reduced inflammation, and accelerated recovery from muscle and connective tissue injuries. Typical research dosing is in the range of 2-5mg administered twice weekly.

The combination of BPC-157 and TB500 is one of the most popular stacks in peptide research, and for good reason. BPC-157 tends to work locally at the injury site while TB500 works systemically. Together, they address tissue repair from multiple angles, local healing, systemic inflammation reduction, blood vessel formation, and cell migration. Our Wolverine Blend combines both peptides in a single vial for convenience.

Typical recovery protocols run 4-6 weeks. Many researchers run a loading phase of higher doses for the first 2 weeks, then reduce to a maintenance dose. After the cycle, a 2-4 week break is standard before beginning another cycle if needed. Results in research settings are typically observed within the first 2-3 weeks, with continued improvement throughout the cycle.

${DISCLAIMER}`,
    relatedProductSlugs: [
      "bpc-157-10mg",
      "tb500-10mg",
      "wolverine-blend-10-10mg",
    ],
    relatedArticleSlugs: ["bpc-157-guide", "getting-started"],
  },
  {
    slug: "peptides-for-fat-loss",
    title: "Peptides for Fat Loss: What Works and What Doesn't",
    tag: "Fat Loss",
    category: "by-goal",
    readTime: "6 min read",
    excerpt:
      "An honest look at MOTS-C, AOD 9604, and growth hormone peptides for body composition, what the research actually shows.",
    content: `The peptide fat loss space is full of marketing hype, so let's cut through it. There are peptides with legitimate research backing for metabolic optimization and body composition, and there are compounds that get wildly oversold. Understanding the difference will save you money and set realistic expectations.

MOTS-C (Mitochondrial-Derived Peptide) is one of the most exciting peptides in metabolic research. It's a 16-amino acid peptide encoded in the mitochondrial genome that plays a role in metabolic homeostasis. Research has shown MOTS-C activates AMPK (a master metabolic regulator), improves insulin sensitivity, and promotes fatty acid oxidation. In animal studies, MOTS-C administration prevented age-dependent and high-fat-diet-induced insulin resistance. It's not a "fat burner" in the traditional sense, it's a metabolic optimizer that helps your body process fuel more efficiently. Research doses typically range from 5-10mg administered subcutaneously several times per week.

AOD 9604 is a modified fragment of human growth hormone (specifically amino acids 177-191). It was originally developed for its potential anti-obesity effects. Research suggests it stimulates lipolysis (fat breakdown) and inhibits lipogenesis (fat formation) without the negative effects on blood sugar or growth that full-length growth hormone can cause. This makes it an interesting research compound for targeted fat reduction. It's typically studied at doses of 250-500mcg per day.

CJC-1295/Ipamorelin is a growth hormone secretagogue combination that stimulates your body's natural growth hormone release. While not directly a "fat loss peptide," elevated growth hormone levels are associated with improved body composition, including increased lean mass and decreased fat mass. The combination is popular because CJC-1295 provides sustained GH elevation while Ipamorelin provides sharp GH pulses, and neither significantly raises cortisol or prolactin. Research dosing is typically 100-300mcg of each, administered before bed when natural GH release peaks.

What doesn't work as well as marketing claims suggest? Any peptide marketed as a miracle fat burner that requires no dietary changes is overpromising. Peptides are tools that can optimize metabolic processes, but they work best in the context of proper nutrition and exercise. They're not shortcuts, they're studied as optimizers for people who already have the fundamentals in place.

${DISCLAIMER}`,
    relatedProductSlugs: [
      "mots-c-40mg",
      "aod-9604-5mg",
      "cjc-ipa-blend-5-5mg",
    ],
    relatedArticleSlugs: [
      "understanding-growth-hormone-secretagogues",
      "getting-started",
    ],
  },

  // ─── Deep Dives ───
  {
    slug: "bpc-157-guide",
    title: "BPC-157: Everything You Need to Know",
    tag: "Deep Dive",
    category: "deep-dives",
    readTime: "10 min read",
    excerpt:
      "The definitive research guide to Body Protection Compound-157, mechanisms, protocols, dosing, storage, and stacking options.",
    content: `BPC-157, or Body Protection Compound-157, is a synthetic pentadecapeptide consisting of 15 amino acids. It's derived from a protein found in human gastric juice and has become one of the most extensively studied peptides in the research community. Since the mid-1990s, over 100 published research studies have examined its effects on tissue repair, inflammation, and wound healing, an unusually robust body of evidence for a research peptide.

The primary mechanisms of action studied include angiogenesis (formation of new blood vessels to deliver nutrients to injured tissue), upregulation of growth factor expression (including VEGF and EGF), modulation of the nitric oxide system, and interaction with the dopamine system. Research has shown protective effects on tendons, ligaments, muscles, the gastrointestinal tract, and even bone. Notably, BPC-157 has demonstrated effects on tendon-to-bone healing in animal models, which is particularly relevant for research into sports injuries and post-surgical recovery.

Common research dosing falls in the range of 250-500mcg per day for a standard 5mg vial, or 500-1000mcg per day for researchers using 10mg or 20mg vials for more aggressive protocols. Administration is typically subcutaneous (SubQ), with many researchers injecting near the area of interest. The peptide appears to have systemic effects regardless of injection site, but proximity to the target tissue is a common research practice. Once-daily administration is standard, though some protocols split the daily dose into two injections (morning and evening).

Typical cycle length is 4-6 weeks, followed by a 2-4 week break before beginning a new cycle. Results in research settings are generally observed within the first 1-2 weeks. BPC-157 is commonly stacked with TB500 for a synergistic approach to recovery, BPC-157 provides localized healing while TB500 works systemically. Our Wolverine Blend was designed specifically for this combination, offering both peptides in a single convenient vial.

Regarding storage: lyophilized (unreconstituted) BPC-157 is stable at room temperature for extended periods, making it safe during shipping. Once reconstituted with bacteriostatic water, store the vial refrigerated at 2-8°C and use within 28-30 days. Do not freeze reconstituted peptides. Protect from light and heat. The reconstituted solution should be clear and colorless, discard if it becomes cloudy or shows particulate matter.

Side effects reported in the research literature are minimal. BPC-157 has a very high safety profile in animal studies, with no toxic effects reported even at doses far exceeding typical research ranges. However, as with any research compound, individual responses can vary, and long-term safety data in humans is limited.

${DISCLAIMER}`,
    relatedProductSlugs: [
      "bpc-157-5mg",
      "bpc-157-10mg",
      "bpc-157-20mg",
      "wolverine-blend-10-10mg",
    ],
    relatedArticleSlugs: ["peptides-for-recovery", "how-to-reconstitute"],
  },
  {
    slug: "understanding-growth-hormone-secretagogues",
    title: "Understanding Growth Hormone Secretagogues",
    tag: "Deep Dive",
    category: "deep-dives",
    readTime: "8 min read",
    excerpt:
      "How CJC-1295, Ipamorelin, and other GH secretagogues work, and why they're studied as alternatives to synthetic HGH.",
    content: `Growth hormone secretagogues (GHS) are a class of peptides that stimulate the pituitary gland to release growth hormone (GH) naturally. This is fundamentally different from synthetic human growth hormone (HGH), which introduces exogenous GH directly into the body. The distinction matters because GHS work with your body's natural feedback loops, while exogenous HGH bypasses them, which is why HGH carries risks of shutdown, insulin resistance, and other side effects that GHS largely avoid.

CJC-1295 (without DAC) is a modified version of Growth Hormone Releasing Hormone (GHRH). It acts on the GHRH receptor in the pituitary to stimulate GH release. The "without DAC" distinction is important, the original CJC-1295 with Drug Affinity Complex had a much longer half-life and caused sustained GH elevation that blunted the natural pulsatile pattern. The version without DAC has a shorter half-life (about 30 minutes), which preserves the natural pulse pattern and is generally preferred in research. It raises baseline GH levels without the blunting effect.

Ipamorelin is a selective growth hormone secretagogue and ghrelin receptor agonist. What makes it unique is its selectivity, it stimulates GH release without significantly raising cortisol, prolactin, or aldosterone. Most other GH secretagogues (like GHRP-6 or GHRP-2) increase hunger hormones and cortisol to varying degrees. Ipamorelin keeps things clean, which is why it's become the preferred GH secretagogue in many research protocols. It produces sharp GH pulses that mimic the body's natural release pattern.

The CJC-1295/Ipamorelin combination is studied for synergistic effects. CJC-1295 amplifies the overall GH signal while Ipamorelin triggers sharp release pulses. Together, they produce a robust but physiologically natural GH elevation pattern. Research suggests benefits across body composition (increased lean mass, decreased body fat), recovery (faster healing, improved sleep quality), and overall well-being. Timing typically follows the body's natural GH rhythm, administration before bed or first thing in the morning on an empty stomach is standard in research protocols.

Expected effects in research settings include improved sleep quality (often one of the first noticed effects), gradual improvements in body composition over 8-12 weeks, enhanced recovery from training and injuries, and improved skin quality. These are subtle, progressive effects, not dramatic overnight changes. GH secretagogues work best as part of a long-term optimization strategy, not as a quick fix. Research cycles typically run 8-12 weeks, with some protocols extending to 16 weeks before a break.

${DISCLAIMER}`,
    relatedProductSlugs: [
      "cjc-ipa-blend-5-5mg",
      "ipamorelin-10mg",
    ],
    relatedArticleSlugs: ["peptides-for-fat-loss", "peptides-for-recovery"],
  },

  // ─── Trust & Safety ───
  {
    slug: "spotting-fake-peptides",
    title: "How to Spot Fake or Underdosed Peptides",
    tag: "Trust",
    category: "trust-safety",
    readTime: "5 min read",
    excerpt:
      "Red flags that indicate low-quality, underdosed, or counterfeit peptides, and how to protect yourself as a researcher.",
    content: `The research peptide market has a quality problem. Because peptides are sold for research use and aren't regulated like pharmaceuticals, the barrier to entry for suppliers is low. This means the market includes everything from pharmaceutical-grade manufacturers to operations rebottling underdosed or entirely different compounds. Knowing what to look for can save you from wasting money on products that don't contain what the label claims.

Price is a data point, not a verdict. If a company is selling BPC-157 5mg for $15 when the market average is $40-60, that should raise questions. Peptide synthesis has real costs, raw materials, purification, quality control, and testing. Prices significantly below market average often mean corners were cut somewhere, and that somewhere is usually purity or accurate dosing. That said, the most expensive option isn't automatically the best either. Look at the whole picture: pricing, testing transparency, and company reputation.

The single most important quality indicator is third-party testing. Check whether the company publishes Certificates of Analysis from an independent lab (not the manufacturer). The CoA should name the testing laboratory, show HPLC purity results (98%+ for research grade), include Mass Spectrometry identity confirmation, and reference a specific batch number. If a company can't or won't provide this, that tells you everything. At Purity Lab, we publish every CoA on our website and link them to specific batch numbers so you can verify exactly what's in your vial.

Visual inspection of the lyophilized powder offers additional clues, though it's not definitive. Research-grade peptides typically appear as a white to off-white dry powder or puck at the bottom of the vial. If the powder is yellow, brown, or has an unusual consistency, that could indicate degradation or contamination. After reconstitution, the solution should be clear and colorless. Cloudiness, discoloration, or floating particles are red flags. However, visual inspection alone can't confirm purity, that requires analytical testing.

Source transparency matters. Reputable peptide companies will tell you where their products are synthesized, where they're tested, and how they're handled throughout the supply chain. Vague claims like "pharmaceutical grade" or "99% purity" without supporting documentation are marketing, not evidence. Look for companies that publish their testing methodology, name their testing partners, and provide batch-specific (not generic) Certificates of Analysis.

${DISCLAIMER}`,
    relatedProductSlugs: [],
    relatedArticleSlugs: ["how-to-read-coa", "getting-started"],
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  "getting-started": "Getting Started",
  "by-goal": "By Goal",
  "deep-dives": "Deep Dives",
  "trust-safety": "Trust & Safety",
};

export const CATEGORY_ORDER = [
  "getting-started",
  "by-goal",
  "deep-dives",
  "trust-safety",
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(
  category: string
): Article[] {
  return articles.filter((a) => a.category === category);
}
