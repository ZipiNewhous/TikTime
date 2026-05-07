"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, Save } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toast } from "@/components/ui/Toast";

interface Tag {
  id: number;
  name: string;
  slug: string;
  color: string;
  _count: { productTags: number };
}

const PRESET_COLORS = [
  "#c9a96e", "#ef4444", "#22c55e", "#3b82f6",
  "#a855f7", "#f97316", "#ec4899", "#14b8a6",
];

export default function AdminTagsClient() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchTags = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tags");
      const data = await res.json();
      setTags(data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTags(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setColor(PRESET_COLORS[0]);
    setShowModal(true);
  };

  const openEdit = (t: Tag) => {
    setEditingId(t.id);
    setName(t.name);
    setColor(t.color);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) { toast.error("שם תגית נדרש"); return; }
    setSubmitting(true);
    try {
      const url = editingId ? `/api/admin/tags/${editingId}` : "/api/admin/tags";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, color }),
      });
      if (res.ok) {
        toast.success(editingId ? "התגית עודכנה" : "התגית נוספה");
        setShowModal(false);
        fetchTags();
      } else {
        const data = await res.json();
        toast.error(data.error ?? "שגיאה");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, tagName: string) => {
    if (!confirm(`למחוק את "${tagName}"?`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/tags/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("התגית נמחקה");
        fetchTags();
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
          <h1 className="text-2xl font-black text-[#222021]">תגיות</h1>
          <p className="text-gray-500 text-sm mt-1">{tags.length} תגיות</p>
        </div>
        <Button variant="gold" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          תגית חדשה
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin h-8 w-8 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
          </div>
        ) : tags.length === 0 ? (
          <div className="text-center py-12 text-gray-500">לא נמצאו תגיות</div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center gap-2 px-4 py-2 rounded-full border-2 font-bold text-sm text-white"
                style={{ background: tag.color, borderColor: tag.color }}
              >
                <span>{tag.name}</span>
                <span className="text-white/70 text-xs">({tag._count.productTags})</span>
                <button
                  onClick={() => openEdit(tag)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  disabled={deletingId === tag.id}
                  className="text-white/80 hover:text-white transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6" dir="rtl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold">{editingId ? "עריכת תגית" : "תגית חדשה"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="שם תגית"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="מבצע"
              />

              {/* Color Picker */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">צבע</label>
                <div className="flex gap-2 flex-wrap">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        background: c,
                        borderColor: color === c ? "#222021" : "transparent",
                        transform: color === c ? "scale(1.2)" : undefined,
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border border-gray-200"
                  />
                  <span className="text-sm text-gray-500">{color}</span>
                  {/* Preview */}
                  <div
                    className="px-3 py-1 rounded-full text-white text-xs font-bold"
                    style={{ background: color }}
                  >
                    {name || "תגית"}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="gold" fullWidth loading={submitting}>
                  <Save className="h-4 w-4" />
                  {editingId ? "שמור" : "צור תגית"}
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
