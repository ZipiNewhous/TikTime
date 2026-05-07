"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import ProductCard from "@/components/store/ProductCard";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import type { ProductWithRelations } from "@/types";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
  slug: string;
  children: { id: number; name: string; slug: string }[];
}

interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface CategoryPageClientProps {
  category: Category;
  brandsInCategory: Brand[];
  priceRange: { min: number; max: number };
  initialSearchParams: Record<string, string | string[]>;
}

const SORT_OPTIONS = [
  { value: "price_asc",  label: "מהזול ליקר" },
  { value: "price_desc", label: "מהיקר לזול" },
  { value: "name_asc",   label: "שם מוצר א-ת" },
  { value: "name_desc",  label: "שם מוצר ת-א" },
  { value: "popular",    label: "הפופולריים ביותר" },
  { value: "newest",     label: "הנמכרים ביותר" },
];

export default function CategoryPageClient({
  category,
  brandsInCategory,
}: CategoryPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<ProductWithRelations[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const page = parseInt(searchParams.get("page") ?? "1");
  const sort = searchParams.get("sort") ?? "price_asc";
  const selectedBrands = searchParams.getAll("brandId").map(Number);
  const inStock = searchParams.get("inStock") === "true";

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === null) params.delete(key);
      else params.set(key, value);
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const toggleBrand = useCallback(
    (brandId: number) => {
      const params = new URLSearchParams(searchParams.toString());
      const existing = params.getAll("brandId");
      const s = String(brandId);
      if (existing.includes(s)) {
        const updated = existing.filter((b) => b !== s);
        params.delete("brandId");
        updated.forEach((b) => params.append("brandId", b));
      } else {
        params.append("brandId", s);
      }
      params.delete("page");
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  const clearFilters = useCallback(() => router.push(pathname), [pathname, router]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams(searchParams.toString());
        params.set("category", category.slug);
        const sortMap: Record<string, string> = {
          price_asc: "price_asc",
          price_desc: "price_desc",
          name_asc: "name_asc",
          name_desc: "name_desc",
          popular: "newest",
          newest: "newest",
        };
        params.set("sort", sortMap[sort] ?? "price_asc");
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.items ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams, category.slug, sort]);

  const hasActiveFilters = selectedBrands.length > 0 || inStock;

  const FilterContent = () => (
    <div className="flex flex-col gap-6" dir="rtl">
      {hasActiveFilters && (
        <button
          onClick={() => { clearFilters(); setFilterOpen(false); }}
          className="flex items-center gap-2 text-[#c9a96e] font-semibold text-sm hover:underline"
        >
          <X className="h-4 w-4" />
          נקה הכל
        </button>
      )}

      {brandsInCategory.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-[#222] uppercase tracking-wide">מותגים</h3>
          <div className="flex flex-col gap-2">
            {brandsInCategory.map((brand) => (
              <label key={brand.id} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => toggleBrand(brand.id)}
                  className="w-4 h-4 accent-[#c9a96e]"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#c9a96e] transition-colors">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-sm mb-3 text-[#222] uppercase tracking-wide">מלאי</h3>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => updateParam("inStock", e.target.checked ? "true" : null)}
            className="w-4 h-4 accent-[#c9a96e]"
          />
          <span className="text-sm text-gray-700">רק במלאי</span>
        </label>
      </div>

      {category.children.length > 0 && (
        <div>
          <h3 className="font-bold text-sm mb-3 text-[#222] uppercase tracking-wide">תת-קטגוריות</h3>
          <div className="flex flex-col gap-2">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="text-sm text-gray-600 hover:text-[#c9a96e] transition-colors"
                onClick={() => setFilterOpen(false)}
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* Breadcrumb — קטלוג / [Category Name] */}
      <div className="bg-white border-b border-[#e8e8e8]">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-gray-400" dir="rtl">
            <Link href="/shop" className="hover:text-[#222] transition-colors">קטלוג</Link>
            <span className="text-gray-300">/</span>
            <span className="text-[#222] font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 py-6">

        {/* Filter bar — סינון מאפיינים (right) | מיין לפי (left) */}
        <div className="flex items-center justify-between mb-6 border-b border-[#e8e8e8] pb-4" dir="rtl">

          {/* Right side: Filter properties button */}
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 border border-[#333] px-4 py-2 text-sm font-semibold text-[#333] hover:bg-[#333] hover:text-white transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            סינון מאפיינים
            {hasActiveFilters && (
              <span className="bg-[#c9a96e] text-white text-[11px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {selectedBrands.length + (inStock ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Left side: Sort by + product count */}
          <div className="flex items-center gap-4">
            <p className="text-gray-400 text-sm hidden sm:block">
              {loading ? "טוען..." : `${total} מוצרים`}
            </p>
            <div className="flex items-center border border-gray-300 px-3 py-2 gap-2">
              <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="text-sm outline-none bg-transparent font-medium cursor-pointer"
                dir="rtl"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product grid — 4 cols desktop, 2 cols tablet+mobile, full width, no sidebar */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} style={{ border: "1px solid #e8e8e8", borderRadius: "4px", padding: "12px" }}>
                <div className="skeleton" style={{ aspectRatio: "1/1", marginBottom: "10px" }} />
                <div className="flex flex-col gap-2">
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                  <div className="skeleton h-5 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h3 className="text-xl font-bold text-gray-700 mb-2">לא נמצאו מוצרים</h3>
            <p className="text-gray-500 mb-6">נסה לשנות את הסינונים</p>
            <button
              onClick={clearFilters}
              className="bg-[#c9a96e] text-white font-bold px-6 py-3 hover:bg-[#b8933a] transition-colors"
            >
              נקה סינונים
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateParam("page", String(i + 1))}
                    className={`w-10 h-10 font-bold text-sm transition-colors border ${
                      page === i + 1
                        ? "bg-[#c9a96e] text-white border-[#c9a96e]"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Filter Drawer */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50" onClick={() => setFilterOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-80 bg-white z-[60] p-6 overflow-y-auto animate-slide-in" dir="rtl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-xl text-[#222]">סינון מאפיינים</h2>
              <button onClick={() => setFilterOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <FilterContent />
          </div>
        </>
      )}
    </div>
  );
}
