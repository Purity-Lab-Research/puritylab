"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, X } from "lucide-react";

const shortcuts = [
  { keys: ["Ctrl", "K"], description: "Open command palette" },
  { keys: ["G", "D"], description: "Go to Dashboard" },
  { keys: ["G", "O"], description: "Go to Orders" },
  { keys: ["G", "P"], description: "Go to Products" },
  { keys: ["G", "C"], description: "Go to Customers" },
  { keys: ["G", "S"], description: "Go to Settings" },
  { keys: ["G", "E"], description: "Go to Email" },
  { keys: ["G", "I"], description: "Go to Inventory" },
  { keys: ["?"], description: "Show shortcuts" },
];

const goRoutes: Record<string, string> = {
  d: "/admin",
  o: "/admin/orders",
  p: "/admin/products",
  c: "/admin/customers",
  s: "/admin/settings",
  e: "/admin/email",
  i: "/admin/inventory",
};

export default function AdminKeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const pendingG = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target as HTMLElement).isContentEditable) {
        return;
      }

      // ? for help
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowHelp((prev) => !prev);
        return;
      }

      // G+<key> navigation
      if (e.key === "g" && !e.ctrlKey && !e.metaKey && !pendingG.current) {
        pendingG.current = true;
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          pendingG.current = false;
        }, 800);
        return;
      }

      if (pendingG.current) {
        pendingG.current = false;
        clearTimeout(timeoutRef.current);
        const route = goRoutes[e.key.toLowerCase()];
        if (route) {
          e.preventDefault();
          router.push(route);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  return (
    <>
      {/* Help button */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-4 right-4 z-40 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-gray-200 shadow-md text-gray-400 hover:text-[#111111] hover:shadow-lg transition-all"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="h-4 w-4" />
      </button>

      {/* Help modal */}
      {showHelp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowHelp(false)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <h3 className="text-sm font-semibold text-gray-900">Keyboard Shortcuts</h3>
              <button onClick={() => setShowHelp(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {shortcuts.map((s) => (
                <div key={s.description} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-gray-600">{s.description}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((key, i) => (
                      <span key={i}>
                        {i > 0 && <span className="text-xs text-gray-300 mx-0.5">+</span>}
                        <kbd className="inline-flex items-center justify-center rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 min-w-[24px]">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
