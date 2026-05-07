"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save, ChevronLeft } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  active: boolean;
  _count: { productCategories: number };
  children: Category[];
}

interface CatForm {
  name: string;
  description: string;
  parentId: string;
  active: boolean;
}

const emptyForm: CatForm = { name: "", description: "", parentId: "", active: true };

export default function AdminCategoriesClient() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CatForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Flat list for parent selector
  const flatCats: Category[] = [];
  categories.forEach((c) => {
    flatCats.push(c);
    c.children?.forEach((ch) => flatCats.push(ch));
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      setCategories(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = (parentId?: number) => {
    setEditingId(null);
    setForm({ ...emptyForm, parentId: parentId ? String(parentId) : "" });
    setShowModal(true);
  };

  const openEdit = (c: Category) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description ?? "",
      parentId: c.parentId ? String(c.parentId) : "",
      active: c.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("שם קטגוריה נדרש"); return; }
    setSubmitting(true);
    try {
      const url = editingId ? `/api/admin/categories/${editingId}` : "/api/admin/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingId ? "הקטגוריה עודכנה" : "הקטגוריה נוספה");
        setShowModal(false);
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.error ?? "שגיאה");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`למחוק את "${name}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("הקטגוריה נמחקה");
        fetchCategories();
      } else {
        toast.error("שגיאה במחיקה");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-[#222021]">קטגוריות</h1>
          <p className="text-gray-500 text-sm mt-1">{flatCats.length} קטגוריות</p>
        </div>
        <Button variant="gold" onClick={() => openCreate()}>
          <Plus className="h-4 w-4" />
          קטגוריה חדשה
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16 text-gray-500">לא נמצאו קטגוריות</div>
        ) : (
          <div className="divide-y">
            {categories.map((cat) => (
              <div key={cat.id}>
                {/* Parent Category */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#222021]">{cat.name}</span>
                      <Badge variant={cat.active ? "dark" : "gray"} className="text-xs">
                        {cat.active ? "פעיל" : "מושבת"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {cat._count.productCategories} מוצרים
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openCreate(cat.id)}
                      className="p-1.5 text-gray-400 hover:text-green-500 transition-colors"
                      title="הוסף תת-קטגוריה"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => openEdit(cat)}
                      className="p-1.5 text-gray-400 hover:text-[#c9a96e] transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      disabled={deletingId === cat.id}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Children */}
                {cat.children?.map((child) => (
                  <div key={child.id} className="flex items-center gap-4 px-5 py-3 bg-gray-50 border-t border-gray-100">
                    <ChevronLeft className="h-3 w-3 text-gray-300 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">{child.name}</span>
                        <Badge variant={child.active ? "dark" : "gray"} className="text-xs">
                          {child.active ? "פעיל" : "מושבת"}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {child._count.productCategories} מוצרים
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(child)}
                        className="p-1.5 text-gray-400 hover:text-[#c9a96e] transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(child.id, child.name)}
                        disabled={deletingId === child.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6" dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editingId ? "עריכת קטגוריה" : "קטגוריה חדשה"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="שם קטגוריה"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="שעונים לגברים"
              />
              <Input
                label="תיאור (אופציונלי)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold">קטגוריית אב (אופציונלי)</label>
                <select
                  value={form.parentId}
                  onChange={(e) => setForm((f) => ({ ...f, parentId: e.target.value }))}
                  className="form-input"
                >
                  <option value="">ללא (ראשית)</option>
                  {flatCats
                    .filter((c) => c.id !== editingId && !c.parentId)
                    .map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 accent-[#c9a96e]"
                />
                <span className="font-semibold text-sm">קטגוריה פעילה</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="gold" fullWidth loading={submitting}>
                  <Save className="h-4 w-4" />
                  {editingId ? "שמור" : "צור קטגוריה"}
                </Button>
                <Button type="button" variant="outline" fullWidth onClick={() => setShowModal(false)}>
                  ביטול
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
