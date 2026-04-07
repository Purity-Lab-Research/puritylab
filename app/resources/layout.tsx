import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Peptide dosing calculator, reconstitution calculator, and cycle planning tools.",
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
