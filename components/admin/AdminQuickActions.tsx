"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, Ticket, Mail, X } from "lucide-react";
import { cn } from "@/lib/utils";

const actions = [
  { label: "New Product", icon: Package, href: "/admin/products?action=new", color: "bg-blue-500" },
  { label: "New Discount", icon: Ticket, href: "/admin/discounts", color: "bg-violet-500" },
  { label: "Compose Email", icon: Mail, href: "/admin/email?tab=compose", color: "bg-emerald-500" },
];

export default function AdminQuickActions() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="fixed bottom-4 right-14 z-40">
      {/* Action items */}
      {open && (
        <div className="absolute bottom-14 right-0 flex flex-col gap-2 items-end mb-2">
          {actions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => {
                  setOpen(false);
                  router.push(action.href);
                }}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white shadow-lg transition-all",
                  "hover:scale-105 active:scale-95",
                  action.color
                )}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Icon className="h-4 w-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-all duration-200",
          "hover:shadow-xl hover:scale-105 active:scale-95",
          open ? "bg-gray-800 rotate-45" : "bg-[#10B981]"
        )}
      >
        {open ? (
          <X className="h-5 w-5 text-white" />
        ) : (
          <Plus className="h-5 w-5 text-white" />
        )}
      </button>
    </div>
  );
}
