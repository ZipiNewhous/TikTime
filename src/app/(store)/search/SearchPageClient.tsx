"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";
import ProductCard from "@/components/store/ProductCard";
import type { ProductWithRelations } from "@/types";

type Product = ProductWithRelations;

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(term)}&limit=24`);
      const data = await res.json();
      setResults(data.results ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (q) { setQuery(q); doSearch(q); }
  }, [q, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
    // Update URL without navigation
    const url = new URL(window.location.href);
    url.searchParams.set("q", query);
    window.history.replaceState({}, "", url.toString());
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Search Header */}
      <div className="bg-white border-b py-10">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-black text-[#222021] mb-6 text-center">חיפוש</h1>
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חפש שעון, מותג, דגם..."
              className="flex-1 form-input text-base"
              autoFocus
              dir="rtl"
            />
            <button
              type="submit"
              className="btn-gold px-6 py-3 flex items-center gap-2 font-bold"
            >
              <Search className="h-5 w-5" />
              חפש
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin h-10 w-10 border-4 border-[#c9a96e] border-t-transparent rounded-full" />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <h2 className="text-xl font-bold text-[#222021] mb-2">לא נמצאו תוצאות</h2>
            <p className="text-gray-500 mb-6">נסה מילות חיפוש אחרות</p>
            <Link href="/" className="btn-gold px-6 py-3 inline-block font-bold">
              חזרה לדף הבית
            </Link>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-gray-500 text-sm mb-6">
              נמצאו <span className="font-bold text-[#222021]">{results.length}</span> תוצאות עבור &ldquo;{q}&rdquo;
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}

        {!searched && !loading && (
          <div className="text-center py-20 text-gray-400">
            <Search className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">הקלד מילת חיפוש כדי להתחיל</p>
          </div>
        )}
      </div>
    </div>
  );
}
