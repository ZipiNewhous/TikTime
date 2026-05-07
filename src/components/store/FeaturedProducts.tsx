import Link from "next/link";
import ProductCard from "./ProductCard";
import type { ProductWithRelations } from "@/types";

interface FeaturedProductsProps {
  products: ProductWithRelations[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-white border-t border-[#e0e0e0]" dir="rtl">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-[24px] font-bold text-[#222222]">מוצרים מומלצים</h2>
          <div className="w-10 h-0.5 bg-[#c9a96e] mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/category/gevarim"
            className="inline-block border-2 border-[#222222] text-[#222222] hover:bg-[#222222] hover:text-white font-bold px-10 py-3 text-sm tracking-widest uppercase transition-colors"
          >
            לכל המוצרים
          </Link>
        </div>
      </div>
    </section>
  );
}
