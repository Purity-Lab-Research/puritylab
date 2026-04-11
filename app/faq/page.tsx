"use client";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import FaqAccordion from "@/components/faq/FaqAccordion";
import EditableText from "@/components/admin/EditableText";

const faqSections = [
  {
    title: "Ordering & Shipping",
    items: [
      {
        question: "How long does shipping take?",
        answer:
          "Orders are processed within 1 business day. Domestic delivery typically takes 2-4 business days depending on your location and shipping method selected at checkout.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "No. Purity Lab Research LLC ships exclusively within the United States. We do not accept or fulfill international orders.",
      },
      {
        question: "Is shipping discreet?",
        answer:
          "Yes. All orders ship in plain, unmarked packaging with no product names or branding visible on the outside. Your privacy is our priority.",
      },
      {
        question: "Do you offer free shipping?",
        answer:
          "Free shipping is available on all orders over $200 and on all active subscriptions.",
      },
      {
        question: "Can I change my shipping address after ordering?",
        answer:
          "If your order hasn't shipped yet, contact us immediately and we'll update the address. Once shipped, we cannot redirect packages.",
      },
    ],
  },
  {
    title: "Subscriptions",
    items: [
      {
        question: "How do subscriptions work?",
        answer:
          "When you subscribe to a research configuration or build a custom selection with the subscribe option, your chosen compounds are automatically shipped on your selected schedule (every 4, 6, or 8 weeks). You save up to 15% on every subscription order compared to one-time pricing.",
      },
      {
        question: "Can I pause my subscription?",
        answer:
          "Yes. You can pause your subscription anytime from your account dashboard. While paused, no shipments or charges occur. Resume whenever you're ready.",
      },
      {
        question: "Can I cancel my subscription?",
        answer:
          "Yes. Cancel anytime from your dashboard with no fees or penalties. Your subscription benefits continue until the end of your current billing period.",
      },
      {
        question: "Can I modify what's in my subscription?",
        answer:
          "Subscription modification is coming soon. In the meantime, you can cancel your current subscription and create a new one with different products.",
      },
      {
        question: "When am I charged?",
        answer:
          "You're charged when your subscription is created and then automatically on your selected delivery schedule (every 4, 6, or 8 weeks).",
      },
      {
        question: "What's the subscription discount?",
        answer:
          "All subscription orders receive 10% off the one-time purchase price on every item in your order.",
      },
    ],
  },
  {
    title: "Products & Quality",
    items: [
      {
        question: "Are your peptides third-party tested?",
        answer:
          "Yes. Every batch of every product is independently tested by a US-based analytical laboratory. We publish the full Certificate of Analysis on each product page and in our CoA Library.",
      },
      {
        question: "What purity do you guarantee?",
        answer:
          "We guarantee 98% or higher purity on all peptide products as verified by HPLC analysis. If a batch tests below 98%, we reject it and it never reaches our catalog. You can verify the exact purity of your specific batch using the Batch Tracker in our CoA Library.",
      },
      {
        question: "How should I store peptides?",
        answer:
          "Store lyophilized (powder form) peptides in a cool, dry environment or refrigerated at 2-8 degrees Celsius. Reconstituted peptides should be refrigerated at 2-8 degrees Celsius and used within the timeframe specified on the product documentation.",
      },
      {
        question: "Do you provide Certificates of Analysis?",
        answer:
          "Yes. Every product page includes the CoA for the current batch. You can also look up any batch number in our CoA Library. We publish the testing lab name, methodology, purity percentage, and test date.",
      },
      {
        question: "What does 'for research use only' mean?",
        answer:
          "All products sold by Purity Lab are intended exclusively for in-vitro laboratory research, scientific investigation, and educational purposes. They are not drugs, supplements, food products, or intended for human or animal consumption by any route of administration. This designation means that the products have not been evaluated by the FDA for safety or efficacy in humans. By purchasing from Purity Lab, you represent that you are at least 21 years of age and that all products will be used exclusively for lawful research purposes. Any use inconsistent with this designation is strictly prohibited and done entirely at the purchaser's own risk. Purity Lab assumes no liability for any misuse of products.",
      },
      {
        question: "What testing methodologies are used?",
        answer:
          "Our third-party laboratory partners use High-Performance Liquid Chromatography (HPLC) for purity analysis and Mass Spectrometry (MS) for molecular identity confirmation. These are industry-standard analytical methods for verifying peptide composition and purity.",
      },
    ],
  },
  {
    title: "Returns & Refunds",
    items: [
      {
        question: "What's your return policy?",
        answer:
          "Due to the nature of research chemicals, we cannot accept returns on opened products. Unopened, undamaged products may be returned within 14 days of delivery for a full refund. Contact us to initiate a return.",
      },
      {
        question: "What if my product arrives damaged?",
        answer:
          "Contact us immediately with photos of the damage. We will replace damaged products at no cost.",
      },
      {
        question: "How do I request a refund?",
        answer:
          "Email our support team with your order number. Refunds for eligible items are processed within 5-7 business days to your original payment method.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        description="Common questions about ordering, shipping, purity standards, and research compounds from Purity Lab."
        breadcrumbs={[{ label: "FAQ" }]}
      />

      <section className="mx-auto max-w-3xl px-6 py-16">
        <FaqAccordion sections={faqSections} useDynamic />

        {/* CTA */}
        <div className="mt-16 rounded-xl border border-border bg-primary/5 p-8 text-center">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-3 text-primary">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <h3 className="font-heading text-lg font-bold text-primary">
            <EditableText settingKey="faq_cta_heading">Still have questions?</EditableText>
          </h3>
          <p className="mt-2 text-sm text-text-secondary">
            <EditableText settingKey="faq_cta_description">
              Our team is happy to help. Reach out and we&apos;ll get back to you as soon as possible.
            </EditableText>
          </p>
          <div className="mt-5">
            <Button href="/contact" variant="fill">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
