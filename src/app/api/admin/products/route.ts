export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils";

// GET /api/admin/products — list with pagination
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const sp = req.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") ?? "1"));
    const pageSize = Math.min(50, parseInt(sp.get("pageSize") ?? "20"));
    const search = sp.get("search") ?? "";
    const brandId = sp.get("brandId") ? parseInt(sp.get("brandId")!) : undefined;
    const stockStatus = sp.get("stockStatus") ?? undefined;

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
      ];
    }
    if (brandId) where.brandId = brandId;
    if (stockStatus) where.stockStatus = stockStatus;

    const [items, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          brand: { select: { id: true, name: true } },
          productTags: { include: { tag: { select: { id: true, name: true, color: true } } } },
          productCategories: { include: { category: { select: { id: true, name: true } } } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
  } catch (err) {
    console.error("[GET /api/admin/products]", err);
    return NextResponse.json({ error: "שגיאה" }, { status: 500 });
  }
}

// POST /api/admin/products — create
export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name, brandId, price, salePrice, description, specs, sku,
      stockStatus, image1, image2, image3, featured, active,
      categoryIds, tagIds,
    } = body;

    if (!name || !brandId || !price || !sku) {
      return NextResponse.json({ error: "שדות חובה חסרים" }, { status: 400 });
    }

    const slug = slugify(name);

    const product = await prisma.product.create({
      data: {
        name, slug, brandId: parseInt(brandId),
        price: parseFloat(price),
        salePrice: salePrice ? parseFloat(salePrice) : null,
        description: description || null,
        specs: specs || null,
        sku, stockStatus: stockStatus || "in_stock",
        image1: image1 || null, image2: image2 || null, image3: image3 || null,
        featured: Boolean(featured), active: active !== false,
        productCategories: {
          create: (categoryIds ?? []).map((id: number) => ({ categoryId: id })),
        },
        productTags: {
          create: (tagIds ?? []).map((id: number) => ({ tagId: id })),
        },
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (err: unknown) {
    if ((err as { code?: string }).code === "P2002") {
      return NextResponse.json({ error: "מק\"ט כבר קיים" }, { status: 400 });
    }
    console.error("[POST /api/admin/products]", err);
    return NextResponse.json({ error: "שגיאה ביצירת המוצר" }, { status: 500 });
  }
}

