import Link from "next/link";
import prisma from "@/lib/db/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "מותגים | TikTime",
  description: "כל מותגי השעונים המובילים - Rolex, Omega, TAG Heuer ועוד",
};

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    where: { active: true },
    include: { _count: { select: { products: { where: { active: true } } } } },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Hero */}
      <div className="bg-[#222021] text-white py-14">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-black mb-3">המותגים שלנו</h1>
          <p className="text-gray-400 text-lg">קולקציית שעונים מהמותגים היוקרתיים ביותר בעולם</p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg hover:border-[#c9a96e] transition-all group"
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-16 w-auto object-contain mb-4 grayscale group-hover:grayscale-0 transition-all"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-[#c9a96e]/10 flex items-center justify-center mb-4">
                  <span className="text-2xl font-black text-[#c9a96e]">
                    {brand.name.charAt(0)}
                  </span>
                </div>
              )}
              <h2 className="font-black text-[#222021] text-lg group-hover:text-[#c9a96e] transition-colors">
                {brand.name}
              </h2>
              {brand.description && (
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">{brand.description}</p>
              )}
              <p className="text-[#c9a96e] text-sm font-bold mt-3">
                {brand._count.products} מוצרים
              </p>
            </Link>
          ))}
        </div>

        {brands.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <p>לא נמצאו מותגים</p>
          </div>
        )}
      </div>
    </div>
  );
}
