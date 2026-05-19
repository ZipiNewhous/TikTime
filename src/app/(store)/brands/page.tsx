export const dynamic = 'force-dynamic';

import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/db/prisma";
import type { Metadata } from "next";
import BrandsProductsClient from "./BrandsProductsClient";

export const metadata: Metadata = {
  title: "מותגים | TikTime",
  description: "כל מותגי השעונים המובילים - Rolex, Omega, TAG Heuer ועוד",
};

const PAGE_SIZE = 24;

// Map brand slug (with random suffix) to local logo file
const KNOWN_LOGOS = new Set([
  "bering", "cavallo", "claude-bernard", "frederique-constant",
  "gant", "mathey-tissot", "michele", "rado", "tissot", "tommy-hilfiger",
]);

function getLogoPath(slug: string): string | null {
  // Strip trailing random suffix like -o4zvg or -da4yn
  const base = slug.replace(/-[a-z0-9]{4,7}$/, "");
  return KNOWN_LOGOS.has(base) ? `/brands/${base}.png` : null;
}

const productInclude = {
  brand: { select: { id: true, name: true, slug: true } },
  productTags: { include: { tag: { select: { id: true, name: true, slug: true, color: true } } } },
  productCategories: { include: { category: { select: { id: true, name: true, slug: true } } } },
};

export default async function BrandsPage() {
  const [brands, initialItems, initialTotal] = await Promise.all([
    prisma.brand.findMany({
      where: { active: true },
      include: { _count: { select: { products: { where: { active: true } } } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { active: true },
      orderBy: [{ stockStatus: "asc" }, { price: "asc" }],
      skip: 0,
      take: PAGE_SIZE,
      include: productInclude,
    }),
    prisma.product.count({ where: { active: true } }),
  ]);

  const initialHasMore = initialTotal > PAGE_SIZE;

  return (
    <div className="min-h-screen bg-white" dir="rtl">

      {/* Brand logos strip */}
      <div className="border-b border-[#e8e8e8] bg-white py-6 px-4">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {brands.map((brand) => {
              const logoPath = getLogoPath(brand.slug);
              return (
                <Link
                  key={brand.id}
                  href={`/brands/${brand.slug}`}
                  className="group flex flex-col items-center justify-center w-[88px] h-[88px] border border-[#e8e8e8] bg-white hover:border-[#c9a96e] transition-colors shrink-0"
                  title={brand.name}
                >
                  {logoPath ? (
                    <Image
                      src={logoPath}
                      alt={brand.name}
                      width={60}
                      height={44}
                      className="object-contain"
                      unoptimized
                    />
                  ) : (
                    <span className="text-xl font-black text-[#c9a96e]">
                      {brand.name.charAt(0)}
                    </span>
                  )}
                  <span className="text-[10px] text-[#555] text-center mt-1 px-1 line-clamp-1 leading-tight">
                    {brand.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Products section */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <BrandsProductsClient
          initialProducts={initialItems as Parameters<typeof BrandsProductsClient>[0]["initialProducts"]}
          initialTotal={initialTotal}
          initialHasMore={initialHasMore}
        />
      </div>
    </div>
  );
}
