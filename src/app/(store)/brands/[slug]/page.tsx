export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import prisma from "@/lib/db/prisma";
import ProductCard from "@/components/store/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await prisma.brand.findUnique({ where: { slug } });
  if (!brand) return { title: "׳׳•׳×׳’ ׳׳ ׳ ׳׳¦׳" };
  return {
    title: `${brand.name} | TikTime`,
    description: brand.description ?? `׳§׳•׳׳§׳¦׳™׳™׳× ׳©׳¢׳•׳ ׳™ ${brand.name}`,
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug } = await params;

  const brand = await prisma.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: {
          productTags: { include: { tag: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!brand) notFound();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Brand Hero */}
      <div className="bg-[#222021] text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/brands" className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 w-fit">
            <ArrowRight className="h-4 w-4" />
            ׳›׳ ׳”׳׳•׳×׳’׳™׳
          </Link>
          <div className="flex items-center gap-6">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="h-20 w-auto object-contain" />
            ) : (
              <div className="h-20 w-20 rounded-2xl bg-[#c9a96e]/20 flex items-center justify-center">
                <span className="text-3xl font-black text-[#c9a96e]">{brand.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <h1 className="text-4xl font-black">{brand.name}</h1>
              {brand.description && (
                <p className="text-gray-400 mt-2 max-w-xl">{brand.description}</p>
              )}
              <p className="text-[#c9a96e] font-bold mt-2">{brand.products.length} ׳׳•׳¦׳¨׳™׳</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        {brand.products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">׳׳™׳ ׳׳•׳¦׳¨׳™׳ ׳–׳׳™׳ ׳™׳ ׳›׳¨׳’׳¢</p>
            <Link href="/" className="btn-gold mt-4 px-6 py-3 inline-block font-bold">
              ׳—׳–׳¨׳” ׳׳—׳ ׳•׳×
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {brand.products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  brand: { id: brand.id, name: brand.name, slug: brand.slug },
                  productCategories: [],
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
