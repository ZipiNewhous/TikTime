export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/db/prisma";
import ProductCard from "@/components/store/ProductCard";
import type { ProductWithRelations } from "@/types";

export const metadata: Metadata = {
  title: "׳׳‘׳¦׳¢׳™׳ | TikTime",
  description: "׳©׳¢׳•׳ ׳™ ׳™׳•׳§׳¨׳” ׳‘׳׳—׳™׳¨׳™׳ ׳׳™׳•׳—׳“׳™׳ ג€“ ׳׳‘׳¦׳¢׳™׳ ׳׳–׳׳ ׳׳•׳’׳‘׳",
};

async function getSaleProducts(): Promise<ProductWithRelations[]> {
  const products = await prisma.product.findMany({
    where: {
      active: true,
      OR: [
        { salePrice: { not: null } },
        { productTags: { some: { tag: { slug: "mivtza" } } } },
      ],
    },
    include: {
      brand: true,
      productCategories: { include: { category: true } },
      productTags: { include: { tag: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 24,
  });
  return products as ProductWithRelations[];
}

export default async function MivtzaimPage() {
  const products = await getSaleProducts();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero banner */}
      <div className="bg-[#222021] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[#c9a96e] text-sm font-bold uppercase tracking-widest mb-2">
            ׳˜׳™׳§ ׳˜׳™׳™׳
          </p>
          <h1 className="text-4xl lg:text-5xl font-black mb-3">׳׳‘׳¦׳¢׳™׳ ׳׳™׳•׳—׳“׳™׳</h1>
          <p className="text-gray-300 text-lg max-w-xl mx-auto">
            ׳׳—׳™׳¨׳™׳ ׳׳™׳•׳—׳“׳™׳ ׳¢׳ ׳©׳¢׳•׳ ׳™ ׳™׳•׳§׳¨׳” ׳ ׳‘׳—׳¨׳™׳ ג€“ ׳׳–׳׳ ׳׳•׳’׳‘׳ ׳‘׳׳‘׳“
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#c9a96e] transition-colors">׳‘׳™׳×</Link>
            <span>/</span>
            <span className="text-[#222021] font-semibold">׳׳‘׳¦׳¢׳™׳</span>
          </nav>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">ג</p>
            <h2 className="text-2xl font-bold text-gray-700 mb-3">
              ׳׳™׳ ׳׳‘׳¦׳¢׳™׳ ׳›׳¨׳’׳¢
            </h2>
            <p className="text-gray-500 mb-6">
              ׳—׳–׳¨׳• ׳‘׳§׳¨׳•׳‘ ג€“ ׳׳‘׳¦׳¢׳™׳ ׳—׳“׳©׳™׳ ׳׳×׳¢׳“׳›׳ ׳™׳ ׳›׳ ׳”׳–׳׳
            </p>
            <Link href="/category/gevarim" className="inline-block bg-[#c9a96e] hover:bg-[#b8933a] text-white font-bold px-7 py-3 rounded transition-colors">
              ׳׳›׳ ׳”׳§׳•׳׳§׳¦׳™׳”
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-6 font-medium">
              ׳ ׳׳¦׳׳• {products.length} ׳׳•׳¦׳¨׳™׳ ׳‘׳׳‘׳¦׳¢
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
