export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { products: { where: { active: true } } } },
      },
    });
    return NextResponse.json(brands);
  } catch (err) {
    console.error("[GET /api/brands]", err);
    return NextResponse.json({ error: "שגיאה בטעינת המותגים" }, { status: 500 });
  }
}

