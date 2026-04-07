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
  { label: "Recovery", href: "/protocols/recovery" },
  { label: "Fat Loss", href: "/protocols/fat-loss" },
  { label: "Performance", href: "/protocols/performance" },
  { label: "Full Recomp", href: "/protocols/full-recomp" },
  { label: "Build Your Own", href: "/protocols/build" },
];

const learnLinks = [
  { label: "Beginner's Guide", href: "/learn/getting-started" },
  { label: "Dosing & Reconstitution", href: "/learn/how-to-reconstitute" },
  { label: "CoA Library", href: "/coa" },
  { label: "How We Test", href: "/how-we-test" },
  { label: "FAQ", href: "/faq" },
  { label: "Resources", href: "/resources" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Terms", href: "/policies/terms" },
  { label: "Privacy", href: "/policies/privacy" },
  { label: "Shipping", href: "/policies/shipping" },
];

function PaymentIcon({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded bg-white/10 px-2 py-1 text-xs font-medium text-white/70">
      {name}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1A2B4A] text-white/80">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-5">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                <span className="font-[family-name:var(--font-heading)] text-sm font-bold text-white tracking-tight">PL</span>
              </div>
              <span className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight text-white">
                PURITY LAB
              </span>
            </div>
            <p className="mb-6 text-sm leading-relaxed text-white/60 max-w-sm">
              <EditableText settingKey="footer_description">
                {SITE_DESCRIPTION}
              </EditableText>
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL_LINKS.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-[#0097A7] hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.6a8.22 8.22 0 0 0 4.76 1.51V6.69h-1z" />
                </svg>
              </a>
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-1.5 text-sm text-white/50">
              <p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition-colors hover:text-white"
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
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase font-[family-name:var(--font-heading)]">
                Protocols
              </h3>
              <ul className="space-y-2.5">
                {protocolLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learn */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase font-[family-name:var(--font-heading)]">
                Learn
              </h3>
              <ul className="space-y-2.5">
                {learnLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase font-[family-name:var(--font-heading)]">
                Company
              </h3>
              <ul className="space-y-2.5">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
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
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <p className="text-xs text-white/40">
              &copy; 2026 Purity Lab. All rights reserved.
            </p>
            <span className="hidden sm:inline text-white/20">|</span>
            <p className="text-xs text-white/40 font-medium">
              For Research Use Only. Not for human consumption.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {PAYMENT_METHODS.map((method) => (
              <PaymentIcon key={method} name={method} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
