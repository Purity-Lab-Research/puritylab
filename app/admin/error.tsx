"use client";

import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="p-8">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 max-w-2xl">
        <h2 className="text-lg font-bold text-red-800 mb-2">Admin Error</h2>
        <p className="text-sm text-red-700 mb-4 font-mono whitespace-pre-wrap break-all">
          {error.message}
        </p>
        {error.stack && (
          <pre className="text-xs text-red-600/70 mb-4 overflow-auto max-h-48 bg-red-100 p-3 rounded-lg">
            {error.stack}
          </pre>
        )}
        <button
          onClick={reset}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
