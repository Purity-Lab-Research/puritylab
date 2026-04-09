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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://puritylabresearch.com";

const SITE_TITLE = "Purity Lab | Research-Grade Peptide Protocols for Athletes";
const SITE_DESC = "Every batch third-party tested. 98%+ verified purity. Athlete recovery, fat loss, and performance peptide protocols with published Certificates of Analysis.";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESC,
  keywords: [
    "research peptides",
    "peptides online",
    "BPC-157",
    "peptide supplier",
    "lab research",
    "peptide stacks",
    "peptide protocols",
  ],
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    url: BASE_URL,
    siteName: "Purity Lab",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-image.png"],
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
