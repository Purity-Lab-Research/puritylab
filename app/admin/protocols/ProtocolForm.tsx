"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  size: string;
  price: number;
}

interface ProtocolItem {
  product_id: string;
  product?: Product | null;
  quantity: number;
  sort_order: number;
}

interface ProtocolData {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  cycle_length: string;
  subscription_price: number;
  one_time_price: number;
  badge: string;
  accent_color: string;
  sort_order: number;
  active: boolean;
  items: ProtocolItem[];
}

interface Props {
  initial?: ProtocolData;
  products: Product[];
}

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

const inputCls =
  "w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-all focus:border-[#0097A7] focus:outline-none focus:ring-2 focus:ring-[#0097A7]/20 placeholder:text-gray-400";

const labelCls = "block text-sm font-medium text-gray-700 mb-1";

export default function ProtocolForm({ initial, products }: Props) {
  const router = useRouter();
  const isEditing = !!initial?.id;

  const [form, setForm] = useState<ProtocolData>(
    initial ?? {
      name: "",
      slug: "",
      tagline: "",
      description: "",
      cycle_length: "",
      subscription_price: 0,
      one_time_price: 0,
      badge: "",
      accent_color: "#0097A7",
      sort_order: 0,
      active: true,
      items: [],
    }
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [showProductDropdown, setShowProductDropdown] = useState(false);

  // Auto-generate slug from name (only for new protocols)
  useEffect(() => {
    if (!isEditing && form.name) {
      setForm((f) => ({ ...f, slug: slugify(f.name) }));
    }
  }, [form.name, isEditing]);

  function setField<K extends keyof ProtocolData>(key: K, value: ProtocolData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function addProduct(product: Product) {
    if (form.items.some((i) => i.product_id === product.id)) return;
    setForm((f) => ({
      ...f,
      items: [
        ...f.items,
        {
          product_id: product.id,
          product,
          quantity: 1,
          sort_order: f.items.length,
        },
      ],
    }));
    setProductSearch("");
    setShowProductDropdown(false);
  }

  function removeItem(productId: string) {
    setForm((f) => ({
      ...f,
      items: f.items.filter((i) => i.product_id !== productId),
    }));
  }

  function updateItem(productId: string, field: "quantity" | "sort_order", value: number) {
    setForm((f) => ({
      ...f,
      items: f.items.map((i) =>
        i.product_id === productId ? { ...i, [field]: value } : i
      ),
    }));
  }

  const filteredProducts = products.filter(
    (p) =>
      !form.items.some((i) => i.product_id === p.id) &&
      (p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.size.toLowerCase().includes(productSearch.toLowerCase()))
  );

  async function handleSave() {
    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...(isEditing ? { id: initial!.id } : {}),
        name: form.name,
        slug: form.slug,
        tagline: form.tagline,
        description: form.description,
        cycle_length: form.cycle_length,
        subscription_price: form.subscription_price,
        one_time_price: form.one_time_price,
        badge: form.badge || null,
        accent_color: form.accent_color,
        sort_order: form.sort_order,
        active: form.active,
        items: form.items.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          sort_order: i.sort_order,
        })),
      };

      const res = await fetch("/api/admin/protocols", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      router.push("/admin/protocols");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/admin/protocols", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: initial!.id }),
      });

      if (!res.ok) throw new Error("Failed to delete");

      router.push("/admin/protocols");
      router.refresh();
    } catch {
      setError("Failed to delete protocol");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  return (
    <div className="max-w-3xl">
      {error && (
        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Info */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Protocol Details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Name *</label>
              <input type="text" value={form.name} onChange={(e) => setField("name", e.target.value)} className={inputCls} placeholder="Recovery Protocol" />
            </div>
            <div>
              <label className={labelCls}>Slug *</label>
              <input type="text" value={form.slug} onChange={(e) => setField("slug", e.target.value)} className={inputCls} placeholder="recovery" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Tagline *</label>
            <input type="text" value={form.tagline} onChange={(e) => setField("tagline", e.target.value)} className={inputCls} placeholder="Accelerate tissue repair and reduce downtime" />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea value={form.description} onChange={(e) => setField("description", e.target.value)} className={inputCls + " h-24 resize-y"} placeholder="Longer description for the protocol detail page..." />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Cycle Length *</label>
              <input type="text" value={form.cycle_length} onChange={(e) => setField("cycle_length", e.target.value)} className={inputCls} placeholder="4-6 weeks" />
            </div>
            <div>
              <label className={labelCls}>Subscription Price *</label>
              <input type="number" value={form.subscription_price || ""} onChange={(e) => setField("subscription_price", parseFloat(e.target.value) || 0)} className={inputCls} step="0.01" min="0" />
            </div>
            <div>
              <label className={labelCls}>One-Time Price *</label>
              <input type="number" value={form.one_time_price || ""} onChange={(e) => setField("one_time_price", parseFloat(e.target.value) || 0)} className={inputCls} step="0.01" min="0" />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className={labelCls}>Badge</label>
              <input type="text" value={form.badge} onChange={(e) => setField("badge", e.target.value)} className={inputCls} placeholder="MOST POPULAR" />
            </div>
            <div>
              <label className={labelCls}>Accent Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.accent_color} onChange={(e) => setField("accent_color", e.target.value)} className="w-10 h-10 rounded border border-gray-300 cursor-pointer" />
                <input type="text" value={form.accent_color} onChange={(e) => setField("accent_color", e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setField("sort_order", parseInt(e.target.value) || 0)} className={inputCls} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setField("active", e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
        </div>

        {/* Protocol Items */}
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Protocol Items</h2>

          {/* Add product */}
          <div className="relative mb-4">
            <input
              type="text"
              value={productSearch}
              onChange={(e) => {
                setProductSearch(e.target.value);
                setShowProductDropdown(true);
              }}
              onFocus={() => setShowProductDropdown(true)}
              placeholder="Search products to add..."
              className={inputCls}
            />
            {showProductDropdown && productSearch && filteredProducts.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto">
                {filteredProducts.slice(0, 10).map((product) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => addProduct(product)}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors flex justify-between"
                  >
                    <span className="font-medium text-gray-900">{product.name}</span>
                    <span className="text-gray-500 text-xs">{product.size} · ${product.price}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Items list */}
          {form.items.length > 0 ? (
            <div className="space-y-2">
              {form.items
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((item) => {
                  const product = item.product ?? products.find((p) => p.id === item.product_id);
                  return (
                    <div
                      key={item.product_id}
                      className="flex items-center gap-3 rounded-lg border border-gray-200 px-4 py-3"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-gray-500">{product?.size}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div>
                          <label className="text-[10px] text-gray-400 block">Qty</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.product_id, "quantity", parseInt(e.target.value) || 1)}
                            min="1"
                            className="w-14 rounded border border-gray-200 px-2 py-1 text-xs text-center"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-gray-400 block">Order</label>
                          <input
                            type="number"
                            value={item.sort_order}
                            onChange={(e) => updateItem(item.product_id, "sort_order", parseInt(e.target.value) || 0)}
                            className="w-14 rounded border border-gray-200 px-2 py-1 text-xs text-center"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-500 hover:text-red-700 text-xs font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-4">
              No products added yet. Search above to add products to this protocol.
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving || !form.name || !form.slug || !form.tagline || !form.cycle_length}
              className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : isEditing ? "Update Protocol" : "Create Protocol"}
            </button>
            <Link
              href="/admin/protocols"
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>

          {isEditing && (
            <div>
              {!confirmDelete ? (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                >
                  Delete Protocol
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Are you sure?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
