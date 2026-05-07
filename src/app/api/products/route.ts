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

    // Sorting
    const orderBy: Record<string, unknown> = (() => {
      switch (sortBy) {
        case "price_asc":  return { price: "asc" };
        case "price_desc": return { price: "desc" };
        case "name_asc":   return { name: "asc" };
        case "newest":
        default:           return { createdAt: "desc" };
      }
    })();

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          brand: { select: { id: true, name: true, slug: true } },
          productTags: { include: { tag: { select: { id: true, name: true, slug: true, color: true } } } },
          productCategories: { include: { category: { select: { id: true, name: true, slug: true } } } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json({ error: "שגיאה בטעינת המוצרים" }, { status: 500 });
  }
}
