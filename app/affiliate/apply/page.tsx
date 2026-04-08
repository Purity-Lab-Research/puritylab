"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";

const platforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Blog",
  "Twitter/X",
  "Podcast",
  "Other",
];

const audienceSizes = [
  "Under 1K",
  "1K-10K",
  "10K-50K",
  "50K-100K",
  "100K+",
];

export default function AffiliateApplyPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    websiteUrl: "",
    platform: "",
    audienceSize: "",
    promotionPlan: "",
    previousExperience: false,
    agreedToTerms: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agreedToTerms) {
      setError("You must agree to the Affiliate Program Terms and Conditions.");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/affiliate/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          websiteUrl: form.websiteUrl || null,
          platform: form.platform || null,
          audienceSize: form.audienceSize || null,
          promotionPlan: form.promotionPlan || null,
          previousExperience: form.previousExperience,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-[#10B981]/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-[#10B981]" />
          </div>
          <h1 className="text-3xl font-extrabold text-[#111111] mb-4">
            Application Received
          </h1>
          <p className="text-[#6B7280] mb-8">
            We review most applications within 24 hours. You will receive an
            email when approved.
          </p>
          <Link
            href="/affiliate"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#10B981] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Affiliate Program
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-xl px-4 sm:px-6">
        <Link
          href="/affiliate"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#111111] mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Affiliate Program
        </Link>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-2">
          Apply to Our Affiliate Program
        </h1>
        <p className="text-[#6B7280] mb-8">
          Fill out the form below. Most applications are approved within 24
          hours.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="w-full rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 focus:bg-white outline-none transition-all"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              className="w-full rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 focus:bg-white outline-none transition-all"
              placeholder="you@example.com"
            />
          </div>

          {/* Website / Social URL */}
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">
              Website or Social Media URL
            </label>
            <input
              type="url"
              value={form.websiteUrl}
              onChange={(e) => update("websiteUrl", e.target.value)}
              className="w-full rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 focus:bg-white outline-none transition-all"
              placeholder="https://..."
            />
          </div>

          {/* Platform */}
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">
              Primary Platform
            </label>
            <select
              value={form.platform}
              onChange={(e) => update("platform", e.target.value)}
              className="w-full rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 focus:bg-white outline-none transition-all"
            >
              <option value="">Select a platform</option>
              {platforms.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Audience Size */}
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">
              Estimated Audience Size
            </label>
            <select
              value={form.audienceSize}
              onChange={(e) => update("audienceSize", e.target.value)}
              className="w-full rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 focus:bg-white outline-none transition-all"
            >
              <option value="">Select audience size</option>
              {audienceSizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Promotion plan */}
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-1.5">
              How do you plan to promote Purity Lab?
            </label>
            <textarea
              value={form.promotionPlan}
              onChange={(e) => update("promotionPlan", e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[#F0F0F0] bg-[#FAFAFA] px-4 py-3 text-sm text-[#111111] focus:border-[#111111] focus:ring-2 focus:ring-[#111111]/10 focus:bg-white outline-none transition-all resize-none"
              placeholder="Tell us about your promotion strategy..."
            />
          </div>

          {/* Previous experience */}
          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-2">
              Have you promoted research peptides before?
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  checked={form.previousExperience === true}
                  onChange={() => update("previousExperience", true)}
                  className="accent-[#10B981]"
                />
                <span className="text-sm text-[#111111]">Yes</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="experience"
                  checked={form.previousExperience === false}
                  onChange={() => update("previousExperience", false)}
                  className="accent-[#10B981]"
                />
                <span className="text-sm text-[#111111]">No</span>
              </label>
            </div>
          </div>

          {/* Terms agreement */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.agreedToTerms}
              onChange={(e) => update("agreedToTerms", e.target.checked)}
              className="mt-0.5 accent-[#10B981]"
            />
            <span className="text-sm text-[#6B7280]">
              I agree to the{" "}
              <Link
                href="/policies/affiliate-terms"
                className="text-[#10B981] hover:underline"
                target="_blank"
              >
                Affiliate Program Terms and Conditions
              </Link>
            </span>
          </label>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#111111] text-white rounded-full px-8 py-4 font-semibold text-base hover:opacity-90 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Application"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
