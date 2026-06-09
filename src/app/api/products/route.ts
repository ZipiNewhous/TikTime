export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get("category");
    const brandIds = searchParams.getAll("brandId").map(Number).filter(Boolean);
    const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
    const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
    const tagSlugs = searchParams.getAll("tag");
    const inStock = searchParams.get("inStock") === "true";
    const sortBy = searchParams.get("sort") ?? "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const pageSize = Math.min(60, parseInt(searchParams.get("pageSize") ?? "24"));
    const featured = searchParams.get("featured") === "true";

    // Build where clause
    const where: Record<string, unknown> = { active: true };

    if (categorySlug) {
      where.productCategories = {
        some: { category: { slug: categorySlug } },
      };
    }
    if (brandIds.length > 0) {
      where.brandId = { in: brandIds };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) (where.price as Record<string, unknown>).gte = minPrice;
      if (maxPrice !== undefined) (where.price as Record<string, unknown>).lte = maxPrice;
    }
    if (tagSlugs.length > 0) {
      where.productTags = {
        some: { tag: { slug: { in: tagSlugs } } },
      };
    }
    if (inStock) {
      where.stockStatus = "in_stock";
    }
    if (featured) {
      where.featured = true;
    }

    // Sorting — out-of-stock products always sink to the bottom
    const primarySort = (() => {
      switch (sortBy) {
        case "price_asc":  return { price: "asc"  as const };
        case "price_desc": return { price: "desc" as const };
        case "name_asc":   return { name: "asc"   as const };
        case "newest":
        default:           return { createdAt: "desc" as const };
      }
    })();
    const orderBy = [{ stockStatus: "asc" as const }, primarySort];

    // Fetch one extra row to know whether another page exists, without a
    // separate COUNT query on every scroll. The card only needs `brand`,
    // so tags/categories are intentionally not joined here.
    const rows = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize + 1,
      include: {
        brand: { select: { id: true, name: true, slug: true } },
      },
    });
    const hasMore = rows.length > pageSize;
    const items = hasMore ? rows.slice(0, pageSize) : rows;

    // The total count only changes when filters change, so compute it on the
    // first page (used for the "X products" label) and skip it while scrolling.
    let total: number | undefined;
    let totalPages: number | undefined;
    if (page === 1) {
      total = await prisma.product.count({ where });
      totalPages = Math.ceil(total / pageSize);
    }

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages,
      hasMore,
    });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json({ error: "שגיאה בטעינת המוצרים" }, { status: 500 });
  }
}

