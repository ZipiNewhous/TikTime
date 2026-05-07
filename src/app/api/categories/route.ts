export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: {
        children: { orderBy: { order: "asc" } },
        _count: { select: { productCategories: true } },
      },
    });

    // Return only top-level categories (parentId = null)
    const topLevel = categories.filter((c) => c.parentId === null);
    return NextResponse.json(topLevel);
  } catch (err) {
    console.error("[GET /api/categories]", err);
    return NextResponse.json({ error: "שגיאה בטעינת הקטגוריות" }, { status: 500 });
  }
}

