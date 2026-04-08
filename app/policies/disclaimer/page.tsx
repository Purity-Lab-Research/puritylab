import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Legal Disclaimer",
  description: "Comprehensive research use disclaimer, limitation of liability, and assumption of risk for Purity Lab products.",
};

export default function DisclaimerPage() {
  return (
    <>
      <PageHeader
        title="Legal Disclaimer"
        description="Important legal notices regarding the use of this website and our products."
        breadcrumbs={[{ label: "Legal Disclaimer" }]}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-sm prose-gray max-w-none space-y-8 text-gray-700 font-body">
          <p className="text-sm text-gray-500">
            Effective Date: April 7, 2026
          </p>

          {/* Research Use */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Research Use Only
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All products sold by {SITE_NAME} are intended exclusively for in-vitro laboratory research, scientific investigation, and educational purposes. They are not intended, marketed, sold, or distributed for human consumption, self-administration, veterinary use, therapeutic application, diagnostic purposes, or any form of bodily introduction by any route including but not limited to injection, ingestion, inhalation, topical application, or any other method. Products sold by {SITE_NAME} are not FDA-approved drugs, dietary supplements, food additives, or cosmetics.
            </p>
          </div>

          {/* Age Requirement */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Age Requirement
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You must be at least 21 years of age to access this website, create an account, or purchase any products. By using this website, you represent and warrant under penalty of perjury that you are at least 21 years old and have the legal authority to enter into binding agreements.
            </p>
          </div>

          {/* No Medical Advice */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              No Medical Advice
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All product descriptions, dosing protocols, cycle recommendations, stacking suggestions, reconstitution instructions, storage guidelines, educational articles, research references, calculator outputs, and other informational content on this website are provided for educational and research reference purposes only. This information does not constitute and shall not be interpreted as medical advice, pharmaceutical guidance, therapeutic recommendations, dosing instructions for human use, diagnostic information, or any recommendation to use any product for human or animal consumption. {SITE_NAME} is not a medical provider, pharmacy, or healthcare facility.
            </p>
          </div>

          {/* Assumption of Risk */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Assumption of Risk
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You expressly acknowledge and assume all risks associated with the purchase, possession, storage, handling, transport, use, and disposal of all products. You voluntarily and knowingly release, waive, and forever discharge {SITE_NAME}, its owners, officers, directors, employees, agents, affiliates, suppliers, manufacturers, fulfillment partners, and their respective successors and assigns from any and all claims, demands, causes of action, suits, damages, losses, liabilities, costs, and expenses of every kind and nature, whether known or unknown, that arise from or relate in any way to your purchase, possession, or use of any products.
            </p>
          </div>

          {/* Limitation of Liability */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Limitation of Liability
            </h2>
            <p className="mt-2 text-sm leading-relaxed uppercase font-semibold">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {SITE_NAME} BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES OF ANY KIND, INCLUDING BUT NOT LIMITED TO PERSONAL INJURY OR DEATH, PROPERTY DAMAGE, LOSS OF PROFITS, MEDICAL EXPENSES, REGULATORY FINES, OR LEGAL FEES, ARISING FROM OR RELATED TO YOUR USE OF THIS WEBSITE OR PURCHASE OF ANY PRODUCTS. IN NO EVENT SHALL {SITE_NAME}&apos;S AGGREGATE LIABILITY EXCEED THE LESSER OF THE AMOUNT YOU PAID FOR THE SPECIFIC PRODUCT GIVING RISE TO THE CLAIM OR ONE HUNDRED DOLLARS ($100.00 USD).
            </p>
          </div>

          {/* Disclaimer of Warranties */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Disclaimer of Warranties
            </h2>
            <p className="mt-2 text-sm leading-relaxed uppercase font-semibold">
              ALL PRODUCTS AND SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. {SITE_NAME} EXPRESSLY DISCLAIMS ALL WARRANTIES INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
          </div>

          {/* CoA Disclaimer */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Certificate of Analysis Disclaimer
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Certificates of Analysis (CoAs) represent the test results of a specific batch at the specific time of testing. CoAs do not guarantee the purity, identity, or quality of a product after the testing date. Product quality may be affected by shipping conditions, storage conditions, temperature exposure, handling, time elapsed since testing, reconstitution method, and other factors outside {SITE_NAME}&apos;s control. Third-party testing is performed by independent laboratories over which {SITE_NAME} has no control. {SITE_NAME} does not guarantee the accuracy of third-party test results and assumes no liability for errors or omissions in testing.
            </p>
          </div>

          {/* Calculator Disclaimer */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Calculator and Tool Disclaimer
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Calculators and tools provided on this website are mathematical reference tools for educational purposes. They do not constitute dosing recommendations, medical advice, or instructions for human use. {SITE_NAME} assumes no liability for the use of these tools, the accuracy of user inputs, or any decisions taken based on tool outputs.
            </p>
          </div>

          {/* Indemnification */}
          <div>
            <h2 className="text-lg font-bold text-primary font-heading">
              Indemnification
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You agree to indemnify, defend, and hold harmless {SITE_NAME} and its owners, officers, employees, agents, and affiliates from any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys&apos; fees) arising from your use of products, your violation of these terms, or any claim that products were used for human or animal consumption.
            </p>
          </div>

          {/* Contact */}
          <div className="rounded-xl border border-border bg-primary/5 p-6">
            <p className="text-sm leading-relaxed">
              <strong className="text-primary">Questions?</strong> Contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-secondary hover:underline">
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
