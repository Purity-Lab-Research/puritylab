import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learn & Resources",
  description:
    "Education hub, peptide calculators, dosing guides, research articles, safety checklists, glossary, FAQ, and everything you need for confident peptide research.",
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
