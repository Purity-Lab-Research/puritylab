"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Bell,
  Search,
  Download,
  Trash2,
  Copy,
  Check,
  X,
  Loader2,
} from "lucide-react";

interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

type ToastType = "success" | "error";
interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

let toastId = 0;

export default function WaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  function addToast(type: ToastType, message: string) {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }

  async function fetchEntries() {
    try {
      const res = await fetch("/api/admin/waitlist");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEntries(data);
    } catch {
      addToast("error", "Failed to load waitlist");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEntries();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter((e) => e.email.toLowerCase().includes(q));
  }, [entries, search]);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((e) => e.id)));
    }
  }

  async function handleDelete() {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} email(s) from the waitlist?`)) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/waitlist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selected) }),
      });
      if (!res.ok) throw new Error();
      setEntries((prev) => prev.filter((e) => !selected.has(e.id)));
      addToast("success", `Deleted ${selected.size} entry(s)`);
      setSelected(new Set());
    } catch {
      addToast("error", "Failed to delete entries");
    } finally {
      setDeleting(false);
    }
  }

  function handleExportCSV() {
    const rows = filtered.map((e) => `${e.email},${e.created_at}`);
    const csv = "email,signed_up\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `waitlist-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast("success", `Exported ${filtered.length} emails`);
  }

  function handleCopyAll() {
    const emails = filtered.map((e) => e.email).join(", ");
    navigator.clipboard.writeText(emails);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast("success", `Copied ${filtered.length} emails`);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-[#111111] flex items-center gap-2">
            <Bell className="h-6 w-6 text-[#10B981]" />
            Waitlist
          </h1>
          <p className="text-sm text-[#6B7280] mt-1">
            {entries.length} {entries.length === 1 ? "person" : "people"} signed up for launch notifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyAll}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-xs font-semibold text-[#111111] hover:bg-[#FAFAFA] transition-colors disabled:opacity-40"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy All"}
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#F0F0F0] bg-white px-3 py-2 text-xs font-semibold text-[#111111] hover:bg-[#FAFAFA] transition-colors disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Search + bulk actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9CA3AF]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search emails..."
            className="w-full rounded-lg border border-[#F0F0F0] bg-white pl-9 pr-4 py-2 text-sm text-[#111111] placeholder:text-[#9CA3AF] outline-none focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]/10 transition-all"
          />
        </div>

        {selected.size > 0 && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
          >
            {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
            Delete {selected.size} selected
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#F0F0F0] bg-white overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[#9CA3AF]">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-10 w-10 text-[#E5E7EB] mb-3" />
            <p className="text-sm text-[#6B7280]">
              {search ? "No emails match your search" : "No signups yet"}
            </p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#F0F0F0] bg-[#FAFAFA]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === filtered.length && filtered.length > 0}
                    onChange={toggleAll}
                    className="rounded border-[#D1D5DB] text-[#10B981] focus:ring-[#10B981]/20"
                  />
                </th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-right">Signed Up</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filtered.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(entry.id)}
                      onChange={() => toggleSelect(entry.id)}
                      className="rounded border-[#D1D5DB] text-[#10B981] focus:ring-[#10B981]/20"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-[#111111]">{entry.email}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs text-[#6B7280]" title={formatDate(entry.created_at)}>
                      {relativeTime(entry.created_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[100] space-y-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg animate-[slideInRight_0.2s_ease-out] ${
              t.type === "success" ? "bg-[#10B981] text-white" : "bg-red-500 text-white"
            }`}
          >
            {t.message}
            <button onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}>
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
