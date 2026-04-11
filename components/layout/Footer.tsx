"use client";

import Link from "next/link";
import {
  CONTACT_EMAIL,
  BUSINESS_ADDRESS,
  SOCIAL_LINKS,
  PAYMENT_METHODS,
  SITE_DESCRIPTION,
} from "@/lib/constants";
import EditableText from "@/components/admin/EditableText";

const protocolLinks = [
  { label: "Tissue Research", href: "/protocols/recovery" },
  { label: "Metabolic Research", href: "/protocols/fat-loss" },
  { label: "GH Research", href: "/protocols/performance" },
  { label: "Comprehensive", href: "/protocols/full-recomp" },
  { label: "Build Your Own", href: "/protocols/build" },
];

const learnLinks = [
  { label: "CoA Library", href: "/coa" },
  { label: "How We Test", href: "/how-we-test" },
  { label: "FAQ", href: "/faq" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Referral Program", href: "/affiliate" },
  { label: "Terms", href: "/policies/terms" },
  { label: "Privacy", href: "/policies/privacy" },
  { label: "Shipping", href: "/policies/shipping" },
  { label: "Legal Disclaimer", href: "/policies/disclaimer" },
];

function PaymentIcon({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded bg-gray-100 px-2 py-1 text-xs font-medium text-[#6B7280]">
      {name}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#F0F0F0]">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <img src="/images/logo.svg" alt="Purity Lab" width={32} height={32} className="h-8 w-8" />
              <span className="text-xl font-extrabold tracking-tight text-[#111111]">
                PURITY LAB
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-[#6B7280] max-w-sm">
              <EditableText settingKey="footer_description">
                {SITE_DESCRIPTION}
              </EditableText>
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              {/* TikTok */}
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[#6B7280] transition-colors hover:bg-[#111111] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.22 8.22 0 0 0 4.76 1.51V6.69h-1z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[#6B7280] transition-colors hover:bg-[#111111] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              {/* YouTube */}
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[#6B7280] transition-colors hover:bg-[#111111] hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-1.5 text-sm text-[#6B7280]">
              <p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-[#111111]"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
              <p>{BUSINESS_ADDRESS}</p>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-3">
            {/* Protocols */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#111111] uppercase">
                Research Configurations
              </h3>
              <ul className="space-y-2.5">
                {protocolLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] transition-colors hover:text-[#111111]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#111111] uppercase">
                Resources
              </h3>
              <ul className="space-y-2.5">
                {learnLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] transition-colors hover:text-[#111111]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#111111] uppercase">
                Company
              </h3>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6B7280] transition-colors hover:text-[#111111]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#F0F0F0]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-1.5 sm:gap-4 text-center">
            <p className="text-[10px] sm:text-xs text-[#6B7280]">
              &copy; 2026 Purity Lab Research LLC. All rights reserved.
            </p>
            <span className="hidden sm:inline text-[#F0F0F0]">|</span>
            <p className="text-[10px] sm:text-xs text-[#6B7280] font-medium">
              For in-vitro laboratory research use only. Not for human consumption. You must be 21 or older to purchase. Purity Lab Research LLC assumes no liability for product use or misuse.
            </p>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {PAYMENT_METHODS.map((method) => (
              <PaymentIcon key={method} name={method} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
