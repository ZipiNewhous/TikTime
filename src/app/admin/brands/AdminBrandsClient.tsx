"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import { toast } from "@/components/ui/Toast";

interface Brand {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  website: string | null;
  active: boolean;
  _count: { products: number };
}

interface BrandForm {
  name: string;
  description: string;
  logo: string;
  website: string;
  active: boolean;
}

const emptyForm: BrandForm = { name: "", description: "", logo: "", website: "", active: true };

export default function AdminBrandsClient() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<BrandForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/brands");
      const data = await res.json();
      setBrands(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBrands(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (b: Brand) => {
    setEditingId(b.id);
    setForm({
      name: b.name,
      description: b.description ?? "",
      logo: b.logo ?? "",
      website: b.website ?? "",
      active: b.active,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error("שם מותג נדרש"); return; }
    setSubmitting(true);
    try {
      const url = editingId ? `/api/admin/brands/${editingId}` : "/api/admin/brands";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(editingId ? "המותג עודכן" : "המותג נוסף");
        setShowModal(false);
        fetchBrands();
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
      const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("המותג נמחק");
        fetchBrands();
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
          <h1 className="text-2xl font-black text-[#222021]">מותגים</h1>
          <p className="text-gray-500 text-sm mt-1">{brands.length} מותגים</p>
        </div>
        <Button variant="gold" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          מותג חדש
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-8 w-8 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
          </div>
        ) : brands.length === 0 ? (
          <div className="text-center py-16 text-gray-500">לא נמצאו מותגים</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>תיאור</th>
                <th>מוצרים</th>
                <th>סטטוס</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((b) => (
                <tr key={b.id}>
                  <td>
                    <p className="font-semibold text-[#222021]">{b.name}</p>
                    {b.website && (
                      <a href={b.website} target="_blank" rel="noreferrer" className="text-xs text-[#c9a96e] hover:underline">
                        {b.website}
                      </a>
                    )}
                  </td>
                  <td className="text-sm text-gray-500 max-w-[200px] truncate">{b.description ?? "—"}</td>
                  <td className="text-sm">{b._count.products}</td>
                  <td>
                    <Badge variant={b.active ? "dark" : "gray"} className="text-xs">
                      {b.active ? "פעיל" : "מושבת"}
                    </Badge>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(b)}
                        className="p-1.5 text-gray-400 hover:text-[#c9a96e] transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id, b.name)}
                        disabled={deletingId === b.id}
                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6" dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editingId ? "עריכת מותג" : "מותג חדש"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="שם מותג"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="Rolex"
              />
              <Input
                label="תיאור (אופציונלי)"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="תיאור קצר..."
              />
              <Input
                label="לוגו (URL)"
                value={form.logo}
                onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
                placeholder="https://..."
              />
              <Input
                label="אתר אינטרנט"
                value={form.website}
                onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                placeholder="https://rolex.com"
              />
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  className="w-4 h-4 accent-[#c9a96e]"
                />
                <span className="font-semibold text-sm">מותג פעיל</span>
              </label>
              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="gold" fullWidth loading={submitting}>
                  <Save className="h-4 w-4" />
                  {editingId ? "שמור" : "צור מותג"}
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
