export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";

// PUT /api/admin/tags/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name, color } = await req.json();
    if (!name) return NextResponse.json({ error: "׳©׳ ׳×׳’׳™׳× ׳ ׳“׳¨׳©" }, { status: 400 });

    const slug = name.toLowerCase().replace(/\s+/g, "-");
    const tag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: { name, slug, color: color || "#c9a96e" },
    });
    return NextResponse.json({ success: true, tag });
  } catch (err) {
    console.error("[PUT /api/admin/tags/[id]]", err);
    return NextResponse.json({ error: "׳©׳’׳™׳׳” ׳‘׳¢׳“׳›׳•׳ ׳”׳×׳’׳™׳×" }, { status: 500 });
  }
}

// DELETE /api/admin/tags/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.tag.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/tags/[id]]", err);
    return NextResponse.json({ error: "׳©׳’׳™׳׳” ׳‘׳׳—׳™׳§׳× ׳”׳×׳’׳™׳×" }, { status: 500 });
  }
}
