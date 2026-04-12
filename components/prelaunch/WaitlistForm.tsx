"use client";

import { useState } from "react";

interface WaitlistFormProps {
  /** Button label, defaults to "Notify Me" */
  buttonLabel?: string;
  /** Success message override */
  successMessage?: string;
  /** Additional class for the form wrapper */
  className?: string;
  /** Show the "no spam" disclaimer */
  showDisclaimer?: boolean;
  /** Layout: stacked (default) or inline */
  layout?: "stacked" | "inline";
}

export default function WaitlistForm({
  buttonLabel = "Notify Me",
  successMessage = "You're on the list. We'll be in touch soon.",
  className = "",
  showDisclaimer = false,
  layout = "stacked",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Something went wrong.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#10B981] flex-shrink-0">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <p className="text-sm text-[#10B981] font-medium">{successMessage}</p>
      </div>
    );
  }

  const isInline = layout === "inline";

  return (
    <form onSubmit={handleSubmit} className={`${className}`}>
      <div className={isInline ? "flex gap-2" : "space-y-3"}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className={`rounded-full border border-[#F0F0F0] px-6 py-3 text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#111111] focus:ring-1 focus:ring-[#111111]/10 transition-all ${isInline ? "flex-1 min-w-0" : "w-full"}`}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`bg-[#111111] text-white rounded-full px-8 py-3 text-sm font-semibold hover:bg-black transition-all disabled:opacity-60 ${isInline ? "flex-shrink-0" : "w-full"}`}
        >
          {status === "loading" ? "Submitting..." : buttonLabel}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-500 mt-2">{errorMsg}</p>
      )}
      {showDisclaimer && status !== "error" && (
        <p className="text-xs text-[#9CA3AF] mt-2">No spam. One email when we launch.</p>
      )}
    </form>
  );
}
