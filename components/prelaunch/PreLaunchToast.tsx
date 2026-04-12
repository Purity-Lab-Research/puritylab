"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { X } from "lucide-react";

function ToastInner() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (searchParams.get("prelaunch") === "1") {
      setShow(true);
      window.history.replaceState({}, "", "/");
      const timer = setTimeout(() => setShow(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] bg-[#111111] text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
      <p className="text-sm">Orders are not yet open. Join our waitlist to be notified.</p>
      <button onClick={() => setShow(false)} className="text-white/60 hover:text-white flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function PreLaunchToast() {
  return (
    <Suspense fallback={null}>
      <ToastInner />
    </Suspense>
  );
}
