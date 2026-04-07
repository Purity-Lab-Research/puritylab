"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import EditableText from "@/components/admin/EditableText";

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; href?: string }[];
  titleKey?: string;
  descriptionKey?: string;
}

export default function PageHeader({
  title,
  description,
  breadcrumbs,
  titleKey,
  descriptionKey,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden mx-4 sm:mx-6 lg:mx-8 my-4 rounded-2xl bg-gradient-to-br from-[#1A2B4A] to-[#243B5C]">
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-9 md:py-14">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1 text-sm text-white/70 font-[family-name:var(--font-body)]"
          >
            <Link
              href="/"
              className="hover:text-white transition-colors"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-white/40" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-white">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-[family-name:var(--font-heading)]">
          {titleKey ? (
            <EditableText settingKey={titleKey}>{title}</EditableText>
          ) : (
            title
          )}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-3 max-w-2xl text-base text-white/80 font-[family-name:var(--font-body)]">
            {descriptionKey ? (
              <EditableText settingKey={descriptionKey}>{description}</EditableText>
            ) : (
              description
            )}
          </p>
        )}
      </div>
    </section>
  );
}
