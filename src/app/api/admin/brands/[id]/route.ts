export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils";

// PUT /api/admin/brands/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name, description, logo, website, active } = await req.json();
    if (!name) return NextResponse.json({ error: "׳©׳ ׳׳•׳×׳’ ׳ ׳“׳¨׳©" }, { status: 400 });

    const brand = await prisma.brand.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug: slugify(name),
        description: description || null,
        logo: logo || null,
        website: website || null,
        active: active !== false,
      },
    });
    return NextResponse.json({ success: true, brand });
  } catch (err) {
    console.error("[PUT /api/admin/brands/[id]]", err);
    return NextResponse.json({ error: "׳©׳’׳™׳׳” ׳‘׳¢׳“׳›׳•׳ ׳”׳׳•׳×׳’" }, { status: 500 });
  }
}

// DELETE /api/admin/brands/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.brand.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/brands/[id]]", err);
    return NextResponse.json({ error: "׳©׳’׳™׳׳” ׳‘׳׳—׳™׳§׳× ׳”׳׳•׳×׳’" }, { status: 500 });
  }
}
