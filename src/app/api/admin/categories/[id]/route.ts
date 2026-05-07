import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prisma";
import { getAdminFromRequest } from "@/lib/auth/admin";
import { slugify } from "@/lib/utils";

// PUT /api/admin/categories/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const { name, description, parentId, active } = await req.json();
    if (!name) return NextResponse.json({ error: "שם קטגוריה נדרש" }, { status: 400 });

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: {
        name,
        slug: slugify(name),
        description: description || null,
        parentId: parentId ? parseInt(parentId) : null,
        active: active !== false,
      },
    });
    return NextResponse.json({ success: true, category });
  } catch (err) {
    console.error("[PUT /api/admin/categories/[id]]", err);
    return NextResponse.json({ error: "שגיאה בעדכון הקטגוריה" }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/admin/categories/[id]]", err);
    return NextResponse.json({ error: "שגיאה במחיקת הקטגוריה" }, { status: 500 });
  }
}
