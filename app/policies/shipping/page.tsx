import type { Metadata } from "next";
import PageHeader from "@/components/ui/PageHeader";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shipping Policy",
  description: `${SITE_NAME} shipping policy - same-day fulfillment, 2-4 business day US domestic delivery, free shipping over $200.`,
};

export default function ShippingPolicyPage() {
  return (
    <>
      <PageHeader
        title="SHIPPING POLICY"
        description="Same-day fulfillment. Free shipping on orders over $200."
        breadcrumbs={[{ label: "Shipping Policy" }]}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="prose prose-sm prose-gray max-w-none space-y-8 text-gray-700">
          <p className="text-sm text-gray-500">
            Effective Date: March 30, 2026 &nbsp;|&nbsp; Last Updated: March 30, 2026
          </p>

          {/* 1. Scope */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              1. Scope
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              This Shipping Policy applies to all orders placed through puritylabresearch.com. By placing an
              order, you agree to the terms of this policy. This policy forms part of and should be read
              together with our{" "}
              <a href="/policies/terms" className="text-[#10B981] hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/policies/refund" className="text-[#10B981] hover:underline">
                Refund Policy
              </a>
              .
            </p>
          </div>

          {/* 2. Processing Time */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              2. Processing Time
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All orders are processed same-day when placed before 2:00 PM EST on business days (Monday
              through Friday, excluding United States statutory holidays). Orders placed after this cutoff or
              on weekends and holidays will be processed on the next business day.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              During periods of high order volume, processing may take up to 2 business days. If your
              order is subject to additional processing time, we will notify you by email.
            </p>
          </div>

          {/* 3. Estimated Delivery Times */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              3. Estimated Delivery Times
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Once your order has been shipped, estimated delivery times are as follows:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li><strong>Standard Shipping:</strong> 2-4 business days</li>
              <li><strong>Priority Shipping:</strong> 1-2 business days</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              We currently ship within the United States only. International shipping is planned for the
              future. These are estimated timeframes and are not guaranteed. Actual delivery times may
              vary due to carrier capacity, weather, and other factors beyond our control. Free shipping
              is available on all orders over $200 and on all active subscriptions.
            </p>
          </div>

          {/* 4. Shipping Carriers */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              4. Shipping Carriers
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              We use the following carriers to fulfill orders, selected based on destination, package
              weight, and service level:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>USPS</li>
              <li>FedEx</li>
              <li>UPS</li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              The carrier is selected at our discretion unless a specific carrier option is available at
              checkout. We reserve the right to change carriers without prior notice.
            </p>
          </div>

          {/* 5. Shipping Destinations and Restrictions */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              5. Shipping Destinations and Restrictions
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              We currently ship within the United States only. We do not ship to P.O. boxes for
              orders requiring signature confirmation. International shipping may be available in
              the future.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to refuse or cancel any order shipping to a destination where we
              reasonably believe fulfillment would violate applicable export controls, sanctions, or
              import regulations. If your order is cancelled for this reason, you will receive a full
              refund.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              A non-exhaustive list of restricted destinations may be available on our website. It is
              ultimately the buyer&apos;s responsibility to verify that the products may be legally
              imported into their jurisdiction before placing an order.
            </p>
          </div>

          {/* 6. International Orders and Customs */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              6. International Orders and Customs
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              International shipments may be subject to customs duties, import taxes, value-added tax
              (VAT), goods and services tax (GST), brokerage fees, and other charges imposed by the
              destination country&apos;s customs authorities. These charges are determined by the
              destination country and are the sole responsibility of the buyer.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              {SITE_NAME} has no control over these charges and cannot predict or estimate their amount.
              We recommend contacting your local customs office for information on applicable duties and
              taxes before placing an order.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              All international shipments include accurate customs declarations as required by United States
              export regulations and international shipping law. We are legally required to declare the
              actual contents and value of each shipment.
            </p>
          </div>

          {/* 7. Customs Seizures and Import Issues */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              7. Customs Seizures and Import Issues
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              If your package is seized, detained, held, or destroyed by customs or border authorities
              in the destination country:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>
                {SITE_NAME} is not liable and no refund will be issued. By placing an international
                order, you accept this risk.
              </li>
              <li>
                It is your sole responsibility to ensure that the products you order may be legally
                imported into your jurisdiction.
              </li>
              <li>
                We will provide reasonable assistance by supplying documentation (such as Certificates
                of Analysis or product descriptions) that may help with customs clearance, but we
                cannot guarantee the outcome.
              </li>
              <li>
                If customs contacts us directly regarding your shipment, we will cooperate with
                authorities as required by law.
              </li>
            </ul>
          </div>

          {/* 8. Packaging */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              8. Packaging
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              All orders are shipped in discreet, professional packaging. External labels do not
              describe the specific contents beyond what is required by shipping carriers and customs
              regulations for lawful transport.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              International shipments will include customs declaration forms as legally required, which
              may describe the general nature and declared value of the contents. This is a legal
              requirement and cannot be omitted.
            </p>
          </div>

          {/* 9. Order Tracking */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              9. Order Tracking
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Once your order has been shipped, you will receive a confirmation email containing a
              tracking number and a link to track your shipment. If you do not receive tracking
              information within 2 business days of your order being processed, please contact us.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Please note that tracking updates may be delayed for international shipments, particularly
              during customs processing. A lack of tracking updates does not necessarily indicate a
              problem with your shipment.
            </p>
          </div>

          {/* 10. Lost or Delayed Packages */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              10. Lost or Delayed Packages
            </h2>

            <h3 className="mt-4 text-base font-semibold text-gray-900">10.1 Delayed Packages</h3>
            <p className="mt-2 text-sm leading-relaxed">
              If your package has not arrived within the estimated delivery window, please allow an
              additional 5 business days (10 business days for international orders) before contacting
              us, as delays can occur due to carrier or customs processing.
            </p>

            <h3 className="mt-4 text-base font-semibold text-gray-900">10.2 Lost Packages</h3>
            <p className="mt-2 text-sm leading-relaxed">
              If your package has not arrived within a reasonable timeframe beyond the estimated delivery
              window (15 business days for domestic, 30 business days for international), contact us and
              we will:
            </p>
            <ul className="mt-2 space-y-1.5 text-sm leading-relaxed list-disc pl-5">
              <li>Investigate with the shipping carrier.</li>
              <li>File a lost package claim where applicable.</li>
              <li>
                If the carrier confirms the package is lost, ship a replacement at no additional cost or
                issue a full refund, at your choice.
              </li>
            </ul>
            <p className="mt-2 text-sm leading-relaxed">
              We reserve the right to limit replacement shipments to a single replacement per order.
              Repeated lost-package claims from the same account may be subject to additional
              verification or account review.
            </p>
          </div>

          {/* 11. Risk of Loss */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              11. Risk of Loss
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Risk of loss and title for all products passes to you upon our delivery of the products to
              the shipping carrier. While we will assist with carrier claims for lost or damaged
              packages, {SITE_NAME} is not the insurer of shipments in transit.
            </p>
          </div>

          {/* 12. Shipping Costs */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              12. Shipping Costs
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              Shipping costs are calculated at checkout based on the destination, package weight, and
              selected shipping method. Any applicable free shipping promotions or thresholds will be
              clearly indicated on our website.
            </p>
            <p className="mt-2 text-sm leading-relaxed">
              Shipping costs are non-refundable except in cases where the order was not shipped, or
              where the shipment error was our fault (wrong product, missing items).
            </p>
          </div>

          {/* 13. Address Accuracy */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              13. Address Accuracy
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              You are responsible for providing a complete and accurate shipping address at checkout.
              {SITE_NAME} is not responsible for orders shipped to incorrect addresses provided by the
              buyer. If a package is returned to us due to an incorrect or incomplete address, we will
              contact you to arrange re-shipment. Additional shipping charges may apply for
              re-shipment.
            </p>
          </div>

          {/* 14. Contact */}
          <div>
            <h2 className="text-lg font-bold text-[#111111]">
              14. Contact
            </h2>
            <p className="mt-2 text-sm leading-relaxed">
              For shipping inquiries:
            </p>
            <div className="mt-2 text-sm leading-relaxed">
              <p>
                Email:{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="text-[#10B981] hover:underline">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>Subject Line: Shipping Inquiry - [Your Order Number]</p>
            </div>
          </div>

          <div className="rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] p-6">
            <p className="text-sm leading-relaxed">
              <strong className="text-[#111111]">Questions about shipping?</strong> Contact us at{" "}
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
