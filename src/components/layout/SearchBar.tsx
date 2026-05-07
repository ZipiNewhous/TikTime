"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getPlaceholderImage } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  image1: string | null;
  brand: { name: string };
}

interface SearchBarProps {
  onClose: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data.items ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/50 flex items-start justify-center pt-20"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden animate-fade-in">
        <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 border-b" dir="rtl">
          <Search className="h-5 w-5 text-[#c9a96e] shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="חפש שעון, מותג, מק&quot;ט..."
            className="flex-1 text-lg outline-none font-[Assistant] bg-transparent"
            dir="rtl"
          />
          {loading && <Loader2 className="h-4 w-4 animate-spin text-gray-400 shrink-0" />}
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </form>

        {results.length > 0 && (
          <div className="py-2 max-h-80 overflow-y-auto" dir="rtl">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.slug}`}
                onClick={onClose}
                className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="relative w-12 h-12 rounded overflow-hidden shrink-0">
                  <Image
                    src={item.image1 ?? getPlaceholderImage(100, 100)}
                    alt={item.name}
                    fill
                    className="object-cover"
                    unoptimized={!item.image1}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#222021] truncate">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.brand.name}</p>
                </div>
                <div className="text-left shrink-0">
                  {item.salePrice ? (
                    <span className="font-bold text-[#c9a96e]">{formatPrice(item.salePrice)}</span>
                  ) : (
                    <span className="font-bold text-[#222021]">{formatPrice(item.price)}</span>
                  )}
                </div>
              </Link>
            ))}
            {query.trim().length >= 2 && (
              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="flex items-center justify-center gap-2 py-3 text-[#c9a96e] font-semibold text-sm hover:bg-gray-50 border-t"
              >
                <Search className="h-4 w-4" />
                לכל תוצאות "{query}"
              </Link>
            )}
          </div>
        )}

        {query.trim().length >= 2 && !loading && results.length === 0 && (
          <div className="py-8 text-center text-gray-500" dir="rtl">
            לא נמצאו תוצאות עבור &quot;{query}&quot;
          </div>
        )}
      </div>
    </div>
  );
}
