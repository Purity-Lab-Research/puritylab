import type { Metadata } from "next";
import { DM_Sans, Instrument_Sans } from "next/font/google";
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
import WebVitals from "@/components/analytics/WebVitals";
import SiteTracker from "@/components/analytics/SiteTracker";

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
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
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
  other: {
    "theme-color": "#1A2B4A",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${instrumentSans.variable} ${dmSans.variable}`}>
      <body className="font-[family-name:var(--font-body)] text-text-primary bg-background leading-relaxed overflow-x-hidden">
        <GoogleAnalytics />
        <SentryInit />
        <WebVitals />
        <SiteTracker />
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
