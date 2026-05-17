"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit, Trash2, Eye, FileSpreadsheet, X, Filter } from "lucide-react";
import { formatPrice, getPlaceholderImage, STOCK_STATUS_LABELS, formatDateTime } from "@/lib/utils";
import { toast } from "@/components/ui/Toast";
import Badge from "@/components/ui/Badge";
import ImportProductsModal from "./ImportProductsModal";

interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stockStatus: string;
  active: boolean;
  featured: boolean;
  image1: string | null;
  createdAt: string;
  brand: { id: number; name: string };
  productTags: { tag: { id: number; name: string; color: string } }[];
}

interface BrandOption    { id: number; name: string; _count: { products: number } }
interface CategoryOption { id: number; name: string; isChild: boolean }

export default function AdminProductsClient() {
  const [products, setProducts]       = useState<Product[]>([]);
  const [total, setTotal]             = useState(0);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState("");
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [deletingId, setDeletingId]   = useState<number | null>(null);
  const [showImport, setShowImport]   = useState(false);

  /* ── Filter state ──────────────────────────────────────────────── */
  const [brandFilter, setBrandFilter]       = useState<number | "">("");
  const [categoryFilter, setCategoryFilter] = useState<number | "">("");
  const [brands, setBrands]                 = useState<BrandOption[]>([]);
  const [categories, setCategories]         = useState<CategoryOption[]>([]);

  /* ── Bulk selection state ─────────────────────────────────────── */
  const [selectedIds, setSelectedIds]     = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting]   = useState(false);
  const selectAllRef                       = useRef<HTMLInputElement>(null);

  const isAllSelected   = products.length > 0 && products.every((p) => selectedIds.has(p.id));
  const isIndeterminate = selectedIds.size > 0 && !isAllSelected;

  useEffect(() => {
    if (selectAllRef.current) selectAllRef.current.indeterminate = isIndeterminate;
  }, [isIndeterminate]);

  useEffect(() => { setSelectedIds(new Set()); }, [page, search, brandFilter, categoryFilter]);

  /* ── Fetch filter options once on mount ───────────────────────── */
  useEffect(() => {
    fetch("/api/admin/brands")
      .then((r) => r.json())
      .then((data: BrandOption[]) => setBrands(data))
      .catch(() => {});

    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((data: { id: number; name: string; children?: { id: number; name: string }[] }[]) => {
        const flat: CategoryOption[] = [];
        for (const parent of data) {
          flat.push({ id: parent.id, name: parent.name, isChild: false });
          for (const child of parent.children ?? []) {
            flat.push({ id: child.id, name: child.name, isChild: true });
          }
        }
        setCategories(flat);
      })
      .catch(() => {});
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll   = () => setSelectedIds(new Set(products.map((p) => p.id)));
  const deselectAll = () => setSelectedIds(new Set());

  const handleSelectAllChange = () => { isAllSelected ? deselectAll() : selectAll(); };

  const hasFilters = !!(search || brandFilter || categoryFilter);
  const clearFilters = () => {
    setSearch("");
    setBrandFilter("");
    setCategoryFilter("");
    setPage(1);
  };

  /* ── Data fetching ─────────────────────────────────────────────── */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), search });
      if (brandFilter    !== "") params.set("brandId",    String(brandFilter));
      if (categoryFilter !== "") params.set("categoryId", String(categoryFilter));
      const res  = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      setProducts(data.items ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, brandFilter, categoryFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  /* ── Single delete ─────────────────────────────────────────────── */
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`האם למחוק את "${name}"? פעולה זו בלתי הפיכה.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("המוצר נמחק בהצלחה"); fetchProducts(); }
      else          toast.error("שגיאה במחיקה");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── Bulk delete ───────────────────────────────────────────────── */
  const handleBulkDelete = async () => {
    const count = selectedIds.size;
    if (!confirm(`האם למחוק ${count} מוצרים? פעולה זו בלתי הפיכה.`)) return;

    setBulkDeleting(true);
    let successCount = 0;
    let errorCount   = 0;

    for (const id of selectedIds) {
      try {
        const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
        res.ok ? successCount++ : errorCount++;
      } catch { errorCount++; }
    }

    setBulkDeleting(false);
    if (successCount > 0) { toast.success(`${successCount} מוצרים נמחקו בהצלחה`); deselectAll(); fetchProducts(); }
    if (errorCount   > 0)   toast.error(`${errorCount} מוצרים לא נמחקו עקב שגיאה`);
  };

  /* ── Render ────────────────────────────────────────────────────── */
  return (
    <div className="p-6 lg:p-8" dir="rtl">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#222021]">מוצרים</h1>
          <p className="text-gray-500 text-sm mt-1">{total} מוצרים במערכת</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-2 text-sm px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:border-[#c9a96e] hover:text-[#c9a96e] font-bold transition-all"
          >
            <FileSpreadsheet className="h-4 w-4" />
            ייבוא מוצרים מקובץ
          </button>
          <Link href="/admin/products/new" className="btn-gold flex items-center gap-2 text-sm px-4 py-2.5">
            <Plus className="h-4 w-4" />
            מוצר חדש
          </Link>
        </div>
      </div>

      {showImport && (
        <ImportProductsModal
          onClose={() => setShowImport(false)}
          onSuccess={() => { fetchProducts(); setShowImport(false); }}
        />
      )}

      {/* Search + Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
        {/* Search */}
        <Search className="h-5 w-5 text-gray-400 shrink-0" />
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder='חיפוש לפי שם, מק"ט...'
          className="flex-1 min-w-[160px] outline-none text-base font-[Assistant]"
          dir="rtl"
        />

        {/* Divider */}
        <div className="w-px h-6 bg-gray-200 shrink-0" />

        {/* Brand filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-gray-400 shrink-0" />
          <select
            value={brandFilter}
            onChange={(e) => { setBrandFilter(e.target.value ? Number(e.target.value) : ""); setPage(1); }}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#c9a96e] bg-white text-gray-700 cursor-pointer"
            dir="rtl"
          >
            <option value="">כל המותגים</option>
            {brands.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} ({b._count.products})
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value ? Number(e.target.value) : ""); setPage(1); }}
          className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#c9a96e] bg-white text-gray-700 cursor-pointer"
          dir="rtl"
        >
          <option value="">כל הקטגוריות</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.isChild ? `  ↳ ${c.name}` : c.name}
            </option>
          ))}
        </select>

        {/* Clear all filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            נקה
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {(brandFilter !== "" || categoryFilter !== "") && (
        <div className="flex flex-wrap gap-2 mb-4">
          {brandFilter !== "" && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-[#c9a96e]/10 text-[#9a7040] border border-[#c9a96e]/30 rounded-full px-3 py-1 font-semibold">
              מותג: {brands.find((b) => b.id === brandFilter)?.name}
              <button onClick={() => { setBrandFilter(""); setPage(1); }} className="hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {categoryFilter !== "" && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-[#c9a96e]/10 text-[#9a7040] border border-[#c9a96e]/30 rounded-full px-3 py-1 font-semibold">
              קטגוריה: {categories.find((c) => c.id === categoryFilter)?.name}
              <button onClick={() => { setCategoryFilter(""); setPage(1); }} className="hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <PackageIcon className="h-12 w-12 mx-auto mb-3 text-gray-200" />
            <p>לא נמצאו מוצרים</p>
            {hasFilters && (
              <button onClick={clearFilters} className="mt-3 text-sm text-[#c9a96e] hover:underline">
                נקה סינון
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: 44 }}>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAllChange}
                      className="w-[18px] h-[18px] rounded cursor-pointer accent-[#c9a96e]"
                      title="בחר הכל"
                    />
                  </th>
                  <th>תמונה</th>
                  <th>שם מוצר</th>
                  <th>מותג</th>
                  <th>מחיר</th>
                  <th>מלאי</th>
                  <th>סטטוס</th>
                  <th>תאריך</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const selected = selectedIds.has(p.id);
                  return (
                    <tr key={p.id} style={selected ? { background: "rgba(59,130,246,0.07)" } : undefined}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleSelect(p.id)}
                          className="w-[18px] h-[18px] rounded cursor-pointer accent-[#c9a96e]"
                        />
                      </td>
                      <td>
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-50">
                          <Image
                            src={p.image1 ?? getPlaceholderImage(80, 80)}
                            alt={p.name}
                            fill
                            className="object-cover"
                            unoptimized={!p.image1}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="max-w-[200px]">
                          <p className="font-semibold text-[#222021] truncate">{p.name}</p>
                          <p className="text-xs text-gray-400">מק&quot;ט: {p.sku}</p>
                          <div className="flex gap-1 mt-1 flex-wrap">
                            {p.productTags.slice(0, 2).map((pt) => (
                              <Badge key={pt.tag.id} variant="custom" color={pt.tag.color} className="text-[10px]">
                                {pt.tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="text-sm">{p.brand.name}</td>
                      <td>
                        {p.salePrice ? (
                          <>
                            <span className="font-bold text-[#c9a96e]">{formatPrice(p.salePrice)}</span>
                            <br />
                            <span className="text-xs text-gray-400 line-through">{formatPrice(p.price)}</span>
                          </>
                        ) : (
                          <span className="font-bold">{formatPrice(p.price)}</span>
                        )}
                      </td>
                      <td>
                        <Badge variant={p.stockStatus === "in_stock" ? "green" : "red"} className="text-xs">
                          {STOCK_STATUS_LABELS[p.stockStatus] ?? p.stockStatus}
                        </Badge>
                      </td>
                      <td>
                        <Badge variant={p.active ? "dark" : "gray"} className="text-xs">
                          {p.active ? "פעיל" : "מושבת"}
                        </Badge>
                      </td>
                      <td className="text-xs text-gray-400">{formatDateTime(p.createdAt)}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/product/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                            title="צפה באתר"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          <Link
                            href={`/admin/products/${p.id}`}
                            className="p-1.5 text-gray-400 hover:text-[#c9a96e] transition-colors"
                            title="ערוך"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletingId === p.id}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            title="מחק"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-colors ${
                  page === i + 1 ? "bg-[#c9a96e] text-white" : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      <div
        dir="rtl"
        style={{
          position: "fixed",
          bottom: 24,
          left: "50%",
          transform: `translateX(-50%) translateY(${selectedIds.size > 0 ? "0" : "calc(100% + 32px)"})`,
          background: "#1a1a1a",
          color: "#fff",
          borderRadius: 12,
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
          transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
          zIndex: 200,
          whiteSpace: "nowrap",
          pointerEvents: selectedIds.size > 0 ? "auto" : "none",
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 600, color: "#e5e5e5" }}>
          נבחרו{" "}
          <span style={{ color: "#c9a96e", fontWeight: 800 }}>{selectedIds.size}</span>
          {" "}מוצרים
        </span>

        <div style={{ width: 1, height: 20, background: "#444" }} />

        <button
          onClick={handleBulkDelete}
          disabled={bulkDeleting}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#dc2626", color: "#fff", border: "none", borderRadius: 8,
            padding: "6px 14px", fontSize: 13, fontWeight: 700,
            cursor: bulkDeleting ? "not-allowed" : "pointer",
            opacity: bulkDeleting ? 0.6 : 1, transition: "opacity 0.15s",
          }}
        >
          <Trash2 style={{ width: 14, height: 14 }} />
          {bulkDeleting ? "מוחק..." : "מחק נבחרים"}
        </button>

        <button
          onClick={deselectAll}
          disabled={bulkDeleting}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            background: "transparent", color: "#aaa", border: "1px solid #444", borderRadius: 8,
            padding: "6px 12px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "color 0.15s, border-color 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#fff";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#888";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#aaa";
            (e.currentTarget as HTMLButtonElement).style.borderColor = "#444";
          }}
        >
          <X style={{ width: 13, height: 13 }} />
          בטל בחירה
        </button>
      </div>

    </div>
  );
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 10V7" />
    </svg>
  );
}
