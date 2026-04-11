const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Purity Lab",
    url: BASE_URL,
    description:
      "Research-grade peptides and reference compounds for in-vitro laboratory use. Every batch third-party tested with published Certificates of Analysis. Same-day processing, domestic shipping.",
    contactPoint: {
      "@type": "ContactPoint",
      email: "support@puritylabresearch.com",
      contactType: "customer service",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Angeles",
      addressRegion: "California",
      addressCountry: "US",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Purity Lab",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${BASE_URL}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
    </>
  );
}
