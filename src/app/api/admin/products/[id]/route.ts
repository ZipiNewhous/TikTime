export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils";

// GET /api/admin/products/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      brand: true,
      productTags: { include: { tag: true } },
      productCategories: { include: { category: true } },
    },
  });

  if (!product) return NextResponse.json({ error: "׳׳•׳¦׳¨ ׳׳ ׳ ׳׳¦׳" }, { status: 404 });
  return NextResponse.json(product);
}

// PUT /api/admin/products/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const productId = parseInt(id);

  try {
    const body = await req.json();
    const {
      name, brandId, price, salePrice, description, specs, sku,
      stockStatus, image1, image2, image3, featured, active,
      categoryIds, tagIds,
    } = body;

    const slug = slugify(name);

    // Delete existing relations
    await prisma.productCategory.deleteMany({ where: { productId } });
    await prisma.productTag.deleteMany({ where: { productId } });

    const product = await prisma.product.update({
      where: { id: productId },
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
          create: (categoryIds ?? []).map((cid: number) => ({ categoryId: cid })),
        },
        productTags: {
          create: (tagIds ?? []).map((tid: number) => ({ tagId: tid })),
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (err) {
    console.error("[PUT /api/admin/products/[id]]", err);
    return NextResponse.json({ error: "׳©׳’׳™׳׳” ׳‘׳¢׳“׳›׳•׳ ׳”׳׳•׳¦׳¨" }, { status: 500 });
  }
}

// DELETE /api/admin/products/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.product.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/products/[id]]", err);
    return NextResponse.json({ error: "׳©׳’׳™׳׳” ׳‘׳׳—׳™׳§׳× ׳”׳׳•׳¦׳¨" }, { status: 500 });
  }
}
