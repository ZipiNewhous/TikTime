export const dynamic = 'force-dynamic';

import { notFound } from "next/navigation";
import prisma from "@/lib/db/prisma";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";
import { safeParseJSON, formatPrice } from "@/lib/utils";
import type { ProductSpec } from "@/types";
import ProductCard from "@/components/store/ProductCard";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tiktime.co.il";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: { select: { name: true } },
      productCategories: { include: { category: { select: { name: true } } } },
    },
  });
  if (!product) return { title: "מוצר לא נמצא" };
  const categoryName = product.productCategories[0]?.category.name;
  const titleSuffix = categoryName
    ? `${product.brand.name} | ${categoryName}`
    : product.brand.name;
  return {
    title: `${product.name} | ${titleSuffix}`,
    description:
      product.description ??
      `${product.name} - ${product.brand.name}. ${formatPrice(product.price)}`,
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

  const categories = product.productCategories.map((pc) => pc.category);
  const images = [product.image1, product.image2, product.image3].filter(Boolean) as string[];
  const sellingPrice =
    product.salePrice !== null && product.salePrice < product.price
      ? product.salePrice
      : product.price;

  const breadcrumbItems = [
    { "@type": "ListItem", position: 1, name: "בית", item: BASE_URL },
    ...(categories[0]
      ? [{ "@type": "ListItem", position: 2, name: categories[0].name, item: `${BASE_URL}/category/${categories[0].slug}` }]
      : []),
    {
      "@type": "ListItem",
      position: categories[0] ? 3 : 2,
      name: product.name,
      item: `${BASE_URL}/product/${product.slug}`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        ...(images.length > 0 && { image: images }),
        ...(product.description && { description: product.description }),
        sku: product.sku,
        brand: { "@type": "Brand", name: product.brand.name },
        offers: {
          "@type": "Offer",
          url: `${BASE_URL}/product/${product.slug}`,
          priceCurrency: "ILS",
          price: sellingPrice,
          availability:
            product.stockStatus === "in_stock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems,
      },
    ],
  };

  return (
    <div className="bg-white min-h-screen" dir="rtl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductPageClient product={product} specs={specs} />

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 border-t">
          <h2 className="text-2xl font-black text-[#222021] mb-8">
            מוצרים נוספים של {product.brand.name}
          </h2>
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
