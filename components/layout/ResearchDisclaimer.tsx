"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "puritylab_disclaimer_accepted";

export default function ResearchDisclaimer() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "true") {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary text-white py-4 px-4 sm:px-6">
      <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-warning flex-shrink-0 mt-0.5">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <line x1="12" x2="12" y1="9" y2="13" />
            <line x1="12" x2="12.01" y1="17" y2="17" />
          </svg>
          <p className="text-xs sm:text-sm leading-relaxed">
            All products are for <strong>in-vitro laboratory research only</strong>. Not for human or animal consumption by any route of administration. You must be <strong>21+</strong> to use this site.
          </p>
        </div>
        <button
          onClick={handleAccept}
          className="bg-white text-primary rounded-lg px-6 py-2 text-sm font-semibold hover:bg-white/90 transition-colors whitespace-nowrap flex-shrink-0"
        >
          I Understand and Agree
        </button>
      </div>
    </div>
  );
}
