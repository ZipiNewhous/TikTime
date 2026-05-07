import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import CategoryPageClient from "./CategoryPageClient";
import type { Metadata } from "next";

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

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: { orderBy: { order: "asc" } },
    },
  });

  if (!category) notFound();

  // Get brands in this category for filter sidebar
  const brandsInCategory = await prisma.brand.findMany({
    where: {
      products: {
        some: {
          active: true,
          productCategories: { some: { category: { slug } } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  // Price range for this category
  const priceAgg = await prisma.product.aggregate({
    where: {
      active: true,
      productCategories: { some: { category: { slug } } },
    },
    _min: { price: true },
    _max: { price: true },
  });

  return (
    <CategoryPageClient
      category={category}
      brandsInCategory={brandsInCategory}
      priceRange={{
        min: priceAgg._min.price ?? 0,
        max: priceAgg._max.price ?? 100000,
      }}
      initialSearchParams={sp}
    />
  );
}
