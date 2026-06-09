"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductCard from "@/components/store/ProductCard";
import type { ProductWithRelations } from "@/types";

const PAGE_SIZE = 24;

interface Props {
  initialProducts: ProductWithRelations[];
  initialTotal: number;
  initialHasMore: boolean;
}

export default function BrandsProductsClient({ initialProducts, initialTotal, initialHasMore }: Props) {
  const [products, setProducts] = useState<ProductWithRelations[]>(initialProducts);
  const [total] = useState(initialTotal);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (isFetchingRef.current || !hasMore) return;
    isFetchingRef.current = true;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/products?page=${nextPage}&pageSize=${PAGE_SIZE}&sort=price_asc`);
      const data = await res.json();
      setProducts((prev) => [...prev, ...(data.items ?? [])]);
      setHasMore(data.hasMore ?? nextPage < (data.totalPages ?? 1));
    } catch (err) {
      console.error(err);
      pageRef.current--;
    } finally {
      setLoadingMore(false);
      isFetchingRef.current = false;
    }
  }, [hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "400px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6" dir="rtl">
        <h2 className="text-xl font-bold text-[#222]">כל המוצרים</h2>
        <p className="text-sm text-gray-400">{total} מוצרים</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div ref={sentinelRef} className="h-1" />

      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-[#c9a96e] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
