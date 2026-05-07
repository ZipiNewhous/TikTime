import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
    const limit = Math.min(20, parseInt(req.nextUrl.searchParams.get("limit") ?? "10"));

    if (q.length < 2) {
      return NextResponse.json({ items: [], total: 0 });
    }

    const items = await prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: q } },
          { sku: { contains: q } },
          { description: { contains: q } },
          { brand: { name: { contains: q } } },
        ],
      },
      take: limit,
      orderBy: { featured: "desc" },
      include: {
        brand: { select: { id: true, name: true, slug: true } },
        productTags: { include: { tag: { select: { id: true, name: true, slug: true, color: true } } } },
      },
    });

    return NextResponse.json({ items, total: items.length });
  } catch (err) {
    console.error("[GET /api/search]", err);
    return NextResponse.json({ error: "שגיאה בחיפוש" }, { status: 500 });
  }
}
