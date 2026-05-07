"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";
import { slugify } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight, Save } from "lucide-react";

interface Brand { id: number; name: string }
interface Category { id: number; name: string; parentId: number | null }
interface Tag { id: number; name: string; color: string }

interface ProductFormProps {
  initialData?: {
    id: number;
    name: string;
    sku: string;
    brandId: number;
    price: number;
    salePrice: number | null;
    description: string | null;
    specs: string | null;
    stockStatus: string;
    image1: string | null;
    image2: string | null;
    image3: string | null;
    featured: boolean;
    active: boolean;
    productCategories: { category: { id: number } }[];
    productTags: { tag: { id: number } }[];
  };
}

export default function ProductForm({ initialData }: ProductFormProps = {}) {
  const router = useRouter();
  const isEdit = !!initialData;

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);

  const [name, setName] = useState(initialData?.name ?? "");
  const [sku, setSku] = useState(initialData?.sku ?? "");
  const [brandId, setBrandId] = useState(initialData?.brandId?.toString() ?? "");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [salePrice, setSalePrice] = useState(initialData?.salePrice?.toString() ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [specs, setSpecs] = useState(initialData?.specs ?? "");
  const [stockStatus, setStockStatus] = useState(initialData?.stockStatus ?? "in_stock");
  const [image1, setImage1] = useState(initialData?.image1 ?? "");
  const [image2, setImage2] = useState(initialData?.image2 ?? "");
  const [image3, setImage3] = useState(initialData?.image3 ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [active, setActive] = useState(initialData?.active ?? true);
  const [selectedCategories, setSelectedCategories] = useState<number[]>(
    initialData?.productCategories.map((pc) => pc.category.id) ?? []
  );
  const [selectedTags, setSelectedTags] = useState<number[]>(
    initialData?.productTags.map((pt) => pt.tag.id) ?? []
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/brands").then((r) => r.json()),
      fetch("/api/categories").then((r) => r.json()),
      fetch("/api/admin/tags").then((r) => r.json()).catch(() => []),
    ]).then(([b, c, t]) => {
      setBrands(b ?? []);
      // Flatten categories
      const flat: Category[] = [];
      const flatten = (cats: Category[]) => {
        cats.forEach((cat: Category & { children?: Category[] }) => {
          flat.push(cat);
          if (cat.children) flatten(cat.children);
        });
      };
      flatten(c ?? []);
      setCategories(flat);
      setTags(t ?? []);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !sku || !brandId || !price) {
      toast.error("יש למלא שדות חובה: שם, מק\"ט, מותג, מחיר");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name, sku, brandId, price, salePrice: salePrice || null,
        description: description || null,
        specs: specs || null,
        stockStatus, image1: image1 || null, image2: image2 || null, image3: image3 || null,
        featured, active,
        categoryIds: selectedCategories,
        tagIds: selectedTags,
      };

      const url = isEdit ? `/api/admin/products/${initialData!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "שגיאה בשמירה");
        return;
      }

      toast.success(isEdit ? "המוצר עודכן בהצלחה" : "המוצר נוסף בהצלחה");
      router.push("/admin/products");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-6 lg:p-8" dir="rtl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600">
          <ArrowRight className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-black text-[#222021]">
          {isEdit ? "עריכת מוצר" : "מוצר חדש"}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Fields */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">פרטי מוצר</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="שם המוצר"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rolex Submariner..."
                />
                <p className="text-xs text-gray-400 -mt-2">
                  Slug: {name ? slugify(name) : "—"}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label='מק"ט (SKU)'
                    required
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="ROL-SUB-001"
                  />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#222021]">
                      מותג <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={brandId}
                      onChange={(e) => setBrandId(e.target.value)}
                      className="form-input"
                      required
                    >
                      <option value="">בחר מותג</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="מחיר (₪)"
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="45000"
                  />
                  <Input
                    label="מחיר מבצע (₪)"
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value)}
                    placeholder="אופציונלי"
                    hint="ריק = אין מבצע"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">סטטוס מלאי</label>
                  <select
                    value={stockStatus}
                    onChange={(e) => setStockStatus(e.target.value)}
                    className="form-input"
                  >
                    <option value="in_stock">במלאי</option>
                    <option value="out_of_stock">אזל מהמלאי</option>
                  </select>
                </div>
                <Textarea
                  label="תיאור"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="תיאור המוצר..."
                  rows={4}
                />
                <Textarea
                  label="מפרט טכני (JSON)"
                  value={specs}
                  onChange={(e) => setSpecs(e.target.value)}
                  placeholder='[{"label":"קוטר","value":"41mm"},...]'
                  rows={3}
                  hint="מערך JSON עם label/value"
                />
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h2 className="font-bold text-lg mb-4">תמונות</h2>
              <div className="flex flex-col gap-4">
                <Input
                  label="תמונה 1 (URL)"
                  value={image1}
                  onChange={(e) => setImage1(e.target.value)}
                  placeholder="https://..."
                />
                <Input
                  label="תמונה 2 (URL)"
                  value={image2}
                  onChange={(e) => setImage2(e.target.value)}
                  placeholder="https://..."
                />
                <Input
                  label="תמונה 3 (URL)"
                  value={image3}
                  onChange={(e) => setImage3(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Status */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-bold text-lg mb-4">הגדרות</h2>
              <div className="flex flex-col gap-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="w-4 h-4 accent-[#c9a96e]"
                  />
                  <span className="font-semibold text-sm">מוצר פעיל</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4 h-4 accent-[#c9a96e]"
                  />
                  <span className="font-semibold text-sm">מוצר מומלץ</span>
                </label>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="font-bold text-lg mb-4">קטגוריות</h2>
                <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => toggleCategory(cat.id)}
                        className="w-4 h-4 accent-[#c9a96e]"
                      />
                      <span className="text-sm text-gray-700">
                        {cat.parentId ? "  ↳ " : ""}{cat.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <h2 className="font-bold text-lg mb-4">תגיות</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                        selectedTags.includes(tag.id)
                          ? "text-white border-transparent"
                          : "bg-transparent border-gray-200 text-gray-600"
                      }`}
                      style={selectedTags.includes(tag.id) ? { background: tag.color, borderColor: tag.color } : {}}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                variant="gold"
                size="lg"
                fullWidth
                loading={submitting}
              >
                <Save className="h-5 w-5" />
                {isEdit ? "שמור שינויים" : "צור מוצר"}
              </Button>
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => router.push("/admin/products")}
              >
                ביטול
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
