"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import WaitlistForm from "./WaitlistForm";

const STORAGE_KEY = "puritylab_coming_soon_dismissed";

export default function ComingSoonModal() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Wait for age gate to be cleared before showing
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      const ageVerified = sessionStorage.getItem("puritylab_age_verified");
      if (!dismissed && ageVerified === "true") {
        setShow(true);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Also listen for age gate verification
  useEffect(() => {
    function checkAgeGate() {
      const dismissed = localStorage.getItem(STORAGE_KEY);
      const ageVerified = sessionStorage.getItem("puritylab_age_verified");
      if (!dismissed && ageVerified === "true") {
        setShow(true);
      }
    }
    // Poll briefly for age gate change
    const interval = setInterval(checkAgeGate, 500);
    return () => clearInterval(interval);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={dismiss} />

      {/* Card */}
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl z-10">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 p-1.5 rounded-full text-[#9CA3AF] hover:text-[#111111] hover:bg-[#F0F0F0] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge */}
        <div className="flex justify-center mb-5">
          <span className="inline-flex items-center bg-[#10B981]/10 text-[#10B981] text-xs font-bold tracking-wider uppercase px-4 py-1.5 rounded-full">
            Launching Soon
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-extrabold text-[#111111] text-center">
          Our First Batch is in Testing
        </h2>

        {/* Subtext */}
        <p className="text-sm text-[#6B7280] text-center mt-3 leading-relaxed">
          Every compound goes through our six-panel independent testing protocol
          before it ships. Drop your email and we&apos;ll notify you the moment
          results are verified and orders open.
        </p>

        {/* Email form */}
        <div className="mt-6">
          <WaitlistForm
            buttonLabel="Notify Me"
            successMessage="You're on the list. We'll be in touch soon."
            showDisclaimer
          />
        </div>
      </div>
    </div>
  );
}
