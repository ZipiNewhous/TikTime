export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

// GET /api/admin/tags
export async function GET(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tags = await prisma.tag.findMany({
    include: { _count: { select: { productTags: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(tags);
}

// POST /api/admin/tags
export async function POST(req: NextRequest) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, color } = await req.json();
    if (!name) return NextResponse.json({ error: "שם תגית נדרש" }, { status: 400 });

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const tag = await prisma.tag.create({
      data: { name, slug, color: color || "#c9a96e" },
    });
    return NextResponse.json({ success: true, tag }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/tags]", err);
    return NextResponse.json({ error: "שגיאה ביצירת התגית" }, { status: 500 });
  }
}

