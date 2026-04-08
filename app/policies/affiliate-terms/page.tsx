import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Affiliate Program Terms and Conditions",
  description: `${SITE_NAME} Affiliate Program terms, commission structure, payment terms, and acceptable use policy.`,
};

export default function AffiliateTermsPage() {
  return (
    <>
      <PageHeader
        title="AFFILIATE PROGRAM TERMS AND CONDITIONS"
        description="Please read these terms carefully before applying to or participating in the Purity Lab Affiliate Program."
        breadcrumbs={[
          { label: "Affiliate Program", href: "/affiliate" },
          { label: "Terms and Conditions" },
        ]}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="max-w-none space-y-8 text-[#6B7280] text-base leading-relaxed">
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-4">
            <p className="text-sm font-bold text-amber-800">
              BY APPLYING TO OR PARTICIPATING IN THE PURITY LAB AFFILIATE PROGRAM, YOU AGREE TO BE BOUND BY THESE TERMS. IF YOU DO NOT AGREE, DO NOT APPLY OR PARTICIPATE.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Effective Date: April 8, 2026 &nbsp;|&nbsp; Last Updated: April 8, 2026
          </p>

          {/* 1 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              1. Overview
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              The {SITE_NAME} Affiliate Program (the &quot;Program&quot;) allows approved
              participants (&quot;Affiliates&quot;) to earn commissions by referring new customers
              to {SITE_NAME} (&quot;Company,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;).
              These Terms and Conditions (the &quot;Agreement&quot;) govern your participation in
              the Program. This Agreement is between you (&quot;Affiliate,&quot; &quot;you,&quot;
              or &quot;your&quot;) and {SITE_NAME}.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              The Program is offered at the sole discretion of {SITE_NAME}. We reserve the right to
              modify, suspend, or terminate the Program, or any Affiliate&apos;s participation in it, at
              any time, for any reason, with or without notice.
            </p>
          </div>

          {/* 2 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              2. Eligibility and Approval
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              To participate in the Program, you must submit an application and receive written approval
              from {SITE_NAME}. We reserve the right to accept or reject any application at our sole
              discretion, without obligation to provide a reason.
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>You must be at least 18 years of age.</li>
              <li>You must provide accurate, truthful information in your application.</li>
              <li>
                Approval of your application does not guarantee continued participation. We may revoke
                your affiliate status at any time.
              </li>
              <li>
                You may not apply using fraudulent information. Doing so will result in immediate
                termination and forfeiture of all unpaid commissions.
              </li>
            </ul>
          </div>

          {/* 3 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              3. Commission Structure
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Subject to the terms of this Agreement:
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                <strong>First order commission:</strong> You earn 15% of the net sale amount on the
                first qualifying order placed by a referred customer.
              </li>
              <li>
                <strong>Recurring commission:</strong> You earn 10% of the net sale amount on all
                subsequent qualifying orders placed by that same referred customer.
              </li>
              <li>
                &quot;Net sale amount&quot; means the order subtotal after discounts, excluding taxes,
                shipping, and any fees.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              <strong>We reserve the right to change commission rates at any time.</strong> Changes
              to commission rates will be communicated via email and will apply to orders placed after
              the effective date of the change. We may also set custom commission rates for individual
              Affiliates at our discretion.
            </p>
          </div>

          {/* 4 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              4. Referral Tracking and Attribution
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Referrals are tracked using unique affiliate links and discount codes assigned to you.
              A referral cookie with a 30-day duration is set when a potential customer clicks your
              affiliate link.
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                If a customer clears their cookies, uses a different device, or the cookie expires before
                purchase, the referral may not be attributed to you. We are not responsible for lost
                attributions due to cookie behavior.
              </li>
              <li>
                If a customer clicks multiple affiliate links, the most recent click before purchase
                receives credit.
              </li>
              <li>
                We are the sole authority on referral attribution. Our tracking data is final and binding.
                Disputes over attribution will be resolved at our sole discretion.
              </li>
              <li>
                We reserve the right to adjust cookie duration at any time.
              </li>
            </ul>
          </div>

          {/* 5 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              5. Referral Discount
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              New customers referred through an affiliate link or code receive 10% off their first
              order. This discount is provided by {SITE_NAME} and does not reduce your commission. We
              reserve the right to modify or discontinue this referral discount at any time.
            </p>
          </div>

          {/* 6 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              6. Payment Terms
            </h2>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                Commissions are paid monthly, on or around the 1st of each month, for commissions
                earned during the previous month.
              </li>
              <li>
                The minimum payout threshold is $25.00 USD. If your balance is below this threshold,
                payment will roll over to the following month.
              </li>
              <li>
                Payments are made via ACH bank transfer or PayPal, based on your preference and the
                payment information you provide in your affiliate dashboard.
              </li>
              <li>
                You are responsible for providing accurate payment information. We are not responsible
                for payments sent to incorrect accounts due to errors in your provided information.
              </li>
              <li>
                Commissions are held in &quot;pending&quot; status for a minimum of 30 days after the
                associated order is placed. This allows for refund and chargeback processing. If an
                order is refunded, cancelled, or charged back during this period, the associated
                commission is reversed.
              </li>
              <li>
                You are solely responsible for all taxes owed on affiliate income. {SITE_NAME} does
                not withhold taxes and will not provide tax advice. If required by law, we may request
                tax identification information (such as a W-9 for U.S. affiliates) before issuing
                payment. Failure to provide requested tax documentation may result in withheld payments.
              </li>
              <li>
                We reserve the right to withhold, delay, or offset payments if we reasonably suspect
                fraud, policy violations, or erroneous commissions.
              </li>
            </ul>
          </div>

          {/* 7 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              7. Prohibited Activities
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              The following activities are strictly prohibited and will result in immediate termination
              and forfeiture of all unpaid commissions:
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                <strong>Self-referrals:</strong> Using your own affiliate link or code to purchase
                products for yourself, or referring friends or family members for the primary purpose
                of earning commissions rather than genuine promotion.
              </li>
              <li>
                <strong>Spam:</strong> Sending unsolicited emails, messages, or communications of any
                kind to promote your affiliate link.
              </li>
              <li>
                <strong>Misleading health claims:</strong> Making any claims that our products treat,
                cure, prevent, or diagnose any disease or medical condition. All products are for
                research use only and must be promoted as such.
              </li>
              <li>
                <strong>Branded paid search:</strong> Bidding on &quot;Purity Lab,&quot;
                &quot;PurityLab,&quot; &quot;puritylabresearch,&quot; or any misspelling or variation
                of our brand name in paid search advertising (Google Ads, Bing Ads, or similar
                platforms).
              </li>
              <li>
                <strong>Trademark misuse:</strong> Using our brand name, logo, or trademarks in your
                domain name, social media handle, or in any way that implies official affiliation,
                endorsement, or partnership beyond the affiliate relationship.
              </li>
              <li>
                <strong>Fake reviews or testimonials:</strong> Creating, purchasing, or incentivizing
                fake reviews or testimonials for {SITE_NAME} products.
              </li>
              <li>
                <strong>Cookie stuffing or click fraud:</strong> Using any technical means to force
                affiliate cookies, generate fake clicks, or artificially inflate referral statistics.
              </li>
              <li>
                <strong>Coupon and deal site abuse:</strong> Listing your affiliate code on public
                coupon aggregator sites (such as RetailMeNot or Honey) without prior written approval.
              </li>
              <li>
                <strong>Illegal activity:</strong> Promoting our products in connection with any
                illegal activity, including human consumption or sale for purposes other than
                legitimate scientific research.
              </li>
              <li>
                <strong>Misrepresentation:</strong> Misrepresenting the nature of your relationship
                with {SITE_NAME}, our products, or the terms of the affiliate program.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to determine, at our sole discretion, whether any activity
              constitutes a violation of these prohibited activities. Our determination is final.
            </p>
          </div>

          {/* 8 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              8. Content and Promotional Guidelines
            </h2>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                All promotional content must be truthful, not misleading, and compliant with applicable
                laws, including FTC disclosure requirements.
              </li>
              <li>
                You must clearly disclose your affiliate relationship with {SITE_NAME} in all content
                where you promote our products. Examples of acceptable disclosures include
                &quot;This post contains affiliate links&quot; or &quot;I may earn a commission if you
                purchase through my link.&quot;
              </li>
              <li>
                All products must be described as &quot;for research use only&quot; and &quot;not for
                human consumption.&quot; You may not imply or state otherwise.
              </li>
              <li>
                We may review your promotional content at any time and require modifications or removal
                of content that violates these guidelines. Failure to comply with such requests within
                48 hours may result in account suspension.
              </li>
            </ul>
          </div>

          {/* 9 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              9. Termination
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              <strong>Either party may terminate this Agreement at any time, for any reason, with or
              without cause.</strong>
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                <strong>Termination by {SITE_NAME}:</strong> We may suspend or terminate your affiliate
                account immediately, at our sole discretion, with or without notice. Reasons for
                termination include, but are not limited to, violation of these terms, inactivity,
                suspected fraud, reputational risk, legal liability, or any business reason we deem
                appropriate. We are not obligated to provide a reason for termination.
              </li>
              <li>
                <strong>Termination by Affiliate:</strong> You may deactivate your account at any time
                through your affiliate dashboard or by emailing affiliate@puritylabresearch.com.
              </li>
              <li>
                <strong>Effect of termination:</strong> Upon termination, all pending commissions under
                $25.00 are forfeited. Commissions above $25.00 that are fully approved (past the 30-day
                hold period) will be paid in the next regular payout cycle, provided no policy violations
                are identified.
              </li>
              <li>
                If termination is due to a violation of Section 7 (Prohibited Activities), all unpaid
                commissions, regardless of amount, are immediately forfeited.
              </li>
              <li>
                Upon termination, you must immediately cease all use of {SITE_NAME} branding,
                trademarks, affiliate links, and promotional materials.
              </li>
            </ul>
          </div>

          {/* 10 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              10. Program Modifications
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to modify any aspect of the Program at any time, including but not
              limited to:
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Commission rates and structure</li>
              <li>Cookie duration</li>
              <li>Payment terms, thresholds, and methods</li>
              <li>Referral discount amounts</li>
              <li>Eligibility criteria</li>
              <li>These Terms and Conditions</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              Material changes will be communicated via email to the address on your affiliate account.
              Your continued participation in the Program after receiving notice of changes constitutes
              acceptance of the updated terms. If you do not agree to the changes, you must terminate
              your participation.
            </p>
          </div>

          {/* 11 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              11. Suspension of the Program
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              We may temporarily or permanently suspend the entire Affiliate Program at any time, for
              any reason, including legal, regulatory, financial, or operational considerations. In the
              event of a full program suspension:
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                Approved commissions above the $25.00 threshold will be paid out in the final payout
                cycle.
              </li>
              <li>Pending commissions may be forfeited if the program is permanently discontinued.</li>
              <li>
                We will make reasonable efforts to provide 30 days notice before a permanent program
                discontinuation, but are not obligated to do so.
              </li>
            </ul>
          </div>

          {/* 12 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              12. Intellectual Property
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              {SITE_NAME} grants you a limited, non-exclusive, non-transferable, revocable license to
              use our approved marketing materials, logos, and product images solely for the purpose of
              promoting products under this Agreement. This license terminates immediately upon
              termination of your affiliate account.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              All intellectual property rights in and to the {SITE_NAME} brand, website, products, and
              marketing materials remain the exclusive property of {SITE_NAME}. Nothing in this
              Agreement grants you any ownership interest in our intellectual property.
            </p>
          </div>

          {/* 13 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              13. Limitation of Liability
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>
                THE TOTAL LIABILITY OF {SITE_NAME} TO YOU UNDER THIS AGREEMENT SHALL NOT EXCEED THE
                TOTAL COMMISSIONS ACTUALLY PAID TO YOU IN THE THREE (3) MONTHS PRECEDING THE CLAIM.
              </li>
              <li>
                IN NO EVENT SHALL {SITE_NAME} BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOST REVENUE, OR LOSS OF
                BUSINESS OPPORTUNITY, ARISING OUT OF OR RELATED TO THIS AGREEMENT.
              </li>
              <li>
                WE ARE NOT LIABLE FOR ANY TECHNICAL FAILURES, TRACKING ERRORS, COOKIE MALFUNCTIONS,
                OR THIRD-PARTY PLATFORM ISSUES THAT MAY AFFECT REFERRAL ATTRIBUTION OR COMMISSION
                CALCULATION.
              </li>
              <li>
                THE PROGRAM IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT
                WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
              </li>
            </ul>
          </div>

          {/* 14 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              14. Indemnification
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You agree to indemnify, defend, and hold harmless {SITE_NAME}, its owners, officers,
              directors, employees, and agents from and against any and all claims, damages, losses,
              liabilities, costs, and expenses (including reasonable attorney fees) arising out of or
              related to:
            </p>
            <ul className="mt-2 text-sm leading-relaxed list-disc pl-5 space-y-1">
              <li>Your participation in the Program</li>
              <li>Your promotional content and activities</li>
              <li>Your breach of this Agreement</li>
              <li>Your violation of any applicable law or regulation</li>
              <li>
                Any claims by third parties related to your promotional activities, including claims
                of false advertising, misleading health claims, or FTC violations
              </li>
            </ul>
          </div>

          {/* 15 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              15. Independent Contractor
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You are an independent contractor. Nothing in this Agreement creates an employment,
              partnership, joint venture, or agency relationship between you and {SITE_NAME}. You have
              no authority to bind {SITE_NAME} to any obligation or representation. You are solely
              responsible for your own taxes, insurance, and compliance with all applicable laws.
            </p>
          </div>

          {/* 16 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              16. Confidentiality
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You agree to keep confidential all non-public information related to the Program,
              including commission rates (if customized), internal communications, program strategies,
              and any data accessible through your affiliate dashboard. This obligation survives
              termination of this Agreement.
            </p>
          </div>

          {/* 17 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              17. Data and Privacy
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              We collect and process personal data related to your affiliate account (name, email,
              payment information) in accordance with our{" "}
              <a href="/policies/privacy" className="text-[#10B981] hover:underline">Privacy Policy</a>.
              You will not receive personally identifiable information about referred customers. You
              will only see aggregate or anonymized conversion data through your dashboard.
            </p>
          </div>

          {/* 18 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              18. Dispute Resolution
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Any disputes arising out of or related to this Agreement shall first be attempted to be
              resolved informally by contacting affiliate@puritylabresearch.com. If informal resolution fails, disputes
              shall be resolved through binding arbitration administered by the American Arbitration
              Association (AAA) under its Commercial Arbitration Rules. The arbitration shall take place
              in the state of California, and the decision of the arbitrator shall be final and binding.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              You agree to waive any right to participate in a class action lawsuit or class-wide
              arbitration against {SITE_NAME}.
            </p>
          </div>

          {/* 19 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              19. Governing Law
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              This Agreement shall be governed by and construed in accordance with the laws of the
              State of California, without regard to its conflict of law principles.
            </p>
          </div>

          {/* 20 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              20. Severability
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              If any provision of this Agreement is found to be invalid or unenforceable, the remaining
              provisions shall remain in full force and effect. The invalid provision shall be modified
              to the minimum extent necessary to make it valid and enforceable.
            </p>
          </div>

          {/* 21 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              21. Entire Agreement
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              This Agreement constitutes the entire agreement between you and {SITE_NAME} with respect
              to the Affiliate Program and supersedes all prior agreements, representations, or
              understandings. No modification of this Agreement shall be binding unless made in writing
              by {SITE_NAME}.
            </p>
          </div>

          {/* 22 */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              22. Contact
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              If you have questions about these terms or the Affiliate Program, contact us at:{" "}
              <a href="mailto:affiliate@puritylabresearch.com" className="text-[#10B981] hover:underline">
                affiliate@puritylabresearch.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
