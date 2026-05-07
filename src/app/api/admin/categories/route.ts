import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils";

// GET /api/admin/categories
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { productCategories: true } },
      children: { include: { _count: { select: { productCategories: true } } } },
    },
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(categories);
}

// POST /api/admin/categories
export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, parentId, active } = await req.json();
    if (!name) return NextResponse.json({ error: "שם קטגוריה נדרש" }, { status: 400 });

    const category = await prisma.category.create({
      data: {
        name,
        slug: slugify(name),
        description: description || null,
        parentId: parentId ? parseInt(parentId) : null,
        active: active !== false,
      },
    });
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/categories]", err);
    return NextResponse.json({ error: "שגיאה ביצירת הקטגוריה" }, { status: 500 });
  }
}
