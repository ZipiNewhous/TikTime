export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import CategoryPageClient from "./CategoryPageClient";
import type { Metadata } from "next";

const PAGE_SIZE = 24;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) return { title: "קטגוריה לא נמצאה" };
  return {
    title: category.name,
    description: `קולקציית ${category.name} של טיק טיים - שעוני יוקרה מקוריים`,
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  // Parse filter state from URL
  const urlSort = typeof sp.sort === 'string' ? sp.sort : 'price_asc';
  const brandIds = (Array.isArray(sp.brandId) ? sp.brandId : sp.brandId ? [sp.brandId] : [])
    .map(Number).filter(Boolean);
  const inStock = sp.inStock === 'true';

  const apiSort = ({ price_asc: 'price_asc', price_desc: 'price_desc', name_asc: 'name_asc', name_desc: 'name_desc', popular: 'newest', newest: 'newest' } as Record<string, string>)[urlSort] ?? 'price_asc';

  const primarySort = (() => {
    switch (apiSort) {
      case 'price_asc':  return { price: 'asc'  as const };
      case 'price_desc': return { price: 'desc' as const };
      case 'name_asc':   return { name: 'asc'   as const };
      default:           return { createdAt: 'desc' as const };
    }
  })();
  const orderBy = [{ stockStatus: 'asc' as const }, primarySort];

  const productWhere = {
    active: true,
    productCategories: { some: { category: { slug } } },
    ...(brandIds.length > 0 ? { brandId: { in: brandIds } } : {}),
    ...(inStock ? { stockStatus: 'in_stock' as const } : {}),
  };

  const productInclude = {
    brand: { select: { id: true, name: true, slug: true } },
    productTags: { include: { tag: { select: { id: true, name: true, slug: true, color: true } } } },
    productCategories: { include: { category: { select: { id: true, name: true, slug: true } } } },
  };

  // All queries in parallel
  const [categoryData, brandsInCategory, priceAgg, initialItems, initialTotal] = await Promise.all([
    prisma.category.findUnique({
      where: { slug },
      include: { children: { orderBy: { order: 'asc' } } },
    }),
    prisma.brand.findMany({
      where: {
        products: { some: { active: true, productCategories: { some: { category: { slug } } } } },
      },
      orderBy: { name: 'asc' },
    }),
    prisma.product.aggregate({
      where: { active: true, productCategories: { some: { category: { slug } } } },
      _min: { price: true },
      _max: { price: true },
    }),
    prisma.product.findMany({
      where: productWhere,
      orderBy,
      skip: 0,
      take: PAGE_SIZE,
      include: productInclude,
    }),
    prisma.product.count({ where: productWhere }),
  ]);

  if (!categoryData) notFound();

  return (
    <CategoryPageClient
      category={categoryData}
      brandsInCategory={brandsInCategory}
      priceRange={{
        min: priceAgg._min.price ?? 0,
        max: priceAgg._max.price ?? 100000,
      }}
      initialSearchParams={sp}
      initialProducts={initialItems as Parameters<typeof CategoryPageClient>[0]['initialProducts']}
      initialTotal={initialTotal}
      initialHasMore={initialTotal > PAGE_SIZE}
    />
  );
}
