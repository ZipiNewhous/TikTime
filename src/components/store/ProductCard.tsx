"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useCartStore } from "@/lib/store/cartStore";
import { toast } from "@/components/ui/Toast";
import type { ProductWithRelations } from "@/types";

interface ProductCardProps {
  product: ProductWithRelations;
  className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const isOutOfStock = product.stockStatus === "out_of_stock";
  const hasSale = product.salePrice !== null && product.salePrice < product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      salePrice: product.salePrice,
      image: product.image1,
      quantity: 1,
      sku: product.sku,
      brandName: product.brand.name,
    });
    toast.success(`${product.name} נוסף לסל`);
  };

  return (
    <article
      className={className}
      style={{ background: "#fff", border: "1px solid #e8e8e8", borderRadius: "4px", padding: "12px" }}
    >
      {/* Image — 1:1 square, bg #f8f8f8 */}
      <div className="relative overflow-hidden" style={{ aspectRatio: "1/1", background: "#f8f8f8" }}>
        <Link href={`/product/${product.slug}`} className="block absolute inset-0">
          <Image
            src={product.image1 ?? `https://placehold.co/400x400/f8f8f8/cccccc?text=${encodeURIComponent(product.brand.name)}`}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={!product.image1}
          />
        </Link>

        {/* Heart — top-left, gray fill red on hover */}
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          className="absolute top-2 left-2 z-10 group/heart p-0.5"
          style={{ background: "none", border: "none", cursor: "pointer" }}
          aria-label="הוסף למועדפים"
        >
          <Heart className="w-[18px] h-[18px] text-[#aaa] group-hover/heart:fill-[#e53e3e] group-hover/heart:text-[#e53e3e] transition-colors" />
        </button>
      </div>

      {/* Info */}
      <div style={{ marginTop: "10px" }} dir="rtl">

        {/* Name — right-aligned, 15px, #333, weight 400, max 2 lines */}
        <Link href={`/product/${product.slug}`}>
          <p
            className="line-clamp-2"
            style={{ textAlign: "right", fontSize: "15px", color: "#333", fontWeight: 400, lineHeight: "1.4", marginBottom: "5px" }}
          >
            {product.name}
          </p>
        </Link>

        {/* SKU — right-aligned, 13px, bold, #222 */}
        <p style={{ textAlign: "right", fontSize: "13px", fontWeight: 700, color: "#222", marginBottom: "5px" }}>
          SKU: {product.sku}
        </p>

        {/* Price — right-aligned */}
        <div style={{ textAlign: "right", marginBottom: "10px" }}>
          {hasSale ? (
            <>
              <span style={{ fontSize: "18px", fontWeight: 700, color: "#222" }}>
                ₪{product.salePrice!.toLocaleString("he-IL")}
              </span>
              {" "}
              <span style={{ fontSize: "14px", color: "#999", textDecoration: "line-through" }}>
                ₪{product.price.toLocaleString("he-IL")}
              </span>
            </>
          ) : (
            <span style={{ fontSize: "18px", fontWeight: 700, color: "#222" }}>
              ₪{product.price.toLocaleString("he-IL")}
            </span>
          )}
        </div>

        {/* Add to cart — single full-width button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-2 text-[14px] transition-colors ${
            isOutOfStock
              ? "border border-[#ccc] bg-[#f5f5f5] text-[#aaa] cursor-not-allowed"
              : "border border-[#333] bg-white text-[#333] hover:bg-[#333] hover:text-white"
          }`}
        >
          {isOutOfStock ? "אזל במלאי" : "הוסף לסל"}
        </button>
      </div>
    </article>
  );
}
