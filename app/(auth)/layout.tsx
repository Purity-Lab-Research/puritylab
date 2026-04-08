import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Account",
  description: "Log in or create your Purity Lab account.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA] px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-[#F0F0F0] p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <img src="/images/logo.svg" alt="Purity Lab" width={32} height={32} className="h-8 w-8" />
            <span className="text-lg font-extrabold tracking-tight text-[#111111]">PURITY LAB</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
