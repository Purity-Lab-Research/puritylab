import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `${SITE_NAME} terms of service - rules and conditions for purchasing research peptides.`,
};

export default function TermsPage() {
  return (
    <>
      <PageHeader
        title="TERMS OF SERVICE"
        description="Rules and conditions for using our website and purchasing our products."
        breadcrumbs={[{ label: "Terms of Service" }]}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="max-w-none space-y-8 text-[#6B7280] text-base leading-relaxed">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-4">
            <p className="text-sm font-bold text-amber-800">
              IMPORTANT: PLEASE READ THESE TERMS CAREFULLY BEFORE USING THIS WEBSITE OR PURCHASING ANY PRODUCTS.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Effective Date: April 7, 2026 &nbsp;|&nbsp; Last Updated: April 7, 2026
          </p>

          {/* 1. Acceptance of Terms */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              1. Acceptance of Terms
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              These Terms of Service govern your use of the website puritylabresearch.com, operated by
              Purity Lab Research LLC, a California limited liability company. By accessing, browsing, or
              using this website or placing an order through our platform, you acknowledge that you have
              read, understood, and agree to be bound by these Terms of Service, our Privacy Policy,
              Refund Policy, and Shipping Policy (collectively, the &ldquo;Agreements&rdquo;). If you do
              not agree to these terms, you must not use our website or purchase our products.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to modify these Terms of Service at any time. Material changes will
              be posted on this page with a revised effective date. Your continued use of the website
              after such changes constitutes your acceptance of the updated terms. We encourage you to
              review these terms periodically.
            </p>
          </div>

          {/* 2. Eligibility and Age Requirement */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              2. Eligibility and Age Requirement
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You must be at least 21 years of age to create an account, place an order, or purchase any
              products from {SITE_NAME}. By using our website or placing an order, you represent and
              warrant that you are at least 21 years old and have the legal capacity to enter into a
              binding agreement.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to request proof of age or identity at any time and to refuse or
              cancel any order if we reasonably believe the purchaser does not meet the age requirement.
            </p>
          </div>

          {/* 3. Research Use Only */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              3. Research Use Only Agreement
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All products sold by {SITE_NAME} are intended exclusively for in-vitro laboratory research, scientific investigation, and educational purposes. They are not intended, marketed, sold, or distributed for human consumption, self-administration, veterinary use, therapeutic application, diagnostic purposes, or any form of bodily introduction by any route including but not limited to injection, ingestion, inhalation, topical application, or any other method. By accessing this website, creating an account, or placing an order, you represent and warrant that:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>(a) You are at least 21 years of age.</li>
              <li>(b) You are legally permitted to purchase research chemicals in your jurisdiction.</li>
              <li>(c) All products purchased will be used exclusively for lawful in-vitro laboratory research or educational purposes.</li>
              <li>(d) You will not resell, redistribute, or provide any products to any person under the age of 21.</li>
              <li>(e) You will not use or permit any product to be used for human or animal consumption or any therapeutic purpose.</li>
              <li>(f) You have the legal authority and scientific knowledge necessary to handle research chemicals safely.</li>
              <li>(g) You understand that research peptides are not FDA-approved drugs, supplements, or food products.</li>
              <li>(h) You will comply with all applicable federal, state, and local laws regarding the purchase, possession, handling, storage, and disposal of research chemicals.</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              Any violation of this section constitutes a material breach of these Terms and may result in immediate termination of your account, cancellation of pending orders, and referral to appropriate authorities.
            </p>
          </div>

          {/* 4. Prohibited Uses */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              4. Prohibited Uses
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              In addition to the restrictions in Section 3, you agree not to:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>
                Use our products for any unlawful purpose or in violation of any applicable local,
                provincial, national, or international law or regulation.
              </li>
              <li>
                Purchase products with the intent to resell, redistribute, or re-export in violation of
                applicable trade laws.
              </li>
              <li>
                Misrepresent your identity, institutional affiliation, or intended use of products.
              </li>
              <li>
                Attempt to circumvent any age verification, eligibility check, or security measure on
                our website.
              </li>
              <li>Use our website to transmit malware, viruses, or other harmful code.</li>
              <li>
                Scrape, crawl, or use automated means to access our website or collect data without our
                written permission.
              </li>
              <li>Interfere with or disrupt the operation of our website or servers.</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to refuse service, cancel orders, and terminate accounts at our sole
              discretion if we reasonably believe any of these prohibitions have been violated.
            </p>
          </div>

          {/* 5. Account Registration */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              5. Account Registration
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              To place orders, you may be required to create an account. You are responsible for
              maintaining the confidentiality of your account credentials and for all activities that
              occur under your account. You agree to:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Update your information promptly if it changes.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to suspend or terminate your account at any time if we believe
              information provided is inaccurate, or if your account has been used in violation of these
              Terms.
            </p>
          </div>

          {/* 6. Orders and Payment */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              6. Orders and Payment
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All orders are subject to acceptance by {SITE_NAME}. We reserve the right to refuse or
              cancel any order at our sole discretion for any reason, including but not limited to:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>Suspected fraudulent or unauthorized transactions.</li>
              <li>Orders that appear intended for non-research use.</li>
              <li>
                Orders shipping to jurisdictions where the products may be restricted or prohibited.
              </li>
              <li>Pricing or product description errors on our website.</li>
              <li>Failure to pass age or eligibility verification.</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              Payment must be received in full before orders are processed and shipped. All prices
              listed on our website are in USD unless otherwise stated. Prices are subject to change
              without prior notice, but changes will not affect orders that have already been confirmed.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Applicable taxes will be calculated and added at checkout based on your shipping
              destination and applicable tax laws.
            </p>
          </div>

          {/* 7. Subscriptions */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              7. Subscriptions
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              {SITE_NAME} offers subscription plans that provide automatic recurring shipments at a
              discounted price. By subscribing, you agree to the following terms:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>
                Subscriptions are billed automatically at the frequency you select (every 4, 6, or 8
                weeks). The first charge occurs at the time of subscription creation.
              </li>
              <li>
                Subscription orders receive a 10% discount off the one-time purchase price for all
                included items.
              </li>
              <li>
                You may pause or cancel your subscription at any time from your account dashboard.
                Pausing stops future shipments and charges until you choose to resume.
              </li>
              <li>
                Cancellation takes effect at the end of the current billing period. No refunds are
                issued for subscription orders that have already been shipped.
              </li>
              <li>
                {SITE_NAME} reserves the right to modify subscription pricing with 30 days&apos; notice.
                You will be notified by email before any price change takes effect.
              </li>
            </ul>
          </div>

          {/* 8. Product Information and Accuracy */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              7. Product Information and Accuracy
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              We make reasonable efforts to ensure that product descriptions, specifications, images,
              and pricing on our website are accurate. However, we do not warrant that product
              descriptions or other website content are error-free, complete, or current.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              All products are provided for research purposes and are accompanied by relevant
              specifications such as purity, molecular weight, and sequence where applicable.
              Certificates of Analysis (COAs) are available upon request.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to correct any errors in product information and to update content
              without prior notice. If a product you have ordered is materially different from its
              description, you may be eligible for a refund or replacement under our Refund Policy.
            </p>
          </div>

          {/* 8. Shipping and Delivery */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              8. Shipping and Delivery
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Shipping terms, estimated delivery times, carrier information, and related policies are
              set out in our Shipping Policy, which forms part of these Terms of Service. By placing an
              order, you agree to the terms of our Shipping Policy. Key provisions include:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>
                International buyers are solely responsible for compliance with all import regulations,
                customs requirements, and local laws governing the importation of research chemicals in
                their jurisdiction.
              </li>
              <li>
                Customs duties, import taxes, brokerage fees, and any other charges imposed by the
                destination country are the sole responsibility of the buyer.
              </li>
              <li>Risk of loss passes to the buyer upon delivery to the shipping carrier.</li>
              <li>
                {SITE_NAME} is not liable for delays caused by customs processing, carrier issues, or
                events beyond our reasonable control.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              For full details, refer to our{" "}
              <a href="/policies/shipping" className="text-[#10B981] hover:underline">
                Shipping Policy
              </a>
              .
            </p>
          </div>

          {/* 9. Refunds and Returns */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              9. Refunds and Returns
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Our refund and return terms are set out in our Refund Policy, which forms part of these
              Terms of Service. Key provisions include:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>
                Refunds or replacements are available only for orders that arrive damaged in transit,
                contain the wrong product, or have missing items.
              </li>
              <li>
                Claims must be submitted within 3 calendar days of delivery with photographic evidence.
              </li>
              <li>
                No refunds are issued for packages seized, held, or destroyed by customs authorities.
              </li>
              <li>
                No refunds are issued for buyer&apos;s remorse, change of mind, or incorrect ordering.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              For full details, refer to our{" "}
              <a href="/policies/refund" className="text-[#10B981] hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </div>

          {/* 10. Export Compliance and Sanctions */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              10. Export Compliance and Sanctions
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              {SITE_NAME} complies with all applicable applicable United States export control laws and regulations,
              including the Export Administration Regulations (EAR) and sanctions administered by the
              Office of Foreign Assets Control (OFAC).
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              We do not ship to countries, regions, entities, or individuals subject to U.S.
              sanctions or embargoes. By placing an order, you represent and warrant that:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>
                You are not located in, and will not ship or transfer products to, any country or
                region subject to U.S., EU, or UN sanctions or embargoes.
              </li>
              <li>
                You are not named on any restricted party list, including the U.S. Specially Designated Nationals (SDN) list
                or the Entity List.
              </li>
              <li>
                You will not use, re-export, or transfer products in violation of any applicable export
                control or sanctions laws.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to cancel any order that we reasonably believe would violate export
              control or sanctions requirements.
            </p>
          </div>

          {/* 11. Intellectual Property */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              11. Intellectual Property
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All content on the {SITE_NAME} website, including but not limited to text, images,
              graphics, logos, trademarks, product descriptions, page layouts, and software, is the
              property of {SITE_NAME} or its licensors and is protected by applicable United States and
              international intellectual property laws.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              You may not reproduce, distribute, modify, create derivative works from, publicly display,
              or commercially exploit any content from our website without our prior written permission.
              Limited personal, non-commercial use (such as printing a product page for reference) is
              permitted.
            </p>
          </div>

          {/* Assumption of Risk */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              12. Assumption of Risk and Release of Claims
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You expressly acknowledge and assume all risks associated with the purchase, possession, storage, handling, transport, use, and disposal of all products. These risks include but are not limited to: improper storage leading to product degradation; contamination from improper handling; adverse reactions from misuse; legal consequences from non-compliant use; financial loss from product that does not meet your expectations. You voluntarily and knowingly release, waive, and forever discharge {SITE_NAME}, its owners, officers, directors, employees, agents, affiliates, suppliers, manufacturers, fulfillment partners, and their respective successors and assigns (collectively &quot;Released Parties&quot;) from any and all claims, demands, causes of action, suits, damages, losses, liabilities, costs, and expenses of every kind and nature, whether known or unknown, suspected or unsuspected, disclosed or undisclosed, that arise from or relate in any way to your purchase, possession, or use of any products. This release applies to claims arising under contract, tort, negligence, strict liability, product liability, consumer protection statutes, or any other legal theory.
            </p>
          </div>

          {/* Disclaimer of Warranties */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              13. Disclaimer of Warranties
            </h2>
            <p className="mt-2 text-sm leading-relaxed uppercase font-semibold">
              ALL PRODUCTS AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. {SITE_NAME} EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO: IMPLIED WARRANTIES OF MERCHANTABILITY; FITNESS FOR A PARTICULAR PURPOSE; NON-INFRINGEMENT; WARRANTIES ARISING FROM COURSE OF DEALING OR USAGE OF TRADE; WARRANTIES REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY PRODUCT DESCRIPTION, CERTIFICATE OF ANALYSIS, PURITY CLAIM, TEST RESULT, OR OTHER CONTENT. {SITE_NAME} DOES NOT WARRANT THAT: (A) PRODUCTS WILL MEET YOUR REQUIREMENTS OR EXPECTATIONS; (B) PRODUCTS WILL BE FREE FROM DEFECTS; (C) CERTIFICATES OF ANALYSIS REFLECT THE CURRENT CONDITION OF THE PRODUCT AFTER SHIPMENT AND STORAGE; (D) THE WEBSITE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE; (E) ANY INFORMATION PROVIDED IS ACCURATE, COMPLETE, OR CURRENT.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Some jurisdictions do not allow the exclusion of implied warranties. In such jurisdictions, the above exclusions apply to the fullest extent permitted by applicable law.
            </p>
          </div>

          {/* Product Information Disclaimer */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              14. Product Information and Content Disclaimer
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All product descriptions, dosing protocols, cycle recommendations, stacking suggestions, reconstitution instructions, storage guidelines, educational articles, research references, calculator outputs, and other informational content on this website are provided for educational and research reference purposes only. This information does not constitute and shall not be interpreted as: medical advice; pharmaceutical guidance; therapeutic recommendations; dosing instructions for human use; diagnostic information; or any recommendation to use any product for human or animal consumption. {SITE_NAME} is not a medical provider, pharmacy, or healthcare facility.
            </p>
          </div>

          {/* CoA Disclaimer */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              15. Certificate of Analysis Disclaimer
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Certificates of Analysis (CoAs) represent the test results of a specific batch at the specific time of testing. CoAs do not guarantee the purity, identity, or quality of a product after the testing date. Product quality may be affected by shipping conditions, storage conditions, temperature exposure, handling, time elapsed since testing, reconstitution method, and other factors outside {SITE_NAME}&apos;s control. {SITE_NAME} makes no warranty or guarantee that the product you receive matches the CoA in every respect at the time of delivery. Third-party testing is performed by independent laboratories over which {SITE_NAME} has no control. {SITE_NAME} does not guarantee the accuracy of third-party test results and assumes no liability for errors or omissions in testing.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              16. Limitation of Liability
            </h2>
            <p className="mt-2 text-sm leading-relaxed uppercase font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {SITE_NAME} OR ANY OF THE RELEASED PARTIES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES OF ANY KIND, INCLUDING BUT NOT LIMITED TO: PERSONAL INJURY OR DEATH; PROPERTY DAMAGE; LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITY; COST OF SUBSTITUTE PRODUCTS OR SERVICES; MEDICAL EXPENSES; RESEARCH COSTS OR LOST RESEARCH TIME; REGULATORY FINES OR PENALTIES; LEGAL FEES; OR ANY OTHER PECUNIARY OR NON-PECUNIARY LOSS, ARISING FROM OR RELATED TO: (A) YOUR USE OF THIS WEBSITE; (B) YOUR PURCHASE OF ANY PRODUCTS; (C) YOUR USE, MISUSE, OR INABILITY TO USE ANY PRODUCTS; (D) ANY INFORMATION, CONTENT, CALCULATORS, TOOLS, ARTICLES, PROTOCOLS, OR RECOMMENDATIONS PROVIDED ON THIS WEBSITE; (E) ANY CERTIFICATE OF ANALYSIS, TEST RESULT, PURITY CLAIM, OR PRODUCT DESCRIPTION; (F) ANY DELAY, FAILURE, OR ERROR IN FULFILLMENT OR SHIPPING; (G) ANY ACTIONS TAKEN OR NOT TAKEN BASED ON CONTENT ON THIS WEBSITE. THIS LIMITATION APPLIES REGARDLESS OF THE THEORY OF LIABILITY AND EVEN IF {SITE_NAME} HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. IN NO EVENT SHALL {SITE_NAME}&apos;S AGGREGATE LIABILITY FOR ALL CLAIMS EXCEED THE LESSER OF: (I) THE AMOUNT YOU PAID FOR THE SPECIFIC PRODUCT GIVING RISE TO THE CLAIM, OR (II) ONE HUNDRED DOLLARS ($100.00 USD). SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IN SUCH JURISDICTIONS, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.
            </p>
          </div>

          {/* Indemnification */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              17. Indemnification
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You agree to indemnify, defend, and hold harmless {SITE_NAME} and all Released Parties from and against any and all claims, demands, causes of action, suits, proceedings, investigations, damages, losses, liabilities, penalties, fines, costs, and expenses (including reasonable attorneys&apos; fees, court costs, and expert witness fees) arising from or related to: (a) your use of any products purchased from this site; (b) your violation of these Terms of Service or any applicable law, regulation, or ordinance; (c) any bodily injury, death, or property damage caused by or related to any product; (d) any claim that a product was used for human or animal consumption; (e) any misrepresentation you make regarding the intended use of products; (f) any claim brought by a third party related to your use, distribution, or handling of any product; (g) any regulatory action, investigation, or inquiry related to your purchase or use of any product. This indemnification obligation shall survive the termination of your account and these Terms of Service.
            </p>
          </div>

          {/* 18. Dispute Resolution - keep existing but renumber */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              18. Dispute Resolution and Arbitration
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Any dispute, controversy, or claim arising out of or relating to these Terms of Service, any product purchased, or this website shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules. The arbitration shall be conducted in Los Angeles County, California, by a single arbitrator. The arbitrator&apos;s decision shall be final and binding and may be entered as a judgment in any court of competent jurisdiction.
            </p>
            <p className="mt-2 text-sm leading-relaxed uppercase font-semibold">
              YOU AGREE THAT ANY DISPUTE RESOLUTION PROCEEDINGS WILL BE CONDUCTED ONLY ON AN INDIVIDUAL BASIS AND NOT IN A CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. YOU WAIVE ANY RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT OR CLASS-WIDE ARBITRATION AGAINST {SITE_NAME}.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              If any part of this arbitration provision is found to be unenforceable, the remainder shall continue to apply. EU consumers retain rights under mandatory consumer protection laws of their member state.
            </p>
          </div>

          {/* Keep remaining sections but renumber */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              19. Force Majeure
            </h2>
          </div>

          {/* Old sections 15-20 removed - superseded by new sections 12-18 above */}

          {/* 19. Force Majeure (content) */}
          <div>
            <p className="mt-2 text-sm leading-relaxed">
              {SITE_NAME} shall not be liable for any failure or delay in performance resulting from causes beyond our reasonable control, including but not limited to natural disasters, pandemics, government actions or restrictions, sanctions, embargoes, carrier disruptions, wars, acts of terrorism, labor disputes, supply chain interruptions, or internet or telecommunications failures.
            </p>
          </div>

          {/* 20. Governing Law */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              20. Governing Law
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of the State of California and the federal laws of the United States applicable therein, without regard to conflict of law principles. Any legal action or proceeding not subject to arbitration against Purity Lab Research LLC shall be brought exclusively in the federal or state courts located in Los Angeles County, California. You consent to the personal jurisdiction of such courts.
            </p>
          </div>

          {/* 21. Severability */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              21. Severability
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              If any provision of these Terms is found to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving the original intent.
            </p>
          </div>

          {/* 22. Entire Agreement */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              22. Entire Agreement
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              These Terms of Service, together with the Privacy Policy, Refund Policy, Shipping Policy, Legal Disclaimer, and any other policies referenced herein, constitute the entire agreement between you and Purity Lab Research LLC. No oral or written statement by any representative of Purity Lab Research LLC shall modify these terms.
            </p>
          </div>

          {/* 23. Contact */}
          <div>
            <h2 className="text-lg font-bold text-[#111111] ">
              23. Contact Information
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              For questions or concerns regarding these Terms of Service, please contact:
            </p>
            <div className="mt-2 text-sm leading-relaxed">
              <p className="font-semibold">Purity Lab Research LLC</p>
              <p>A California limited liability company</p>
              <p>United States</p>
              <p>
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#10B981] hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[#dde2ea] bg-[#111111]/5 p-6">
            <p className="text-sm leading-relaxed">
              <strong className="text-[#111111]">Questions?</strong> Contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#10B981] hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
