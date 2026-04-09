"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { Plus, Pencil, Trash2, Star, CreditCard } from "lucide-react";

interface SavedCard {
  id: string;
  label: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
}

const BRANDS = ["Visa", "Mastercard", "Amex", "Discover", "Other"];

const emptyForm = {
  label: "Card",
  brand: "Visa",
  last4: "",
  exp_month: new Date().getMonth() + 1,
  exp_year: new Date().getFullYear(),
  is_default: false,
};

function CardIcon({ brand }: { brand: string }) {
  const abbr =
    brand === "Visa"
      ? "VISA"
      : brand === "Mastercard"
        ? "MC"
        : brand === "Amex"
          ? "AMEX"
          : brand.slice(0, 4).toUpperCase();

  return (
    <div className="w-10 h-7 rounded bg-gradient-to-br from-[#1a1a2e] to-[#16213e] flex items-center justify-center flex-shrink-0">
      <span className="text-[9px] font-bold text-white uppercase tracking-wider">
        {abbr}
      </span>
    </div>
  );
}

export default function PaymentMethodsPage() {
  const supabase = createClient();
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchCards() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("saved_payment_methods")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });

    setCards((data as SavedCard[]) || []);
    setLoading(false);
  }

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setError(null);
  }

  function openEdit(card: SavedCard) {
    setEditingId(card.id);
    setForm({
      label: card.label,
      brand: card.brand,
      last4: card.last4,
      exp_month: card.exp_month,
      exp_year: card.exp_year,
      is_default: card.is_default,
    });
    setShowForm(true);
    setError(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (form.last4.length !== 4 || !/^\d{4}$/.test(form.last4)) {
      setError("Please enter exactly 4 digits for the card number.");
      return;
    }

    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const payload = { ...form, user_id: user.id };

    if (form.is_default) {
      await supabase
        .from("saved_payment_methods")
        .update({ is_default: false })
        .eq("user_id", user.id);
    }

    if (editingId) {
      const { error: err } = await supabase
        .from("saved_payment_methods")
        .update(payload)
        .eq("id", editingId);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: err } = await supabase
        .from("saved_payment_methods")
        .insert(payload);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setShowForm(false);
    setEditingId(null);
    fetchCards();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this payment method?")) return;
    await supabase.from("saved_payment_methods").delete().eq("id", id);
    fetchCards();
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setForm((prev) => ({ ...prev, [target.name]: value }));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-[#111111] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-heading)] tracking-tight text-[#111111]">
          Payment Methods
        </h1>
        {!showForm && (
          <Button size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4 mr-1.5" />
            Add Card
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white rounded-xl shadow-sm p-6 mb-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-900">
            {editingId ? "Edit Card" : "Add Card"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                name="label"
                value={form.label}
                onChange={handleChange}
                placeholder="e.g. Personal, Business"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Brand
              </label>
              <select
                name="brand"
                value={form.brand}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-colors bg-white"
              >
                {BRANDS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last 4 Digits
              </label>
              <input
                name="last4"
                required
                maxLength={4}
                value={form.last4}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    last4: e.target.value.replace(/\D/g, ""),
                  }))
                }
                placeholder="1234"
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exp Month
                </label>
                <select
                  name="exp_month"
                  value={form.exp_month}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      exp_month: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-colors bg-white"
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {String(m).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exp Year
                </label>
                <select
                  name="exp_year"
                  value={form.exp_year}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      exp_year: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981] outline-none transition-colors bg-white"
                >
                  {Array.from(
                    { length: 10 },
                    (_, i) => new Date().getFullYear() + i
                  ).map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
              className="rounded border-gray-300 text-[#111111] focus:ring-[#10B981]"
            />
            Set as default payment method
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : editingId ? "Update" : "Save"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Card list */}
      {cards.length > 0 ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl shadow-sm p-5 relative"
            >
              {card.is_default && (
                <span className="absolute top-4 right-4 inline-flex items-center gap-1 text-xs font-medium text-[#111111] bg-primary/5 px-2 py-0.5 rounded-full">
                  <Star className="w-3 h-3 fill-current" />
                  Default
                </span>
              )}
              <div className="flex items-center gap-3 mb-1">
                <CardIcon brand={card.brand} />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#111111]">
                    {card.brand} ending in {card.last4}
                  </p>
                  <p className="text-xs text-[#9CA3AF]">
                    Expires {String(card.exp_month).padStart(2, "0")}/
                    {card.exp_year}
                  </p>
                </div>
              </div>
              {card.label !== "Card" && (
                <p className="text-xs text-[#9CA3AF] ml-[52px] mb-2">
                  {card.label}
                </p>
              )}
              <div className="flex gap-3 mt-3">
                <button
                  onClick={() => openEdit(card)}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-[#10B981] transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(card.id)}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <CreditCard className="w-10 h-10 text-[#D1D5DB] mx-auto mb-3" />
            <p className="text-gray-500 mb-3">No payment methods saved yet.</p>
            <Button size="sm" onClick={openAdd}>
              Add your first card
            </Button>
          </div>
        )
      )}
    </div>
  );
}
