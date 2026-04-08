"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "puritylab_age_verified";

export default function AgeGate() {
  const [status, setStatus] = useState<"loading" | "gate" | "denied" | "verified">("loading");

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setStatus("verified");
    } else {
      setStatus("gate");
    }
  }, []);

  function handleConfirm() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setStatus("verified");
  }

  function handleDeny() {
    setStatus("denied");
    window.location.href = "https://www.google.com";
  }

  if (status === "loading" || status === "verified") return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl sm:p-10">
        {status === "denied" ? (
          <>
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" x2="9" y1="9" y2="15" />
                <line x1="9" x2="15" y1="9" y2="15" />
              </svg>
            </div>
            <h2 className="mb-3 text-xl font-bold text-gray-900">Access Denied</h2>
            <p className="text-sm leading-relaxed text-gray-600">
              You must be 21 years of age or older to access this website. Redirecting...
            </p>
          </>
        ) : (
          <>
            <img src="/images/logo.svg" alt="Purity Lab" width={48} height={48} className="mx-auto mb-4 h-12 w-12" />
            <h1 className="mb-1 text-2xl font-bold tracking-tight text-primary font-heading">
              PURITY LAB
            </h1>
            <p className="mb-6 text-xs font-medium tracking-wide text-text-secondary">
              For Research Use Only
            </p>

            <div className="mb-6">
              <p className="text-sm leading-relaxed text-gray-600">
                You must be <strong>21 years of age or older</strong> to access this website.
              </p>
              <p className="mt-3 text-[11px] leading-relaxed text-gray-500">
                By clicking &quot;I am 21 or older&quot; you confirm under penalty of perjury that you are at least 21 years of age, that you are accessing this website for lawful purposes, and that all products purchased will be used exclusively for in-vitro laboratory research.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleConfirm}
                className="flex-1 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                I Am 21 or Older
              </button>
              <button
                onClick={handleDeny}
                className="flex-1 rounded-lg bg-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                I Am Under 21
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
