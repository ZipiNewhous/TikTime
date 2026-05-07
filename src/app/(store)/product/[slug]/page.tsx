export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";
import { safeParseJSON, formatPrice } from "@/lib/utils";
import type { ProductSpec } from "@/types";
import ProductCard from "@/components/store/ProductCard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { brand: { select: { name: true } } },
  });
  if (!product) return { title: "׳׳•׳¦׳¨ ׳׳ ׳ ׳׳¦׳" };
  return {
    title: `${product.name} | ${product.brand.name}`,
    description: product.description ?? `${product.name} - ${formatPrice(product.price)}`,
    openGraph: {
      images: product.image1 ? [product.image1] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, active: true },
    include: {
      brand: { select: { id: true, name: true, slug: true } },
      productTags: { include: { tag: true } },
      productCategories: { include: { category: { select: { id: true, name: true, slug: true } } } },
    },
  });

  if (!product) notFound();

  const specs: ProductSpec[] = safeParseJSON(product.specs) ?? [];

  // Related products
  const related = await prisma.product.findMany({
    where: {
      active: true,
      brandId: product.brandId,
      id: { not: product.id },
    },
    take: 4,
    include: {
      brand: { select: { id: true, name: true, slug: true } },
      productTags: { include: { tag: true } },
      productCategories: { include: { category: { select: { id: true, name: true, slug: true } } } },
    },
  });

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <ProductPageClient product={product} specs={specs} />

      {/* Related Products */}
      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 border-t">
          <h2 className="text-2xl font-black text-[#222021] mb-8">׳׳•׳¦׳¨׳™׳ ׳ ׳•׳¡׳₪׳™׳ ׳©׳ {product.brand.name}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
