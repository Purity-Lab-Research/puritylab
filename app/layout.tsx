import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CartProvider from "@/components/cart/CartProvider";
import WishlistProvider from "@/components/wishlist/WishlistProvider";
import AgeGate from "@/components/layout/AgeGate";
import SiteShell from "@/components/layout/SiteShell";
import { SITE_NAME } from "@/lib/constants";
import StructuredData from "@/components/layout/StructuredData";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SentryInit from "@/components/analytics/SentryInit";
import CookieConsent from "@/components/layout/CookieConsent";
// ResearchDisclaimer removed - research acknowledgment is handled by the AgeGate and checkout compliance
import WebVitals from "@/components/analytics/WebVitals";
import SiteTracker from "@/components/analytics/SiteTracker";
import { Analytics } from "@vercel/analytics/next";
import TikTokPixel from "@/components/analytics/TikTokPixel";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

const SITE_TITLE = "Purity Lab | Research-Grade Peptides with Published CoAs";
const SITE_DESC = "Every batch third-party tested. 98%+ verified purity. Research-grade peptides and reference compounds with published Certificates of Analysis. For in-vitro laboratory research only.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "research peptides",
    "peptide supplier",
    "BPC-157",
    "laboratory research chemicals",
    "reference compounds",
    "certificate of analysis",
    "in-vitro research",
    "research-grade peptides",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: BASE_URL,
    siteName: "Purity Lab",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/sendmessage.jpg", width: 2400, height: 1790 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/images/sendmessage.jpg"],
  },
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  other: {
    "theme-color": "#FFFFFF",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-[family-name:var(--font-heading)] text-text-primary bg-background leading-relaxed overflow-x-hidden">
        <GoogleAnalytics />
        <SentryInit />
        <WebVitals />
        <SiteTracker />
        <Analytics />
        <TikTokPixel />
        <StructuredData />
        <CartProvider>
          <WishlistProvider>
            <AgeGate />
            <SiteShell>{children}</SiteShell>
            <CookieConsent />
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
