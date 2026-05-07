export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils";

// GET /api/admin/brands
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(brands);
}

// POST /api/admin/brands
export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description, logo, website, active } = await req.json();
    if (!name) return NextResponse.json({ error: "שם מותג נדרש" }, { status: 400 });

    const slug = slugify(name);
    const brand = await prisma.brand.create({
      data: {
        name,
        slug,
        description: description || null,
        logo: logo || null,
        website: website || null,
        active: active !== false,
      },
    });
    return NextResponse.json({ success: true, brand }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/brands]", err);
    return NextResponse.json({ error: "שגיאה ביצירת המותג" }, { status: 500 });
  }
}

