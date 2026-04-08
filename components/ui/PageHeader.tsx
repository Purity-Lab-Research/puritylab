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
    <section className="bg-[#FAFAFA] pt-24 pb-8 border-b border-[#F0F0F0]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumb"
            className="mb-3 flex items-center gap-1 text-sm text-text-secondary"
          >
            <Link
              href="/"
              className="hover:text-primary transition-colors"
            >
              Home
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="w-3.5 h-3.5 text-text-secondary/40" />
                {crumb.href ? (
                  <Link
                    href={crumb.href}
                    className="hover:text-primary transition-colors"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-primary">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
          {titleKey ? (
            <EditableText settingKey={titleKey}>{title}</EditableText>
          ) : (
            title
          )}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-2 max-w-2xl text-base text-text-secondary">
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
