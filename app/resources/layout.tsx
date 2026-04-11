import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Resources",
  description:
    "Laboratory reference tools, published research library, peptide glossary, handling and storage guides, and technical documentation for peptide research.",
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
